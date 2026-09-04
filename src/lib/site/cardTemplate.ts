import { getCenterMarkHue } from "@/lib/center/centers";
import { CARD_ATTR, CARD_PART, cardDataset, type CardFields } from "@/lib/site/cardAttributes";

/**
 * Операция «данные карточки + заготовка → готовый узел» — единственное
 * объявление.
 *
 * `cardAttributes` закрывает *имена* контракта, но не саму операцию: раньше
 * заполнение заготовки было переписано дважды — на `/saved` и на `/nearby`, —
 * и копии успели разойтись. Одна прятала строку расположения целиком, вторая
 * нет; одна форматировала дату по локали страницы, вторая по захардкоженной
 * «ru»; обе правили Tailwind-классы, выбранные в `CardItem.astro`.
 *
 * Теперь расхождение невозможно: заполняет одно место, а различия страниц
 * приезжают параметрами. Кнопку действия модуль не трогает — она у страниц
 * разная по смыслу («удалить» против «сохранить»), и знание о ней принадлежит
 * странице, а не карточке.
 *
 * Модуль попадает в клиентский бандл: никаких Node-зависимостей.
 */

/**
 * Класс отступа под кнопку в углу. Его выбирает `CardItem.astro` и объявляет
 * прямо в заготовке: имя утилитарного класса не должно существовать в
 * клиентском скрипте, иначе переименование в разметке снова начнёт ломать
 * вёрстку молча.
 */
export const CARD_RESERVE_ATTR = "data-card-reserve";

export interface FillCardOptions {
	/** Локаль для `Intl`. Модуль не выясняет её сам: см. `AGENTS.md`, i18n. */
	locale: string;
	/**
	 * Адрес, по которому карточка открывается. Отличается от канонического
	 * `fields.href`: с префиксом локали и слешем на конце.
	 */
	linkHref: string;
}

/** Пустую часть прячем: иначе остаются висящие разделители и чипы. */
function fillPart(root: ParentNode, part: keyof typeof CARD_PART, value: string) {
	const node = root.querySelector<HTMLElement>(`[${CARD_PART[part]}]`);
	if (!node) return;

	node.textContent = value;
	node.hidden = value.length === 0;
}

function formatDate(value: string, locale: string) {
	if (!value) return "";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";

	return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(date);
}

/**
 * Клонирует заготовку и подставляет значения. Возвращает `null`, если в
 * заготовке нет карточки или ссылки — подставлять тогда некуда.
 */
export function fillCard(
	template: HTMLTemplateElement,
	fields: CardFields,
	options: FillCardOptions,
): DocumentFragment | null {
	const node = template.content.cloneNode(true) as DocumentFragment;
	const article = node.querySelector<HTMLElement>(`[${CARD_ATTR.id}]`);
	const link = node.querySelector<HTMLAnchorElement>(`[${CARD_PART.link}]`);
	if (!article || !link) return null;

	// Полный набор атрибутов, а не один id: с него читает кнопка «сохранить»,
	// и без него в localStorage уехала бы пустая карточка.
	for (const [name, value] of Object.entries(cardDataset(fields))) {
		article.setAttribute(name, value);
	}

	article
		.querySelector<HTMLElement>(`[${CARD_PART.mark}]`)
		?.style.setProperty("--mark-hue", String(getCenterMarkHue(fields.id)));

	link.href = options.linkHref;
	link.textContent = fields.title;

	fillPart(node, "flag", fields.flag);
	fillPart(node, "city", fields.city);
	fillPart(node, "country", fields.country);
	fillPart(node, "summary", fields.summary);
	fillPart(node, "category", fields.category);
	fillPart(node, "type", fields.type);
	fillPart(node, "date", formatDate(fields.pubDate, options.locale));

	const separator = article.querySelector<HTMLElement>(`[${CARD_PART.separator}]`);
	if (separator) separator.hidden = !(fields.city && fields.country);

	const hasLocation = Boolean(fields.flag || fields.city || fields.country);
	const location = article.querySelector<HTMLElement>(`[${CARD_PART.location}]`);
	if (location) location.hidden = !hasLocation;

	// Без строки расположения заголовок сам обходит кнопку в углу — тем
	// отступом, который заготовка объявила в `data-card-reserve`.
	const reserve = article.getAttribute(CARD_RESERVE_ATTR);
	const heading = article.querySelector<HTMLElement>(`[${CARD_PART.heading}]`);
	if (reserve && heading) heading.classList.toggle(reserve, !hasLocation);

	return node;
}
