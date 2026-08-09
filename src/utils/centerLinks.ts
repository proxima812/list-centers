/**
 * Быстрые ссылки для карточки центра.
 *
 * У коллекции `centers` во фронтматтере есть только `source`, а живые контакты
 * лежат в теле файла под «## Ссылки» — там сайт, соцсети и мессенджеры вперемешку
 * с человеческими подписями («Официальный сайт — kazankultur.org»). Карточке
 * нужен не список, а по одной ссылке на площадку: сайт, Instagram, Telegram и
 * так далее. Разбор строго по секции «## Ссылки» — «## Источники» это ссылки на
 * статьи о центре, а не сам центр.
 */

export type CenterLinkKind =
	| "website"
	| "instagram"
	| "telegram"
	| "vk"
	| "youtube"
	| "facebook"
	| "ok";

export interface CenterLink {
	kind: CenterLinkKind;
	label: string;
	href: string;
}

/** Порядок задаёт и приоритет разбора, и порядок вывода в карточке. */
const PLATFORMS: { kind: CenterLinkKind; label: string; pattern: RegExp }[] = [
	{ kind: "instagram", label: "Instagram", pattern: /(^|\.)instagram\.com$/ },
	{ kind: "telegram", label: "Telegram", pattern: /(^|\.)(t\.me|telegram\.me|telegram\.org)$/ },
	{ kind: "vk", label: "VK", pattern: /(^|\.)(vk\.com|vk\.ru)$/ },
	{ kind: "youtube", label: "YouTube", pattern: /(^|\.)(youtube\.com|youtu\.be)$/ },
	{ kind: "facebook", label: "Facebook", pattern: /(^|\.)(facebook\.com|fb\.com)$/ },
	{ kind: "ok", label: "OK", pattern: /(^|\.)ok\.ru$/ },
];

const LINKS_SECTION = /^##\s+(Ссылки|Links)\s*$/im;
const MARKDOWN_LINK = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;

function classify(href: string): { kind: CenterLinkKind; label: string } | null {
	let host: string;

	try {
		host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
	} catch {
		return null;
	}

	const platform = PLATFORMS.find((candidate) => candidate.pattern.test(host));
	if (platform) return { kind: platform.kind, label: platform.label };

	return { kind: "website", label: "Сайт" };
}

function extractSection(body: string): string {
	const start = body.search(LINKS_SECTION);
	if (start === -1) return "";

	const rest = body.slice(start);
	const nextHeading = rest.slice(1).search(/^##\s+/m);

	return nextHeading === -1 ? rest : rest.slice(0, nextHeading + 1);
}

/**
 * Возвращает по одной ссылке на площадку. `source` из фронтматтера — запасной
 * вариант: у части центров секции «## Ссылки» нет вовсе.
 */
export function getCenterLinks(body: string | undefined, source?: string): CenterLink[] {
	const found = new Map<CenterLinkKind, CenterLink>();

	const collect = (href: string) => {
		const classified = classify(href);
		if (!classified || found.has(classified.kind)) return;
		found.set(classified.kind, { ...classified, href });
	};

	for (const match of extractSection(body ?? "").matchAll(MARKDOWN_LINK)) {
		collect(match[1]);
	}

	if (source) collect(source);

	// Сайт первым: это «домашний» адрес центра, соцсети — производные от него.
	const order: CenterLinkKind[] = ["website", ...PLATFORMS.map((platform) => platform.kind)];

	return order
		.map((kind) => found.get(kind))
		.filter((link): link is CenterLink => Boolean(link));
}
