/**
 * Данные демо-страницы `/colors`: снимок текущих токенов и пять расчётных
 * вариантов акцента на каждый пресет.
 *
 * ВНИМАНИЕ: это снимок, а не источник истины. Живые значения живут в
 * `src/styles/tailwind.css` и `src/styles/palettes/*.css`; здесь они лежат в
 * hex только чтобы страница могла показать светлую и тёмную колонки
 * одновременно, не переключая тему. Правишь CSS - перегенерируй этот файл,
 * иначе демо начнёт врать.
 *
 * Контрасты посчитаны по WCAG 2.1 против собственного фона пресета:
 * `background` (#F9F9F9 в светлой, #000000 в тёмной) и `surface`. Варианты
 * решены в OKLCH: тон пресета сохранён, светлота подобрана под порог, хрома
 * подрезана до границы sRGB.
 */

export interface TokenRow {
	token: string;
	light: string;
	dark: string;
	usage: string;
	derived: boolean;
}

export interface AccentSet {
	accent: string;
	accentForeground: string;
	accentVivid: string;
	accentGlow: string;
}

export interface AccentMetrics {
	onBackground: number;
	onSurface: number;
	foregroundOnAccent: number;
}

export interface AccentVariant {
	key: string;
	title: string;
	note: string;
	light: AccentSet & AccentMetrics;
	dark: AccentSet & AccentMetrics;
}

export interface PaletteLab {
	name: string;
	label: string;
	current: { light: AccentSet; dark: AccentSet };
	currentContrast: { light: AccentMetrics; dark: AccentMetrics };
	variants: AccentVariant[];
}

/** Порог, ниже которого акцент не годится в мелкий текст и иконки. */
export const AA_THRESHOLD = 4.5;

export const NEUTRAL_TOKENS: TokenRow[] = [
	{
		"token": "background",
		"light": "#F9F9F9",
		"dark": "#000000",
		"usage": "Плоскость страницы",
		"derived": false
	},
	{
		"token": "muted",
		"light": "#ECECEC",
		"dark": "#050505",
		"usage": "Утопленная полоса секции",
		"derived": false
	},
	{
		"token": "surface",
		"light": "#FFFFFF",
		"dark": "#0D0D0D",
		"usage": "Карточки, панели, поповеры",
		"derived": false
	},
	{
		"token": "surface-muted",
		"light": "#F1F1F1",
		"dark": "#161616",
		"usage": "surface 94.5% + ink",
		"derived": true
	},
	{
		"token": "subtle",
		"light": "#E3E3E3",
		"dark": "#242424",
		"usage": "Самая тихая заливка",
		"derived": false
	},
	{
		"token": "catalog",
		"light": "#F1F1F1",
		"dark": "#050505",
		"usage": "Полоса каталога: surface-muted / muted",
		"derived": true
	},
	{
		"token": "foreground",
		"light": "#1D1D1D",
		"dark": "#EDEDED",
		"usage": "Основные чернила",
		"derived": false
	},
	{
		"token": "muted-foreground",
		"light": "#595959",
		"dark": "#A1A1A1",
		"usage": "Второстепенный текст",
		"derived": false
	},
	{
		"token": "subtle-foreground",
		"light": "#656565",
		"dark": "#949494",
		"usage": "Самый тусклый текст",
		"derived": false
	},
	{
		"token": "primary",
		"light": "#1D1D1D",
		"dark": "#EDEDED",
		"usage": "Главные действия",
		"derived": false
	},
	{
		"token": "primary-foreground",
		"light": "#FFFFFF",
		"dark": "#000000",
		"usage": "Текст на primary",
		"derived": false
	},
	{
		"token": "border",
		"light": "#CCCCCC",
		"dark": "#323232",
		"usage": "surface 80% + ink",
		"derived": true
	},
	{
		"token": "border-muted",
		"light": "#DBDBDB",
		"dark": "#262626",
		"usage": "surface 86% + ink",
		"derived": true
	},
	{
		"token": "ring",
		"light": "#C7C7C7",
		"dark": "#666666",
		"usage": "Кольца и инсеты",
		"derived": false
	},
	{
		"token": "depth-100",
		"light": "#D6D6D6",
		"dark": "#2A2A2A",
		"usage": "Тихая линия: surface 84% + ink",
		"derived": true
	},
	{
		"token": "depth-200",
		"light": "#C2C2C2",
		"dark": "#303030",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-300",
		"light": "#9E9E9E",
		"dark": "#3B3B3B",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-400",
		"light": "#7A7A7A",
		"dark": "#4A4A4A",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-500",
		"light": "#5C5C5C",
		"dark": "#737373",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-600",
		"light": "#474747",
		"dark": "#A1A1A1",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-700",
		"light": "#333333",
		"dark": "#CCCCCC",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "link",
		"light": "#105FC6",
		"dark": "#85C2FF",
		"usage": "Ссылки в prose",
		"derived": false
	},
	{
		"token": "link-decoration",
		"light": "#3080E8",
		"dark": "#4C99E6",
		"usage": "Подчёркивание ссылок",
		"derived": false
	},
	{
		"token": "destructive",
		"light": "#C8481E",
		"dark": "#ED825E",
		"usage": "Сброс фильтров",
		"derived": false
	},
	{
		"token": "favorite",
		"light": "#CA2137",
		"dark": "#F0566B",
		"usage": "Сердце избранного",
		"derived": false
	},
	{
		"token": "shade",
		"light": "#000000",
		"dark": "#000000",
		"usage": "Тон тени",
		"derived": false
	},
	{
		"token": "lift",
		"light": "#FFFFFF",
		"dark": "#FFFFFF",
		"usage": "Тон верхней подсветки",
		"derived": false
	}
];

