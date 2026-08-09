import { resolveCenterGeo, type CenterGeo } from "@/data/geo";
import { getCollection, type CollectionEntry } from "astro:content";
import type { AppLocale } from "@/i18n";

type CenterEntry = CollectionEntry<"centers" | "centersEn">;

export type CenterSearchIndexItem = {
	id: string;
	country: string;
	type: string;
	category: string;
	region: string;
	title: string;
	summary: string;
	city: string;
	searchText: string;
	terms: string[];
	order: number;
};

function normalize(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[ё]/g, "е")
		.replace(/[“”«»"']/g, "")
		.trim();
}

function uniqueTerms(terms: string[]) {
	return Array.from(new Set(terms.map((term) => term.trim()).filter((term) => term.length > 1)));
}

function sortByUpdatedDate(entries: CenterEntry[]) {
	return entries.sort((a, b) => {
		return (
			(b.data.pubDate ? new Date(b.data.pubDate).getTime() : 0) -
			(a.data.pubDate ? new Date(a.data.pubDate).getTime() : 0)
		);
	});
}

function toSearchItem(
	entry: CenterEntry,
	order: number,
	geoById: Map<string, CenterGeo>,
): CenterSearchIndexItem {
	// География — нормализованная и из русской коллекции, как и в фасетах.
	// Иначе подсказка поиска предлагала бы «Перми», а фильтр знал бы «Пермь».
	const geo = geoById.get(entry.id) ?? resolveCenterGeo(entry.data.location);
	const country = geo.country || "Прочее";
	const type = entry.data.type ?? "";
	const category = entry.data.category ?? "";
	const title = entry.data.title ?? "";
	const summary = entry.data.summary ?? "";
	// Локализованные подписи из перевода карточки в поиск всё же попадают:
	// на английской странице «Saint Petersburg» должен находиться, даже если
	// ключом фильтра остаётся «Санкт-Петербург».
	const localizedTerms = [entry.data.location?.city, entry.data.location?.region].filter(
		(value): value is string => Boolean(value),
	);
	const terms = uniqueTerms([
		title,
		geo.city,
		country,
		geo.region,
		geo.district,
		category,
		...localizedTerms,
	]);

	return {
		id: entry.id,
		country,
		type,
		category,
		region: geo.region,
		title,
		summary,
		city: geo.city,
		terms,
		order,
		searchText: normalize(
			[title, summary, geo.city, country, type, category, geo.region, geo.district, ...localizedTerms].join(
				" ",
			),
		),
	};
}

export async function getCenterSearchIndex(locale: AppLocale) {
	const sourceCards = await getCollection("centers");
	const geoById = new Map(sourceCards.map((card) => [card.id, resolveCenterGeo(card.data.location)]));
	const localizedCards = locale === "en" ? await getCollection("centersEn") : sourceCards;
	const fallbackCards = localizedCards.length > 0 ? localizedCards : sourceCards;

	return sortByUpdatedDate(fallbackCards).map((entry, order) =>
		toSearchItem(entry, order, geoById),
	);
}
