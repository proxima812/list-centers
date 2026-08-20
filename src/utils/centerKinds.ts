import type { CollectionEntry } from "astro:content";

/**
 * Organization "kind" derived from the entry title and type.
 *
 * The catalog is not only "centers": it also holds national-cultural
 * autonomies, associations, diasporas/землячества and online initiatives.
 * We classify each entry into one mutually-exclusive kind so the homepage
 * counter can show the real composition. This is display-only — it does not
 * add a schema field or a catalog filter.
 *
 * Priority matters: a title like «Общественная организация "Центр ..."»
 * contains both "обществ" and "центр", so the more specific bucket wins.
 */
export type CenterKind =
	| "centers"
	| "autonomies"
	| "communities"
	| "associations"
	| "diasporas"
	| "online";

/** Display order for the breakdown tiles. */
const CENTER_KIND_ORDER: CenterKind[] = [
	"centers",
	"autonomies",
	"communities",
	"associations",
	"diasporas",
	"online",
];

export const CENTER_KIND_ICONS: Record<CenterKind, string> = {
	centers: "mdi:map-marker-radius",
	autonomies: "mdi:bank-outline",
	communities: "mdi:account-group-outline",
	associations: "mdi:handshake-outline",
	diasporas: "mdi:earth",
	online: "mdi:web",
};

const classifyCenterKind = (title: string, type?: string): CenterKind => {
	const s = title.toLowerCase();

	if (type === "Онлайн") return "online";
	if (/землячеств|диаспор/.test(s)) return "diasporas";
	if (/автономи/.test(s)) return "autonomies";
	if (/ассоциаци|союз|конгресс|курултай|меджлис/.test(s)) return "associations";
	if (/центр/.test(s)) return "centers";
	return "communities";
};

export interface CenterKindBucket {
	kind: CenterKind;
	count: number;
}

/**
 * Returns the non-empty kind buckets in display order. Counts sum to the
 * total number of centers, so the breakdown stays consistent with the total.
 */
export const getCenterKindBreakdown = (
	entries: CollectionEntry<"centers">[],
): CenterKindBucket[] => {
	const counts = new Map<CenterKind, number>();

	for (const entry of entries) {
		const kind = classifyCenterKind(entry.data.title, entry.data.type);
		counts.set(kind, (counts.get(kind) ?? 0) + 1);
	}

	return CENTER_KIND_ORDER.map((kind) => ({
		kind,
		count: counts.get(kind) ?? 0,
	})).filter((bucket) => bucket.count > 0);
};
