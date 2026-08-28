import type { AppLocale } from "@/i18n";

/**
 * Описание страницы центра для `<meta name="description">`.
 *
 * Если у карточки есть своё `summary` — берём его. Иначе собираем из
 * названия и географии, укладываясь в 160 символов: длинное название
 * усекается посередине, чтобы в выдаче остались и начало, и хвост с
 * уточнением вроде «(Казахстан)».
 *
 * Логика жила во frontmatter страницы вперемешку с разметкой, и проверить
 * её можно было только глазами по готовому HTML.
 */

/** Поисковая выдача обрезает описание примерно на этой длине. */
const MAX_LENGTH = 160;
/** Сколько символов отдаём под перечисление «город, регион, страна». */
const MAX_CONTEXT = 32;
/** Хвост названия при усечении: не длиннее половины доступного места. */
const MAX_TAIL = 56;
const ELLIPSIS = "...";

const SUFFIX: Record<AppLocale, string> = {
	ru: ". Контакты и проверенные источники: tatarverse.",
	en: ". Contacts and verified sources: tatarverse.",
};

export interface DescriptionParts {
	title: string;
	summary?: string | null;
	city?: string | null;
	region?: string | null;
	country?: string | null;
	category?: string | null;
	type?: string | null;
}

/** Усечение посередине: «Начало длинного наз...ния (Казахстан)». */
function shorten(title: string, limit: number) {
	if (title.length <= limit) return title;

	const tail = Math.min(MAX_TAIL, Math.floor(limit / 2));
	const head = title.slice(0, limit - tail - ELLIPSIS.length).trimEnd();

	return `${head}${ELLIPSIS}${title.slice(-tail).trimStart()}`;
}

export function centerDescription(parts: DescriptionParts, locale: AppLocale): string {
	if (parts.summary) return parts.summary;

	// В английской версии категория и тип остаются русскими — в описание их не берём.
	const details =
		locale === "en"
			? [parts.city, parts.region, parts.country]
			: [parts.city, parts.region, parts.country, parts.category, parts.type];

	const unique = [...new Set(details.filter((value): value is string => Boolean(value)))];

	const context = unique.reduce((acc, detail) => {
		const candidate = `${acc ? `${acc}, ` : ": "}${detail}`;
		return candidate.length <= MAX_CONTEXT ? candidate : acc;
	}, "");

	const suffix = SUFFIX[locale] ?? SUFFIX.ru;

	return `${shorten(parts.title, MAX_LENGTH - context.length - suffix.length)}${context}${suffix}`;
}
