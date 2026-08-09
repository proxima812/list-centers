/**
 * Сохранённые карточки центров: хранилище и синхронизация UI.
 *
 * Данных на сервере нет и не будет — сайт статический, — поэтому список живёт
 * в localStorage браузера. Храним не только id, но снимок карточки: страница
 * /saved рисуется сразу из хранилища, без запроса к каталогу и без ожидания
 * сети. Каталог из 340 карточек грузить ради десяти сохранённых незачем.
 *
 * Снимок берётся с data-атрибутов `<article data-search-id>` (см. CardItem):
 * они там уже есть для поиска и фильтров, второй копии тех же строк в разметке
 * не заводим.
 *
 * Модуль общий для всех поверхностей — кнопки на карточках, счётчик в шапке,
 * список на /saved. Слушатели навешаны на document/window, поэтому сколько раз
 * его импортировали на странице, значения не имеет.
 */

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
	/** Русское название страны: /saved существует только в дефолтной локали. */
	country: string;
	flag: string;
	pubDate: string;
	/** Метка времени сохранения: список показывается свежим сверху. */
	savedAt: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

const asString = (value: unknown) => (typeof value === "string" ? value : "");

/**
 * Читаем защищённо: localStorage бросает в приватном режиме Safari и при
 * запрещённых сторонних данных, а содержимое могло остаться от старой версии
 * формата или быть испорчено руками. Любая проблема — пустой список, а не
 * пустая страница.
 */
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
		// Квота кончилась или запись запрещена. Молча: пользователь нажал на
		// закладку, а не запустил операцию, ради которой стоит ронять страницу.
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

/** Возвращает новое состояние: true — карточка сохранена, false — снята. */
export function toggleSaved(entry: Omit<SavedCenter, "savedAt">): boolean {
	const list = readSaved();
	const existing = list.findIndex((item) => item.id === entry.id);

	if (existing !== -1) {
		list.splice(existing, 1);
		writeSaved(list);
		return false;
	}

	// Свежее сверху: список читается как история, а не как случайный порядок.
	writeSaved([{ ...entry, savedAt: Date.now() }, ...list]);
	return true;
}

function notify() {
	document.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/**
 * Подписка на изменения. `storage` прилетает только из других вкладок, свои
 * правки приходят через CustomEvent — поэтому слушаем оба источника, иначе
 * счётчик в шапке разъедется между вкладками.
 */
export function onSavedChange(handler: () => void) {
	document.addEventListener(CHANGE_EVENT, handler);
	window.addEventListener("storage", (event) => {
		if (event.key === null || event.key === STORAGE_KEY) handler();
	});
}
