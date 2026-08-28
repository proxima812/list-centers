import type { CollectionEntry } from "astro:content";

type SourceCenter = CollectionEntry<"centers">;

/**
 * Объявлено через `type`, а не `interface`, намеренно: только у псевдонима
 * типа есть неявная индексная сигнатура, без которой объект не передать в
 * `t(key, values)` — тот принимает `Record<string, string | number>`.
 */
export type CatalogStats = {
	/** Всего карточек в каталоге. */
	count: number;
	/** Сколько разных стран встречается в `location.country`. */
	countries: number;
	/** Сколько разных регионов встречается в `location.region`. */
	regions: number;
};

const distinct = (values: readonly (string | undefined)[]) =>
	new Set(values.filter(Boolean)).size;

/**
 * Цифры «центров / стран / регионов» под шапки, SEO-описания и /stats.
 *
 * Считались независимо в четырёх местах (главная, HomeSections, каталог,
 * /stats) — и разъезжались бы при первой же правке правила подсчёта.
 */
export function catalogStats(centers: readonly SourceCenter[]): CatalogStats {
	return {
		count: centers.length,
		countries: distinct(centers.map((center) => center.data.location?.country)),
		regions: distinct(centers.map((center) => center.data.location?.region)),
	};
}

/** Карточек по странам — основа таблицы на /stats. */
export function countByCountry(centers: readonly SourceCenter[]): Map<string, number> {
	const counts = new Map<string, number>();

	for (const center of centers) {
		const country = center.data.location?.country;
		if (!country) continue;
		counts.set(country, (counts.get(country) ?? 0) + 1);
	}

	return counts;
}

/** Карточки без указанной страны — их не видно ни в одном макрорегионе. */
export const withoutCountry = (centers: readonly SourceCenter[]) =>
	centers.filter((center) => !center.data.location?.country).length;
