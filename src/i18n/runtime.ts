import { isLanguage, languages, type Language, ui } from "@/i18n/ui";

const STORAGE_KEY = "language";
const DEFAULT_LANGUAGE: Language = "en";

type LanguageChangeDetail = {
	language: Language;
};

type TranslateableElement = HTMLElement & {
	dataset: DOMStringMap & {
		i18n?: string;
		i18nValues?: string;
		i18nDate?: string;
		i18nPlaceholder?: string;
		i18nAriaLabel?: string;
		i18nTitle?: string;
		i18nDateOnly?: string;
		countryLabels?: string;
	};
};

declare global {
	interface Window {
		__ximaI18nRuntimeInitialized?: boolean;
		__ximaSetLanguage?: (language: Language) => void;
		__ximaApplyLanguage?: (language?: string | null) => void;
	}
}

function isSupportedLanguage(value: string | null): value is Language {
	return isLanguage(value) && languages.includes(value);
}

function getStoredLanguage(): Language {
	const value = window.localStorage.getItem(STORAGE_KEY);
	return isSupportedLanguage(value) ? value : DEFAULT_LANGUAGE;
}

function interpolate(text: string, values: Record<string, string | number> = {}) {
	return Object.entries(values).reduce(
		(result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
		text,
	);
}

function formatDate(value: string, language: Language) {
	return new Intl.DateTimeFormat(language, {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "Asia/Almaty",
	}).format(new Date(value));
}

function formatPlainDate(value: string, language: Language) {
	return new Intl.DateTimeFormat(language, {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "Asia/Almaty",
	}).format(new Date(value));
}

function readValues(element: TranslateableElement, language: Language) {
	try {
		const values = JSON.parse(element.dataset.i18nValues || "{}") as Record<string, string | number>;
		if (element.dataset.i18nDate) {
			values.date = formatDate(element.dataset.i18nDate, language);
		}
		return values;
	} catch {
		return {};
	}
}

function translate(language: Language, key: string, values: Record<string, string | number> = {}) {
	const table = ui[language] || ui[DEFAULT_LANGUAGE];
	const fallback = ui[DEFAULT_LANGUAGE] || {};
	const raw = table[key] || fallback[key] || key;
	return interpolate(String(raw), values);
}

function applyElementTranslations(language: Language) {
	document.querySelectorAll<TranslateableElement>("[data-i18n]").forEach((element) => {
		const key = element.dataset.i18n;
		if (!key) return;
		element.textContent = translate(language, key, readValues(element, language));
	});

	document
		.querySelectorAll<TranslateableElement>("[data-i18n-placeholder]")
		.forEach((element) => {
			const key = element.dataset.i18nPlaceholder;
			if (!key) return;
			element.setAttribute(
				"placeholder",
				translate(language, key, readValues(element, language)),
			);
		});

	document
		.querySelectorAll<TranslateableElement>("[data-i18n-aria-label]")
		.forEach((element) => {
			const key = element.dataset.i18nAriaLabel;
			if (!key) return;
			element.setAttribute(
				"aria-label",
				translate(language, key, readValues(element, language)),
			);
		});

	document.querySelectorAll<TranslateableElement>("[data-i18n-title]").forEach((element) => {
		const key = element.dataset.i18nTitle;
		if (!key) return;
		element.setAttribute("title", translate(language, key, readValues(element, language)));
	});

	document.querySelectorAll<TranslateableElement>("[data-i18n-date-only]").forEach((element) => {
		const date = element.dataset.i18nDateOnly;
		if (!date) return;
		element.textContent = formatPlainDate(date, language);
	});

	document.querySelectorAll<TranslateableElement>("[data-country-labels]").forEach((element) => {
		try {
			const labels = JSON.parse(element.dataset.countryLabels || "{}") as Partial<
				Record<Language, string>
			>;
			element.textContent = labels[language] || labels.en || element.textContent || "";
		} catch {
			// ignore malformed labels payloads
		}
	});
}

function syncLanguageToggle(language: Language) {
	document
		.querySelectorAll<HTMLElement>("[data-language-switcher] [data-language-option]")
		.forEach((button) => {
			const isActive = button.dataset.languageOption === language;
			button.setAttribute("aria-checked", String(isActive));
			button.setAttribute("tabindex", isActive ? "0" : "-1");
		});
}

function emitLanguageChange(language: Language) {
	window.dispatchEvent(
		new CustomEvent<LanguageChangeDetail>("languagechange", {
			detail: { language },
		}),
	);
}

export function applyLanguage(value?: string | null, dispatchEvent = true) {
	const language = isSupportedLanguage(value ?? null) ? value : getStoredLanguage();
	const root = document.documentElement;

	root.lang = language;
	root.dataset.language = language;

	applyElementTranslations(language);
	syncLanguageToggle(language);

	if (dispatchEvent) {
		emitLanguageChange(language);
	}
}

export function setLanguage(language: Language) {
	window.localStorage.setItem(STORAGE_KEY, language);
	applyLanguage(language);
}

function bindLanguageToggle() {
	document
		.querySelectorAll<HTMLButtonElement>("[data-language-switcher] [data-language-option]")
		.forEach((button) => {
			if (button.dataset.languageBound === "true") {
				return;
			}

			button.dataset.languageBound = "true";

			button.addEventListener("click", () => {
				const language = button.dataset.languageOption;
				if (isSupportedLanguage(language)) {
					setLanguage(language);
				}
			});

			button.addEventListener("keydown", (event) => {
				const buttons = Array.from(
					document.querySelectorAll<HTMLButtonElement>(
						"[data-language-switcher] [data-language-option]",
					),
				);
				const currentIndex = buttons.indexOf(button);
				let nextIndex = currentIndex;

				if (event.key === "ArrowRight" || event.key === "ArrowDown") {
					nextIndex = (currentIndex + 1) % buttons.length;
				}

				if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
					nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
				}

				if (nextIndex !== currentIndex) {
					event.preventDefault();
					const nextButton = buttons[nextIndex];
					nextButton?.focus();
					const nextLanguage = nextButton?.dataset.languageOption;
					if (isSupportedLanguage(nextLanguage)) {
						setLanguage(nextLanguage);
					}
				}
			});
		});
}

function initCurrentPage() {
	bindLanguageToggle();
	applyLanguage(getStoredLanguage(), false);
}

export function initI18nRuntime() {
	if (window.__ximaI18nRuntimeInitialized) {
		initCurrentPage();
		return;
	}

	window.__ximaI18nRuntimeInitialized = true;
	window.__ximaSetLanguage = setLanguage;
	window.__ximaApplyLanguage = (language) => applyLanguage(language);

	document.addEventListener("astro:after-swap", () => {
		initCurrentPage();
	});

	document.addEventListener("astro:page-load", () => {
		initCurrentPage();
	});

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => initCurrentPage(), { once: true });
	} else {
		initCurrentPage();
	}
}
