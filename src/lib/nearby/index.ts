import { resolveCenterGeo } from "@/data/geo";
import { countryFlagsByRu, getCountryLabel } from "@/data/worldCountries";
import { localizedCenters } from "@/lib/center/collection";
import { byRecency } from "@/lib/center/order";
import type { NearbyIndexItem } from "@/lib/types";
import { localizePath, type AppLocale } from "@/i18n";
import { createCenterRouteIdMap, getCenterPath } from "@/lib/center/centers";
import { getCollection } from "astro:content";

/**
 * Индекс для страницы «Центры рядом».
 *
 * Ровно те поля, которые рисует карточка, — ни `searchText`, ни `terms`:
 * поисковый индекс тяжелее вчетверо, а страница из него взяла бы восьмую
 * часть. Онлайн-центры сюда не попадают: у них нет страны, а «рядом» — это
 * вопрос про географию.
 */
export async function getNearbyIndex(locale: AppLocale): Promise<NearbyIndexItem[]> {
	const sourceCards = await getCollection("centers");
	const geoById = new Map(
		sourceCards.map((card) => [card.id, resolveCenterGeo(card.data.location)]),
	);

	const cards = byRecency(await localizedCenters(locale));
	const routeIds = createCenterRouteIdMap(cards);

	const items: NearbyIndexItem[] = [];

	for (const card of cards) {
		const geo = geoById.get(card.id) ?? resolveCenterGeo(card.data.location);
		if (!geo.country) continue;

		const href = getCenterPath(routeIds.get(card.id) ?? card.id);
		// То же, что делает карточка каталога: локаль и слеш на конце.
		const linkHref = localizePath(locale, href);

		items.push({
			id: card.id,
			href,
			linkHref,
			title: card.data.title ?? "",
			summary: card.data.summary ?? "",
			country: geo.country,
			countryLabel: getCountryLabel(geo.country, locale),
			flag: card.data.location?.flag?.trim() || countryFlagsByRu[geo.country] || "",
			city: geo.city,
			category: card.data.category ?? "",
			type: card.data.type ?? "",
			pubDate: card.data.pubDate ?? "",
		});
	}

	return items;
}

export interface NearbyCountry {
	country: string;
	label: string;
	flag: string;
	count: number;
}

/**
 * Страны для ручного выбора: считаются на сборке, а не в браузере.
 *
 * Список одинаков для всех посетителей, поэтому ручной выбор работает ещё до
 * того, как приедет индекс карточек, и остаётся единственным рабочим путём
 * там, где функции геолокации нет вовсе — на `astro dev` и на превью без
 * Cloudflare.
 */
export function nearbyCountries(
	items: readonly NearbyIndexItem[],
	locale: AppLocale,
): NearbyCountry[] {
	const stats = new Map<string, NearbyCountry>();

	for (const item of items) {
		const stat = stats.get(item.country);
		if (stat) stat.count += 1;
		else
			stats.set(item.country, {
				country: item.country,
				label: item.countryLabel,
				flag: item.flag,
				count: 1,
			});
	}

	return [...stats.values()].sort(
		(left, right) => right.count - left.count || left.label.localeCompare(right.label, locale),
	);
}
