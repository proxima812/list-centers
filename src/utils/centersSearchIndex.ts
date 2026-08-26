import { localizedCenters, type CenterEntry } from "@/domain/center/collection";
import { byRecency } from "@/domain/center/order";
import { normalizeSearchText, uniqueTerms } from "@/domain/center/searchText";
import { resolveCenterGeo, type CenterGeo } from "@/data/geo";
import { getCollection } from "astro:content";
import type { AppLocale } from "@/i18n";

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

function toSearchItem(
	entry: CenterEntry,
	order: number,
	geoById: Map<string, CenterGeo>,
): CenterSearchIndexItem {
	const geo = geoById.get(entry.id) ?? resolveCenterGeo(entry.data.location);
	const country = geo.country || "Прочее";
	const type = entry.data.type ?? "";
	const category = entry.data.category ?? "";
	const title = entry.data.title ?? "";
	const summary = entry.data.summary ?? "";
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
		searchText: normalizeSearchText(
			[title, summary, geo.city, country, type, category, geo.region, geo.district, ...localizedTerms].join(
				" ",
			),
		),
	};
}

export async function getCenterSearchIndex(locale: AppLocale) {
	const sourceCards = await getCollection("centers");
	const geoById = new Map(
		sourceCards.map((card) => [card.id, resolveCenterGeo(card.data.location)]),
	);

	return byRecency(await localizedCenters(locale)).map((entry, order) =>
		toSearchItem(entry, order, geoById),
	);
}
