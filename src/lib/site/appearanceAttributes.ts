/**
 * Контракт переключателей оформления — единственное объявление.
 *
 * Тема и палитра устроены одинаково: группа `radiogroup`, кнопки с
 * значениями, выбранное лежит в localStorage и на `<html>`. Раньше у каждой
 * был свой атрибут (`data-theme-option`, `data-accent-option`), из-за чего
 * `lib/scripts/appearance.ts` разбирал нажатие цепочкой тернарников и дважды
 * повторял «прочитать / применить / записать».
 *
 * Теперь группа и значение — два общих атрибута, а сами группы описаны
 * таблицей. Добавить третий переключатель значит добавить строку.
 */

export const APPEARANCE_GROUP_ATTR = "data-appearance-option";
export const APPEARANCE_VALUE_ATTR = "data-appearance-value";

export const APPEARANCE_GROUPS = ["theme", "accent"] as const;

export type AppearanceGroup = (typeof APPEARANCE_GROUPS)[number];

export const isAppearanceGroup = (value: string | null): value is AppearanceGroup =>
	(APPEARANCE_GROUPS as readonly string[]).includes(value ?? "");

/** Атрибуты одной кнопки-варианта. */
export const appearanceOption = (group: AppearanceGroup, value: string) => ({
	[APPEARANCE_GROUP_ATTR]: group,
	[APPEARANCE_VALUE_ATTR]: value,
});

export const appearanceOptionSelector = (group: AppearanceGroup) =>
	`[${APPEARANCE_GROUP_ATTR}="${group}"]`;
