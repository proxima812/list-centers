import type { CollectionEntry } from "astro:content";

const CENTER_ROUTE_PREFIX = "tbk-";
const CENTER_ROUTE_ID_PATTERN = /^tbk-\d+$/;
const CENTER_TRANSLATION_COLLECTIONS = {
	en: "centersEn",
} as const;

export type CenterTranslationLocale = keyof typeof CENTER_TRANSLATION_COLLECTIONS;
export type CenterTranslationCollection =
	(typeof CENTER_TRANSLATION_COLLECTIONS)[CenterTranslationLocale];

export const getCenterPath = (routeId: string) => `/centers/${routeId}`;

export const getCenterTranslationCollection = (locale: string) =>
	CENTER_TRANSLATION_COLLECTIONS[locale as CenterTranslationLocale];

export const createCenterRouteIdMap = (
	entries: CollectionEntry<"centers" | "centersEn">[],
) => {
	const sortedEntries = [...entries].sort((a, b) => {
		const aRouteNumber = a.id.match(CENTER_ROUTE_ID_PATTERN)?.[0].slice(CENTER_ROUTE_PREFIX.length);
		const bRouteNumber = b.id.match(CENTER_ROUTE_ID_PATTERN)?.[0].slice(CENTER_ROUTE_PREFIX.length);

		if (aRouteNumber && bRouteNumber) {
			return Number(aRouteNumber) - Number(bRouteNumber);
		}

		return a.id.localeCompare(b.id, "en");
	});

	// Синтетический id для файла не вида tbk-N берёт первый свободный номер,
	// а не позицию в сортировке: позиционный `tbk-${index+1}` мог совпасть с
	// реальным id другого файла и дать дубликат маршрута в getStaticPaths.
	const usedRouteIds = new Set(
		entries.map((entry) => entry.id).filter((id) => CENTER_ROUTE_ID_PATTERN.test(id)),
	);
	let nextNumber = 1;

	return new Map(
		sortedEntries.map((entry) => {
			if (CENTER_ROUTE_ID_PATTERN.test(entry.id)) return [entry.id, entry.id] as const;

			while (usedRouteIds.has(`${CENTER_ROUTE_PREFIX}${nextNumber}`)) nextNumber += 1;
			const routeId = `${CENTER_ROUTE_PREFIX}${nextNumber}`;
			usedRouteIds.add(routeId);
			return [entry.id, routeId] as const;
		}),
	);
};
