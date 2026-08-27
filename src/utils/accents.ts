
export interface AccentPreset {
	value: string;
	labelKey: string;
	label: string;
	from: string;
	to: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
	{ value: "default", labelKey: "accent.default", label: "Дефолт", from: "#29262C", to: "#4A474D" },
	{ value: "green", labelKey: "accent.green", label: "Җаным Яшел", from: "#009143", to: "#58B772" },
	{ value: "blue", labelKey: "accent.blue", label: "Кадерле Зәнгәр", from: "#596FFA", to: "#8AA1FF" },
	{ value: "violet", labelKey: "accent.violet", label: "Яна Шәмәха", from: "#6920DF", to: "#9D68F3" },
	{ value: "red", labelKey: "accent.red", label: "Утлы Кызыл", from: "#F7001A", to: "#FF8175" },
	{ value: "pink", labelKey: "accent.pink", label: "Иркә Алсу", from: "#F20077", to: "#FF7DA4" },
];

export const ACCENT_VALUES = ACCENT_PRESETS.map((preset) => preset.value);

export const DEFAULT_ACCENT = "default";
