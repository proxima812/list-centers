/**
 * Общие типы проекта: каталог, поиск и «центры рядом».
 *
 * Один файл на все разделяемые типы — чтобы не искать их по модулям.
 * Импортируется и на сборке, и в браузере, поэтому здесь только типы:
 * ни одного значения, которое попало бы в бандл.
 */


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

/**
 * Карточка в том виде, в каком её получает страница «Центры рядом».
 *
 * Страна посетителя известна только в браузере, поэтому разметку карточек
 * нельзя отрендерить заранее: пришлось бы отдать все 400+ ради десятка
 * нужных. Вместо этого страница берёт этот индекс и собирает карточки из
 * `<template>` — тем же способом, что и `/saved`.
 */
export interface NearbyIndexItem {
	id: string;
	/** Канонический путь карточки: он же уезжает в «сохранённые». */
	href: string;
	/**
	 * Адрес, по которому карточка открывается: с префиксом локали, если
	 * перевод есть, и со слешем на конце. Отличается от `href` всегда —
	 * хотя бы этим слешем, без которого сайт отвечает редиректом.
	 */
	linkHref: string;
	title: string;
	summary: string;
	/** Каноническое русское название: по нему сходится геолокация. */
	country: string;
	/** То же, но на языке страницы: его видит посетитель. */
	countryLabel: string;
	flag: string;
	city: string;
	category: string;
	type: string;
	pubDate: string;
}
