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

/**
 * Описание фасетов каталога — единственное место, где живёт знание о том,
 * какие оси есть у фильтров, как они вложены друг в друга и в каком порядке
 * показываются.
 *
 * До этого модуля осей было четыре и все рисовались одинаково: страна, тип,
 * категория, регион. Проблема была не в разметке, а в том, что оси разной
 * природы. `type` («Регион РФ» / «Зарубежный» / «Онлайн») на 99% повторял
 * страну, а `region` был плоским списком на 84 значения, не связанным со
 * страной, — «Казахстан» плюс «Пермский край» был кликабельной комбинацией,
 * дающей ноль карточек.
 *
 * Теперь это дерево. Корень — scope (бывший `type`), он решает, какая ветка
 * географии показывается. Дальше промежуточный уровень (федеральный округ для
 * России, макрорегион для остального мира), затем страна, регион и город.
 * Категория ортогональна всему и стоит отдельно.
 */

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
	/** Ключ i18n для `aria-label` группы. */
	ariaKey: string;
	/** Ключ i18n для кнопки «все …». */
	allKey: string;
	/** Сколько опций видно до «показать ещё». `0` — показываем все. */
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

/**
 * География берётся из русской коллекции для всех локалей.
 *
 * Переводы карточек хранят локализованные подписи (`country: Russia`,
 * `region: Saint Petersburg`), причём не у всех карточек: на английской
 * странице фильтры строились по другому набору значений, чем на русской, и
 * часть карточек выпадала из географии вовсе. Ключ фильтра обязан быть один на
 * все языки, иначе фасет не находит собственные карточки.
 */
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

/**
 * Порядок опций считается один раз на сервере и дальше не меняется.
 *
 * Клиент пересчитывает счётчики после каждого клика, но не пересортировывает
 * список: если строки будут прыгать под курсором после каждого выбора,
 * попасть во вторую по счёту станет невозможно. Скрытие нулевых опций
 * порядок сохраняет.
 */
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

// Округа и макрорегионы показываем целиком: их восемь и шесть, «показать ещё»
// на таком списке — лишний клик ради двух строк. У страны, региона и города
// хвост длинный, там порог нужен.
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
			// «Россия» из списка корзин убрана намеренно: она уже есть в
			// переключателе выше, и вторая кнопка с тем же смыслом рядом с
			// первой — не выбор, а вопрос «а эти две одинаковые?».
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
