import { countryFlagsByRu, getCountryLabel } from "@/data/worldCountries";
import {
	FEDERAL_DISTRICTS,
	MACRO_REGIONS,
	getRegionLabel,
	resolveCenterGeo,
	type CenterGeo,
	type CenterScope,
} from "@/data/geo";
import type { AppLocale } from "@/i18n";
import type { CollectionEntry } from "astro:content";


export type FacetKey = "macro" | "okrug" | "country" | "region" | "city" | "category";

type CenterEntry = CollectionEntry<"centers" | "centersEn">;

export interface CenterFacetRecord extends CenterGeo {
	id: string;
	category: string;
}

export interface FacetOption {
	value: string;
	label: string;
	count: number;
	flag?: string;
}

export interface Facet {
	key: FacetKey;
	ariaKey: string;
	allKey: string;
	limit: number;
	options: FacetOption[];
}

export interface ScopeOption {
	value: CenterScope;
	labelKey: string;
	count: number;
}

export interface CenterFacets {
	scopes: ScopeOption[];
	facets: Facet[];
	total: number;
}

export function buildFacetRecords(
	cards: CenterEntry[],
	geoById: Map<string, CenterGeo>,
): CenterFacetRecord[] {
	return cards.map((card) => ({
		id: card.id,
		category: card.data.category ?? "",
		...(geoById.get(card.id) ?? resolveCenterGeo(card.data.location)),
	}));
}

export function buildGeoIndex(sourceCards: CollectionEntry<"centers">[]): Map<string, CenterGeo> {
	return new Map(sourceCards.map((card) => [card.id, resolveCenterGeo(card.data.location)]));
}

function countBy(records: CenterFacetRecord[], pick: (record: CenterFacetRecord) => string) {
	const counts = new Map<string, number>();
	for (const record of records) {
		const value = pick(record);
		if (!value) continue;
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}
	return counts;
}

function toOptions(
	counts: Map<string, number>,
	order: readonly string[] | undefined,
	label: (value: string) => string,
	decorate?: (value: string) => Pick<FacetOption, "flag">,
): FacetOption[] {
	const entries = [...counts.entries()];

	entries.sort((left, right) => {
		if (order) {
			const leftIndex = order.indexOf(left[0]);
			const rightIndex = order.indexOf(right[0]);
			const safeLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
			const safeRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
			if (safeLeft !== safeRight) return safeLeft - safeRight;
		}
		return right[1] - left[1] || left[0].localeCompare(right[0], "ru");
	});

	return entries.map(([value, count]) => ({
		value,
		label: label(value),
		count,
		...decorate?.(value),
	}));
}

const CATEGORY_ORDER = [
	"Татарский",
	"Татаро-Башкирский",
	"Башкирский",
	"Крымотатарский",
] as const;

const SCOPE_ORDER: { value: CenterScope; labelKey: string }[] = [
	{ value: "ru", labelKey: "list.scope.ru" },
	{ value: "abroad", labelKey: "list.scope.abroad" },
	{ value: "online", labelKey: "list.scope.online" },
];

const VISIBLE_LIMIT = 8;

export function buildCenterFacets(
	records: CenterFacetRecord[],
	locale: AppLocale,
): CenterFacets {
	const scopeCounts = countBy(records, (record) => record.scope);

	const facets: Facet[] = [
		{
			key: "macro",
			ariaKey: "list.macro.aria",
			allKey: "list.allMacro",
			limit: 0,
			options: toOptions(
				countBy(records, (record) => (record.scope === "ru" ? "" : record.macro)),
				MACRO_REGIONS,
				(value) => value,
			),
		},
		{
			key: "okrug",
			ariaKey: "list.okrug.aria",
			allKey: "list.allOkrug",
			limit: 0,
			options: toOptions(
				countBy(records, (record) => record.okrug),
				FEDERAL_DISTRICTS,
				(value) => value,
			),
		},
		{
			key: "country",
			ariaKey: "list.countries.aria",
			allKey: "list.all",
			limit: VISIBLE_LIMIT,
			options: toOptions(
				countBy(records, (record) => record.country),
				undefined,
				(value) => getCountryLabel(value, locale),
				(value) => ({ flag: countryFlagsByRu[value] }),
			),
		},
		{
			key: "region",
			ariaKey: "list.regions.aria",
			allKey: "list.allRegions",
			limit: VISIBLE_LIMIT,
			options: toOptions(
				countBy(records, (record) => record.region),
				undefined,
				getRegionLabel,
			),
		},
		{
			key: "city",
			ariaKey: "list.cities.aria",
			allKey: "list.allCities",
			limit: VISIBLE_LIMIT,
			options: toOptions(
				countBy(records, (record) => record.city),
				undefined,
				(value) => value,
			),
		},
		{
			key: "category",
			ariaKey: "list.categories.aria",
			allKey: "list.allCategories",
			limit: 0,
			options: toOptions(
				countBy(records, (record) => record.category),
				CATEGORY_ORDER,
				(value) => value,
			),
		},
	];

	return {
		scopes: SCOPE_ORDER.map((scope) => ({
			...scope,
			count: scopeCounts.get(scope.value) ?? 0,
		})).filter((scope) => scope.count > 0),
		facets: facets.filter((facet) => facet.options.length > 0),
		total: records.length,
	};
}
