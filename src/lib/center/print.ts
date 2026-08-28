import { getCountryLabel } from "@/data/worldCountries";
import { localizePath, type AppLocale } from "@/i18n";
import { createCenterRouteIdMap, getCenterPath } from "@/lib/center/centers";
import { localizedCenters } from "@/lib/center/collection";

/** Страна не указана: такие карточки печатаются последней группой. */
const UNKNOWN_COUNTRY = "Прочее";

export interface PrintEntry {
	title: string;
	place: string;
	kind: string;
	/** Абсолютный адрес: с бумаги ссылку переписывают руками. */
	href: string;
}

export interface PrintCountry {
	/** Русское название страны — ключ группировки и хук для фильтра печати. */
	country: string;
	label: string;
	entries: PrintEntry[];
}

/**
 * Каталог, разложенный по странам для `/centers/print`.
 *
 * Ключ группировки — русское название: по нему сходятся карточки обеих
 * коллекций. На печать уходит уже локализованная подпись.
 */
export async function buildPrintCatalog(
	locale: AppLocale,
	siteUrl: string,
): Promise<{ countries: PrintCountry[]; total: number }> {
	const centers = await localizedCenters(locale);
	const routeIds = createCenterRouteIdMap(centers);
	const groups = new Map<string, PrintEntry[]>();

	for (const center of centers) {
		const country = center.data.location?.country ?? UNKNOWN_COUNTRY;
		const place = [center.data.location?.city, center.data.location?.region]
			.filter(Boolean)
			.filter((value, index, list) => list.indexOf(value) === index)
			.join(", ");

		const entry: PrintEntry = {
			title: center.data.title,
			place,
			kind: [center.data.category, center.data.type].filter(Boolean).join(" · "),
			href: `${siteUrl}${localizePath(locale, getCenterPath(routeIds.get(center.id) ?? center.id))}`,
		};

		const group = groups.get(country);
		if (group) group.push(entry);
		else groups.set(country, [entry]);
	}

	for (const entries of groups.values()) {
		entries.sort(
			(a, b) => a.place.localeCompare(b.place, locale) || a.title.localeCompare(b.title, locale),
		);
	}

	const countries = [...groups.entries()]
		.sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], locale))
		.map(([country, entries]) => ({
			country,
			label: getCountryLabel(country, locale),
			entries,
		}));

	return { countries, total: centers.length };
}
