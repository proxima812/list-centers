
const STORAGE_KEY = "saved-centers";
const CHANGE_EVENT = "saved-centers:change";
const LIMIT = 500;

export type SavedCenter = {
	id: string;
	href: string;
	title: string;
	summary: string;
	type: string;
	category: string;
	city: string;
	country: string;
	flag: string;
	pubDate: string;
	savedAt: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const asString = (value: unknown) => (typeof value === "string" ? value : "");

export function readSaved(): SavedCenter[] {
	let raw: string | null = null;

	try {
		raw = localStorage.getItem(STORAGE_KEY);
	} catch {
		return [];
	}

	if (!raw) return [];

	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];

		return parsed
			.filter(isRecord)
			.filter((item) => typeof item.id === "string" && item.id.length > 0)
			.map((item) => ({
				id: item.id as string,
				href: asString(item.href),
				title: asString(item.title),
				summary: asString(item.summary),
				type: asString(item.type),
				category: asString(item.category),
				city: asString(item.city),
				country: asString(item.country),
				flag: asString(item.flag),
				pubDate: asString(item.pubDate),
				savedAt: typeof item.savedAt === "number" ? item.savedAt : 0,
			}));
	} catch {
		return [];
	}
}

function writeSaved(list: SavedCenter[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, LIMIT)));
	} catch {
	}

	notify();
}

export function isSaved(id: string) {
	return readSaved().some((item) => item.id === id);
}

export function getSavedCount() {
	return readSaved().length;
}

export function removeSaved(id: string) {
	writeSaved(readSaved().filter((item) => item.id !== id));
}

export function clearSaved() {
	writeSaved([]);
}

export function toggleSaved(entry: Omit<SavedCenter, "savedAt">): boolean {
	const list = readSaved();
	const existing = list.findIndex((item) => item.id === entry.id);

	if (existing !== -1) {
		list.splice(existing, 1);
		writeSaved(list);
		return false;
	}

	writeSaved([{ ...entry, savedAt: Date.now() }, ...list]);
	return true;
}

function notify() {
	document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function onSavedChange(handler: () => void) {
	document.addEventListener(CHANGE_EVENT, handler);
	window.addEventListener("storage", (event) => {
		if (event.key === null || event.key === STORAGE_KEY) handler();
	});
}
