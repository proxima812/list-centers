import { getCenterLinks } from "../../src/lib/center/links";
import type { ParsedCenter } from "./parse-center";

/** Заголовки секций, которые не переносим в пост: техника, а не польза для читателя. */
const EXCLUDED_HEADINGS = new Set(["ссылки", "источники"]);

/** Порядок секций в посте — не порядок в исходном файле, он у карточек случаен. */
const SECTION_ORDER = ["о центре", "особенности", "адрес/локация", "контакты", "прочее"];

const HEADING_LINE = /^#{2,6}\s+(.+?)\s*$/;
const MD_LINK = /\[([^\]]*)\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+|tel:[^)\s]+)\)/g;
const SOLE_LINK_LINE = /^\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)$/;

interface Section {
	heading: string | null;
	lines: string[];
}

function splitIntoSections(body: string): Section[] {
	const sections: Section[] = [{ heading: null, lines: [] }];

	for (const line of body.split("\n")) {
		const headingMatch = HEADING_LINE.exec(line);
		if (headingMatch) {
			sections.push({ heading: headingMatch[1], lines: [] });
			continue;
		}
		sections[sections.length - 1].lines.push(line);
	}

	return sections.filter((section) => section.heading !== null || section.lines.some((line) => line.trim()));
}

function convertLine(line: string): string {
	const bulletMatch = /^(\s*(?:[-*>]\s*)+)(.*)$/.exec(line);
	const prefix = bulletMatch ? bulletMatch[1].replace(/[>*]/g, "-") : "";
	const content = bulletMatch ? bulletMatch[2] : line;

	const soleLinkMatch = SOLE_LINK_LINE.exec(content.trim());
	if (soleLinkMatch) {
		const [, label, url] = soleLinkMatch;
		return `${prefix}${label || url}:\n${url}`;
	}

	const converted = content.replace(MD_LINK, (_match, label: string, url: string) => {
		if (url.startsWith("mailto:") || url.startsWith("tel:")) {
			return label || url.replace(/^(mailto:|tel:)/, "");
		}
		return label ? `${label} (${url})` : url;
	});

	return `${prefix}${converted}`.trimEnd();
}

function sectionToPlainText(section: Section): string {
	const body = section.lines.map(convertLine).join("\n").trim();
	if (!section.heading) return body;
	return body ? `${section.heading}\n\n${body}` : section.heading;
}

function orderedSections(sections: Section[]): Section[] {
	const kept = sections.filter((section) => {
		if (section.heading === null) return section.lines.some((line) => line.trim());
		return !EXCLUDED_HEADINGS.has(section.heading.trim().toLowerCase());
	});

	return kept.sort((a, b) => {
		const aIndex = a.heading ? SECTION_ORDER.indexOf(a.heading.trim().toLowerCase()) : -1;
		const bIndex = b.heading ? SECTION_ORDER.indexOf(b.heading.trim().toLowerCase()) : -1;
		if (aIndex === -1 && bIndex === -1) return 0;
		if (aIndex === -1) return 1;
		if (bIndex === -1) return -1;
		return aIndex - bIndex;
	});
}

const LINK_LABELS: Record<string, string> = {
	website: "Сайт",
	instagram: "Instagram",
	telegram: "Telegram",
	vk: "VK",
	youtube: "YouTube",
	facebook: "Facebook",
	ok: "Одноклассники",
};

function formatLinksBlock(center: ParsedCenter): string | null {
	const links = getCenterLinks(center.body, center.source);
	if (links.length === 0) return null;

	const lines =
		links.length === 1
			? [links[0].href]
			: links.map((link) => `${LINK_LABELS[link.kind] ?? link.label}: ${link.href}`);

	return ["Ссылки:", ...lines].join("\n");
}

/**
 * Хештег для поиска в VK: внутри тега живут только буквы, цифры и `_`, поэтому
 * пробелы и дефисы не экранируются, а склеиваются — «Регион РФ» → `#РегионРФ`,
 * «Татаро-Башкирский» → `#ТатароБашкирский`. Регистр исходника сохраняем.
 */
function toHashtag(value: string): string | null {
	// Каждое слово с заглавной, иначе «Алтайский край» слипается в
	// `#Алтайскийкрай`. Для поиска VK регистр не важен, но читается это плохо.
	const cleaned = value
		.split(/[^\p{L}\p{N}_]+/u)
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join("");

	if (!cleaned || /^\d/.test(cleaned)) return null;
	return `#${cleaned}`;
}

function uniqueHashtags(values: Array<string | undefined>): string[] {
	const tags = values
		.filter((value): value is string => Boolean(value))
		.map(toHashtag)
		.filter((tag): tag is string => tag !== null);

	return [...new Set(tags)];
}

/**
 * Футер повторяет шапку карточки тегами: `#tatarverse | 📍 <гео> <категория · тип>`.
 * Пустые части просто выпадают, включая сам разделитель и пин.
 */
function formatHashtagFooter(placeParts: string[], badgeParts: string[]): string {
	const placeTags = uniqueHashtags(placeParts);
	const badgeTags = uniqueHashtags(badgeParts);

	const groups = [
		placeTags.length > 0 ? `📍 ${placeTags.join(" ")}` : null,
		badgeTags.length > 0 ? badgeTags.join(" · ") : null,
	].filter((group): group is string => group !== null);

	return groups.length > 0 ? `#tatarverse | ${groups.join(" ")}` : "#tatarverse";
}

export interface FormatPostOptions {
	center: ParsedCenter;
	url: string;
}

export function formatPost({ center, url }: FormatPostOptions): string {
	const placeParts = [
		center.location?.city,
		center.location?.region,
		center.location?.country,
	].filter((value): value is string => Boolean(value));
	const badgeParts = [center.category, center.type].filter((value): value is string =>
		Boolean(value),
	);

	const placeLine = placeParts.join(", ");
	const badgeLine = badgeParts.join(" · ");

	const sections = orderedSections(splitIntoSections(center.body))
		.map(sectionToPlainText)
		.filter(Boolean);

	const linksBlock = formatLinksBlock(center);

	const blocks = [
		center.title,
		[placeLine ? `📍 ${placeLine}` : null, badgeLine || null].filter(Boolean).join("\n"),
		center.summary ?? null,
		...sections,
		linksBlock,
		`Карточка в tatarverse:\n${url}`,
		formatHashtagFooter(placeParts, badgeParts),
	].filter((block): block is string => Boolean(block && block.trim()));

	return blocks.join("\n\n");
}
