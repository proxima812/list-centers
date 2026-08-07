/**
 * Тема и акцент. Первичное применение делает инлайн-скрипт в <head>
 * (Layout.astro) — до первой отрисовки, иначе вспышка светлой темы. Здесь
 * только реакция на пользователя.
 *
 * Модуль общий для всех переключателей: и dropdown в шапке, и инлайновые
 * группы в мобильном меню. Слушатели навешаны на document, поэтому
 * количество экземпляров на странице не имеет значения.
 */

import { ACCENT_VALUES, DEFAULT_ACCENT } from "@/utils/accents";

const THEME_KEY = "theme";
const ACCENT_KEY = "accent";
const MOTION_KEY = "motion";
const THEMES = ["system", "light", "dark"];
const ACCENTS = ACCENT_VALUES;
const MOTIONS = ["on", "off"];

const root = document.documentElement;
const media = matchMedia("(prefers-color-scheme: dark)");

let initialized = false;

const readTheme = () => {
	const value = localStorage.getItem(THEME_KEY) ?? "";
	return THEMES.includes(value) ? value : "system";
};

const readAccent = () => {
	const value = localStorage.getItem(ACCENT_KEY) ?? "";
	return ACCENTS.includes(value) ? value : DEFAULT_ACCENT;
};

const readMotion = () => {
	const value = localStorage.getItem(MOTION_KEY) ?? "";
	return MOTIONS.includes(value) ? value : "on";
};

const syncGroup = (attr: string, value: string) => {
	for (const button of document.querySelectorAll<HTMLElement>(`[${attr}]`)) {
		const isActive = button.getAttribute(attr) === value;
		button.setAttribute("aria-checked", String(isActive));
		button.tabIndex = isActive ? 0 : -1;
	}
};

const applyTheme = (theme: string) => {
	root.dataset.theme = theme;
	root.classList.toggle("dark", theme === "dark" || (theme === "system" && media.matches));
	syncGroup("data-theme-option", theme);
};

const applyAccent = (accent: string) => {
	root.dataset.accent = accent;
	syncGroup("data-accent-option", accent);
};

// Флаг живёт на <html>, а не на классе конкретных блоков: по нему гасятся все
// CSS-анимации разом (правило в tailwind.css), а острова вроде LiquidMetalMark
// читают его через MutationObserver и размонтируют WebGL.
const applyMotion = (motion: string) => {
	root.dataset.motion = motion;
	syncGroup("data-motion-option", motion);
};

const setMotion = (motion: string) => {
	localStorage.setItem(MOTION_KEY, motion);
	applyMotion(motion);
};

const setTheme = (theme: string) => {
	localStorage.setItem(THEME_KEY, theme);
	applyTheme(theme);
};

const setAccent = (accent: string) => {
	localStorage.setItem(ACCENT_KEY, accent);
	applyAccent(accent);
};

const closeAllMenus = (except?: Element) => {
	for (const menu of document.querySelectorAll<HTMLElement>("[data-appearance-menu]")) {
		if (menu === except) continue;

		const trigger = menu.querySelector<HTMLElement>("[data-appearance-trigger]");
		const panel = menu.querySelector<HTMLElement>("[data-appearance-panel]");
		if (!trigger || !panel) continue;

		panel.hidden = true;
		trigger.setAttribute("aria-expanded", "false");
	}
};

export function initAppearance() {
	if (initialized) return;
	initialized = true;

	applyTheme(readTheme());
	applyAccent(readAccent());
	applyMotion(readMotion());

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const themeOption = target.closest<HTMLElement>("[data-theme-option]");
		if (themeOption) {
			setTheme(themeOption.dataset.themeOption ?? "system");
			return;
		}

		const accentOption = target.closest<HTMLElement>("[data-accent-option]");
		if (accentOption) {
			setAccent(accentOption.dataset.accentOption ?? DEFAULT_ACCENT);
			return;
		}

		const motionOption = target.closest<HTMLElement>("[data-motion-option]");
		if (motionOption) {
			setMotion(motionOption.dataset.motionOption ?? "on");
			return;
		}

		const trigger = target.closest<HTMLElement>("[data-appearance-trigger]");
		if (trigger) {
			const menu = trigger.closest<HTMLElement>("[data-appearance-menu]");
			const panel = menu?.querySelector<HTMLElement>("[data-appearance-panel]");
			if (!panel) return;

			const willOpen = panel.hidden;
			closeAllMenus(menu ?? undefined);
			panel.hidden = !willOpen;
			trigger.setAttribute("aria-expanded", String(willOpen));
			return;
		}

		// Клик мимо любого меню — закрываем всё открытое.
		if (!target.closest("[data-appearance-menu]")) closeAllMenus();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			const open = document.querySelector<HTMLElement>(
				"[data-appearance-trigger][aria-expanded='true']",
			);
			if (open) {
				closeAllMenus();
				open.focus();
			}
			return;
		}

		const step =
			event.key === "ArrowRight" || event.key === "ArrowDown"
				? 1
				: event.key === "ArrowLeft" || event.key === "ArrowUp"
					? -1
					: 0;

		if (step === 0) return;

		const target = event.target;
		if (!(target instanceof HTMLElement)) return;

		// Стрелки переключают внутри одной radiogroup — ожидаемая
		// клавиатурная семантика: Tab входит в группу, стрелки ходят по ней.
		const group = target.closest<HTMLElement>("[role='radiogroup']");
		const attr = target.dataset.themeOption
			? "data-theme-option"
			: target.dataset.accentOption
				? "data-accent-option"
				: target.dataset.motionOption
					? "data-motion-option"
					: null;

		if (!group || !attr) return;

		const buttons = [...group.querySelectorAll<HTMLElement>(`[${attr}]`)];
		const next = buttons[(buttons.indexOf(target) + step + buttons.length) % buttons.length];
		if (!next) return;

		event.preventDefault();
		const value = next.getAttribute(attr) ?? "";
		if (attr === "data-theme-option") setTheme(value);
		else if (attr === "data-accent-option") setAccent(value);
		else setMotion(value);
		next.focus();
	});

	// В режиме «системная» тема должна следовать за ОС на лету.
	media.addEventListener("change", () => {
		if (readTheme() === "system") applyTheme("system");
	});

	// Тему могли поменять в соседней вкладке.
	window.addEventListener("storage", (event) => {
		if (event.key === THEME_KEY) applyTheme(readTheme());
		if (event.key === ACCENT_KEY) applyAccent(readAccent());
		if (event.key === MOTION_KEY) applyMotion(readMotion());
	});
}
