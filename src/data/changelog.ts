import type { AppLocale } from "@/i18n";

/**
 * Журнал изменений сайта: все правки за все время, по дням.
 *
 * Источник - история git, но не дословная: коммиты сгруппированы по дням и
 * переписаны так, чтобы строку понял посетитель, а не только тот, кто писал
 * код. Инфраструктурные правки (хуки, скиллы, документация) оставлены -
 * репозиторий открытый, и по ним видно, как проект менялся.
 *
 * Порядок в файле - от новых к старым, но страница все равно сортирует сама.
 */

export interface ChangelogEntry {
	/** Дата в ISO: форматируется под язык страницы. */
	date: string;
	title: Record<AppLocale, string>;
	/** Пункты списка: по одному изменению на строку. */
	items: Record<AppLocale, string[]>;
}

export const changelog: ChangelogEntry[] = [
	{
		date: "2026-09-04",
		title: {
			ru: "Кыргызстан целиком, кнопки главной и пост об Играх кочевников",
			en: "All of Kyrgyzstan, new home buttons and a post about the Nomad Games",
		},
		items: {
			ru: [
				"Разобран весь Кыргызстан: у центра «Туган тел» появился инстаграм @tatardiaspora.kg - единственный живой аккаунт татарской организации в стране, - а также Сабантуй-2026 и три новых источника.",
				"Добавлены две башкирские организации из реестра Всемирного курултая башкир: «Курултай башкир» в Бишкеке и «Ак тирма» в Оше. Всего по стране теперь 17 центров.",
				"У карточки Кара-Балты уточнено название - это башкиро-татарский центр «Идель», - и категория сменилась на татаро-башкирскую. Токмок, Каракол и «Дуслык» получили вторые источники.",
				"Карточка Tatardiaspora kg честно помечена: это онлайн-аккаунт «Туган тел», а не отдельная организация.",
				"Кнопки на главной переименованы: «Посмотреть центры» стала «Каталогом», «Центры рядом» - «Рядом с тобой».",
				"Между ними появилась кнопка со ссылкой на инстаграм проекта @the_tatarverse с цветным логотипом.",
				"Обе кнопки рядом с «Каталогом» получили плашку вместо обводки: фон подложки и мягкая тень.",
				"Вышел пост о VI Всемирных играх кочевников и о том, какие татарские и башкирские центры есть рядом с площадками Игр.",
				"Над шапкой появилась полоса анонсов: телеграм, Threads, ВКонтакте и инстаграм проекта сменяют друг друга каждые три секунды. Ссылкой сделан только хэндл @the_tatarverse, иконки - в фирменных цветах платформ. При системной настройке «меньше движения» остаётся телеграм.",
			],
			en: [
				"All of Kyrgyzstan was worked through: the \"Tugan Tel\" center now has its Instagram @tatardiaspora.kg - the only live account of a Tatar organization in the country - plus the 2026 Sabantuy and three new sources.",
				"Two Bashkir organizations were added from the registry of the World Kurultai of Bashkirs: \"Kurultai of Bashkirs\" in Bishkek and \"Ak Tirma\" in Osh. The country now holds 17 centers.",
				"The Kara-Balta entry got its proper name - the Bashkir-Tatar center \"Idel\" - and its category changed to Tatar-Bashkir. Tokmok, Karakol and \"Duslyk\" received second sources.",
				"The Tatardiaspora kg entry now says plainly that it is the online account of \"Tugan Tel\", not a separate organization.",
				"The home page buttons were renamed: \"View centers\" became \"Catalog\", and \"Centers nearby\" became \"Near you\".",
				"A button linking to the project's Instagram @the_tatarverse, with the full-color logo, was added between them.",
				"Both buttons next to \"Catalog\" traded their outline for a surface plate with a soft shadow.",
				"A post went out about the VI World Nomad Games and the Tatar and Bashkir centers near the Games venues.",
				"A strip of announcements now sits above the header: the project's Telegram, Threads, VK and Instagram take turns every three seconds. Only the @the_tatarverse handle is a link, and the icons carry each platform's own colors. With reduced motion enabled, only Telegram stays.",
			],
		},
	},
	{
		date: "2026-08-28",
		title: {
			ru: "Палитры картинками, секции о сохраненных и печати, чистка постов",
			en: "Palettes as images, sections on saved and print, a cleanup of the posts",
		},
		items: {
			ru: [
				"Добавлена страница «Изменения» - этот самый журнал, ссылка на него лежит в меню «Прочее».",
				"Палитры в меню оформления стали картинками, встали в один ряд и лишились подписей. Кружок в шапке показывает выбранную палитру той же картинкой.",
				"На главной появились две секции: про сохраненные центры и про печать каталога.",
				"В подвале, в разделе «О проекте», появилась ссылка на статью о проекте на vc.ru.",
				"Секция «Нас больше, чем кажется» переехала после «Поиска по геолокации».",
				"Из постов удалены все записи, кроме гида по помощи с переводом; сам гид переписан - контакты идут первыми, раздел про GitHub после.",
				"Название телеграм-канала везде приведено к @the_tatarverse, личный контакт разработчика - @mirikhan1.",
				"Секции главной разнесены по вертикали, на мобильных текст встал выше картинки, первая секция получила новый текст.",
				"Из системы убраны чистый белый и чистый черный, у пресетов появились насыщенные варианты, пресет orange удален, blue сдвинут по тону.",
				"Появилась демо-страница палитры с вариантами акцента.",
				"В светлой теме подвалу вернули его плашку, шрифт Tatarverse Sans переименован в Inter.",
				"Под капотом: вся логика собрана в src/lib, клиентские скрипты - в src/lib/scripts, компонентные стили - в src/styles/components, разметка страниц вынесена в компоненты.",
			],
			en: [
				"A \"Changelog\" page was added - this very log; the link to it sits in the \"Other\" menu.",
				"Palettes in the appearance menu became images, lined up in a row and lost their captions. The dot in the header shows the selected palette with the same image.",
				"The home page gained two sections: about saved centers and about printing the catalog.",
				"The footer, under \"About the project\", now links to the article about the project on vc.ru.",
				"The \"There are more of us than it seems\" section moved below \"Search by geolocation\".",
				"All posts except the translation help guide were removed; the guide itself was rewritten so that contacts come first and the GitHub part follows.",
				"The Telegram channel name is now @the_tatarverse everywhere, and the developer's personal contact is @mirikhan1.",
				"Home sections were spread out vertically, on mobile the text moved above the image, and the first section got new copy.",
				"Pure white and pure black were removed from the system, presets gained vivid variants, the orange preset was dropped and blue was shifted in hue.",
				"A demo page for the palette with accent variants appeared.",
				"In the light theme the footer got its plate back, and the Tatarverse Sans font was renamed to Inter.",
				"Under the hood: all logic was gathered into src/lib, client scripts into src/lib/scripts, component styles into src/styles/components, and page markup moved into components.",
			],
		},
	},
	{
		date: "2026-08-27",
		title: {
			ru: "«Центры рядом», английские версии страниц и редизайн подвала",
			en: "\"Centers nearby\", English versions of the pages and a footer redesign",
		},
		items: {
			ru: [
				"Добавлена страница «Центры рядом»: сайт определяет страну и показывает, что есть вокруг, а если геолокация не сработала - страну можно выбрать руками.",
				"Появились английские версии постов и служебных страниц.",
				"На главной добавлены секции «Витрина ссылок», «Численность народов» и «Поиск по геолокации».",
				"Подвал переделан дважды: сначала на сетку в стиле Framer, потом на темную с колонками последних центров, свежих постов и связи.",
				"Каталог пополнен: карточки Казахстана, Кыргызстана, Украины и Узбекистана уточнены, по России прошли кластеры Москвы и Петербурга, Поволжья, Урала, Юга и Крыма; через обход графа добавлены 3 новые карточки.",
				"У татарских центров Узбекистана появились контакты и соцсети.",
				"Убран переключатель анимаций, шрифты переведены на Astro Fonts API, у селекта стран появилась своя стрелка.",
				"Astro обновлен до 7.2.9, включены инкрементальные сборки.",
				"Написан одноразовый импортер карточек в VK: хештег-футер с гео и категорией, канонический URL, остановка очереди на фатальных ошибках.",
				"Под капотом: единые источники для порядка, поиска, статистики и ссылок, один владелец DOM-контракта карточки, один переключатель оформления вместо трех копий, одна реализация карточки центра вместо двух.",
			],
			en: [
				"A \"Centers nearby\" page was added: the site detects your country and shows what is around, and if geolocation fails the country can be picked by hand.",
				"English versions of the posts and the service pages appeared.",
				"The home page gained the \"Link showcase\", \"Population\" and \"Search by geolocation\" sections.",
				"The footer was redone twice: first onto a Framer-style grid, then into a dark one with columns for recent centers, latest posts and contacts.",
				"The catalog grew: cards for Kazakhstan, Kyrgyzstan, Ukraine and Uzbekistan were refined, Russia was covered by clusters for Moscow and St Petersburg, the Volga region, the Urals, the South and Crimea, and 3 new cards were added by walking the link graph.",
				"Tatar centers in Uzbekistan got contacts and social links.",
				"The animation toggle was removed, fonts moved to the Astro Fonts API, and the country select got its own arrow.",
				"Astro was updated to 7.2.9 and incremental builds were enabled.",
				"A one-off importer of cards into VK was written: a hashtag footer with geography and category, a canonical URL, and a queue that stops on fatal errors.",
				"Under the hood: single sources for ordering, search, statistics and links, one owner of the card DOM contract, one appearance switcher instead of three copies, and one center card implementation instead of two.",
			],
		},
	},
	{
		date: "2026-08-20",
		title: {
			ru: "Темная тема по умолчанию, монохромный «Дефолт», удаление разделов",
			en: "Dark theme by default, a monochrome \"Default\", and sections removed",
		},
		items: {
			ru: [
				"Темная тема стала темой по умолчанию, главная кнопка - градиентной, движение в интерфейсе стало тише.",
				"Палитра «Дефолт» стала монохромной, кольцо у карточки убрано.",
				"Ссылки в тексте стали синими, одним тоном во всех пресетах; подвалу вернули нейтральные ссылки.",
				"Удалены разделы «Сабантуй» и «Проекты» вместе с выпадающим меню «Интересное».",
				"Темная бумага пресета green затонирована в зеленый.",
				"Добавлен генератор PDF со всеми палитрами и темами.",
				"Каталог переведен на общий компонент и обычную страницу вместо постраничного роутинга.",
				"Соц-ссылки в тексте перестали получать плашку при наведении, цитаты переделаны.",
				"Убраны мертвые данные стран, метрика ужата.",
				"Проверка запретов в постах переведена на машинный хук; вернулись скиллы бренда и документация проекта.",
			],
			en: [
				"The dark theme became the default, the main button turned into a gradient, and the motion in the interface got quieter.",
				"The \"Default\" palette went monochrome and the ring around the card was removed.",
				"Links inside text turned blue, one tone across every preset, while the footer got neutral links back.",
				"The \"Sabantuy\" and \"Projects\" sections were removed along with the \"Interesting\" dropdown.",
				"The dark paper of the green preset was tinted green.",
				"A PDF generator with every palette and theme was added.",
				"The catalog moved to a shared component and a plain page instead of paginated routing.",
				"Social links inside text stopped getting a plate on hover, and blockquotes were redone.",
				"Dead country data was removed and the analytics script was slimmed down.",
				"Post rule checks moved to a machine hook, and the brand skills and project documentation came back.",
			],
		},
	},
	{
		date: "2026-08-19",
		title: {
			ru: "Markdown-версии страниц для языковых моделей",
			en: "Markdown versions of the pages for language models",
		},
		items: {
			ru: [
				"У главной появился markdown-двойник /index.md.",
				"У каждой карточки центра появилась markdown-версия, дубли заголовка убраны.",
				"Согласование форматов вынесено в функцию Cloudflare Pages: модель получает текст, браузер - обычную страницу.",
			],
			en: [
				"The home page got a markdown twin at /index.md.",
				"Every center card got a markdown version, and duplicate headings were cleaned up.",
				"Format negotiation moved into a Cloudflare Pages Function: a model gets the text, a browser gets the normal page.",
			],
		},
	},
	{
		date: "2026-08-17",
		title: {
			ru: "Градиентная метка на карточке центра",
			en: "A gradient mark on the center card",
		},
		items: {
			ru: ["В каталоге логотип на карточке центра заменен градиентной меткой."],
			en: ["In the catalog the logo on a center card was replaced with a gradient mark."],
		},
	},
	{
		date: "2026-08-16",
		title: {
			ru: "Страница проектов и отказ от буквы е с точками",
			en: "The projects page, and \"e\" instead of \"yo\"",
		},
		items: {
			ru: [
				"Добавлена карточка проекта TatarTelem, у карточек проектов появились логотипы.",
				"В списке остались только Burger Point и TatarTelem.",
				"Вместо списка иконок на странице проектов - минималистичный блок призыва.",
				"Во всем видимом тексте сайта буква е с точками заменена на обычную.",
				"В подвале подпись почты переведена в именительный падеж.",
			],
			en: [
				"A TatarTelem project card was added, and project cards got logos.",
				"Only Burger Point and TatarTelem were left in the list.",
				"The icon list on the projects page was replaced with a minimal call-to-action block.",
				"Across all visible text on the site the letter \"yo\" was replaced with \"e\".",
				"In the footer the email caption moved to the nominative case.",
			],
		},
	},
	{
		date: "2026-08-15",
		title: {
			ru: "Сетка проектов в четыре колонки",
			en: "A four-column projects grid",
		},
		items: {
			ru: ["Страница проектов перестроена: четыре колонки и минималистичные карточки."],
			en: ["The projects page was rebuilt: four columns and minimal cards."],
		},
	},
	{
		date: "2026-08-13",
		title: {
			ru: "Девять белых пятен каталога закрыты",
			en: "Nine blank spots in the catalog were closed",
		},
		items: {
			ru: [
				"Добавлены 9 карточек в странах, где не было ни одной: от Армении до Индии.",
				"Добавлены новые сообщества, интерфейс уточнен.",
				"Публичные подписи почты в карточках скрыты.",
			],
			en: [
				"9 cards were added in countries that had none: from Armenia to India.",
				"New communities were added and the interface was refined.",
				"Public email captions on cards were hidden.",
			],
		},
	},
	{
		date: "2026-08-12",
		title: {
			ru: "Страница «Статистика» и ревизия географии",
			en: "The \"Statistics\" page and a geography review",
		},
		items: {
			ru: [
				"Цифры каталога переехали с /centers на отдельную страницу /stats.",
				"52 зарубежные карточки получили город.",
				"Закрыты городские пробелы: Бохоники, Крушиняны, Варшава, Турку, Бурса.",
				"Ревизия пробелов в базе: ОАЭ, дедупликация, страны онлайн-проектов.",
				"Навигация перегруппирована: появилось выпадающее «Интересное», часть разделов ушла в подвал.",
			],
			en: [
				"The catalog numbers moved from /centers to a separate /stats page.",
				"52 foreign cards got a city.",
				"City-level gaps were closed: Bohoniki, Kruszyniany, Warsaw, Turku, Bursa.",
				"A review of the gaps in the data: the UAE, deduplication, and the countries of online projects.",
				"The navigation was regrouped: an \"Interesting\" dropdown appeared and some sections moved into the footer.",
			],
		},
	},
	{
		date: "2026-08-11",
		title: {
			ru: "Австралия в каталоге и большая партия исправлений",
			en: "Australia in the catalog and a large batch of fixes",
		},
		items: {
			ru: [
				"Добавлен Австралийский татарский форум «Курултай» и еще 4 карточки по Австралии, дубли убраны.",
				"Подключена Яндекс.Метрика отдельным компонентом, инлайн-скрипт темы стал устойчивее.",
				"Исправлены поиск по каталогу, устойчивость темы к localStorage и инварианты движения.",
				"Исправлены интеграции, sitemap, доступность, схемы данных и стили фокуса.",
				"Убраны ссылки на несуществующие английские страницы, markdown-ссылки перестали терять текст.",
			],
			en: [
				"The Australian Tatar Forum \"Qurultai\" and 4 more Australian cards were added, and duplicates removed.",
				"Yandex.Metrica was wired in as a separate component, and the inline theme script became more robust.",
				"Fixes to catalog search, theme resilience against localStorage, and motion invariants.",
				"Fixes to integrations, the sitemap, accessibility, data schemas and focus styles.",
				"Links to non-existent English pages were removed, and markdown links stopped losing their text.",
			],
		},
	},
	{
		date: "2026-08-10",
		title: {
			ru: "Посты о переводах и фильтрах",
			en: "Posts about translation and filters",
		},
		items: {
			ru: [
				"Опубликованы посты: гид по фильтрам каталога, статус английского перевода, новые акценты, страница сохраненных.",
				"Опубликован призыв искать переводчиков на татарский, казахский, башкирский и крымскотатарский.",
				"Опубликован гид по способам помочь с переводом: гитхаб, телеграм, почта, отдельный раздел про git.",
				"Добавлена карточка молодежного комитета татар и башкир Казахстана.",
			],
			en: [
				"Posts were published: a guide to the catalog filters, the status of the English translation, the new accents, and the saved page.",
				"A call went out for translators into Tatar, Kazakh, Bashkir and Crimean Tatar.",
				"A guide to helping with translation was published: GitHub, Telegram, email, and a separate section on git.",
				"A card for the youth committee of Tatars and Bashkirs of Kazakhstan was added.",
			],
		},
	},
	{
		date: "2026-08-09",
		title: {
			ru: "Сохраненные центры, иерархические фильтры и новые карточки",
			en: "Saved centers, hierarchical filters and new cards",
		},
		items: {
			ru: [
				"Добавлена страница «Сохраненные» и закладки на карточках центров.",
				"Фильтры каталога стали иерархическими, география нормализована.",
				"Внутри группы фильтров теперь одиночный выбор, все три типа показываются без «показать еще».",
				"На карточках вместо названий площадок - адреса, иконки и кнопка «Смотреть».",
				"У карточки появилось градиентное кольцо с бегущей дугой и быстрые ссылки, у тулбара - своя поверхность.",
				"Из тулбара убран голосовой поиск, полоса прокрутки у фильтров скрыта.",
			],
			en: [
				"A \"Saved\" page and bookmarks on center cards were added.",
				"Catalog filters became hierarchical and the geography was normalized.",
				"Inside a filter group the choice is now single, and all three types show without a \"show more\".",
				"Cards now show addresses, icons and a \"View\" button instead of platform names.",
				"The card got a gradient ring with a running arc and quick links, and the toolbar got its own surface.",
				"Voice search was removed from the toolbar and the filter scrollbar was hidden.",
			],
		},
	},
	{
		date: "2026-08-08",
		title: {
			ru: "Панель фильтров и токены поверхностей",
			en: "The filter panel and surface tokens",
		},
		items: {
			ru: [
				"Панель фильтров переехала под свою кнопку, мертвая пагинация убрана.",
				"Слипающиеся поверхности разведены, палитры разложены по файлам.",
				"Границы и кольцо выведены через color-mix, по образцу HeroUI v3.",
			],
			en: [
				"The filter panel moved under its own button and dead pagination was removed.",
				"Surfaces that blended into each other were separated, and palettes were split into files.",
				"Borders and rings are now derived with color-mix, following HeroUI v3.",
			],
		},
	},
	{
		date: "2026-08-07",
		title: {
			ru: "Три новых пресета акцента и радиус в пресете",
			en: "Three new accent presets and radius as part of a preset",
		},
		items: {
			ru: [
				"Добавлены пресеты красный, оранжевый и розовый.",
				"Радиус скруглений стал частью пресета акцента, последние сырые скругления переведены на шкалу.",
				"Марка логотипа переведена с WebGL-шейдера на svg-маску.",
				"Статистика каталога переведена в строку, без анимаций.",
			],
			en: [
				"Red, orange and pink presets were added.",
				"Corner radius became part of the accent preset, and the last raw radii moved onto the scale.",
				"The logo mark moved from a WebGL shader to an SVG mask.",
				"Catalog statistics moved into one line, without animations.",
			],
		},
	},
	{
		date: "2026-08-06",
		title: {
			ru: "Страницы постов и логотип LiquidMetal",
			en: "Post pages and the LiquidMetal logo",
		},
		items: {
			ru: [
				"Добавлены страницы постов /posts/[id].",
				"В логотипе появилась марка LiquidMetal, секции главной вынесены в компонент.",
				"Над героем главной появился бейдж новостей.",
				"Градиентные панели главной сменились атласом каталога и были возвращены обратно скриншотами.",
				"Цифры каталога перестали выглядеть кликабельными, число и подпись статистики встали в строку.",
				"Марка логотипа перестала сбрасывать анимацию между страницами.",
			],
			en: [
				"Post pages at /posts/[id] were added.",
				"The logo got a LiquidMetal mark, and the home sections moved into a component.",
				"A news badge appeared above the hero on the home page.",
				"The gradient panels on the home page were swapped for a catalog atlas and then reverted to screenshots.",
				"Catalog numbers stopped looking clickable, and the statistic and its caption moved onto one line.",
				"The logo mark stopped resetting its animation between pages.",
			],
		},
	},
	{
		date: "2026-08-05",
		title: {
			ru: "Читаемая глубина в темных темах",
			en: "Readable depth in the dark themes",
		},
		items: {
			ru: [
				"В темных темах поправлена глубина: поверхности стали различимы.",
				"В навигации раздел назван «Центры», на главной появились декоративные панели, печать стала монохромной.",
				"Иконки языков начали наследовать цвет текста.",
			],
			en: [
				"Depth in the dark themes was fixed so that surfaces became distinguishable.",
				"The nav section was renamed \"Centers\", the home page got decorative panels, and print went monochrome.",
				"Language icons began inheriting the text color.",
			],
		},
	},
	{
		date: "2026-08-03",
		title: {
			ru: "Печатная версия каталога",
			en: "A printable version of the catalog",
		},
		items: {
			ru: [
				"Добавлена печатная версия каталога центров.",
				"Темные палитры подстроены под акцент, тинт марки стал светлее.",
			],
			en: [
				"A printable version of the center catalog was added.",
				"Dark palettes were tuned to the accent and the mark tint got lighter.",
			],
		},
	},
	{
		date: "2026-08-02",
		title: {
			ru: "Переключатель анимаций и токенные панели",
			en: "An animation toggle and token panels",
		},
		items: {
			ru: [
				"В шапке появился переключатель анимаций.",
				"Скриншоты на главной заменены токенными панелями.",
				"Дизайн-система описана под темы, акценты и тумблер анимаций.",
			],
			en: [
				"An animation toggle appeared in the header.",
				"Screenshots on the home page were replaced with token panels.",
				"The design system was documented for themes, accents and the animation toggle.",
			],
		},
	},
	{
		date: "2026-08-01",
		title: {
			ru: "Темная тема, три акцентные палитры и татарские названия",
			en: "Dark theme, three accent palettes and Tatar names",
		},
		items: {
			ru: [
				"Добавлены темная тема, три акцентные палитры и единый стиль фокуса.",
				"Палитры получили татарские названия вместо названий цветов.",
				"Исправлены тени в темной теме, текст в темной теме и читаемость выпадающего меню тем.",
				"Реализация карты удалена, на /map оставлена заглушка.",
				"Ускорен каталог, доработано SEO карточек центров.",
			],
			en: [
				"A dark theme, three accent palettes and a single focus style were added.",
				"Palettes got Tatar names instead of color names.",
				"Fixes to shadows in the dark theme, text in the dark theme, and the readability of the theme dropdown.",
				"The map implementation was removed and /map was left as a stub.",
				"The catalog got faster and center card SEO was improved.",
			],
		},
	},
	{
		date: "2026-07-29",
		title: {
			ru: "Центры Пермского края",
			en: "Centers of Perm Krai",
		},
		items: {
			ru: ["Добавлено 10 карточек общественных центров Пермского края."],
			en: ["10 cards for community centers in Perm Krai were added."],
		},
	},
	{
		date: "2026-07-28",
		title: {
			ru: "Проекты, гайды для участников и русская лицензия",
			en: "Projects, contributor guides and a Russian license",
		},
		items: {
			ru: [
				"У карточек проектов появились цветные иконки и новая типографика, обновлен телеграм-хендл.",
				"Вместо мультифильтра на проектах - одиночный выбор категории.",
				"Добавлена русская версия лицензии на контент.",
				"Написаны полные гайды для участников: форк, локальная настройка, путь для новичка.",
			],
			en: [
				"Project cards got colored icons and new typography, and the Telegram handle was updated.",
				"The multi-filter on projects was replaced with a single category choice.",
				"A Russian version of the content license was added.",
				"Full contributor guides were written: forking, local setup, and a path for newcomers.",
			],
		},
	},
	{
		date: "2026-07-27",
		title: {
			ru: "Боковое мобильное меню, липкий хедер и дропдаун «Материалы»",
			en: "A side mobile menu, a sticky header and a \"Materials\" dropdown",
		},
		items: {
			ru: [
				"Мобильное меню стало боковым, с переключателем языка, и открывается под хедером, а не поверх него.",
				"Меню переехало вправо, логотип - влево, дубль переключателя языка убран.",
				"Хедер стал липким на мобильных, кнопка меню встала в поток хедера.",
				"На десктопе ссылки встали по центру хедера, появился дропдаун «Материалы».",
				"Меню получило ловушку фокуса, inert и уважение к reduced-motion.",
			],
			en: [
				"The mobile menu became a side drawer with a language switcher, and it opens below the header instead of over it.",
				"The menu moved to the right, the logo to the left, and the duplicate language switcher was removed.",
				"The header became sticky on mobile and the menu button moved into the header flow.",
				"On desktop the links moved to the center of the header and a \"Materials\" dropdown appeared.",
				"The menu got a focus trap, inert, and respect for reduced-motion.",
			],
		},
	},
	{
		date: "2026-07-26",
		title: {
			ru: "Переименование разделов и блок «Везде. Всегда. Для всех.»",
			en: "Sections renamed and the \"Everywhere. Always. For everyone.\" block",
		},
		items: {
			ru: [
				"Раздел /support переименован в /projects, подписи в навигации обновлены, активные ссылки хедера переделаны.",
				"Изменен текст главной кнопки, подвал почищен.",
				"Добавлен блок «Везде. Всегда. Для всех.» с переводами и живыми цифрами, доработаны анимации и сетка карточек.",
			],
			en: [
				"The /support section was renamed to /projects, nav labels were updated and the header's active states were redone.",
				"The main button copy changed and the footer was cleaned up.",
				"An \"Everywhere. Always. For everyone.\" block was added with translations and live numbers, along with animation and card grid work.",
			],
		},
	},
	{
		date: "2026-07-23",
		title: {
			ru: "Навигация и визуал главной",
			en: "Navigation and home page visuals",
		},
		items: {
			ru: ["Обновлены навигация сайта, визуал раздела поддержки и главной страницы."],
			en: ["The site navigation, the support section visuals and the home page were updated."],
		},
	},
	{
		date: "2026-07-18",
		title: {
			ru: "Кнопки в мобильном меню",
			en: "Buttons in the mobile menu",
		},
		items: {
			ru: ["Кнопки «Сабантуй» и «Поддержка» в мобильном меню снова стали активными."],
			en: ["The \"Sabantuy\" and \"Support\" buttons in the mobile menu became active again."],
		},
	},
	{
		date: "2026-07-16",
		title: {
			ru: "Крымскотатарские и башкирские центры, посты о проекте",
			en: "Crimean Tatar and Bashkir centers, posts about the project",
		},
		items: {
			ru: [
				"Добавлены крымскотатарские и башкирские центры, счетчик каталога стал общим.",
				"Опубликованы практические посты о проекте, обновлены контакты в посте о добавлении центра.",
				"Обновлен список проектов поддержки, доработаны запасные визуалы проектов и стиль карточек постов.",
			],
			en: [
				"Crimean Tatar and Bashkir centers were added and the catalog counter became shared.",
				"Practical posts about the project were published and the contacts in the center submission post were updated.",
				"The list of supported projects was updated, and project fallback visuals and post card styling were polished.",
			],
		},
	},
	{
		date: "2026-07-14",
		title: {
			ru: "Страницы проектов поддержки",
			en: "Support project pages",
		},
		items: {
			ru: ["Добавлены страницы проектов, которые поддерживает tatarverse."],
			en: ["Pages for the projects tatarverse supports were added."],
		},
	},
	{
		date: "2026-07-13",
		title: {
			ru: "Лента постов и раздел о совместной работе",
			en: "The post feed and a section on collaboration",
		},
		items: {
			ru: ["Улучшена лента постов, добавлен раздел о совместной работе над проектом."],
			en: ["The post feed was improved and a section on collaborating on the project was added."],
		},
	},
	{
		date: "2026-07-10",
		title: {
			ru: "Ускорение каталога и даты у материалов",
			en: "A faster catalog and dates on the content",
		},
		items: {
			ru: ["Каталог оптимизирован, у материалов появились даты публикации и обновления."],
			en: ["The catalog was optimized and content got publication and update dates."],
		},
	},
	{
		date: "2026-07-09",
		title: {
			ru: "Английские карточки и обогащенные профили центров",
			en: "English cards and enriched center profiles",
		},
		items: {
			ru: [
				"Профили центров обогащены, информация обновлена.",
				"Английские карточки переведены на нормальный английский, тип и категория остались на схеме русского каталога.",
				"Подсказка «Открыть в» в меню копирования переведена по языку страницы.",
			],
			en: [
				"Center profiles were enriched and their information updated.",
				"English cards were rewritten in proper English, while type and category stayed on the Russian catalog schema.",
				"The \"Open in\" prompt in the copy menu is now localized by page language.",
			],
		},
	},
	{
		date: "2026-07-08",
		title: {
			ru: "Мобильная карточка центра",
			en: "The mobile center card",
		},
		items: {
			ru: [
				"Исправлен адаптивный макет карточки центра.",
				"Поправлено выпадающее меню копирования на мобильных.",
			],
			en: [
				"The responsive layout of the center card was fixed.",
				"The copy dropdown on mobile was adjusted.",
			],
		},
	},
	{
		date: "2026-07-06",
		title: {
			ru: "RSS и временное удаление постов",
			en: "RSS and a temporary removal of the posts page",
		},
		items: {
			ru: ["Добавлены метаданные RSS, страница постов на время убрана."],
			en: ["RSS metadata was added and the posts page was temporarily removed."],
		},
	},
	{
		date: "2026-07-05",
		title: {
			ru: "Страница поддержки и типографика героя",
			en: "The support page and hero typography",
		},
		items: {
			ru: [
				"Добавлена страница поддержки и карточки героя с подсветкой флага.",
				"Доработана типографика героя, шрифты стали предзагружаться.",
			],
			en: [
				"A support page and hero cards with a flag glow were added.",
				"Hero typography was refined and fonts began preloading.",
			],
		},
	},
	{
		date: "2026-07-02",
		title: {
			ru: "Пост о телеграм-канале и страница сабантуя",
			en: "A post about the Telegram channel and a Sabantuy page",
		},
		items: {
			ru: [
				"Опубликован пост о телеграм-канале, в ленте заработал markdown, добавлена страница сабантуя.",
				"Добавлена карточка молодежной организации «Чак-Чак» Пермского края.",
			],
			en: [
				"A post about the Telegram channel was published, markdown started rendering in the feed, and a Sabantuy page was added.",
				"A card for the \"Chak-Chak\" youth organization of Perm Krai was added.",
			],
		},
	},
	{
		date: "2026-06-28",
		title: {
			ru: "Дизайн-система под брендовую главную",
			en: "A design system for a branded home page",
		},
		items: {
			ru: ["Дизайн-система расширена под брендовый слой главной страницы."],
			en: ["The design system was expanded for the branded layer of the home page."],
		},
	},
	{
		date: "2026-06-27",
		title: {
			ru: "SEO и PWA",
			en: "SEO and PWA",
		},
		items: {
			ru: ["Исправлены замечания SEO-ревью, доработаны тулбар и настройки PWA."],
			en: ["The findings of an SEO review were fixed, and the toolbar and PWA settings were refined."],
		},
	},
	{
		date: "2026-06-25",
		title: {
			ru: "Подробные карточки центров",
			en: "Detailed center cards",
		},
		items: {
			ru: ["Страницы центров и тулбар каталога стали содержательнее."],
			en: ["Center pages and the catalog toolbar got richer."],
		},
	},
	{
		date: "2026-06-23",
		title: {
			ru: "Статистика и градиенты по странам",
			en: "Statistics and per-country gradients",
		},
		items: {
			ru: ["В каталоге появились статистика и градиенты по странам, тулбар переписан."],
			en: ["The catalog gained statistics and per-country gradients, and the toolbar was rewritten."],
		},
	},
	{
		date: "2026-06-19",
		title: {
			ru: "Главная, статус перевода и высота героя",
			en: "The home page, translation status and hero height",
		},
		items: {
			ru: [
				"Обновлены визуал главной и статус перевода.",
				"Высота секции героя стала адаптивной.",
				"Документация для участников уточнена по локалям и охвату контента.",
			],
			en: [
				"The home page visuals and the translation status were updated.",
				"The hero section height became responsive.",
				"Contributor documentation was clarified on locales and content scope.",
			],
		},
	},
	{
		date: "2026-06-18",
		title: {
			ru: "Контент и обработка локалей",
			en: "Content and locale handling",
		},
		items: {
			ru: [
				"Уточнены тексты проекта и обработка локалей.",
				"Четвертая строка героя на главной скрыта.",
			],
			en: [
				"Project copy and locale handling were refined.",
				"The fourth hero line on the home page was hidden.",
			],
		},
	},
	{
		date: "2026-05-29",
		title: {
			ru: "Герой каталога и мета карточек",
			en: "The catalog hero and card metadata",
		},
		items: {
			ru: ["Доработаны шапка каталога и метаданные карточек центров."],
			en: ["The catalog hero and the metadata of center cards were refined."],
		},
	},
	{
		date: "2026-05-25",
		title: {
			ru: "Карточки центров стали ссылками",
			en: "Center cards became links",
		},
		items: {
			ru: [
				"Карточки центров переделаны в ссылки, доступные для поиска.",
				"Бегущая строка со словами переехала в ассеты.",
			],
			en: [
				"Center cards were rebuilt as searchable links.",
				"The word marquee image moved into the assets.",
			],
		},
	},
	{
		date: "2026-05-24",
		title: {
			ru: "Ссылки на правку и чистка зависимостей",
			en: "Edit links and a dependency cleanup",
		},
		items: {
			ru: [
				"Исправлены локализованные ссылки на правку в GitHub.",
				"Обновлены документация, иконки и настройки предзагрузки.",
				"Убраны неиспользуемые зависимости, заголовок героя стал компактнее.",
			],
			en: [
				"Localized GitHub edit links were fixed.",
				"Documentation, icons and prefetch settings were updated.",
				"Unused dependencies were removed and the hero title got tighter.",
			],
		},
	},
	{
		date: "2026-05-17",
		title: {
			ru: "Деплой на Cloudflare Pages",
			en: "Deploy to Cloudflare Pages",
		},
		items: {
			ru: [
				"Сайт подготовлен к деплою на Cloudflare Pages, добавлены превью-конфиг и динамические метаданные.",
				"С главной убраны анимации и анимация хедера.",
			],
			en: [
				"The site was prepared for deploying to Cloudflare Pages, with a preview config and dynamic metadata.",
				"Home page motion and the header animation were removed.",
			],
		},
	},
	{
		date: "2026-05-15",
		title: {
			ru: "Типы стека и иконки SVGL",
			en: "Stack typings and SVGL icons",
		},
		items: {
			ru: ["Уточнены типы блока технологий, добавлены иконки SVGL."],
			en: ["The tech stack typings were refined and SVGL icons were added."],
		},
	},
	{
		date: "2026-05-14",
		title: {
			ru: "Адреса карточек tbk и лицензии в меню",
			en: "tbk card routes and licenses in the menu",
		},
		items: {
			ru: [
				"Файлы центров переименованы под адреса вида tbk-…",
				"В мобильное меню добавлены ссылки на лицензии.",
				"Добавлен ключ перевода для кнопки копирования адреса.",
			],
			en: [
				"Center files were renamed to tbk-style routes.",
				"License links were added to the mobile menu.",
				"A translation key for the copy URL button was added.",
			],
		},
	},
	{
		date: "2026-05-09",
		title: {
			ru: "Большая загрузка каталога",
			en: "A large catalog import",
		},
		items: {
			ru: ["В репозиторий загружена основная часть карточек центров."],
			en: ["The bulk of the center cards was loaded into the repository."],
		},
	},
	{
		date: "2026-04-19",
		title: {
			ru: "Начало проекта",
			en: "The project begins",
		},
		items: {
			ru: ["Первый коммит: каркас сайта и первые карточки центров."],
			en: ["The first commit: the site skeleton and the first center cards."],
		},
	},
];
