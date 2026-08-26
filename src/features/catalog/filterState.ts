import type { CenterScope, FacetKey, FilterGate, FilterRecord } from "./types";

/**
 * Отбор карточек каталога — без единого обращения к DOM.
 *
 * Раньше эти правила жили внутри 900-строчной `initCardsToolbar` вперемешку
 * с рендером чипов, скроллом и обработчиками клавиатуры: ни проверить, ни
 * переиспользовать. Здесь остались только состояние выбора и решения по нему.
 *
 * Объект владеет своим состоянием и наружу отдаёт ответы, а не сами Set'ы:
 * поменять выбор мимо `toggle`/`setScope` нельзя, поэтому каскад «сбросить
 * потомков» невозможно случайно обойти.
 */

/** Выбор страны обнуляет регион и город: они относятся к прежней стране. */
const FACET_CHILDREN: Record<string, readonly string[]> = {
	macro: ["country", "region", "city"],
	okrug: ["region", "city"],
	country: ["region", "city"],
	region: ["city"],
};

/** Географические фасеты: их сбрасывает смена области. */
export const GEO_FACETS = ["macro", "okrug", "country", "region", "city"] as const;

export interface FilterSnapshot {
	scope: CenterScope;
	selections: Record<FacetKey, string[]>;
}

export interface CatalogFilter {
	readonly scope: CenterScope;
	readonly facetKeys: readonly FacetKey[];
	selected(key: FacetKey): ReadonlySet<string>;
	/** Сколько фильтров активно — область считается за один. */
	activeCount(): number;
	setScope(next: CenterScope): void;
	/** Чипы одиночного выбора: повторный клик по активному снимает его. */
	toggle(key: FacetKey, value: string): void;
	resetGroup(key: FacetKey): void;
	reset(): void;
	/** Ограничить выдачу результатами поиска; `null` — поиск не активен. */
	limitTo(ids: Set<string> | null): void;
	matches(record: FilterRecord): boolean;
	countFacet(key: FacetKey): Map<string, number>;
	countScopes(): Map<string, number>;
	/** Снять выбор, под который не осталось ни одной карточки. */
	pruneEmpty(): boolean;
	isSectionVisible(gate: FilterGate, key: FacetKey): boolean;
	snapshot(): FilterSnapshot;
	restore(snapshot: FilterSnapshot): void;
}

export function createCatalogFilter(
	records: readonly FilterRecord[],
	facetKeys: readonly FacetKey[],
): CatalogFilter {
	const selections = new Map<FacetKey, Set<string>>(
		facetKeys.map((key) => [key, new Set<string>()]),
	);
	let scope: CenterScope = "";
	let searchMatchIds: Set<string> | null = null;

	const groupOf = (key: FacetKey) => selections.get(key);

	const matchesScope = (record: FilterRecord) => !scope || record.scope === scope;
	const matchesSearch = (record: FilterRecord) =>
		!searchMatchIds || searchMatchIds.has(record.id);

	function matchesExcept(record: FilterRecord, skip: readonly FacetKey[] | null) {
		if (!matchesScope(record) || !matchesSearch(record)) return false;

		for (const key of facetKeys) {
			if (skip?.includes(key)) continue;
			const chosen = groupOf(key);
			if (chosen && chosen.size > 0 && !chosen.has(record.facets[key])) return false;
		}

		return true;
	}

	function clearDescendants(key: FacetKey) {
		for (const child of FACET_CHILDREN[key] ?? []) groupOf(child)?.clear();
	}

	function countFacet(key: FacetKey) {
		// Себя и своих потомков не учитываем: иначе выбор страны обнулил бы
		// счётчики всех остальных стран и группа схлопнулась бы до одной.
		const skip = [key, ...(FACET_CHILDREN[key] ?? [])];
		const counts = new Map<string, number>();

		for (const record of records) {
			if (!matchesExcept(record, skip)) continue;
			const value = record.facets[key];
			if (!value) continue;
			counts.set(value, (counts.get(value) ?? 0) + 1);
		}

		return counts;
	}

	return {
		get scope() {
			return scope;
		},

		get facetKeys() {
			return facetKeys;
		},

		selected: (key) => groupOf(key) ?? new Set<string>(),

		activeCount: () =>
			facetKeys.reduce((total, key) => total + (groupOf(key)?.size ?? 0), 0) + (scope ? 1 : 0),

		setScope(next) {
			scope = scope === next ? "" : next;
			// География привязана к области: выбранная страна не переживает
			// переключение «Россия / зарубеж / онлайн».
			for (const key of GEO_FACETS) groupOf(key)?.clear();
		},

		toggle(key, value) {
			const group = groupOf(key);
			if (!group) return;

			const wasActive = group.has(value);
			group.clear();
			if (!wasActive) group.add(value);
			clearDescendants(key);
		},

		resetGroup(key) {
			groupOf(key)?.clear();
			clearDescendants(key);
		},

		reset() {
			for (const group of selections.values()) group.clear();
			scope = "";
		},

		limitTo(ids) {
			searchMatchIds = ids;
		},

		matches: (record) => matchesExcept(record, null),

		countFacet,

		countScopes() {
			// Считаем по негеографическим фасетам: иначе выбранная страна
			// обнулила бы счётчик у соседних областей.
			const counts = new Map<string, number>();

			for (const record of records) {
				if (!matchesSearch(record)) continue;

				const fits = facetKeys.every((key) => {
					if ((GEO_FACETS as readonly string[]).includes(key)) return true;
					const chosen = groupOf(key);
					return !chosen || chosen.size === 0 || chosen.has(record.facets[key]);
				});

				if (fits) counts.set(record.scope, (counts.get(record.scope) ?? 0) + 1);
			}

			return counts;
		},

		pruneEmpty() {
			let pruned = false;

			for (const key of facetKeys) {
				const group = groupOf(key);
				if (!group || group.size === 0) continue;

				const counts = countFacet(key);
				for (const value of [...group]) {
					if ((counts.get(value) ?? 0) === 0) {
						group.delete(value);
						pruned = true;
					}
				}
			}

			return pruned;
		},

		isSectionVisible(gate, key) {
			switch (gate) {
				case "ru":
					return scope === "ru";
				case "world":
					return scope !== "ru" && scope !== "online";
				case "country":
					return scope === "abroad" || (groupOf("macro")?.size ?? 0) > 0;
				case "region":
					return (
						scope === "ru" ||
						(groupOf("okrug")?.size ?? 0) > 0 ||
						(groupOf("country")?.size ?? 0) > 0
					);
				case "city":
					return (groupOf("region")?.size ?? 0) > 0 || (groupOf("country")?.size ?? 0) > 0;
				default:
					return key.length > 0;
			}
		},

		snapshot: () => ({
			scope,
			selections: Object.fromEntries(
				facetKeys.map((key) => [key, [...(groupOf(key) ?? [])]]),
			),
		}),

		restore(next) {
			scope = next.scope;
			for (const key of facetKeys) {
				const group = groupOf(key);
				if (!group) continue;
				group.clear();
				for (const value of next.selections[key] ?? []) group.add(value);
			}
		},
	};
}
