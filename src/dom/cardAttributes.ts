/**
 * Контракт `data-*` карточки центра — единственное объявление.
 *
 * Карточка рендерится на сборке (`CardItem.astro`), а читают её три
 * независимых потребителя в браузере: фильтры каталога
 * (`scripts/centersToolbar.ts`), сохранённые центры
 * (`scripts/savedCentersUi.ts`) и страница `/saved`. Раньше имена атрибутов
 * жили в этих файлах строковыми литералами — переименование ловилось только
 * грепом и падало в рантайме, потому что ни `astro check`, ни TypeScript
 * ничего не знали о связи.
 *
 * Теперь имя атрибута существует один раз. Пишущая сторона зовёт
 * `cardDataset`, читающие — `readCard`; расхождение становится ошибкой типов.
 *
 * Модуль попадает в клиентский бандл: никаких Node-зависимостей.
 */

export const CARD_ATTR = {
	id: "data-search-id",
	scope: "data-scope",
	macro: "data-macro",
	okrug: "data-okrug",
	country: "data-country",
	region: "data-region",
	city: "data-city",
	type: "data-type",
	category: "data-category",
	title: "data-title",
	summary: "data-summary",
	flag: "data-flag",
	pubDate: "data-pub-date",
	href: "data-href",
} as const;

export type CardField = keyof typeof CARD_ATTR;

export type CardFields = Record<CardField, string>;

/** Поля, по которым каталог умеет фильтровать. Порядок не значим. */
export const FACET_FIELDS = [
	"macro",
	"okrug",
	"country",
	"region",
	"city",
	"category",
] as const satisfies readonly CardField[];

export type FacetField = (typeof FACET_FIELDS)[number];

const FIELDS = Object.keys(CARD_ATTR) as CardField[];

export const isFacetField = (value: string): value is FacetField =>
	(FACET_FIELDS as readonly string[]).includes(value);

/**
 * Атрибуты для `<article {...cardDataset(fields)}>`.
 * Пустые значения не выбрасываем: читающая сторона отличает «поля нет» от
 * «поле пустое» только по наличию атрибута, а фильтры ждут пустую строку.
 */
export function cardDataset(fields: CardFields): Record<string, string> {
	const dataset: Record<string, string> = {};
	for (const field of FIELDS) dataset[CARD_ATTR[field]] = fields[field];

	return dataset;
}

/** Обратная операция: карточка из DOM. Отсутствующий атрибут — пустая строка. */
export function readCard(element: Element): CardFields {
	const fields = {} as CardFields;
	for (const field of FIELDS) fields[field] = element.getAttribute(CARD_ATTR[field]) ?? "";

	return fields;
}

/** Ближайшая карточка вверх по дереву — общий способ для всех обработчиков. */
export const closestCard = (element: Element): HTMLElement | null =>
	element.closest<HTMLElement>(`[${CARD_ATTR.id}]`);
