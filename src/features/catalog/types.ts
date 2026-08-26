/** Общий словарь каталога: им пользуются фильтр, поиск, URL и вид. */

export type FacetKey = string;

/** Пустая строка — «область не выбрана», а не отсутствие значения. */
export type CenterScope = "" | "ru" | "abroad" | "online";

/**
 * Условие показа секции фильтров. Гейт приходит из разметки
 * (`data-filter-gate` в `FilterSection.astro`) и решает, имеет ли секция
 * смысл при текущем выборе: округа нужны только для России, макрорегионы —
 * только когда область не сужена до России или онлайна.
 */
export type FilterGate = "always" | "world" | "ru" | "country" | "region" | "city";

/**
 * Минимум, который нужен фильтру от карточки. Намеренно без DOM-узла:
 * логику отбора можно прогнать над обычным массивом объектов.
 */
export interface FilterRecord {
	id: string;
	scope: CenterScope;
	facets: Record<FacetKey, string>;
}

/** Поля, по которым ищет Fuse и строится подсказка. */
export interface SearchIndexItem {
	id: string;
	title: string;
	summary: string;
	city: string;
	country: string;
	region: string;
	type: string;
	category: string;
	searchText: string;
	terms: string[];
	order: number;
}

/** Карточка каталога: запись фильтра + поисковые поля + узел в DOM. */
export interface CardIndexItem extends FilterRecord, SearchIndexItem {
	element: HTMLElement;
}

export interface SearchResult {
	item: CardIndexItem;
	score: number;
}
