import {
	APPEARANCE_GROUPS,
	APPEARANCE_GROUP_ATTR,
	APPEARANCE_VALUE_ATTR,
	appearanceOptionSelector,
	isAppearanceGroup,
	type AppearanceGroup,
} from "@/lib/site/appearanceAttributes";
import { APPEARANCE_SPECS } from "@/lib/site/appearance";

/**
 * Тема и палитра: чтение, применение и сохранение.
 *
 * Обе настройки устроены одинаково, поэтому и обрабатываются одинаково —
 * таблицей `APPEARANCE_SPECS`, а не двумя парами read/apply и цепочкой
 * тернарников при разборе нажатия.
 */

const root = document.documentElement;
const darkMedia = matchMedia("(prefers-color-scheme: dark)");

let initialized = false;

const readStorage = (key: string) => {
	try {
		return localStorage.getItem(key) ?? "";
	} catch {
		// Приватный режим и заблокированные куки: оформление просто не запомнится.
		return "";
	}
};

const writeStorage = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value);
	} catch {}
};

function readValue(group: AppearanceGroup): string {
	const spec = APPEARANCE_SPECS[group];
	const stored = readStorage(spec.storageKey);

	return spec.options.some((option) => option.value === stored) ? stored : spec.fallback;
}

/**
 * `<meta name="theme-color">` подхватывает фон текущей палитры: иначе на
 * мобильных строка браузера остаётся от прежней темы.
 */
function syncThemeColor() {
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
}

function syncButtons(group: AppearanceGroup, value: string) {
	for (const button of document.querySelectorAll<HTMLElement>(
		appearanceOptionSelector(group),
	)) {
		const isActive = button.getAttribute(APPEARANCE_VALUE_ATTR) === value;
		button.setAttribute("aria-checked", String(isActive));
		// Roving tabindex: в radiogroup с клавиатуры доступен только выбранный.
		button.tabIndex = isActive ? 0 : -1;
	}
}

function apply(group: AppearanceGroup, value: string) {
	root.dataset[group] = value;

	if (group === "theme") {
		root.classList.toggle("dark", value === "dark" || (value === "system" && darkMedia.matches));
	}

	syncButtons(group, value);
	syncThemeColor();
}

function set(group: AppearanceGroup, value: string) {
	writeStorage(APPEARANCE_SPECS[group].storageKey, value);
	apply(group, value);
}

function closeMenus(except?: Element) {
	for (const menu of document.querySelectorAll<HTMLElement>("[data-appearance-menu]")) {
		if (menu === except) continue;

		const trigger = menu.querySelector<HTMLElement>("[data-appearance-trigger]");
		const panel = menu.querySelector<HTMLElement>("[data-appearance-panel]");
		if (!trigger || !panel) continue;

		panel.hidden = true;
		trigger.setAttribute("aria-expanded", "false");
	}
}

const groupOf = (element: Element | null): AppearanceGroup | null => {
	const value = element?.getAttribute(APPEARANCE_GROUP_ATTR) ?? null;
	return isAppearanceGroup(value) ? value : null;
};

export function initAppearance() {
	if (initialized) return;
	initialized = true;

	for (const group of APPEARANCE_GROUPS) apply(group, readValue(group));

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const option = target.closest<HTMLElement>(`[${APPEARANCE_GROUP_ATTR}]`);
		const group = groupOf(option);
		if (option && group) {
			set(group, option.getAttribute(APPEARANCE_VALUE_ATTR) ?? APPEARANCE_SPECS[group].fallback);
			return;
		}

		const trigger = target.closest<HTMLElement>("[data-appearance-trigger]");
		if (trigger) {
			const menu = trigger.closest<HTMLElement>("[data-appearance-menu]");
			const panel = menu?.querySelector<HTMLElement>("[data-appearance-panel]");
			if (!panel) return;

			const willOpen = panel.hidden;
			closeMenus(menu ?? undefined);
			panel.hidden = !willOpen;
			trigger.setAttribute("aria-expanded", String(willOpen));
			return;
		}

		if (!target.closest("[data-appearance-menu]")) closeMenus();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			const open = document.querySelector<HTMLElement>(
				"[data-appearance-trigger][aria-expanded='true']",
			);
			if (open) {
				closeMenus();
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

		const group = groupOf(target);
		const radiogroup = target.closest<HTMLElement>("[role='radiogroup']");
		if (!group || !radiogroup) return;

		const buttons = [...radiogroup.querySelectorAll<HTMLElement>(`[${APPEARANCE_VALUE_ATTR}]`)];
		const next = buttons[(buttons.indexOf(target) + step + buttons.length) % buttons.length];
		if (!next) return;

		event.preventDefault();
		set(group, next.getAttribute(APPEARANCE_VALUE_ATTR) ?? "");
		next.focus();
	});

	darkMedia.addEventListener("change", () => {
		if (readValue("theme") === "system") apply("theme", "system");
	});

	// Настройку могли поменять в соседней вкладке.
	window.addEventListener("storage", (event) => {
		for (const group of APPEARANCE_GROUPS) {
			if (event.key === null || event.key === APPEARANCE_SPECS[group].storageKey) {
				apply(group, readValue(group));
			}
		}
	});
}
