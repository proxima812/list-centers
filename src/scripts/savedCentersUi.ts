import { closestCard, readCard } from "@/dom/cardAttributes";
import { onSavedChange, readSaved, toggleSaved, type SavedCenter } from "@/scripts/savedCenters";

let initialized = false;

function readCardSnapshot(button: HTMLElement): Omit<SavedCenter, "savedAt"> | null {
	const card = closestCard(button);
	if (!card) return null;

	const { id, href, title, summary, type, category, city, country, flag, pubDate } =
		readCard(card);

	return id ? { id, href, title, summary, type, category, city, country, flag, pubDate } : null;
}

function syncButtons(savedIds: Set<string>) {
	for (const button of document.querySelectorAll<HTMLElement>("[data-save-center]")) {
		const card = closestCard(button);
		const id = card && readCard(card).id;
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

function syncCounters(count: number) {
	for (const node of document.querySelectorAll<HTMLElement>("[data-saved-count]")) {
		node.textContent = count > 99 ? "99+" : String(count);
		node.hidden = count === 0;
	}
}

/**
 * Привести кнопки и счётчики к тому, что лежит в хранилище.
 *
 * Наружу это нужно страницам, которые добавляют карточки уже после
 * загрузки: делегированный обработчик кликов подхватит их сам, а вот
 * `aria-pressed` у новых кнопок остался бы от заготовки, и сохранённая
 * карточка выглядела бы несохранённой.
 */
export function syncSavedCenters() {
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

		
		
		event.preventDefault();
		event.stopPropagation();

		const snapshot = readCardSnapshot(button);
		if (!snapshot) return;

		toggleSaved(snapshot);
	});

	onSavedChange(syncSavedCenters);
	syncSavedCenters();
}
