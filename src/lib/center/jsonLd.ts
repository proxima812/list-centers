/**
 * Разметка schema.org для страницы центра.
 *
 * Держим отдельно от `.astro`: граф — это данные, а не вёрстка. Заодно его
 * стало видно целиком, без 300 строк разметки вокруг.
 */

export interface OrganizationParts {
	name: string;
	description?: string | null;
	/** Ссылка на сам центр, если она есть; иначе канонический адрес страницы. */
	url: string;
	country?: string | null;
	region?: string | null;
	city?: string | null;
}

export function centerJsonLd(parts: OrganizationParts) {
	const { name, description, url, country, region, city } = parts;
	// Адрес добавляем, только если есть страна или город: PostalAddress с
	// одним лишь регионом Google не принимает.
	const hasAddress = Boolean(country || city);

	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name,
		...(description ? { description } : {}),
		url,
		...(hasAddress
			? {
					address: {
						"@type": "PostalAddress",
						...(country ? { addressCountry: country } : {}),
						...(region ? { addressRegion: region } : {}),
						...(city ? { addressLocality: city } : {}),
					},
				}
			: {}),
	};
}
