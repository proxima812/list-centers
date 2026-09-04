import { normalizeSearchText } from "@/lib/center/searchText";
import type { CardIndexItem, SearchIndexItem, SearchResult } from "@/lib/types";

/**
 * Поиск по каталогу: точное вхождение, потом нечёткое через Fuse.
 *
 * Ранжирование отделено от вида: сюда приходит строка, отсюда уходит
 * упорядоченный список карточек. Ни одного обращения к DOM, кроме `fetch`
 * индекса, — тулбар только показывает то, что решили здесь.
 *
 * Fuse и полный индекс подтягиваются лениво: пока посетитель не начал искать,
 * в бандл они не попадают.
 */

interface FuseResult {
	item: SearchIndexItem;
	score?: number;
}

interface FuseInstance {
	search: (query: string) => FuseResult[];
}

type FuseConstructor = new (
	items: SearchIndexItem[],
	options: {
		includeScore: boolean;
		ignoreLocation: boolean;
		threshold: number;
		minMatchCharLength: number;
		keys: { name: keyof SearchIndexItem; weight: number }[];
	},
) => FuseInstance;

/** Вес поля в нечётком поиске: название важнее города, город важнее описания. */
const FUSE_KEYS: { name: keyof SearchIndexItem; weight: number }[] = [
	{ name: "title", weight: 0.42 },
	{ name: "city", weight: 0.2 },
	{ name: "country", weight: 0.14 },
	{ name: "region", weight: 0.12 },
	{ name: "category", weight: 0.06 },
	{ name: "summary", weight: 0.03 },
];

/**
 * Сколько точных вхождений считаем самодостаточным ответом. Ниже порога
 * список дополняется нечёткими: «Берлинскй центр» находит один точный хит по
 * слову «центр» — и без добора это была бы вся выдача.
 */
const ENOUGH_EXACT = 5;

export interface CenterSearch {
	/** Пустой запрос возвращает весь каталог в исходном порядке. */
	run(query: string): Promise<SearchResult[]>;
}

export function createCenterSearch(
	cards: readonly CardIndexItem[],
	indexUrl: string | undefined,
): CenterSearch {
	const cardById = new Map(cards.map((card) => [card.id, card]));

	let itemsPromise: Promise<SearchIndexItem[]> | null = null;
	let fusePromise: Promise<FuseInstance> | null = null;

	/**
	 * Запасной индекс — из того, что уже отрисовано на странице. Нужен, когда
	 * `search-index.json` не отдался: поиск обязан работать хотя бы по
	 * видимым карточкам, а не отваливаться целиком.
	 */
	const fallbackItems = (): SearchIndexItem[] =>
		cards.map(({ element: _element, facets: _facets, scope: _scope, ...item }) => item);

	function loadItems(): Promise<SearchIndexItem[]> {
		if (!indexUrl) return Promise.resolve(fallbackItems());

		itemsPromise ??= fetch(indexUrl)
			.then((response) => {
				if (!response.ok) throw new Error(`Search index failed: ${response.status}`);
				return response.json() as Promise<SearchIndexItem[]>;
			})
			.catch(() => fallbackItems());

		return itemsPromise;
	}

	function loadFuse(): Promise<FuseInstance> {
		fusePromise ??= Promise.all([import("fuse.js"), loadItems()]).then(
			([{ default: Fuse }, items]) =>
				new (Fuse as unknown as FuseConstructor)(items, {
					includeScore: true,
					ignoreLocation: true,
					threshold: 0.32,
					minMatchCharLength: 2,
					keys: FUSE_KEYS,
				}),
		);

		return fusePromise;
	}

	/**
	 * Поля индекса кладём поверх прочитанных из разметки: индекс знает больше
	 * о той же карточке — район и локализованные город с регионом («Sydney»,
	 * «New South Wales» на /en, где в `data-*` лежит русская география).
	 * Состав карточек при этом совпадает; отсутствующие в DOM отбрасываем на
	 * случай расхождения сборки.
	 */
	const toCard = (item: SearchIndexItem): CardIndexItem | null => {
		const card = cardById.get(item.id);
		return card ? { ...card, ...item, facets: card.facets, scope: card.scope, element: card.element } : null;
	};

	return {
		async run(query) {
			const needle = normalizeSearchText(query);
			if (!needle) return cards.map((item) => ({ item, score: 0 }));

			// Точное вхождение бьёт нечёткое: набравшему «Берлин» нужен Берлин,
			// а не «Берген» с хорошим score. Но «бьёт» — это про порядок, а не
			// про право вето: один случайный точный хит не должен прятать
			// хорошие нечёткие совпадения.
			const exact = (await loadItems())
				.map(toCard)
				.filter((card): card is CardIndexItem => Boolean(card))
				.filter((card) => card.searchText.includes(needle))
				.map((item) => ({ item, score: 0.01 }))
				.sort((a, b) => a.item.order - b.item.order);

			// Точных хватает — за нечёткими не идём: это экономит загрузку Fuse
			// и его индекса ровно в тех запросах, где они ничего не добавят.
			if (exact.length >= ENOUGH_EXACT) return exact;

			const byCard = new Map<HTMLElement, SearchResult>();
			for (const result of exact) byCard.set(result.item.element, result);

			const fuse = await loadFuse();
			const fuzzy: SearchResult[] = [];

			for (const found of fuse.search(query)) {
				const item = toCard(found.item);
				if (!item || byCard.has(item.element)) continue;

				const result = { item, score: found.score ?? 1 };
				byCard.set(item.element, result);
				fuzzy.push(result);
			}

			fuzzy.sort((a, b) => a.score - b.score || a.item.order - b.item.order);

			// Точные — первыми, нечёткие — хвостом: список дополняется, а не
			// пересортировывается, когда к одному точному хиту нашлось десять
			// похожих.
			return [...exact, ...fuzzy];
		},
	};
}
