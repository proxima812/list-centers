import type { FilterSnapshot } from "./filterState";
import type { CenterScope, FacetKey } from "@/lib/types";

/**
 * Состояние каталога ⇄ строка запроса.
 *
 * Отдельно от фильтра и от DOM: обе функции — чистые, на вход строка и
 * словарь допустимых значений, на выходе состояние или новая строка. Читать и
 * писать URL умеет только вызывающий (`history.replaceState`).
 */

const SCOPE_KEY = "scope";
const QUERY_KEY = "q";
const LEGACY_TYPE_KEY = "type";

/** Ссылки, разошедшиеся до перехода на `scope`, обязаны продолжать работать. */
const LEGACY_TYPE_TO_SCOPE: Record<string, CenterScope> = {
	"Регион РФ": "ru",
	Зарубежный: "abroad",
	Онлайн: "online",
};

export interface CatalogQuery extends FilterSnapshot {
	search: string;
}

/**
 * Разбор строки запроса. Значения, которых нет среди допустимых, молча
 * отбрасываются: чужая или устаревшая ссылка не должна давать пустой каталог
 * с невидимым фильтром.
 */
export function readCatalogQuery(
	search: string,
	facetKeys: readonly FacetKey[],
	allowed: (key: FacetKey) => ReadonlySet<string>,
	isKnownScope: (scope: CenterScope) => boolean,
): CatalogQuery {
	const params = new URLSearchParams(search);

	const requested = (params.get(SCOPE_KEY) ??
		LEGACY_TYPE_TO_SCOPE[params.get(LEGACY_TYPE_KEY) ?? ""] ??
		"") as CenterScope;

	const selections: Record<FacetKey, string[]> = {};
	for (const key of facetKeys) {
		const valid = allowed(key);
		// Фасеты — одиночный выбор: берём первое пригодное значение.
		const value = params.getAll(key).find((candidate) => valid.has(candidate));
		selections[key] = value ? [value] : [];
	}

	return {
		search: params.get(QUERY_KEY) ?? "",
		scope: isKnownScope(requested) ? requested : "",
		selections,
	};
}

/** Новая строка запроса для `history.replaceState`. Пустое не пишем. */
export function writeCatalogQuery(
	href: string,
	state: CatalogQuery,
	facetKeys: readonly FacetKey[],
): string {
	const url = new URL(href);
	const query = state.search.trim();

	url.searchParams.delete(QUERY_KEY);
	url.searchParams.delete(SCOPE_KEY);
	url.searchParams.delete(LEGACY_TYPE_KEY);
	for (const key of facetKeys) url.searchParams.delete(key);

	if (query) url.searchParams.set(QUERY_KEY, query);
	if (state.scope) url.searchParams.set(SCOPE_KEY, state.scope);
	for (const key of facetKeys) {
		for (const value of state.selections[key] ?? []) url.searchParams.append(key, value);
	}

	return `${url.pathname}${url.search}${url.hash}`;
}
