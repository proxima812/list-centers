/**
 * Выпадающие подсказки под строкой поиска.
 *
 * Самостоятельный комбобокс: владеет своим списком, подсветкой и ARIA
 * (`aria-expanded`, `aria-activedescendant`, `aria-selected`). Наружу отдаёт
 * одно событие — «выбрали значение».
 */

const OPTION_CLASS =
	"cursor-pointer rounded-control px-3 py-2 text-surface-foreground transition hover:bg-muted aria-selected:bg-muted";

export interface SearchSuggestions {
	show(values: string[]): void;
	hide(): void;
	/** Сдвиг подсветки с закольцовыванием. Возвращает `true`, если список открыт. */
	move(step: number): boolean;
	/** Значение под подсветкой или `null`, если ничего не выбрано. */
	active(): string | null;
}

export function createSearchSuggestions(
	list: HTMLUListElement | null,
	input: HTMLInputElement | null,
	onCommit: (value: string) => void,
): SearchSuggestions {
	let values: string[] = [];
	let activeIndex = -1;

	function hide() {
		if (!list || !input) return;

		list.classList.add("hidden");
		list.replaceChildren();
		input.setAttribute("aria-expanded", "false");
		input.removeAttribute("aria-activedescendant");
		activeIndex = -1;
		values = [];
	}

	function highlight(index: number) {
		if (!list || !input) return;

		activeIndex = index;
		[...list.children].forEach((child, position) => {
			child.setAttribute("aria-selected", String(position === activeIndex));
		});
		input.setAttribute("aria-activedescendant", `search-suggestion-${activeIndex}`);
	}

	return {
		show(next) {
			if (!list || !input) return;
			if (next.length === 0) {
				hide();
				return;
			}

			values = next;
			activeIndex = -1;
			list.replaceChildren();

			next.forEach((value, index) => {
				const option = document.createElement("li");
				option.id = `search-suggestion-${index}`;
				option.role = "option";
				option.dataset.searchSuggestion = value;
				option.className = OPTION_CLASS;
				option.textContent = value;
				// mousedown, а не click: click прилетает уже после blur поля,
				// когда список успевает закрыться.
				option.addEventListener("mousedown", (event) => {
					event.preventDefault();
					onCommit(value);
				});
				list.append(option);
			});

			list.classList.remove("hidden");
			input.setAttribute("aria-expanded", "true");
		},

		hide,

		move(step) {
			if (values.length === 0) return false;

			const last = values.length - 1;
			const next = activeIndex + step;
			highlight(next < 0 ? last : next > last ? 0 : next);

			return true;
		},

		active: () => (activeIndex >= 0 ? (values[activeIndex] ?? null) : null),
	};
}
