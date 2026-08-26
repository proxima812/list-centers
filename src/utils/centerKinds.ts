import type { CollectionEntry } from "astro:content";

export type CenterKind =
	| "centers"
	| "autonomies"
	| "communities"
	| "associations"
	| "diasporas"
	| "online";

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
