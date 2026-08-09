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

// `saved` здесь по той же причине, что `map`: страница одна на обе локали.
// Содержимое у неё не редакционное, а из localStorage браузера, и заводить
// вторую копию каркаса ради заголовка — лишний маршрут в карте сайта и лишний
// повод для расхождения. Рендерится в дефолтной локали, отсюда русские строки.
const unlocalizedPathnames = new Set(["posts", "sabantye", "map", "saved"]);

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
	if (unlocalizedPathnames.has(relativePath)) {
		return hash ? `/${relativePath}/#${hash}` : `/${relativePath}/`;
	}

	const localized = getRelativeLocaleUrl(locale, relativePath);

	return hash ? `${localized}#${hash}` : localized;
}

export function getSwitcherHref(locale: AppLocale, url: URL): string {
	const currentPath = getLocalePathname(url.pathname);
	if (currentPath === "404") {
		return getRelativeLocaleUrl(locale, "");
	}

	if (unlocalizedPathnames.has(currentPath)) {
		return `/${currentPath}/${url.search}${url.hash}`;
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
