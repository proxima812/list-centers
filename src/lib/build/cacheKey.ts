import type { CollectionEntry } from "astro:content";

type AnyEntry = { id: string; digest?: string | number; data?: unknown };

/** FNV-1a: короткий детерминированный ключ без зависимостей и без crypto. */
function hash(input: string): string {
	let h = 0x811c9dc5;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return (h >>> 0).toString(36);
}

/**
 * Отпечаток записи коллекции.
 *
 * `digest` проставляет loader, но у части записей его нет — тогда падаем на
 * сериализацию frontmatter. Тело файла в data не входит, но у glob-loader
 * digest считается по всему файлу, так что правка текста ключ меняет.
 */
export const entryFingerprint = (entry: AnyEntry): string =>
	String(entry.digest ?? hash(`${entry.id}:${JSON.stringify(entry.data ?? null)}`));

/** Общий отпечаток набора записей — для страниц, зависящих от всей коллекции. */
export const collectionFingerprint = (entries: AnyEntry[]): string =>
	hash(
		[...entries]
			.map((entry) => `${entry.id}:${entryFingerprint(entry)}`)
			.sort()
			.join("|"),
	);

/** Ключ страницы: склейка отпечатков всего, от чего страница зависит. */
export const pageCacheKey = (...parts: (string | number | null | undefined)[]): string =>
	hash(parts.map((part) => part ?? "-").join("|"));

export type { CollectionEntry };
