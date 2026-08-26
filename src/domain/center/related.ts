import type { CollectionEntry } from "astro:content";
import type { CenterEntry } from "./collection";

/**
 * Похожие центры под карточкой.
 *
 * Родство считаем по русскому источнику, а не по переводу: у английской
 * карточки может не быть ни страны, ни категории, и блок бы просто пропал.
 * Показываем же локализованную запись, если перевод есть.
 */

const RELATED_LIMIT = 4;

const clean = (value?: string | null) => value?.trim() || null;

export function relatedCenters(
	entry: CollectionEntry<"centers">,
	source: readonly CollectionEntry<"centers">[],
	localizedById: Map<string, CenterEntry>,
): CenterEntry[] {
	const country = clean(entry.data.location?.country);
	const category = clean(entry.data.category);

	// Страна ближе, чем категория: «ещё центры в Германии» полезнее, чем
	// «ещё татарские центры» — последних в каталоге сотни.
	const isRelated = (candidate: CollectionEntry<"centers">) => {
		if (candidate.id === entry.id) return false;
		if (country) return candidate.data.location?.country === country;
		if (category) return candidate.data.category === category;

		return false;
	};

	return source
		.filter(isRelated)
		.slice(0, RELATED_LIMIT)
		.map((candidate) => localizedById.get(candidate.id) ?? candidate);
}

/** По стране родство или по категории — от этого зависит заголовок блока. */
export const relatedByCountry = (entry: CollectionEntry<"centers">) =>
	Boolean(clean(entry.data.location?.country));
