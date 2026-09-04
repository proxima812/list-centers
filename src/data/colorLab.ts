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
 * `background` (#F6F3F9 в светлой, #111012 в тёмной) и `surface`. Варианты
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
		"dark": "#111012",
		"usage": "Плоскость страницы",
		"derived": false
	},
	{
		"token": "muted",
		"light": "#E9E5EE",
		"dark": "#181719",
		"usage": "Утопленная полоса секции",
		"derived": false
	},
	{
		"token": "surface",
		"light": "#FBF9FD",
		"dark": "#222123",
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
		"dark": "#333234",
		"usage": "Самая тихая заливка",
		"derived": false
	},
	{
		"token": "catalog",
		"light": "#EDEBEF",
		"dark": "#181719",
		"usage": "Полоса каталога: surface-muted / muted",
		"derived": true
	},
	{
		"token": "foreground",
		"light": "#1F1C21",
		"dark": "#EDEBEF",
		"usage": "Основные чернила",
		"derived": false
	},
	{
		"token": "muted-foreground",
		"light": "#534F56",
		"dark": "#A8A7A9",
		"usage": "Второстепенный текст",
		"derived": false
	},
	{
		"token": "subtle-foreground",
		"light": "#646067",
		"dark": "#939294",
		"usage": "Самый тусклый текст",
		"derived": false
	},
	{
		"token": "primary",
		"light": "#1F1C21",
		"dark": "#EDEBEF",
		"usage": "Главные действия",
		"derived": false
	},
	{
		"token": "primary-foreground",
		"light": "#FBF9FD",
		"dark": "#111012",
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
		"dark": "#545355",
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
		"dark": "#3F3E40",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-300",
		"light": "#9C97A0",
		"dark": "#494849",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-400",
		"light": "#78747C",
		"dark": "#555456",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-500",
		"light": "#5A565E",
		"dark": "#787779",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-600",
		"light": "#454149",
		"dark": "#9D9C9F",
		"usage": "Ступень глубины",
		"derived": false
	},
	{
		"token": "depth-700",
		"light": "#312E35",
		"dark": "#C0BFC2",
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
				"accent": "#1D1A1F",
				"accentForeground": "#FBF9FD",
				"accentVivid": "#29262C",
				"accentGlow": "#4A474D"
			},
			"dark": {
				"accent": "#FDFBFF",
				"accentForeground": "#111012",
				"accentVivid": "#F7F4FA",
				"accentGlow": "#FAF7FD"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 15.66,
				"onSurface": 16.45,
				"foregroundOnAccent": 16.45
			},
			"dark": {
				"onBackground": 19.86,
				"onSurface": 16.83,
				"foregroundOnAccent": 19.86
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
				"accent": "#00803A",
				"accentForeground": "#FBF9FD",
				"accentVivid": "#009143",
				"accentGlow": "#58B772"
			},
			"dark": {
				"accent": "#00BC5D",
				"accentForeground": "#111012",
				"accentVivid": "#00C361",
				"accentGlow": "#6ADF8D"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.61,
				"onSurface": 4.84,
				"foregroundOnAccent": 4.84
			},
			"dark": {
				"onBackground": 8.12,
				"onSurface": 6.88,
				"foregroundOnAccent": 8.12
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
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
					"accentForeground": "#111012",
					"accentVivid": "#00C361",
					"accentGlow": "#6ADF8D",
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
					"accentForeground": "#111012",
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
					"accent": "#437950",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#4B8A5B",
					"accentGlow": "#7BAF86",
					"onBackground": 4.67,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#67B37C",
					"accentForeground": "#111012",
					"accentVivid": "#6ABA80",
					"accentGlow": "#97D7A6",
					"onBackground": 8.09,
					"onSurface": 6.85,
					"foregroundOnAccent": 8.09
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#007E55",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#008F61",
					"accentGlow": "#58B58B",
					"onBackground": 4.64,
					"onSurface": 4.88,
					"foregroundOnAccent": 4.88
				},
				"dark": {
					"accent": "#00B982",
					"accentForeground": "#111012",
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
					"accent": "#19813F",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#179247",
					"accentGlow": "#60B876",
					"onBackground": 4.49,
					"onSurface": 4.72,
					"foregroundOnAccent": 4.72
				},
				"dark": {
					"accent": "#76D691",
					"accentForeground": "#111012",
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
				"accent": "#4F63DC",
				"accentForeground": "#FBF9FD",
				"accentVivid": "#596FFA",
				"accentGlow": "#8AA1FF"
			},
			"dark": {
				"accent": "#7A9FFF",
				"accentForeground": "#111012",
				"accentVivid": "#83A6FF",
				"accentGlow": "#B2C9FF"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.6,
				"onSurface": 4.84,
				"foregroundOnAccent": 4.84
			},
			"dark": {
				"onBackground": 8.0,
				"onSurface": 6.78,
				"foregroundOnAccent": 8.0
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
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
					"accentForeground": "#111012",
					"accentVivid": "#83A6FF",
					"accentGlow": "#B2C9FF",
					"onBackground": 8.0,
					"onSurface": 6.78,
					"foregroundOnAccent": 8.0
				}
			},
			{
				"key": "vivid",
				"title": "Насыщенный",
				"note": "Хрома поднята до края sRGB при том же контрасте. Для тех, кому дефолт кажется приглушённым; риск — заливки становятся крикливыми, поэтому soft-фон остаётся вычисляемым.",
				"light": {
					"accent": "#4957FF",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#596FFF",
					"accentGlow": "#8CA3FF",
					"onBackground": 4.67,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#7A9FFF",
					"accentForeground": "#111012",
					"accentVivid": "#83A6FF",
					"accentGlow": "#B2C9FF",
					"onBackground": 8.0,
					"onSurface": 6.78,
					"foregroundOnAccent": 8.0
				}
			},
			{
				"key": "muted",
				"title": "Приглушённый",
				"note": "Хрома срезана до 60%. Акцент перестаёт спорить с фотографиями и брендовыми плитками платформ, но остаётся отличимым от нейтралей.",
				"light": {
					"accent": "#596AB0",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#6478C8",
					"accentGlow": "#8EA1E8",
					"onBackground": 4.65,
					"onSurface": 4.88,
					"foregroundOnAccent": 4.88
				},
				"dark": {
					"accent": "#8BA2DB",
					"accentForeground": "#111012",
					"accentVivid": "#90A8E4",
					"accentGlow": "#B4C9FB",
					"onBackground": 8.06,
					"onSurface": 6.83,
					"foregroundOnAccent": 8.06
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#695BD8",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#7766F5",
					"accentGlow": "#9E9BFF",
					"onBackground": 4.67,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#929AFF",
					"accentForeground": "#111012",
					"accentVivid": "#99A2FF",
					"accentGlow": "#BFC7FF",
					"onBackground": 8.06,
					"onSurface": 6.83,
					"foregroundOnAccent": 8.06
				}
			},
			{
				"key": "uniform",
				"title": "Ровная громкость",
				"note": "Одинаковые L и C во всех семи: L 0.53 в светлой и 0.80 в тёмной, C 0.135. Пресеты перестают отличаться яркостью — только тоном.",
				"light": {
					"accent": "#5164B9",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#5C71D3",
					"accentGlow": "#859CF1",
					"onBackground": 4.93,
					"onSurface": 5.18,
					"foregroundOnAccent": 5.18
				},
				"dark": {
					"accent": "#A0BCFF",
					"accentForeground": "#111012",
					"accentVivid": "#A9C3FF",
					"accentGlow": "#D9E4FF",
					"onBackground": 10.82,
					"onSurface": 9.18,
					"foregroundOnAccent": 10.82
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
				"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
				"accent": "#DD0016",
				"accentForeground": "#FBF9FD",
				"accentVivid": "#F7001A",
				"accentGlow": "#FF8175"
			},
			"dark": {
				"accent": "#FF7A79",
				"accentForeground": "#111012",
				"accentVivid": "#FF8684",
				"accentGlow": "#FFBBB8"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.68,
				"onSurface": 4.91,
				"foregroundOnAccent": 4.91
			},
			"dark": {
				"onBackground": 8.08,
				"onSurface": 6.85,
				"foregroundOnAccent": 8.08
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
				"light": {
					"accent": "#DD0116",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#F7001A",
					"accentGlow": "#FF8275",
					"onBackground": 4.67,
					"onSurface": 4.91,
					"foregroundOnAccent": 4.91
				},
				"dark": {
					"accent": "#FF7A79",
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accent": "#B54C44",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#CD554C",
					"accentGlow": "#F0867B",
					"onBackground": 4.68,
					"onSurface": 4.92,
					"foregroundOnAccent": 4.92
				},
				"dark": {
					"accent": "#DD8E8A",
					"accentForeground": "#111012",
					"accentVivid": "#E6938F",
					"accentGlow": "#FEB8B4",
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
					"accent": "#C44100",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#DC4A00",
					"accentGlow": "#FF8054",
					"onBackground": 4.66,
					"onSurface": 4.89,
					"foregroundOnAccent": 4.89
				},
				"dark": {
					"accent": "#FD7D5F",
					"accentForeground": "#111012",
					"accentVivid": "#FF876B",
					"accentGlow": "#FFBBAB",
					"onBackground": 8.05,
					"onSurface": 6.82,
					"foregroundOnAccent": 8.05
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
					"accentForeground": "#111012",
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
		"name": "pink",
		"label": "Иркә Алсу",
		"current": {
			"light": {
				"accent": "#D8006A",
				"accentForeground": "#FBF9FD",
				"accentVivid": "#F20077",
				"accentGlow": "#FF7DA4"
			},
			"dark": {
				"accent": "#FF74AC",
				"accentForeground": "#111012",
				"accentVivid": "#FF81B2",
				"accentGlow": "#FFBAD1"
			}
		},
		"currentContrast": {
			"light": {
				"onBackground": 4.63,
				"onSurface": 4.86,
				"foregroundOnAccent": 4.86
			},
			"dark": {
				"onBackground": 8.12,
				"onSurface": 6.88,
				"foregroundOnAccent": 8.12
			}
		},
		"variants": [
			{
				"key": "aa",
				"title": "Строгий AA",
				"note": "Светлота решена под 4.6:1 к своему фону, тон и хрома пресета сохранены. Минимальная правка: то же семейство, но акцент гарантированно читается как текст и как иконка.",
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
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
					"accent": "#B24B6C",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#C9537A",
					"accentGlow": "#ED84A2",
					"onBackground": 4.64,
					"onSurface": 4.88,
					"foregroundOnAccent": 4.88
				},
				"dark": {
					"accent": "#DC8AA7",
					"accentForeground": "#111012",
					"accentVivid": "#E58EAD",
					"accentGlow": "#FDB4CD",
					"onBackground": 8.01,
					"onSurface": 6.79,
					"foregroundOnAccent": 8.01
				}
			},
			{
				"key": "shift",
				"title": "Сдвиг тона",
				"note": "Тон повёрнут на +12°, светлота и контраст те же. Раздвигает пресеты, которые сейчас соседствуют по тону (red/pink, green/blue).",
				"light": {
					"accent": "#DC004A",
					"accentForeground": "#FBF9FD",
					"accentVivid": "#F60054",
					"accentGlow": "#FF818E",
					"onBackground": 4.61,
					"onSurface": 4.85,
					"foregroundOnAccent": 4.85
				},
				"dark": {
					"accent": "#FF7693",
					"accentForeground": "#111012",
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
					"accentForeground": "#111012",
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
