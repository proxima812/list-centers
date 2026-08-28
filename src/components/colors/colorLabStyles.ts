/**
 * Классы демо-страницы `/colors`. Единственное место проекта, где цвет —
 * это контент, а не оформление, поэтому и классы у него свои.
 */
export const SWATCH_CLASS = "h-12 w-full rounded-micro corner-squircle ring-1 ring-inset ring-shade/10";

export const CELL_CLASS = "font-mono text-[11px] tabular-nums text-muted-foreground";

/** Подпись светлой и тёмной колонки: тема показана сразу обеими. */
export const THEME_LABELS = { light: "Светлая", dark: "Тёмная" } as const;

export const THEMES = ["light", "dark"] as const;

export type ThemeKey = (typeof THEMES)[number];
