import { getCenterMarkHue } from "@/lib/center/centers";
import { clearSaved, onSavedChange, readSaved, removeSaved } from "@/lib/scripts/savedCenters";
import { CARD_ATTR, CARD_PART, closestCard, readCard } from "@/lib/site/cardAttributes";

/**
 * Страница `/saved`: рисует карточки из localStorage по заготовке `CardItem`
 * в `<template>`. Своей разметки карточки у страницы нет — правка дизайна
 * каталога доезжает сюда сама.
 */
export function initSavedPage() {
	const grid = document.querySelector<HTMLElement>("[data-saved-grid]");
	const empty = document.querySelector<HTMLElement>("[data-saved-empty]");
	const summary = document.querySelector<HTMLElement>("[data-saved-summary]");
	const clearButton = document.querySelector<HTMLButtonElement>("[data-saved-clear]");
	const template = document.querySelector<HTMLTemplateElement>("[data-saved-card]");

	if (!grid || !empty || !summary || !template) return;

	const dateFormat = new Intl.DateTimeFormat("ru", { month: "short", year: "numeric" });

	const strings = {
		count: summary.dataset.count ?? "",
		confirm: summary.dataset.confirm ?? "",
		remove: summary.dataset.remove ?? "",
	};

	/** Пустую часть прячем: иначе остаются висящие разделители и чипы. */
	const fill = (root: ParentNode, part: keyof typeof CARD_PART, value: string) => {
		const node = root.querySelector<HTMLElement>(`[${CARD_PART[part]}]`);
		if (!node) return;

		node.textContent = value;
		node.hidden = value.length === 0;
	};

	const formatDate = (value: string) => {
		if (!value) return "";

		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? "" : dateFormat.format(date);
	};

	const render = () => {
		const list = readSaved().sort((a, b) => b.savedAt - a.savedAt);

		summary.textContent = strings.count.replace("{count}", String(list.length));
		empty.hidden = list.length > 0;
		grid.hidden = list.length === 0;
		if (clearButton) clearButton.hidden = list.length === 0;

		const fragment = document.createDocumentFragment();

		for (const item of list) {
			const node = template.content.cloneNode(true) as DocumentFragment;
			const article = node.querySelector<HTMLElement>(`[${CARD_ATTR.id}]`);
			const link = node.querySelector<HTMLAnchorElement>(`[${CARD_PART.link}]`);
			if (!article || !link) continue;

			article.setAttribute(CARD_ATTR.id, item.id);

			node
				.querySelector<HTMLElement>(`[${CARD_PART.mark}]`)
				?.style.setProperty("--mark-hue", String(getCenterMarkHue(item.id)));

			link.href = item.href;
			link.textContent = item.title;

			const deleteButton = node.querySelector<HTMLElement>("[data-saved-delete]");
			if (deleteButton) {
				const label = item.title ? `${strings.remove}: ${item.title}` : strings.remove;
				deleteButton.setAttribute("aria-label", label);
				deleteButton.setAttribute("title", label);
			}

			fill(node, "flag", item.flag);
			fill(node, "city", item.city);
			fill(node, "country", item.country);
			fill(node, "summary", item.summary);
			fill(node, "category", item.category);
			fill(node, "type", item.type);
			fill(node, "date", formatDate(item.pubDate));

			const separator = node.querySelector<HTMLElement>(`[${CARD_PART.separator}]`);
			if (separator) separator.hidden = !(item.city && item.country);

			const hasLocation = Boolean(item.flag || item.city || item.country);
			const location = node.querySelector<HTMLElement>(`[${CARD_PART.location}]`);
			if (location) location.hidden = !hasLocation;

			// Без строки расположения заголовок сам обходит кнопку удаления.
			const heading = node.querySelector<HTMLElement>(`[${CARD_PART.heading}]`);
			if (heading) heading.classList.toggle("pr-24", !hasLocation);

			fragment.append(node);
		}

		grid.replaceChildren(fragment);
	};

	clearButton?.addEventListener("click", () => {
		if (!confirm(strings.confirm)) return;

		clearSaved();
	});

	grid.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const button = target.closest<HTMLElement>("[data-saved-delete]");
		if (!button) return;

		event.preventDefault();

		const card = closestCard(button);
		const id = card && readCard(card).id;
		if (id) removeSaved(id);
	});

	onSavedChange(render);
	render();
}
