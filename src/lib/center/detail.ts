import { getCountryLabel } from "@/data/worldCountries";
import { localizePath, type AppLocale, type Translate } from "@/i18n";
import { createCenterRouteIdMap, getCenterPath } from "@/lib/center/centers";
import { centerDescription } from "@/lib/center/description";
import { centerJsonLd } from "@/lib/center/jsonLd";
import { byRecency } from "@/lib/center/order";
import type { CenterEntry } from "@/lib/center/collection";
import { relatedByCountry, relatedCenters } from "@/lib/center/related";
import { getContentDates } from "@/lib/contentDates";
import { getCollection, type CollectionEntry } from "astro:content";

type CenterSource = CollectionEntry<"centers">;
type CenterTranslation = CollectionEntry<"centersEn">;

export interface CenterFact {
	label: string;
	value: string;
}

export interface CenterDetail {
	title: string;
	summary: string | null;
	/** Категория и тип — надзаголовочная строка. */
	badges: string[];
	facts: CenterFact[];
	sourceUrl: string | null;
	sourceLabel: string | null;
	canonicalURL: string;
	markdownURL?: string;
	alternates: Array<{ hreflang: string; href: string }>;
	description: string;
	publishedDate?: Date;
	modifiedDate?: Date;
	previousEntry: CenterSource | null;
	nextEntry: CenterSource | null;
	routeIds: Map<string, string>;
	related: CenterEntry[];
	relatedTitle: string;
	jsonLd: ReturnType<typeof centerJsonLd>;
}

const clean = (value?: string | null) => {
	if (!value) return null;

	const normalized = value.trim();
	return normalized.length ? normalized : null;
};

/** Домен источника: в боковой колонке он читается лучше полного URL. */
const hostnameOf = (url: string) => {
	try {
		return new URL(url).hostname.replace(/^www\./, "");
	} catch {
		return url;
	}
};

/**
 * Всё, что странице центра нужно знать помимо самого текста: шапка, факты,
 * соседи по каталогу, похожие карточки, канониклы и JSON-LD.
 *
 * Читает коллекции сама — страница остаётся разметкой. Переводимые подписи
 * приходят через `t`, потому что зависят от локали, а не от данных.
 */
export async function buildCenterDetail({
	entry,
	localizedEntry,
	locale,
	t,
}: {
	entry: CenterSource;
	localizedEntry?: CenterTranslation;
	locale: AppLocale;
	t: Translate;
}): Promise<CenterDetail> {
	const contentEntry = localizedEntry ?? entry;
	const data = contentEntry.data;

	const centerEntries = byRecency(await getCollection("centers"));
	const routeIds = createCenterRouteIdMap(centerEntries);
	const englishEntries = await getCollection("centersEn");
	const englishIds = new Set(englishEntries.map((item) => item.id));

	const title = clean(data.title) ?? t("detail.fallbackTitle");
	const summary = clean(data.summary);
	const country = clean(data.location?.country);
	const city = clean(data.location?.city);
	const flag = clean(data.location?.flag);
	const region = clean(data.location?.region);
	const rawPubDate = clean(data.pubDate);
	const localizedCountry = country ? getCountryLabel(country, locale) : null;
	const placeLine = [flag, localizedCountry ?? country].filter(Boolean).join(" ");

	const { publishedDate, modifiedDate } = getContentDates({
		pubDate: rawPubDate,
		filePath: contentEntry.filePath,
	});

	const routeId = routeIds.get(entry.id) ?? entry.id;
	const centerPath = getCenterPath(routeId);

	const formattedDate = rawPubDate
		? new Date(rawPubDate).toLocaleDateString(locale, {
				day: "numeric",
				month: "long",
				year: "numeric",
				timeZone: "Asia/Almaty",
			})
		: null;

	const facts = [
		placeLine ? { label: t("detail.country"), value: placeLine } : null,
		city ? { label: t("detail.city"), value: city } : null,
		region ? { label: t("detail.region"), value: region } : null,
		formattedDate ? { label: t("content.published"), value: formattedDate } : null,
	].filter((fact): fact is CenterFact => Boolean(fact));

	const currentIndex = centerEntries.findIndex((item) => item.id === entry.id);
	const sourceUrl = clean(data.source);

	return {
		title,
		summary,
		badges: [clean(data.category), clean(data.type)].filter(
			(value): value is string => Boolean(value),
		),
		facts,
		sourceUrl,
		sourceLabel: sourceUrl ? hostnameOf(sourceUrl) : null,
		canonicalURL: localizePath(locale, centerPath),
		markdownURL: locale === "ru" ? `${centerPath}.md` : undefined,
		alternates: [
			{ hreflang: "ru", href: centerPath },
			// Английская версия объявляется только там, где перевод есть:
			// иначе hreflang ведёт на русский текст под /en/.
			...(englishIds.has(entry.id)
				? [{ hreflang: "en", href: localizePath("en", centerPath) }]
				: []),
			{ hreflang: "x-default", href: centerPath },
		],
		description: centerDescription(
			{ title, summary, city, region, country: localizedCountry, category: clean(data.category), type: clean(data.type) },
			locale,
		),
		publishedDate,
		modifiedDate,
		previousEntry: currentIndex > 0 ? centerEntries[currentIndex - 1] : null,
		nextEntry:
			currentIndex >= 0 && currentIndex < centerEntries.length - 1
				? centerEntries[currentIndex + 1]
				: null,
		routeIds,
		related: relatedCenters(
			entry,
			centerEntries,
			new Map((locale === "en" ? englishEntries : centerEntries).map((item) => [item.id, item])),
		),
		relatedTitle: relatedByCountry(entry)
			? t("detail.related", { country: localizedCountry ?? country ?? "" })
			: t("detail.relatedCategory"),
		jsonLd: centerJsonLd({
			name: title,
			description: summary,
			url: sourceUrl ?? localizePath(locale, centerPath),
			country,
			region,
			city,
		}),
	};
}
