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
 * `background` (#F6F3F9 в светлой, #090211 в тёмной) и `surface`. Варианты
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
		"light": "#F6F3F9",
		"dark": "#090211",
		"usage": "Плоскость страницы",
		"derived": false
	},
	{
		"token": "muted",
		"light": "#E9E5EE",
		"dark": "#150C1C",
		"usage": "Утопленная полоса секции",
		"derived": false
	},
	{
		"token": "surface",
		"light": "#FBF9FD",
		"dark": "#201727",
		"usage": "Карточки, панели, поповеры",
		"derived": false
	},
	{
		"token": "surface-muted",
		"light": "#EDEBEF",
		"dark": "#292130",
		"usage": "Выведен: surface 94.5% + чернила",
		"derived": true
	},
	{
		"token": "subtle",
		"light": "#E1DCE6",
		"dark": "#2F2936",
		"usage": "Самая тихая заливка",
		"derived": false
	},
	{
		"token": "catalog",
		"light": "#EDEBEF",
		"dark": "#150C1C",
		"usage": "Полоса каталога: surface-muted / muted",
		"derived": true
	},
	{
		"token": "foreground",
		"light": "#1F1C21",
		"dark": "#EFECF2",
		"usage": "Основные чернила",
		"derived": false
	},
	{
		"token": "muted-foreground",
		"light": "#534F56",
		"dark": "#AAA7AD",
		"usage": "Второстепенный текст",
		"derived": false
	},
	{
		"token": "subtle-foreground",
		"light": "#646067",
		"dark": "#959298",
		"usage": "Самый тусклый текст",
		"derived": false
	},
	{
		"token": "primary",
		"light": "#1F1C21",
		"dark": "#EFECF2",
		"usage": "Главные действия",
		"derived": false
	},
	{
		"token": "primary-foreground",
		"light": "#FBF9FD",
		"dark": "#090211",
		"usage": "Текст на primary",
		"derived": false
	},
	{
		"token": "border",
		"light": "#CAC7CC",
		"dark": "#443B4B",
		"usage": "Выведен: surface 80% + чернила",
		"derived": true
	},
	{
		"token": "border-muted",
		"light": "#D8D6DA",
		"dark": "#393040",
		"usage": "Выведен: surface 86% + чернила",
		"derived": true
	},
	{
		"token": "ring",
		"light": "#C4C0C9",
		"dark": "#4F4A54",
		"usage": "Кольца и инсеты",
		"derived": false
	},
	{
		"token": "depth-100",
		"light": "#D3D1D6",
		"dark": "#3C3443",
		"usage": "Выведен: тихая линия",
		"derived": true
	},
	{
		"token": "depth-200",
		"light": "#C0BBC4",
		"dark": "#443C4B",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-300",
		"light": "#9C97A0",
		"dark": "#4D4653",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-400",
		"light": "#78747C",
		"dark": "#59535E",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-500",
		"light": "#5A565E",
		"dark": "#7B767F",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-600",
		"light": "#454149",
		"dark": "#A09CA3",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-700",
		"light": "#312E35",
		"dark": "#C3BFC6",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "link",
		"light": "#1F53B8",
		"dark": "#9FC1FF",
		"usage": "Ссылки в prose",
		"derived": false
	},
	{
		"token": "link-decoration",
		"light": "#447BE4",
		"dark": "#6B97E8",
		"usage": "Подчёркивание ссылок",
		"derived": false
	},
	{
		"token": "destructive",
		"light": "#B23A26",
		"dark": "#F18A76",
		"usage": "Сброс фильтров",
		"derived": false
	},
	{
		"token": "favorite",
		"light": "#BD1F3F",
		"dark": "#F87580",
		"usage": "Сердце избранного",
		"derived": false
	},
	{
		"token": "shade",
		"light": "#090211",
		"dark": "#090211",
		"usage": "Тон тени",
		"derived": false
	},
	{
		"token": "lift",
		"light": "#FBF9FD",
		"dark": "#FBF9FD",
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
				"accent": "#1F1C21",
				"accentForeground": "#FBF9FD",
				"accentVivid": "#1F1C21",
				"accentGlow": "#9C97A0"
			},
			"dark": {
				"accent": "#EFECF2",
				"accentForeground": "#090211",
				"accentVivid": "#EFECF2",
				"accentGlow": "#A09CA3"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 15.33,
				"onSurface": 16.1,
				"foregroundOnAccent": 16.1
			},
			"dark": {
				"onBackground": 17.45,
				"onSurface": 14.8,
				"foregroundOnAccent": 17.45
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#2E2E2E",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#3B3B3B",
					"accentGlow": "#5E5E5E",
					"onBackground": 12.36,
					"onSurface": 12.98,
					"foregroundOnAccent": 12.98
				},
				"dark": {
					"accent": "#E8E8E8",
					"accentForeground": "#090211",
					"accentVivid": "#EFEFEF",
					"accentGlow": "#F8F8F8",
					"onBackground": 16.67,
					"onSurface": 14.13,
					"foregroundOnAccent": 16.67
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#1B1B1B",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#272727",
					"accentGlow": "#484848",
					"onBackground": 15.67,
					"onSurface": 16.46,
					"foregroundOnAccent": 16.46
				},
				"dark": {
					"accent": "#FCFCFC",
					"accentForeground": "#090211",
					"accentVivid": "#F5F5F5",
					"accentGlow": "#F8F8F8",
					"onBackground": 19.9,
					"onSurface": 16.87,
					"foregroundOnAccent": 19.9
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#424242",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#4F4F4F",
					"accentGlow": "#747474",
					"onBackground": 9.14,
					"onSurface": 9.6,
					"foregroundOnAccent": 9.6
				},
				"dark": {
					"accent": "#D1D1D1",
					"accentForeground": "#090211",
					"accentVivid": "#D7D7D7",
					"accentGlow": "#F8F8F8",
					"onBackground": 13.37,
					"onSurface": 11.33,
					"foregroundOnAccent": 13.37
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#292E34",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#353B42",
					"accentGlow": "#585E64",
					"onBackground": 12.45,
					"onSurface": 13.08,
					"foregroundOnAccent": 13.08
				},
				"dark": {
					"accent": "#E3E8EE",
					"accentForeground": "#090211",
					"accentVivid": "#E9EFF5",
					"accentGlow": "#F5F9FE",
					"onBackground": 16.57,
					"onSurface": 14.05,
					"foregroundOnAccent": 16.57
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#6C6C6C",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#7B7B7B",
					"accentGlow": "#A2A2A2",
					"onBackground": 4.78,
					"onSurface": 5.02,
					"foregroundOnAccent": 5.02
				},
				"dark": {
					"accent": "#BEBEBE",
					"accentForeground": "#090211",
					"accentVivid": "#C4C4C4",
					"accentGlow": "#E5E5E5",
					"onBackground": 10.99,
					"onSurface": 9.31,
					"foregroundOnAccent": 10.99
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
				"accentForeground": "#FBF9FD",
				"accentVivid": "#16A249",
				"accentGlow": "#3BDE77"
			},
			"dark": {
				"accent": "#3ECC72",
				"accentForeground": "#090211",
				"accentVivid": "#39D070",
				"accentGlow": "#7DE8A4"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.37,
				"onSurface": 4.59,
				"foregroundOnAccent": 4.59
			},
			"dark": {
				"onBackground": 9.81,
				"onSurface": 8.31,
				"foregroundOnAccent": 9.81
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#137F3D",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#0F9045",
					"accentGlow": "#5DB674",
					"onBackground": 4.63,
					"onSurface": 4.86,
					"foregroundOnAccent": 4.86
				},
				"dark": {
					"accent": "#23BA61",
					"accentForeground": "#090211",
					"accentVivid": "#1CC263",
					"accentGlow": "#70DD90",
					"onBackground": 8.04,
					"onSurface": 6.81,
					"foregroundOnAccent": 8.04
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#00803A",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#009143",
					"accentGlow": "#58B772",
					"onBackground": 4.61,
					"onSurface": 4.84,
					"foregroundOnAccent": 4.84
				},
				"dark": {
					"accent": "#00BC5D",
					"accentForeground": "#090211",
					"accentVivid": "#00C361",
					"accentGlow": "#6ADF8D",
					"onBackground": 8.12,
					"onSurface": 6.88,
					"foregroundOnAccent": 8.12
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#467852",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#4F885D",
					"accentGlow": "#7DAE88",
					"onBackground": 4.7,
					"onSurface": 4.93,
					"foregroundOnAccent": 4.93
				},
				"dark": {
					"accent": "#6BB27E",
					"accentForeground": "#090211",
					"accentVivid": "#6EB982",
					"accentGlow": "#9AD6A8",
					"onBackground": 8.07,
					"onSurface": 6.84,
					"foregroundOnAccent": 8.07
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#007E56",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#008F62",
					"accentGlow": "#58B58C",
					"onBackground": 4.64,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#00B982",
					"accentForeground": "#090211",
					"accentVivid": "#00C087",
					"accentGlow": "#6ADCAB",
					"onBackground": 8.03,
					"onSurface": 6.81,
					"foregroundOnAccent": 8.03
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#18813F",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#169247",
					"accentGlow": "#60B876",
					"onBackground": 4.49,
					"onSurface": 4.72,
					"foregroundOnAccent": 4.72
				},
				"dark": {
					"accent": "#76D691",
					"accentForeground": "#090211",
					"accentVivid": "#78DE95",
					"accentGlow": "#AAFBBE",
					"onBackground": 11.47,
					"onSurface": 9.72,
					"foregroundOnAccent": 11.47
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
				"accentForeground": "#FBF9FD",
				"accentVivid": "#0D59D3",
				"accentGlow": "#4595F7"
			},
			"dark": {
				"accent": "#5AA0F6",
				"accentForeground": "#090211",
				"accentVivid": "#519BF6",
				"accentGlow": "#92C2FC"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 5.43,
				"onSurface": 5.7,
				"foregroundOnAccent": 5.7
			},
			"dark": {
				"onBackground": 7.58,
				"onSurface": 6.42,
				"foregroundOnAccent": 7.58
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#2469D9",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#2676F7",
					"accentGlow": "#6FA5FF",
					"onBackground": 4.66,
					"onSurface": 4.9,
					"foregroundOnAccent": 4.9
				},
				"dark": {
					"accent": "#5EA5FB",
					"accentForeground": "#090211",
					"accentVivid": "#67ACFF",
					"accentGlow": "#A3CCFF",
					"onBackground": 8.02,
					"onSurface": 6.8,
					"foregroundOnAccent": 8.02
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#0065F0",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#2076FF",
					"accentGlow": "#72A7FF",
					"onBackground": 4.64,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#5DA6FF",
					"accentForeground": "#090211",
					"accentVivid": "#6AADFF",
					"accentGlow": "#A5CDFF",
					"onBackground": 8.13,
					"onSurface": 6.89,
					"foregroundOnAccent": 8.13
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#476EAF",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#507CC7",
					"accentGlow": "#7DA5E7",
					"onBackground": 4.64,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#7DA5D8",
					"accentForeground": "#090211",
					"accentVivid": "#81ABE1",
					"accentGlow": "#A8CBF8",
					"onBackground": 8.02,
					"onSurface": 6.8,
					"foregroundOnAccent": 8.02
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#4F63DC",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#596FFA",
					"accentGlow": "#8AA1FF",
					"onBackground": 4.6,
					"onSurface": 4.84,
					"foregroundOnAccent": 4.84
				},
				"dark": {
					"accent": "#7A9FFF",
					"accentForeground": "#090211",
					"accentVivid": "#83A6FF",
					"accentGlow": "#B2C9FF",
					"onBackground": 8.0,
					"onSurface": 6.78,
					"foregroundOnAccent": 8.0
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#3A6AB9",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#4178D3",
					"accentGlow": "#71A2F1",
					"onBackground": 4.85,
					"onSurface": 5.09,
					"foregroundOnAccent": 5.09
				},
				"dark": {
					"accent": "#90C1FF",
					"accentForeground": "#090211",
					"accentVivid": "#9CC7FF",
					"accentGlow": "#D3E6FF",
					"onBackground": 10.95,
					"onSurface": 9.28,
					"foregroundOnAccent": 10.95
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
				"accentForeground": "#FBF9FD",
				"accentVivid": "#6920DF",
				"accentGlow": "#9D68F3"
			},
			"dark": {
				"accent": "#A97BF4",
				"accentForeground": "#090211",
				"accentVivid": "#A474F1",
				"accentGlow": "#C7A8FA"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 6.35,
				"onSurface": 6.67,
				"foregroundOnAccent": 6.67
			},
			"dark": {
				"onBackground": 6.64,
				"onSurface": 5.63,
				"foregroundOnAccent": 6.64
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#814CE4",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#9156FF",
					"accentGlow": "#B196FF",
					"onBackground": 4.67,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#B78EFF",
					"accentForeground": "#090211",
					"accentVivid": "#BC97FF",
					"accentGlow": "#D5C2FF",
					"onBackground": 8.1,
					"onSurface": 6.86,
					"foregroundOnAccent": 8.1
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#8939FF",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#945BFF",
					"accentGlow": "#B49AFF",
					"onBackground": 4.67,
					"onSurface": 4.9,
					"foregroundOnAccent": 4.9
				},
				"dark": {
					"accent": "#B78EFF",
					"accentForeground": "#090211",
					"accentVivid": "#BC97FF",
					"accentGlow": "#D5C2FF",
					"onBackground": 8.1,
					"onSurface": 6.86,
					"foregroundOnAccent": 8.1
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#7860B6",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#886CCE",
					"accentGlow": "#AD98EE",
					"onBackground": 4.61,
					"onSurface": 4.84,
					"foregroundOnAccent": 4.84
				},
				"dark": {
					"accent": "#B097E0",
					"accentForeground": "#090211",
					"accentVivid": "#B79CE9",
					"accentGlow": "#D4C0FF",
					"onBackground": 8.12,
					"onSurface": 6.88,
					"foregroundOnAccent": 8.12
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#9744D8",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#AB4AF5",
					"accentGlow": "#C78DFF",
					"onBackground": 4.62,
					"onSurface": 4.85,
					"foregroundOnAccent": 4.85
				},
				"dark": {
					"accent": "#CD85F9",
					"accentForeground": "#090211",
					"accentVivid": "#D38CFF",
					"accentGlow": "#E5BDFF",
					"onBackground": 8.09,
					"onSurface": 6.86,
					"foregroundOnAccent": 8.09
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#7259B1",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#8265CA",
					"accentGlow": "#A791E9",
					"onBackground": 5.06,
					"onSurface": 5.31,
					"foregroundOnAccent": 5.31
				},
				"dark": {
					"accent": "#C8ADFF",
					"accentForeground": "#090211",
					"accentVivid": "#CDB6FF",
					"accentGlow": "#E8DFFF",
					"onBackground": 10.58,
					"onSurface": 8.97,
					"foregroundOnAccent": 10.58
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
				"accentForeground": "#FBF9FD",
				"accentVivid": "#E93737",
				"accentGlow": "#F47B7B"
			},
			"dark": {
				"accent": "#EE6A6A",
				"accentForeground": "#090211",
				"accentVivid": "#F26363",
				"accentGlow": "#FA9E9E"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.38,
				"onSurface": 4.6,
				"foregroundOnAccent": 4.6
			},
			"dark": {
				"onBackground": 6.71,
				"onSurface": 5.69,
				"foregroundOnAccent": 6.71
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#D72023",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#F31C24",
					"accentGlow": "#FF8175",
					"onBackground": 4.64,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#FF7A79",
					"accentForeground": "#090211",
					"accentVivid": "#FF8684",
					"accentGlow": "#FFBBB8",
					"onBackground": 8.08,
					"onSurface": 6.85,
					"foregroundOnAccent": 8.08
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#DD0016",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#F7001A",
					"accentGlow": "#FF8175",
					"onBackground": 4.68,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#FF7A79",
					"accentForeground": "#090211",
					"accentVivid": "#FF8684",
					"accentGlow": "#FFBBB8",
					"onBackground": 8.08,
					"onSurface": 6.85,
					"foregroundOnAccent": 8.08
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#B15047",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#C8594F",
					"accentGlow": "#EB897E",
					"onBackground": 4.65,
					"onSurface": 4.89,
					"foregroundOnAccent": 4.89
				},
				"dark": {
					"accent": "#DE8E8A",
					"accentForeground": "#090211",
					"accentVivid": "#E7938F",
					"accentGlow": "#FFB8B4",
					"onBackground": 8.11,
					"onSurface": 6.88,
					"foregroundOnAccent": 8.11
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#C44100",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#DC4A00",
					"accentGlow": "#FF8054",
					"onBackground": 4.66,
					"onSurface": 4.89,
					"foregroundOnAccent": 4.89
				},
				"dark": {
					"accent": "#FF7E60",
					"accentForeground": "#090211",
					"accentVivid": "#FF8A6E",
					"accentGlow": "#FFBEAD",
					"onBackground": 8.17,
					"onSurface": 6.93,
					"foregroundOnAccent": 8.17
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#AC473E",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#C45046",
					"accentGlow": "#E68075",
					"onBackground": 5.13,
					"onSurface": 5.39,
					"foregroundOnAccent": 5.39
				},
				"dark": {
					"accent": "#FFA09C",
					"accentForeground": "#090211",
					"accentVivid": "#FFAAA6",
					"accentGlow": "#FFDBD8",
					"onBackground": 10.46,
					"onSurface": 8.87,
					"foregroundOnAccent": 10.46
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
				"accentForeground": "#FBF9FD",
				"accentVivid": "#D95D04",
				"accentGlow": "#F7993B"
			},
			"dark": {
				"accent": "#F38314",
				"accentForeground": "#090211",
				"accentVivid": "#F98510",
				"accentGlow": "#FBB656"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.38,
				"onSurface": 4.6,
				"foregroundOnAccent": 4.6
			},
			"dark": {
				"onBackground": 7.84,
				"onSurface": 6.65,
				"foregroundOnAccent": 7.84
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#B55002",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#CC5A00",
					"accentGlow": "#EF8A53",
					"onBackground": 4.65,
					"onSurface": 4.88,
					"foregroundOnAccent": 4.88
				},
				"dark": {
					"accent": "#F58518",
					"accentForeground": "#090211",
					"accentVivid": "#FF8911",
					"accentGlow": "#FFBC8D",
					"onBackground": 8.02,
					"onSurface": 6.8,
					"foregroundOnAccent": 8.02
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#B64F00",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#CC5A00",
					"accentGlow": "#F18952",
					"onBackground": 4.65,
					"onSurface": 4.89,
					"foregroundOnAccent": 4.89
				},
				"dark": {
					"accent": "#F98400",
					"accentForeground": "#090211",
					"accentVivid": "#FF8B1D",
					"accentGlow": "#FFBE90",
					"onBackground": 8.1,
					"onSurface": 6.86,
					"foregroundOnAccent": 8.1
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#9A5F40",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#AF6B47",
					"accentGlow": "#D29677",
					"onBackground": 4.68,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#D79464",
					"accentForeground": "#090211",
					"accentVivid": "#E09966",
					"accentGlow": "#F8BD94",
					"onBackground": 8.08,
					"onSurface": 6.85,
					"foregroundOnAccent": 8.08
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#A65B00",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#BB6700",
					"accentGlow": "#DF9352",
					"onBackground": 4.64,
					"onSurface": 4.87,
					"foregroundOnAccent": 4.87
				},
				"dark": {
					"accent": "#E58F00",
					"accentForeground": "#090211",
					"accentVivid": "#ED9400",
					"accentGlow": "#FFBC72",
					"onBackground": 8.03,
					"onSurface": 6.81,
					"foregroundOnAccent": 8.03
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#A84E14",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#BF5812",
					"accentGlow": "#E28757",
					"onBackground": 5.08,
					"onSurface": 5.33,
					"foregroundOnAccent": 5.33
				},
				"dark": {
					"accent": "#FFA663",
					"accentForeground": "#090211",
					"accentVivid": "#FFB076",
					"accentGlow": "#FFDDC6",
					"onBackground": 10.59,
					"onSurface": 8.97,
					"foregroundOnAccent": 10.59
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
				"accentForeground": "#FBF9FD",
				"accentVivid": "#E82E7C",
				"accentGlow": "#F679AD"
			},
			"dark": {
				"accent": "#F366A0",
				"accentForeground": "#090211",
				"accentVivid": "#F5619F",
				"accentGlow": "#FB9DC4"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.39,
				"onSurface": 4.61,
				"foregroundOnAccent": 4.61
			},
			"dark": {
				"onBackground": 7.02,
				"onSurface": 5.95,
				"foregroundOnAccent": 7.02
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#D21B6A",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#ED1477",
					"accentGlow": "#FF7BA3",
					"onBackground": 4.65,
					"onSurface": 4.89,
					"foregroundOnAccent": 4.89
				},
				"dark": {
					"accent": "#FF74AC",
					"accentForeground": "#090211",
					"accentVivid": "#FF81B2",
					"accentGlow": "#FFBAD1",
					"onBackground": 8.12,
					"onSurface": 6.88,
					"foregroundOnAccent": 8.12
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#D8006A",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#F20077",
					"accentGlow": "#FF7DA4",
					"onBackground": 4.63,
					"onSurface": 4.86,
					"foregroundOnAccent": 4.86
				},
				"dark": {
					"accent": "#FF74AC",
					"accentForeground": "#090211",
					"accentVivid": "#FF81B2",
					"accentGlow": "#FFBAD1",
					"onBackground": 8.12,
					"onSurface": 6.88,
					"foregroundOnAccent": 8.12
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#AE4D6B",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#C55679",
					"accentGlow": "#E886A1",
					"onBackground": 4.69,
					"onSurface": 4.93,
					"foregroundOnAccent": 4.93
				},
				"dark": {
					"accent": "#DF8AA9",
					"accentForeground": "#090211",
					"accentVivid": "#E88EAF",
					"accentGlow": "#FFB5CF",
					"onBackground": 8.12,
					"onSurface": 6.88,
					"foregroundOnAccent": 8.12
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#D6194B",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#F21053",
					"accentGlow": "#FF7E8C",
					"onBackground": 4.66,
					"onSurface": 4.9,
					"foregroundOnAccent": 4.9
				},
				"dark": {
					"accent": "#FF7693",
					"accentForeground": "#090211",
					"accentVivid": "#FF839B",
					"accentGlow": "#FFBAC4",
					"onBackground": 8.04,
					"onSurface": 6.81,
					"foregroundOnAccent": 8.04
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#A84464",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#BF4C71",
					"accentGlow": "#E27D99",
					"onBackground": 5.2,
					"onSurface": 5.46,
					"foregroundOnAccent": 5.46
				},
				"dark": {
					"accent": "#FF9ABF",
					"accentForeground": "#090211",
					"accentVivid": "#FFA5C5",
					"accentGlow": "#FFD9E5",
					"onBackground": 10.33,
					"onSurface": 8.76,
					"foregroundOnAccent": 10.33
				}
			}
		]
	}
];
