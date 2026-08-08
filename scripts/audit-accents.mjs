// Прогон контраст-аудита по всем шести пресетам × двум темам.
// Запуск: node scripts/audit-accents.mjs
//
// Значения ЧИТАЮТСЯ из CSS, а не дублируются здесь. Раньше в этом файле лежала
// своя копия палитры с пометкой «должны совпадать с tailwind.css» — она отстала
// от CSS и продолжала печатать «✅ Все 12 пар проходят» для значений, которых в
// проекте уже не было. Копия палитры, которую надо синхронизировать руками, —
// это не аудит, а второй источник правды.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { audit, ladder } from "./audit-accent.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const styles = join(root, "src/styles");

const sources = [
	readFileSync(join(styles, "tailwind.css"), "utf8"),
	...readdirSync(join(styles, "palettes"))
		.filter((f) => f.endsWith(".css"))
		.map((f) => readFileSync(join(styles, "palettes", f), "utf8")),
].join("\n");

// Собираем объявления из всех блоков, подходящих под селектор. Блоков может быть
// несколько (в @theme и в файле палитры), выигрывает последний — как в CSS.
const collect = (selector) => {
	const out = {};
	let from = 0;
	for (;;) {
		const at = sources.indexOf(`${selector} {`, from);
		if (at < 0) break;
		const prev = sources[at - 1];
		if (prev && !/[\s,}/]/.test(prev)) {
			from = at + 1;
			continue;
		}
		let depth = 0;
		let end = sources.indexOf("{", at);
		const open = end;
		for (; end < sources.length; end += 1) {
			if (sources[end] === "{") depth += 1;
			else if (sources[end] === "}") {
				depth -= 1;
				if (!depth) break;
			}
		}
		for (const m of sources.slice(open + 1, end).matchAll(/(--color-[a-z0-9-]+):\s*hsl\(([^)]*)\)/g)) {
			const [h, s, l] = m[2].trim().split(/\s+/).map((v) => Number.parseFloat(v));
			out[m[1].replace("--color-", "")] = [h, s, l];
		}
		from = end + 1;
	}
	return out;
};

const theme = collect("@theme");
const darkBase = collect(".dark");
const PRESETS = ["green", "blue", "violet", "red", "orange", "pink"];

let ok = true;
for (const name of PRESETS) {
	const light = { ...theme, ...collect(`:root[data-accent="${name}"]`) };
	const dark = {
		...theme,
		...darkBase,
		...collect(`:root[data-accent="${name}"]`),
		...collect(`:root.dark[data-accent="${name}"]`),
	};

	for (const [label, p, softPct] of [
		[`${name} light`, light, 0.12],
		[`${name} dark`, dark, 0.18],
	]) {
		ok =
			audit(label, {
				bg: p.background,
				fg: p.foreground,
				accent: p.accent,
				accentFg: p["accent-foreground"],
				vivid: p["accent-vivid"],
				softPct,
				subtleFg: p["subtle-foreground"],
				subtle: p.subtle,
				// Порог «фон→поверхность ≥ 8» — только для тёмной темы: там нет
				// тени, и ступень светлоты несёт глубину одна. Возле белого шкала
				// сжата (100%→97.5% это ΔL 1.9), и добирают тень с границей.
				surface: label.endsWith("dark") ? p.surface : undefined,
			}) && ok;
		ok = ladder(label, p) && ok;
	}
}

console.log(ok ? "\n✅ Все 12 пар проходят" : "\n❌ Есть провалы");
process.exit(ok ? 0 : 1);
