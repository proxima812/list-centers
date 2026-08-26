import { config } from "@/config";

/**
 * Граф schema.org для страницы.
 *
 * Собирался прямо в `SEO.astro` — сотня строк объектных литералов посреди
 * разметки. Граф это данные: здесь его видно целиком, можно прочитать
 * глазами и проверить, не пролистывая сорок мета-тегов.
 */

export interface SchemaInput {
	title: string;
	description: string;
	keywords: string;
	locale: string;
	siteName: string;
	author: string;
	image: string;
	canonicalURL: string;
	siteURL: URL;
	logoURL?: string;
	isArticle: boolean;
	/** У `noindex`-страниц не указываем url: незачем звать краулера. */
	shouldIndex: boolean;
	publishedTime?: string;
	modifiedTime?: string;
}

const thing = (name: string) => ({ "@type": "Thing", name });

function publisher(input: SchemaInput) {
	return {
		"@type": "Organization",
		name: config.site.OG.organizationName || input.siteName,
		url: input.siteURL.href,
		...(input.logoURL && { logo: { "@type": "ImageObject", url: input.logoURL } }),
	};
}

function website(input: SchemaInput) {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: input.siteName,
		alternateName: ["tatarverse.cc", "ТБК", "Татары, башкиры и крымские татары"],
		description: config.site.OG.description,
		inLanguage: input.locale,
		url: input.siteURL.href,
		publisher: publisher(input),
		about: [
			thing("Татары"),
			thing("Башкиры"),
			thing("Крымские татары"),
			thing("Татарские и башкирские культурные центры"),
		],
		// Даёт поисковику форму поиска прямо в выдаче.
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: new URL("/centers?q={search_term_string}", input.siteURL).href,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

function article(input: SchemaInput) {
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: input.title,
		description: input.description,
		keywords: input.keywords,
		inLanguage: input.locale,
		...(input.shouldIndex
			? { url: input.canonicalURL, mainEntityOfPage: input.canonicalURL }
			: {}),
		image: [input.image],
		author: { "@type": "Person", name: input.author, url: input.siteURL.href },
		publisher: publisher(input),
		...(input.publishedTime && { datePublished: input.publishedTime }),
		...(input.modifiedTime && { dateModified: input.modifiedTime }),
	};
}

function webPage(input: SchemaInput) {
	return {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: input.title,
		description: input.description,
		keywords: input.keywords,
		inLanguage: input.locale,
		...(input.shouldIndex ? { url: input.canonicalURL } : {}),
		image: [input.image],
		isPartOf: { "@id": `${input.siteURL.href}#website` },
		about: [thing("ТБК"), thing("Татары"), thing("Башкиры"), thing("Крымские татары")],
		author: { "@type": "Person", name: input.author, url: input.siteURL.href },
	};
}

/**
 * Статья идёт одиночным узлом, обычная страница — вместе с описанием сайта:
 * `WebSite` нужен поисковику один раз, и вешать его на каждый пост незачем.
 */
export function pageSchema(input: SchemaInput) {
	if (input.isArticle) return article(input);

	return {
		"@context": "https://schema.org",
		"@graph": [
			{ ...website(input), "@id": `${input.siteURL.href}#website` },
			webPage(input),
		],
	};
}
