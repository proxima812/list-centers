/**
 * Фильтр стран на `/centers/print`: прячет группы, которые не пойдут на
 * бумагу, и держит счётчик в актуальном состоянии. Пустой набор — печатаем
 * всё, поэтому «Все страны» это не отдельный режим, а очистка выбора.
 */
export function initPrintCatalog() {
	const printButton = document.querySelector<HTMLButtonElement>("[data-print-button]");
	const allButton = document.querySelector<HTMLButtonElement>("[data-print-all]");
	const countryButtons = Array.from(
		document.querySelectorAll<HTMLButtonElement>("[data-print-country]"),
	);
	const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-print-group]"));
	const summary = document.querySelector<HTMLElement>("[data-print-summary]");

	const selected = new Set<string>();

	function setActive(button: HTMLButtonElement, active: boolean) {
		button.toggleAttribute("data-active", active);
		button.setAttribute("aria-pressed", String(active));
	}

	function render() {
		let visibleCount = 0;

		for (const group of groups) {
			const country = group.dataset.printGroup ?? "";
			const visible = selected.size === 0 || selected.has(country);
			group.hidden = !visible;
			if (visible) {
				visibleCount += group.querySelectorAll("li").length;
			}
		}

		for (const button of countryButtons) {
			setActive(button, selected.has(button.dataset.printCountry ?? ""));
		}

		if (allButton) {
			setActive(allButton, selected.size === 0);
		}

		if (summary) {
			summary.textContent = (summary.dataset.template ?? "").replace(
				"{count}",
				String(visibleCount),
			);
		}
	}

	printButton?.addEventListener("click", () => {
		window.print();
	});

	allButton?.addEventListener("click", () => {
		selected.clear();
		render();
	});

	for (const button of countryButtons) {
		button.addEventListener("click", () => {
			const country = button.dataset.printCountry ?? "";
			if (selected.has(country)) {
				selected.delete(country);
			} else {
				selected.add(country);
			}
			render();
		});
	}

	render();
}
