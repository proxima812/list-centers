import enDict from "@/i18n/locales/en";
import ruDict from "@/i18n/locales/ru";
import { getRelativeLocaleUrl } from "astro:i18n";
import type { Dictionary } from "@/i18n/ui";

export const allLocales = ["ru", "en"] as const;
export const locales = ["ru", "en"] as const;
export type AppLocale = (typeof allLocales)[number];
export type ActiveLocale = (typeof locales)[number];

export const defaultLocale: ActiveLocale = "ru";

export const localeLabels: Record<AppLocale, { label: string; short: Uppercase<AppLocale> }> = {
	ru: { label: "Русский", short: "RU" },
	en: { label: "English", short: "EN" },
};

const dictionaries: Record<AppLocale, Dictionary> = {
	ru: ruDict,
	en: enDict,
};

const ogLocales: Record<AppLocale, string> = {
	ru: "ru_RU",
	en: "en_US",
};

const idsFromGlob = (files: Record<string, unknown>) =>
	new Set(
		Object.keys(files).map((path) =>
			path.slice(path.lastIndexOf("/") + 1).replace(/\.mdx$/, ""),
		),
	);

const translatedCenterIds = idsFromGlob(import.meta.glob("../data/centers_i18n/en/*.mdx"));
const translatedPostIds = idsFromGlob(import.meta.glob("../data/posts_i18n/en/*.mdx"));

/**
 * Маршруты, у которых английской версии нет вовсе.
 *
 * Сейчас список пуст: переведены все служебные страницы, посты и печатная
 * форма. Механизм оставлен — он понадобится следующему разделу, который
 * выйдет сначала по-русски.
 */
const ruOnlyRoutes: Array<{ pattern: RegExp; switcher: "stay" | "hub" }> = [];

function findRuOnlyRoute(relativePath: string) {
	return ruOnlyRoutes.find((route) => route.pattern.test(relativePath));
}

export function hasLocalizedRoute(locale: AppLocale, relativePath: string): boolean {
	if (locale === defaultLocale) return true;
	if (findRuOnlyRoute(relativePath)) return false;

	const centerId = relativePath.match(/^centers\/([^/.]+)$/)?.[1];
	if (centerId && !translatedCenterIds.has(centerId)) return false;

	const postId = relativePath.match(/^posts\/([^/.]+)$/)?.[1];
	if (postId && !translatedPostIds.has(postId)) return false;

	return true;
}

export function isAppLocale(value: string | null | undefined): value is AppLocale {
	return Boolean(value && locales.includes(value as AppLocale));
}

export function getLocaleFromUrl(url: URL): AppLocale {
	const segment = url.pathname.split("/").filter(Boolean)[0];
	return isAppLocale(segment) ? segment : defaultLocale;
}

export function getLocalePathname(pathname: string): string {
	const segments = pathname.split("/").filter(Boolean);
	if (segments.length > 0 && isAppLocale(segments[0])) {
		return segments.slice(1).join("/");
	}

	return segments.join("/");
}

export function localizePath(locale: AppLocale, href: string): string {
	if (!href || href.startsWith("#")) return href;
	if (/^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) {
		return href;
	}

	if (!href.startsWith("/")) return href;

	const [pathname, hash = ""] = href.split("#");
	const relativePath = getLocalePathname(pathname);
	if (!hasLocalizedRoute(locale, relativePath)) {
		const fallback = relativePath ? `/${relativePath}/` : "/";
		return hash ? `${fallback}#${hash}` : fallback;
	}

	const localized = getRelativeLocaleUrl(locale, relativePath);

	return hash ? `${localized}#${hash}` : localized;
}

function nearestLocalizedHub(locale: AppLocale, relativePath: string): string {
	const segments = relativePath.split("/").slice(0, -1);
	while (segments.length > 0) {
		const candidate = segments.join("/");
		if (hasLocalizedRoute(locale, candidate)) return candidate;
		segments.pop();
	}

	return "";
}

export function getSwitcherHref(locale: AppLocale, url: URL): string {
	const currentPath = getLocalePathname(url.pathname);
	if (currentPath === "404") {
		return getRelativeLocaleUrl(locale, "");
	}

	if (findRuOnlyRoute(currentPath)?.switcher === "stay") {
		return `/${currentPath}/${url.search}${url.hash}`;
	}

	if (!hasLocalizedRoute(locale, currentPath)) {
		return getRelativeLocaleUrl(locale, nearestLocalizedHub(locale, currentPath));
	}

	const localized = getRelativeLocaleUrl(locale, currentPath);
	return `${localized}${url.search}${url.hash}`;
}

export function getOgLocale(locale: AppLocale): string {
	return ogLocales[locale];
}

export function useTranslations(locale: AppLocale) {
	const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
	const fallback = dictionaries[defaultLocale];

	return (key: string, values?: Record<string, string | number>, defaultValue?: string) => {
		const template = dict[key] ?? fallback[key] ?? defaultValue ?? key;

		if (!values) return template;

		return template.replace(/\{(\w+)\}/g, (_, token: string) => String(values[token] ?? ""));
	};
}
