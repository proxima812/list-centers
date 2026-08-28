import type { AppearanceGroup } from "@/lib/site/appearanceAttributes";
import { ACCENT_PRESETS, DEFAULT_ACCENT } from "@/lib/site/accents";

/**
 * Что посетитель может переключить в оформлении.
 *
 * Один список на все поверхности: компактные пилюли в мобильном меню,
 * выпадающее меню в шапке и клиентский скрипт. Раньше темы перечислялись
 * дважды (ThemeToggle и AppearanceMenu) с разными ключами перевода и
 * разъезжались бы при добавлении четвёртой.
 */

export interface AppearanceOption {
	value: string;
	/** Ключ перевода для полной подписи (мобильное меню, aria-label). */
	labelKey: string;
	/** Короткий ключ для выпадающего меню, где места меньше. */
	shortLabelKey: string;
	/** Запасная подпись, если ключа в словаре нет. */
	label: string;
	icon?: string;
	/** Заливка кружка палитры: только у акцентов. */
	swatch?: { from: string; to: string };
}

export interface AppearanceGroupSpec {
	group: AppearanceGroup;
	/** Ключ в localStorage и `data-`-атрибут на `<html>`. */
	storageKey: AppearanceGroup;
	switcherLabelKey: string;
	fallback: string;
	options: AppearanceOption[];
}

const THEME_OPTIONS: AppearanceOption[] = [
	{
		value: "system",
		labelKey: "theme.system",
		shortLabelKey: "theme.system.short",
		label: "System theme",
		icon: "tabler:app-window",
	},
	{
		value: "light",
		labelKey: "theme.light",
		shortLabelKey: "theme.light.short",
		label: "Light theme",
		icon: "tabler:sun-high",
	},
	{
		value: "dark",
		labelKey: "theme.dark",
		shortLabelKey: "theme.dark.short",
		label: "Dark theme",
		icon: "tabler:moon",
	},
];

const ACCENT_OPTIONS: AppearanceOption[] = ACCENT_PRESETS.map((preset) => ({
	value: preset.value,
	labelKey: preset.labelKey,
	shortLabelKey: preset.labelKey,
	label: preset.label,
	swatch: { from: preset.from, to: preset.to },
}));

/**
 * Порядок важен: тёмная тема — значение по умолчанию, его же ставит
 * блокирующий скрипт в `Layout.astro` до первой отрисовки.
 */
export const APPEARANCE_SPECS: Record<AppearanceGroup, AppearanceGroupSpec> = {
	theme: {
		group: "theme",
		storageKey: "theme",
		switcherLabelKey: "theme.switcher",
		fallback: "dark",
		options: THEME_OPTIONS,
	},
	accent: {
		group: "accent",
		storageKey: "accent",
		switcherLabelKey: "accent.switcher",
		fallback: DEFAULT_ACCENT,
		options: ACCENT_OPTIONS,
	},
};
