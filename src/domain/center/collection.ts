import type { AppLocale } from "@/i18n";
import { getCenterTranslationCollection } from "@/utils/centers";
import { getCollection, type CollectionEntry } from "astro:content";

export type CenterEntry = CollectionEntry<"centers" | "centersEn">;

/**
 * Карточки центров под нужную локаль.
 *
 * Русский — источник истины: переводы живут отдельной коллекцией и могут быть
 * пустыми. Если перевода для локали нет вообще, отдаём русские карточки, а не
 * пустой каталог. Это правило дублировалось в `[locale]/centers/index.astro`
 * и в построении поискового индекса.
 */
export async function localizedCenters(locale: AppLocale): Promise<CenterEntry[]> {
	const source = await getCollection("centers");
	const translationCollection = getCenterTranslationCollection(locale);
	if (!translationCollection) return source;

	const translated = await getCollection(translationCollection);

	return translated.length > 0 ? translated : source;
}
