import { getCountryLabel } from "@/data/worldCountries";
import { clearSaved, onSavedChange, readSaved, removeSaved } from "@/lib/scripts/savedCenters";
import { closestCard, readCard } from "@/lib/site/cardAttributes";
import { fillCard } from "@/lib/site/cardTemplate";

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

	// Локаль страницы, а не «ru»: на /en/saved по-русски выводились и даты, и
	// названия стран, хотя в localStorage лежит канон, а не подпись.
	const locale = document.documentElement.lang === "en" ? "en" : "ru";

	const strings = {
		count: summary.dataset.count ?? "",
		confirm: summary.dataset.confirm ?? "",
		remove: summary.dataset.remove ?? "",
	};

	const render = () => {
		const list = readSaved().sort((a, b) => b.savedAt - a.savedAt);

		summary.textContent = strings.count.replace("{count}", String(list.length));
		empty.hidden = list.length > 0;
		grid.hidden = list.length === 0;
		if (clearButton) clearButton.hidden = list.length === 0;

		const fragment = document.createDocumentFragment();

		for (const item of list) {
			const node = fillCard(
				template,
				{
					id: item.id,
					scope: "",
					macro: "",
					okrug: "",
					country: getCountryLabel(item.country, locale),
					region: "",
					city: item.city,
					type: item.type,
					category: item.category,
					title: item.title,
					summary: item.summary,
					flag: item.flag,
					pubDate: item.pubDate,
					href: item.href,
				},
				{ locale, linkHref: item.href },
			);
			if (!node) continue;

			const deleteButton = node.querySelector<HTMLElement>("[data-saved-delete]");
			if (deleteButton) {
				const label = item.title ? `${strings.remove}: ${item.title}` : strings.remove;
				deleteButton.setAttribute("aria-label", label);
				deleteButton.setAttribute("title", label);
			}

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
