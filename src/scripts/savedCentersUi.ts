/**
 * Живая часть «Сохранённых»: кнопка-закладка на карточках и счётчик в шапке.
 *
 * Один делегированный слушатель на document вместо слушателя на каждой из 340
 * кнопок каталога, и одна синхронизация состояния по событию хранилища —
 * поэтому карточка, снятая на /saved, гаснет и в шапке, и в другой вкладке.
 */

import { onSavedChange, readSaved, toggleSaved, type SavedCenter } from "@/scripts/savedCenters";

let initialized = false;

/**
 * Снимок собирается с карточки, а не из атрибутов кнопки: те же строки уже
 * лежат на `<article data-search-id>` ради поиска и фильтров.
 */
function readCardSnapshot(button: HTMLElement): Omit<SavedCenter, "savedAt"> | null {
	const card = button.closest<HTMLElement>("[data-search-id]");
	const id = card?.dataset.searchId;
	if (!card || !id) return null;

	return {
		id,
		href: card.dataset.href ?? "",
		title: card.dataset.title ?? "",
		summary: card.dataset.summary ?? "",
		type: card.dataset.type ?? "",
		category: card.dataset.category ?? "",
		city: card.dataset.city ?? "",
		country: card.dataset.country ?? "",
		flag: card.dataset.flag ?? "",
		pubDate: card.dataset.pubDate ?? "",
	};
}

function syncButtons(savedIds: Set<string>) {
	for (const button of document.querySelectorAll<HTMLElement>("[data-save-center]")) {
		const id = button.closest<HTMLElement>("[data-search-id]")?.dataset.searchId;
		if (!id) continue;

		const active = savedIds.has(id);
		const label = active ? button.dataset.labelRemove : button.dataset.labelSave;

		button.setAttribute("aria-pressed", String(active));
		if (label) {
			button.setAttribute("aria-label", label);
			button.setAttribute("title", label);
		}
	}
}

/**
 * Счётчик рисуется как «(N)» и целиком исчезает на нуле: пустые скобки рядом с
 * закладкой читаются как сломанная разметка, а не как «ничего не сохранено».
 */
function syncCounters(count: number) {
	for (const node of document.querySelectorAll<HTMLElement>("[data-saved-count]")) {
		node.textContent = `(${count})`;
		node.hidden = count === 0;
	}
}

function sync() {
	const list = readSaved();
	syncButtons(new Set(list.map((item) => item.id)));
	syncCounters(list.length);
}

export function initSavedCenters() {
	if (initialized) return;
	initialized = true;

	document.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const button = target.closest<HTMLElement>("[data-save-center]");
		if (!button) return;

		// Карточка целиком — ссылка на страницу центра (растянутый
		// псевдоэлемент), поэтому клик по закладке обязан остановиться здесь.
		event.preventDefault();
		event.stopPropagation();

		const snapshot = readCardSnapshot(button);
		if (!snapshot) return;

		toggleSaved(snapshot);
	});

	onSavedChange(sync);
	sync();
}
