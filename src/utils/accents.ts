// Единственный список пресетов акцента. Раньше он жил копией в AccentToggle
// и AppearanceMenu, и добавление пресета требовало правки в двух местах —
// с шестью палитрами это гарантированный рассинхрон.
//
// Образцы — превью выбора, а не раскраска интерфейса, поэтому здесь литералы:
// кнопка «синей» палитры должна быть синей и в зелёной теме. Пары `from`/`to`
// совпадают с --color-accent-vivid / --color-accent-glow в tailwind.css
// (светлые значения) и должны обновляться вместе с ними.

export interface AccentPreset {
	value: string;
	labelKey: string;
	/** Запасная подпись, если ключ локали ещё не заведён. */
	label: string;
	from: string;
	to: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
	{ value: "green", labelKey: "accent.green", label: "Җаным Яшел", from: "hsl(142 76% 36%)", to: "hsl(142 71% 55%)" },
	{ value: "blue", labelKey: "accent.blue", label: "Кадерле Зәнгәр", from: "hsl(217 88% 44%)", to: "hsl(213 92% 62%)" },
	{ value: "violet", labelKey: "accent.violet", label: "Яна Шәмәха", from: "hsl(263 75% 50%)", to: "hsl(263 85% 68%)" },
	{ value: "red", labelKey: "accent.red", label: "Утлы Кызыл", from: "hsl(0 80% 56.5%)", to: "hsl(0 85% 72%)" },
	{ value: "orange", labelKey: "accent.orange", label: "Җылы Наранҗы", from: "hsl(25 96% 43.5%)", to: "hsl(30 92% 60%)" },
	{ value: "pink", labelKey: "accent.pink", label: "Иркә Алсу", from: "hsl(335 80% 54.5%)", to: "hsl(335 88% 72%)" },
];

export const ACCENT_VALUES = ACCENT_PRESETS.map((preset) => preset.value);

export const DEFAULT_ACCENT = "green";