export const PALETTE_LAB: PaletteLab[] = [
	{
		"name": "default",
		"label": "Дефолт",
		"current": {
			"light": {
				"accent": "#1D1D1D",
				"accentForeground": "#FFFFFF",
				"accentVivid": "#1D1D1D",
				"accentGlow": "#909090"
			},
			"dark": {
				"accent": "#F2F2F2",
				"accentForeground": "#000000",
				"accentVivid": "#F2F2F2",
				"accentGlow": "#BDBDBD"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 16.01,
				"onSurface": 16.86,
				"foregroundOnAccent": 16.86
			},
			"dark": {
				"onBackground": 18.76,
				"onSurface": 17.36,
				"foregroundOnAccent": 18.76
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#2E2E2E",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#3B3B3B",
					"accentGlow": "#5E5E5E",
					"onBackground": 12.9,
					"onSurface": 13.58,
					"foregroundOnAccent": 13.58
				},
				"dark": {
					"accent": "#E8E8E8",
					"accentForeground": "#000000",
					"accentVivid": "#EFEFEF",
					"accentGlow": "#F8F8F8",
					"onBackground": 17.14,
					"onSurface": 15.86,
					"foregroundOnAccent": 17.14
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#1B1B1B",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#272727",
					"accentGlow": "#484848",
					"onBackground": 16.36,
					"onSurface": 17.22,
					"foregroundOnAccent": 17.22
				},
				"dark": {
					"accent": "#FCFCFC",
					"accentForeground": "#000000",
					"accentVivid": "#F5F5F5",
					"accentGlow": "#F8F8F8",
					"onBackground": 20.47,
					"onSurface": 18.94,
					"foregroundOnAccent": 20.47
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#424242",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#4F4F4F",
					"accentGlow": "#747474",
					"onBackground": 9.55,
					"onSurface": 10.05,
					"foregroundOnAccent": 10.05
				},
				"dark": {
					"accent": "#D1D1D1",
					"accentForeground": "#000000",
					"accentVivid": "#D7D7D7",
					"accentGlow": "#F8F8F8",
					"onBackground": 13.75,
					"onSurface": 12.73,
					"foregroundOnAccent": 13.75
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#292E34",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#353B42",
					"accentGlow": "#585E64",
					"onBackground": 13.0,
					"onSurface": 13.68,
					"foregroundOnAccent": 13.68
				},
				"dark": {
					"accent": "#E3E8EE",
					"accentForeground": "#000000",
					"accentVivid": "#E9EFF5",
					"accentGlow": "#F5F9FE",
					"onBackground": 17.04,
					"onSurface": 15.77,
					"foregroundOnAccent": 17.04
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#6C6C6C",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#7B7B7B",
					"accentGlow": "#A2A2A2",
					"onBackground": 4.99,
					"onSurface": 5.25,
					"foregroundOnAccent": 5.25
				},
				"dark": {
					"accent": "#BEBEBE",
					"accentForeground": "#000000",
					"accentVivid": "#C4C4C4",
					"accentGlow": "#E5E5E5",
					"onBackground": 11.3,
					"onSurface": 10.46,
					"foregroundOnAccent": 11.3
				}
			}
		]
	},
	{
		"name": "green",
		"label": "Җаным Яшел",
		"current": {
			"light": {
				"accent": "#1B8341",
				"accentForeground": "#FFFFFF",
				"accentVivid": "#16A249",
				"accentGlow": "#3BDE77"
			},
			"dark": {
				"accent": "#3ECC72",
				"accentForeground": "#000000",
				"accentVivid": "#39D070",
				"accentGlow": "#7DE8A4"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.56,
				"onSurface": 4.81,
				"foregroundOnAccent": 4.81
			},
			"dark": {
				"onBackground": 10.08,
				"onSurface": 9.33,
				"foregroundOnAccent": 10.08
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#1A8240",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#189448",
					"accentGlow": "#61B977",
					"onBackground": 4.63,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#20B960",
					"accentForeground": "#000000",
					"accentVivid": "#18C162",
					"accentGlow": "#6FDC8F",
					"onBackground": 8.17,
					"onSurface": 7.56,
					"foregroundOnAccent": 8.17
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#00823B",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#009344",
					"accentGlow": "#59B973",
					"onBackground": 4.69,
					"onSurface": 4.93,
					"foregroundOnAccent": 4.93
				},
				"dark": {
					"accent": "#00B85C",
					"accentForeground": "#000000",
					"accentVivid": "#00BF60",
					"accentGlow": "#68DB8B",
					"onBackground": 8.01,
					"onSurface": 7.41,
					"foregroundOnAccent": 8.01
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#4A7C55",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#538D60",
					"accentGlow": "#82B38B",
					"onBackground": 4.63,
					"onSurface": 4.88,
					"foregroundOnAccent": 4.88
				},
				"dark": {
					"accent": "#68B07B",
					"accentForeground": "#000000",
					"accentVivid": "#6BB77F",
					"accentGlow": "#97D4A5",
					"onBackground": 8.08,
					"onSurface": 7.48,
					"foregroundOnAccent": 8.08
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#008058",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#009164",
					"accentGlow": "#59B78E",
					"onBackground": 4.72,
					"onSurface": 4.97,
					"foregroundOnAccent": 4.97
				},
				"dark": {
					"accent": "#00B680",
					"accentForeground": "#000000",
					"accentVivid": "#00BD85",
					"accentGlow": "#68D9A9",
					"onBackground": 8.0,
					"onSurface": 7.41,
					"foregroundOnAccent": 8.0
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#18813F",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#169247",
					"accentGlow": "#60B876",
					"onBackground": 4.69,
					"onSurface": 4.94,
					"foregroundOnAccent": 4.94
				},
				"dark": {
					"accent": "#76D691",
					"accentForeground": "#000000",
					"accentVivid": "#78DE95",
					"accentGlow": "#AAFBBE",
					"onBackground": 11.8,
					"onSurface": 10.92,
					"foregroundOnAccent": 11.8
				}
			}
		]
	},
	{
		"name": "blue",
		"label": "Кадерле Зәнгәр",
		"current": {
			"light": {
				"accent": "#185ECD",
				"accentForeground": "#FFFFFF",
				"accentVivid": "#0D59D3",
				"accentGlow": "#4595F7"
			},
			"dark": {
				"accent": "#5AA0F6",
				"accentForeground": "#000000",
				"accentVivid": "#519BF6",
				"accentGlow": "#92C2FC"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 5.66,
				"onSurface": 5.96,
				"foregroundOnAccent": 5.96
			},
			"dark": {
				"onBackground": 7.79,
				"onSurface": 7.21,
				"foregroundOnAccent": 7.79
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#286DDD",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#2B7AFB",
					"accentGlow": "#75A9FF",
					"onBackground": 4.62,
					"onSurface": 4.86,
					"foregroundOnAccent": 4.86
				},
				"dark": {
					"accent": "#5DA3F9",
					"accentForeground": "#000000",
					"accentVivid": "#64A9FF",
					"accentGlow": "#A0CAFF",
					"onBackground": 8.07,
					"onSurface": 7.47,
					"foregroundOnAccent": 8.07
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#0068F7",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#2A7BFF",
					"accentGlow": "#78ABFF",
					"onBackground": 4.61,
					"onSurface": 4.86,
					"foregroundOnAccent": 4.86
				},
				"dark": {
					"accent": "#57A3FF",
					"accentForeground": "#000000",
					"accentVivid": "#64AAFF",
					"accentGlow": "#A0CAFF",
					"onBackground": 8.09,
					"onSurface": 7.49,
					"foregroundOnAccent": 8.09
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#4971B1",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#527FC9",
					"accentGlow": "#80A8E9",
					"onBackground": 4.66,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#7BA4D7",
					"accentForeground": "#000000",
					"accentVivid": "#7FAAE0",
					"accentGlow": "#A6CAF7",
					"onBackground": 8.13,
					"onSurface": 7.53,
					"foregroundOnAccent": 8.13
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#5266DF",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#5C72FD",
					"accentGlow": "#8EA5FF",
					"onBackground": 4.61,
					"onSurface": 4.86,
					"foregroundOnAccent": 4.86
				},
				"dark": {
					"accent": "#799EFD",
					"accentForeground": "#000000",
					"accentVivid": "#81A5FF",
					"accentGlow": "#B0C8FF",
					"onBackground": 8.12,
					"onSurface": 7.52,
					"foregroundOnAccent": 8.12
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#3A6AB9",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#4178D3",
					"accentGlow": "#71A2F1",
					"onBackground": 5.06,
					"onSurface": 5.33,
					"foregroundOnAccent": 5.33
				},
				"dark": {
					"accent": "#90C1FF",
					"accentForeground": "#000000",
					"accentVivid": "#9CC7FF",
					"accentGlow": "#D3E6FF",
					"onBackground": 11.26,
					"onSurface": 10.42,
					"foregroundOnAccent": 11.26
				}
			}
		]
	},
	{
		"name": "violet",
		"label": "Яна Шәмәха",
		"current": {
			"light": {
				"accent": "#6E33CC",
				"accentForeground": "#FFFFFF",
				"accentVivid": "#6920DF",
				"accentGlow": "#9D68F3"
			},
			"dark": {
				"accent": "#A97BF4",
				"accentForeground": "#000000",
				"accentVivid": "#A474F1",
				"accentGlow": "#C7A8FA"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 6.63,
				"onSurface": 6.98,
				"foregroundOnAccent": 6.98
			},
			"dark": {
				"onBackground": 6.83,
				"onSurface": 6.32,
				"foregroundOnAccent": 6.83
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#8550E9",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#945EFF",
					"accentGlow": "#B59CFF",
					"onBackground": 4.62,
					"onSurface": 4.86,
					"foregroundOnAccent": 4.86
				},
				"dark": {
					"accent": "#B68CFF",
					"accentForeground": "#000000",
					"accentVivid": "#BB95FF",
					"accentGlow": "#D4C0FF",
					"onBackground": 8.18,
					"onSurface": 7.57,
					"foregroundOnAccent": 8.18
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#8A40FF",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#9560FF",
					"accentGlow": "#B69EFF",
					"onBackground": 4.68,
					"onSurface": 4.93,
					"foregroundOnAccent": 4.93
				},
				"dark": {
					"accent": "#B68CFF",
					"accentForeground": "#000000",
					"accentVivid": "#BB95FF",
					"accentGlow": "#D4C0FF",
					"onBackground": 8.18,
					"onSurface": 7.57,
					"foregroundOnAccent": 8.18
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#7A63B9",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#8A6FD1",
					"accentGlow": "#B09BF2",
					"onBackground": 4.62,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#AD95DD",
					"accentForeground": "#000000",
					"accentVivid": "#B49AE6",
					"accentGlow": "#D2BDFD",
					"onBackground": 8.12,
					"onSurface": 7.52,
					"foregroundOnAccent": 8.12
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#9A47DB",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#AE4DF8",
					"accentGlow": "#C992FF",
					"onBackground": 4.64,
					"onSurface": 4.89,
					"foregroundOnAccent": 4.89
				},
				"dark": {
					"accent": "#CA82F6",
					"accentForeground": "#000000",
					"accentVivid": "#D187FF",
					"accentGlow": "#E3B9FF",
					"onBackground": 8.04,
					"onSurface": 7.44,
					"foregroundOnAccent": 8.04
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#7259B1",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#8265CA",
					"accentGlow": "#A791E9",
					"onBackground": 5.28,
					"onSurface": 5.56,
					"foregroundOnAccent": 5.56
				},
				"dark": {
					"accent": "#C8ADFF",
					"accentForeground": "#000000",
					"accentVivid": "#CDB6FF",
					"accentGlow": "#E8DFFF",
					"onBackground": 10.88,
					"onSurface": 10.07,
					"foregroundOnAccent": 10.88
				}
			}
		]
	},
	{
		"name": "red",
		"label": "Утлы Кызыл",
		"current": {
			"light": {
				"accent": "#DC2727",
				"accentForeground": "#FFFFFF",
				"accentVivid": "#E93737",
				"accentGlow": "#F47B7B"
			},
			"dark": {
				"accent": "#EE6A6A",
				"accentForeground": "#000000",
				"accentVivid": "#F26363",
				"accentGlow": "#FA9E9E"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.57,
				"onSurface": 4.81,
				"foregroundOnAccent": 4.81
			},
			"dark": {
				"onBackground": 6.91,
				"onSurface": 6.39,
				"foregroundOnAccent": 6.91
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#DA2526",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#F62227",
					"accentGlow": "#FF867A",
					"onBackground": 4.67,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#FC7776",
					"accentForeground": "#000000",
					"accentVivid": "#FF817F",
					"accentGlow": "#FFB7B3",
					"onBackground": 8.04,
					"onSurface": 7.44,
					"foregroundOnAccent": 8.04
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#E40017",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#FE001B",
					"accentGlow": "#FF897D",
					"onBackground": 4.63,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#FF7574",
					"accentForeground": "#000000",
					"accentVivid": "#FF827F",
					"accentGlow": "#FFB7B3",
					"onBackground": 8.05,
					"onSurface": 7.45,
					"foregroundOnAccent": 8.05
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#B5544B",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#CD5D53",
					"accentGlow": "#EF8D82",
					"onBackground": 4.6,
					"onSurface": 4.84,
					"foregroundOnAccent": 4.84
				},
				"dark": {
					"accent": "#DB8B87",
					"accentForeground": "#000000",
					"accentVivid": "#E4908C",
					"accentGlow": "#FCB5B0",
					"onBackground": 8.05,
					"onSurface": 7.45,
					"foregroundOnAccent": 8.05
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#CA4300",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#E24C00",
					"accentGlow": "#FF875E",
					"onBackground": 4.62,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#FA7A5C",
					"accentForeground": "#000000",
					"accentVivid": "#FF8265",
					"accentGlow": "#FFB7A5",
					"onBackground": 8.0,
					"onSurface": 7.41,
					"foregroundOnAccent": 8.0
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#AC473E",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#C45046",
					"accentGlow": "#E68075",
					"onBackground": 5.35,
					"onSurface": 5.64,
					"foregroundOnAccent": 5.64
				},
				"dark": {
					"accent": "#FFA09C",
					"accentForeground": "#000000",
					"accentVivid": "#FFAAA6",
					"accentGlow": "#FFDBD8",
					"onBackground": 10.76,
					"onSurface": 9.96,
					"foregroundOnAccent": 10.76
				}
			}
		]
	},
	{
		"name": "orange",
		"label": "Җылы Наранҗы",
		"current": {
			"light": {
				"accent": "#BA540C",
				"accentForeground": "#FFFFFF",
				"accentVivid": "#D95D04",
				"accentGlow": "#F7993B"
			},
			"dark": {
				"accent": "#F38314",
				"accentForeground": "#000000",
				"accentVivid": "#F98510",
				"accentGlow": "#FBB656"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.57,
				"onSurface": 4.82,
				"foregroundOnAccent": 4.82
			},
			"dark": {
				"onBackground": 8.07,
				"onSurface": 7.47,
				"foregroundOnAccent": 8.07
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#B85208",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#D05C00",
					"accentGlow": "#F38C55",
					"onBackground": 4.69,
					"onSurface": 4.94,
					"foregroundOnAccent": 4.94
				},
				"dark": {
					"accent": "#F38315",
					"accentForeground": "#000000",
					"accentVivid": "#FD8707",
					"accentGlow": "#FFB988",
					"onBackground": 8.07,
					"onSurface": 7.47,
					"foregroundOnAccent": 8.07
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#BB5200",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#D25D00",
					"accentGlow": "#F68C54",
					"onBackground": 4.62,
					"onSurface": 4.86,
					"foregroundOnAccent": 4.86
				},
				"dark": {
					"accent": "#F58200",
					"accentForeground": "#000000",
					"accentVivid": "#FE8700",
					"accentGlow": "#FFBA88",
					"onBackground": 8.08,
					"onSurface": 7.47,
					"foregroundOnAccent": 8.08
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#9E6243",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#B36E4A",
					"accentGlow": "#D6997A",
					"onBackground": 4.66,
					"onSurface": 4.9,
					"foregroundOnAccent": 4.9
				},
				"dark": {
					"accent": "#D49161",
					"accentForeground": "#000000",
					"accentVivid": "#DD9663",
					"accentGlow": "#F5BA91",
					"onBackground": 8.02,
					"onSurface": 7.42,
					"foregroundOnAccent": 8.02
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#AB5E00",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#C06A00",
					"accentGlow": "#E49654",
					"onBackground": 4.6,
					"onSurface": 4.85,
					"foregroundOnAccent": 4.85
				},
				"dark": {
					"accent": "#E38E00",
					"accentForeground": "#000000",
					"accentVivid": "#EB9300",
					"accentGlow": "#FFBA6C",
					"onBackground": 8.14,
					"onSurface": 7.53,
					"foregroundOnAccent": 8.14
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#A84E14",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#BF5812",
					"accentGlow": "#E28757",
					"onBackground": 5.3,
					"onSurface": 5.58,
					"foregroundOnAccent": 5.58
				},
				"dark": {
					"accent": "#FFA663",
					"accentForeground": "#000000",
					"accentVivid": "#FFB076",
					"accentGlow": "#FFDDC6",
					"onBackground": 10.89,
					"onSurface": 10.08,
					"foregroundOnAccent": 10.89
				}
			}
		]
	},
	{
		"name": "pink",
		"label": "Иркә Алсу",
		"current": {
			"light": {
				"accent": "#D7236E",
				"accentForeground": "#FFFFFF",
				"accentVivid": "#E82E7C",
				"accentGlow": "#F679AD"
			},
			"dark": {
				"accent": "#F366A0",
				"accentForeground": "#000000",
				"accentVivid": "#F5619F",
				"accentGlow": "#FB9DC4"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.58,
				"onSurface": 4.82,
				"foregroundOnAccent": 4.82
			},
			"dark": {
				"onBackground": 7.22,
				"onSurface": 6.68,
				"foregroundOnAccent": 7.22
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#D6226D",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#F21E7A",
					"accentGlow": "#FF82A6",
					"onBackground": 4.63,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#FD6FA9",
					"accentForeground": "#000000",
					"accentVivid": "#FF7BAF",
					"accentGlow": "#FFB5CE",
					"onBackground": 8.02,
					"onSurface": 7.43,
					"foregroundOnAccent": 8.02
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#DC006C",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#F60079",
					"accentGlow": "#FF82A6",
					"onBackground": 4.68,
					"onSurface": 4.93,
					"foregroundOnAccent": 4.93
				},
				"dark": {
					"accent": "#FF6EA9",
					"accentForeground": "#000000",
					"accentVivid": "#FF7CAF",
					"accentGlow": "#FFB6CE",
					"onBackground": 8.06,
					"onSurface": 7.46,
					"foregroundOnAccent": 8.06
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#B2516F",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#C95A7D",
					"accentGlow": "#EC8AA5",
					"onBackground": 4.64,
					"onSurface": 4.88,
					"foregroundOnAccent": 4.88
				},
				"dark": {
					"accent": "#DC88A6",
					"accentForeground": "#000000",
					"accentVivid": "#E58CAC",
					"accentGlow": "#FDB3CC",
					"onBackground": 8.12,
					"onSurface": 7.51,
					"foregroundOnAccent": 8.12
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#DB204F",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#F71A58",
					"accentGlow": "#FF8692",
					"onBackground": 4.6,
					"onSurface": 4.85,
					"foregroundOnAccent": 4.85
				},
				"dark": {
					"accent": "#FF7391",
					"accentForeground": "#000000",
					"accentVivid": "#FF8099",
					"accentGlow": "#FFB8C2",
					"onBackground": 8.11,
					"onSurface": 7.51,
					"foregroundOnAccent": 8.11
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#A84464",
					"accentForeground": "#FFFFFF",
					"accentVivid": "#BF4C71",
					"accentGlow": "#E27D99",
					"onBackground": 5.43,
					"onSurface": 5.71,
					"foregroundOnAccent": 5.71
				},
				"dark": {
					"accent": "#FF9ABF",
					"accentForeground": "#000000",
					"accentVivid": "#FFA5C5",
					"accentGlow": "#FFD9E5",
					"onBackground": 10.63,
					"onSurface": 9.83,
					"foregroundOnAccent": 10.63
				}
			}
		]
	}
];
