import type { AppLocale } from "@/i18n";

/**
 * Журнал изменений сайта.
 *
 * Пишется руками, а не собирается из коммитов: в истории git половина
 * записей - рефакторинги и правки текста, читателю каталога они ничего не
 * говорят. Сюда попадает только то, что посетитель может увидеть.
 *
 * Порядок - от новых к старым, за этим следит сама таблица.
 */

export interface ChangelogEntry {
	/** Дата в ISO: форматируется под язык страницы. */
	date: string;
	title: Record<AppLocale, string>;
	/** Пункты списка: по одному изменению на строку. */
	items: Record<AppLocale, string[]>;
	/** Короткая метка раздела: каталог, оформление, тексты. */
	tags?: Record<AppLocale, string[]>;
}

export const changelog: ChangelogEntry[] = [
	{
		date: "2026-08-28",
		title: {
			ru: "Палитры картинками и две новые секции на главной",
			en: "Palettes as images and two new sections on the home page",
		},
		items: {
			ru: [
				"В меню оформления палитры стали картинками и встали в один ряд, без подписей. Кружок в шапке показывает выбранную.",
				"На главной появились секции о сохраненных центрах и о печати каталога.",
				"В подвале, в разделе «О проекте», добавлена ссылка на статью о tatarverse на vc.ru.",
			],
			en: [
				"In the appearance menu the palettes became images in a single row, without captions. The dot in the header shows the selected one.",
				"The home page gained sections about saved centers and about printing the catalog.",
				"The footer, under \"About the project\", now links to the article about tatarverse on vc.ru.",
			],
		},
		tags: { ru: ["оформление", "главная"], en: ["appearance", "home"] },
	},
	{
		date: "2026-08-27",
		title: {
			ru: "Центры рядом и английские версии страниц",
			en: "Centers nearby and English versions of the pages",
		},
		items: {
			ru: [
				"Страница «Центры рядом»: сайт определяет страну и показывает, что есть вокруг. Если геолокация не сработала, страну можно выбрать руками.",
				"Английские версии постов и служебных страниц.",
				"Подвал переехал на новую сетку: последние центры, свежие посты и связь в отдельных колонках.",
			],
			en: [
				"The \"Centers nearby\" page: the site detects your country and shows what exists around you. If geolocation fails, the country can be picked by hand.",
				"English versions of the posts and the service pages.",
				"The footer moved to a new grid: recent centers, latest posts and contacts in separate columns.",
			],
		},
		tags: { ru: ["каталог", "языки"], en: ["catalog", "languages"] },
	},
	{
		date: "2026-08-20",
		title: {
			ru: "Темная тема по умолчанию и монохромный «Дефолт»",
			en: "Dark theme by default and a monochrome \"Default\" palette",
		},
		items: {
			ru: [
				"Темная тема стала темой по умолчанию, движение в интерфейсе сделали тише.",
				"Палитра «Дефолт» стала монохромной, ссылки в тексте - синими во всех пресетах.",
				"Разделы «Сабантуй» и «Проекты» убраны вместе с выпадающим меню «Интересное».",
			],
			en: [
				"The dark theme became the default, and the motion in the interface got quieter.",
				"The \"Default\" palette went monochrome, and links inside text turned blue across every preset.",
				"The \"Sabantuy\" and \"Projects\" sections were removed along with the \"Interesting\" dropdown.",
			],
		},
		tags: { ru: ["оформление"], en: ["appearance"] },
	},
	{
		date: "2026-08-19",
		title: {
			ru: "Markdown-версии страниц для языковых моделей",
			en: "Markdown versions of the pages for language models",
		},
		items: {
			ru: [
				"У главной и у каждой карточки центра появился markdown-двойник: модель читает текст, а не верстку.",
				"Кнопка «Открыть в» на карточке отправляет страницу в ChatGPT, Claude, Gemini, Grok или DeepSeek.",
			],
			en: [
				"The home page and every center card got a markdown twin: a model reads the text instead of the markup.",
				"The \"Open in\" button on a card sends the page to ChatGPT, Claude, Gemini, Grok or DeepSeek.",
			],
		},
		tags: { ru: ["каталог"], en: ["catalog"] },
	},
	{
		date: "2026-08-12",
		title: {
			ru: "Страница «Статистика» и ревизия географии",
			en: "The \"Statistics\" page and a geography review",
		},
		items: {
			ru: [
				"Цифры каталога переехали с /centers на отдельную страницу /stats. Там же перечислены страны, где карточек пока нет.",
				"52 зарубежные карточки получили город, дубли убраны.",
				"Навигация перегруппирована: часть разделов ушла в подвал.",
			],
			en: [
				"The catalog numbers moved from /centers to a separate /stats page, which also lists the countries with no cards yet.",
				"52 foreign cards got a city, and duplicates were removed.",
				"The navigation was regrouped, with some sections moved into the footer.",
			],
		},
		tags: { ru: ["каталог", "данные"], en: ["catalog", "data"] },
	},
	{
		date: "2026-08-09",
		title: {
			ru: "Сохраненные центры и иерархические фильтры",
			en: "Saved centers and hierarchical filters",
		},
		items: {
			ru: [
				"Закладка на карточке складывает центр в личный список на странице «Сохраненные». Без регистрации, список хранится в браузере.",
				"Фильтры каталога стали иерархическими: страна, регион, город связаны между собой.",
				"На карточках вместо названий площадок - адреса и иконки.",
			],
			en: [
				"The bookmark on a card puts the center into a personal list on the \"Saved\" page. No sign-up: the list lives in the browser.",
				"Catalog filters became hierarchical, with country, region and city tied together.",
				"Cards now show addresses and icons instead of platform names.",
			],
		},
		tags: { ru: ["каталог"], en: ["catalog"] },
	},
];
