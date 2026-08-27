import { config } from "../../src/config";
import { getCenterPath } from "../../src/utils/centers";
import { formatPost } from "./format-post";
import { buildRouteIdMap, loadAllCenters, type ParsedCenter } from "./parse-center";
import { loadState, saveState, type PublishState } from "./state";
import { FATAL_ERROR_CODES, VkApiError, readVkConfig, wallPost } from "./vk";

const DELAY_BETWEEN_POSTS_MS = 700;

interface CliOptions {
	dryRun: boolean;
	limit?: number;
	id?: string;
}

function parseArgs(argv: string[]): CliOptions {
	const options: CliOptions = { dryRun: false };

	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];

		if (arg === "--dry-run") {
			options.dryRun = true;
		} else if (arg === "--limit") {
			const value = Number(argv[++i]);
			if (!Number.isInteger(value) || value <= 0) {
				throw new Error(`--limit ожидает положительное целое число, получено: ${argv[i]}`);
			}
			options.limit = value;
		} else if (arg === "--id") {
			options.id = argv[++i];
			if (!options.id) throw new Error("--id ожидает значение, например --id tbk-402");
		} else {
			throw new Error(
				`Неизвестный аргумент: ${arg}\nДоступно: --dry-run, --limit <N>, --id <routeId>`,
			);
		}
	}

	return options;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function buildUrl(routeId: string): string {
	// Со слешем на конце: без него сайт отвечает 308 на канонический адрес,
	// и каждый переход из VK стоит лишнего редиректа.
	return new URL(`${getCenterPath(routeId)}/`, config.site.url).toString();
}

async function main() {
	const options = parseArgs(process.argv.slice(2));

	const centers = loadAllCenters();
	const routeIds = buildRouteIdMap(centers.map((center) => center.id));

	let queue: Array<{ center: ParsedCenter; routeId: string }> = centers
		.map((center) => ({ center, routeId: routeIds.get(center.id) ?? center.id }))
		.sort((a, b) => a.routeId.localeCompare(b.routeId, "en", { numeric: true }));

	if (options.id) {
		queue = queue.filter((item) => item.routeId === options.id || item.center.id === options.id);
		if (queue.length === 0) {
			console.error(`Карточка с id "${options.id}" не найдена`);
			process.exitCode = 1;
			return;
		}
	} else if (options.limit) {
		queue = queue.slice(0, options.limit);
	}

	const state: PublishState = loadState();
	const vkConfig = options.dryRun ? null : readVkConfig();

	let published = 0;
	let skipped = 0;
	let errors = 0;
	let stoppedEarly = 0;

	for (let i = 0; i < queue.length; i++) {
		const { center, routeId } = queue[i];
		const progress = `[${i + 1}/${queue.length}] ${routeId}`;
		const url = buildUrl(routeId);
		const message = formatPost({ center, url });

		const alreadyPublished = state[routeId];

		// В dry-run опубликованное всё равно показываем: иначе после первого
		// прогона нельзя посмотреть, как изменился формат поста.
		if (options.dryRun) {
			const note = alreadyPublished
				? ` — при реальном запуске будет пропущено (post_id=${alreadyPublished.postId})`
				: "";
			console.log(`${progress} — предпросмотр (dry-run)${note}:\n${message}\n${"-".repeat(40)}`);
			if (alreadyPublished) skipped++;
			else published++;
			continue;
		}

		if (alreadyPublished) {
			console.log(`${progress} — уже опубликовано, пропуск (post_id=${alreadyPublished.postId})`);
			skipped++;
			continue;
		}

		try {
			const postId = await wallPost(vkConfig!, message);
			state[routeId] = { postId, publishedAt: new Date().toISOString() };
			saveState(state);
			console.log(`${progress} — опубликовано, post_id=${postId}`);
			published++;
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			console.log(`${progress} — ошибка VK: ${reason}`);
			errors++;

			if (error instanceof VkApiError && FATAL_ERROR_CODES.has(error.code)) {
				stoppedEarly = queue.length - (i + 1);
				console.log(
					`\nОстановка: дальше вся очередь упрётся в ту же ошибку.\n` +
						`Прогресс сохранён в state.json — повторный запуск продолжит с этого места.`,
				);
				break;
			}
		}

		if (i < queue.length - 1) await sleep(DELAY_BETWEEN_POSTS_MS);
	}

	console.log("\nГотово\n");
	console.log(`Всего: ${queue.length}`);
	console.log(`${options.dryRun ? "Показано" : "Опубликовано"}: ${published}`);
	console.log(`Пропущено: ${skipped}`);
	console.log(`Ошибок: ${errors}`);
	if (stoppedEarly > 0) console.log(`Осталось на следующий запуск: ${stoppedEarly}`);

	if (errors > 0) process.exitCode = 1;
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
