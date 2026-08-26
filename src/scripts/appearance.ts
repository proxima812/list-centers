
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
	}
};

const readTheme = () => {
	const value = readStorage(THEME_KEY);
	return THEMES.includes(value) ? value : "dark";
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

const syncThemeColor = () => {
	const background = getComputedStyle(root).getPropertyValue("--color-background").trim();
	if (!background) return;

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
			setTheme(themeOption.dataset.themeOption ?? "dark");
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

	media.addEventListener("change", () => {
		if (readTheme() === "system") applyTheme("system");
	});

	window.addEventListener("storage", (event) => {
		if (event.key === null || event.key === THEME_KEY) applyTheme(readTheme());
		if (event.key === null || event.key === ACCENT_KEY) applyAccent(readAccent());
		if (event.key === null || event.key === MOTION_KEY) applyMotion(readMotion());
	});
}
