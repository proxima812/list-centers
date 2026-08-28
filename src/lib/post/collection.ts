import type { AppLocale } from "@/i18n";
import { getCollection, type CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts" | "postsEn">;

const POST_TRANSLATION_COLLECTIONS = {
	en: "postsEn",
} as const;

type PostTranslationLocale = keyof typeof POST_TRANSLATION_COLLECTIONS;

export const getPostTranslationCollection = (locale: string) =>
	POST_TRANSLATION_COLLECTIONS[locale as PostTranslationLocale];

/** Свежие сверху — порядок ленты и порядок соседних ссылок в посте. */
export const byNewest = <T extends PostEntry>(entries: T[]): T[] =>
	[...entries].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

/**
 * Посты под нужную локаль.
 *
 * Русский — источник истины, переводы живут отдельной коллекцией. Если для
 * локали переводов нет вовсе, отдаём русские: пустая лента хуже, чем лента на
 * другом языке. Правило то же, что у центров (`localizedCenters`).
 */
export async function localizedPosts(locale: AppLocale): Promise<PostEntry[]> {
	const source = await getCollection("posts");
	const collection = getPostTranslationCollection(locale);
	if (!collection) return source;

	const translated = await getCollection(collection);

	return translated.length > 0 ? translated : source;
}
