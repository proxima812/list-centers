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

// В Safari с «Блокировать все куки» само обращение к localStorage бросает
// SecurityError, а в старом приватном режиме iOS setItem — QuotaExceededError.
// Переключатели обязаны работать хотя бы в пределах вкладки и без хранилища.
const readStorage = (key: string) => {
	try {
		return localStorage.getItem(key) ?? "";
	} catch {
		return "";
	}
};

const writeStorage = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Хранилище недоступно — выбор живёт до конца вкладки.
	}
};

const readTheme = () => {
	const value = readStorage(THEME_KEY);
	return THEMES.includes(value) ? value : "system";
};

const readAccent = () => {
	const value = readStorage(ACCENT_KEY);
	return ACCENTS.includes(value) ? value : DEFAULT_ACCENT;
};

const readMotion = () => {
	const value = readStorage(MOTION_KEY);
	return MOTIONS.includes(value) ? value : "on";
};

const syncGroup = (attr: string, value: string) => {
	for (const button of document.querySelectorAll<HTMLElement>(`[${attr}]`)) {
		const isActive = button.getAttribute(attr) === value;
		button.setAttribute("aria-checked", String(isActive));
		button.tabIndex = isActive ? 0 : -1;
	}
};

// Цвет адресной строки берётся из вычисленного --color-background, а не из
// таблицы в JS. Иначе он был бы третьей копией палитры и разъезжался бы с CSS:
// раньше здесь стоял фиксированный #141414, который совпадал только с green, а
// у blue и violet страница чёрная — полоса браузера была светлее страницы на
// 19 единиц перцептивной светлоты. Фон зависит и от темы, и от акцента, поэтому
// звать нужно из обоих applyTheme/applyAccent.
const syncThemeColor = () => {
	const background = getComputedStyle(root).getPropertyValue("--color-background").trim();
	if (!background) return;

	// Тег должен остаться ровно один: PWA-плагин вставляет свой, статический.
	const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
	for (let i = 1; i < metas.length; i += 1) metas[i].remove();

	let meta = metas[0];
	if (!meta) {
		meta = document.createElement("meta");
		meta.name = "theme-color";
		document.head.append(meta);
	}
	meta.content = background;
};

const applyTheme = (theme: string) => {
	root.dataset.theme = theme;
	root.classList.toggle("dark", theme === "dark" || (theme === "system" && media.matches));
	syncGroup("data-theme-option", theme);
	syncThemeColor();
};

const applyAccent = (accent: string) => {
	root.dataset.accent = accent;
	syncGroup("data-accent-option", accent);
	syncThemeColor();
};

// Флаг живёт на <html>, а не на классе конкретных блоков: по нему гасятся все
// CSS-анимации разом (правило в tailwind.css), а острова вроде LiquidMetalMark
// читают его через MutationObserver и размонтируют WebGL.
const applyMotion = (motion: string) => {
	root.dataset.motion = motion;
	syncGroup("data-motion-option", motion);
};

const setMotion = (motion: string) => {
	writeStorage(MOTION_KEY, motion);
	applyMotion(motion);
};

const setTheme = (theme: string) => {
	writeStorage(THEME_KEY, theme);
	applyTheme(theme);
};

const setAccent = (accent: string) => {
	writeStorage(ACCENT_KEY, accent);
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

	// Тему могли поменять в соседней вкладке. key === null — это
	// localStorage.clear() оттуда же: пересинхронизируем всё.
	window.addEventListener("storage", (event) => {
		if (event.key === null || event.key === THEME_KEY) applyTheme(readTheme());
		if (event.key === null || event.key === ACCENT_KEY) applyAccent(readAccent());
		if (event.key === null || event.key === MOTION_KEY) applyMotion(readMotion());
	});
}
