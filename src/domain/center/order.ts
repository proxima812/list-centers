import type { CollectionEntry } from "astro:content";
import { centerRouteNumber } from "./routeId";

type CenterEntry = CollectionEntry<"centers" | "centersEn">;

const pubTime = (entry: CenterEntry) =>
	entry.data.pubDate ? new Date(entry.data.pubDate).getTime() : 0;

/**
 * Единственный порядок центров «от свежих к старым».
 *
 * Дата — первичный ключ, номер карточки (`tbk-N`) — тай-брейк: без него
 * центры с одинаковым `pubDate` выстраивались как придётся, и подвал,
 * каталог, RSS и поиск показывали их в разном порядке.
 *
 * Копирует вход, а не сортирует его на месте: `getCollection` отдаёт массив,
 * который переиспользуют другие вызовы на той же сборке.
 */
export const byRecency = <T extends CenterEntry>(entries: readonly T[]): T[] =>
	[...entries].sort(
		(a, b) => pubTime(b) - pubTime(a) || centerRouteNumber(b.id) - centerRouteNumber(a.id),
	);

/** Самый свежий центр или `undefined`, если коллекция пуста. */
export const latestCenter = <T extends CenterEntry>(entries: readonly T[]): T | undefined =>
	byRecency(entries)[0];
