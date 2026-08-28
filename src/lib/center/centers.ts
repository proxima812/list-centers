import type { CollectionEntry } from "astro:content";
import { centerRouteId, centerRouteNumber, isCenterRouteId } from "@/lib/center/routeId";

const CENTER_TRANSLATION_COLLECTIONS = {
	en: "centersEn",
} as const;

export type CenterTranslationLocale = keyof typeof CENTER_TRANSLATION_COLLECTIONS;
export type CenterTranslationCollection =
	(typeof CENTER_TRANSLATION_COLLECTIONS)[CenterTranslationLocale];

export const getCenterPath = (routeId: string) => `/centers/${routeId}`;

const MARK_GOLDEN_ANGLE = 137.50776405003785;

const hashSeed = (value: string) => {
	let hash = 0x811c9dc5;
	for (let i = 0; i < value.length; i++) {
		hash ^= value.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}

	hash ^= hash >>> 16;
	hash = Math.imul(hash, 0x85ebca6b);
	hash ^= hash >>> 13;
	hash = Math.imul(hash, 0xc2b2ae35);
	hash ^= hash >>> 16;

	return hash >>> 0;
};

export const getCenterMarkHue = (id: string) => {
	const seed = isCenterRouteId(id) ? centerRouteNumber(id) : hashSeed(id);

	return Math.round((seed * MARK_GOLDEN_ANGLE) % 360);
};

export const getCenterTranslationCollection = (locale: string) =>
	CENTER_TRANSLATION_COLLECTIONS[locale as CenterTranslationLocale];

export const createCenterRouteIdMap = (
	entries: CollectionEntry<"centers" | "centersEn">[],
) => {
	const sortedEntries = [...entries].sort((a, b) => {
		const aRouteNumber = centerRouteNumber(a.id);
		const bRouteNumber = centerRouteNumber(b.id);

		if (aRouteNumber >= 0 && bRouteNumber >= 0) {
			return aRouteNumber - bRouteNumber;
		}

		return a.id.localeCompare(b.id, "en");
	});

	const usedRouteIds = new Set(entries.map((entry) => entry.id).filter(isCenterRouteId));
	let nextNumber = 1;

	return new Map(
		sortedEntries.map((entry) => {
			if (isCenterRouteId(entry.id)) return [entry.id, entry.id] as const;

			while (usedRouteIds.has(centerRouteId(nextNumber))) nextNumber += 1;
			const routeId = centerRouteId(nextNumber);
			usedRouteIds.add(routeId);
			return [entry.id, routeId] as const;
		}),
	);
};
