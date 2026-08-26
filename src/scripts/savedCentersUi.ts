
import { onSavedChange, readSaved, toggleSaved, type SavedCenter } from "@/scripts/savedCenters";

let initialized = false;

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

function syncCounters(count: number) {
	for (const node of document.querySelectorAll<HTMLElement>("[data-saved-count]")) {
		node.textContent = count > 99 ? "99+" : String(count);
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

		
		
		event.preventDefault();
		event.stopPropagation();

		const snapshot = readCardSnapshot(button);
		if (!snapshot) return;

		toggleSaved(snapshot);
	});

	onSavedChange(sync);
	sync();
}
