import { CARD_ATTR, isFacetField, readCard } from "@/dom/cardAttributes";
import { normalizeSearchText, uniqueTerms } from "@/domain/center/searchText";
import { createCatalogFilter } from "@/features/catalog/filterState";
import { readCatalogQuery, writeCatalogQuery } from "@/features/catalog/query";
import { createCenterSearch } from "@/features/catalog/search";
import { createSearchSuggestions } from "@/features/catalog/suggestions";
import type {
	CardIndexItem,
	CenterScope,
	FacetKey,
	FilterGate,
} from "@/features/catalog/types";

/**
 * Вид каталога: читает разметку, слушает события, показывает результат.
 *
 * Решения принимаются не здесь. Что показать — считает `filterState`, в каком
 * порядке — `search`, что положить в адрес — `query`, как вести себя списку
 * подсказок — `suggestions`. Этот файл переводит их ответы в DOM и обратно.
 */

const SEARCH_DEBOUNCE_MS = 150;
/** Клик по подсказке приходит после blur — даём ему успеть. */
const SUGGESTION_BLUR_DELAY_MS = 120;
const MIN_SUGGESTION_QUERY = 2;
const MAX_SUGGESTIONS = 6;
const SUGGESTION_SOURCE_LIMIT = 8;

const TOKEN_CLASS =
	"group inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-sm font-medium text-primary-foreground transition hover:bg-primary/85";

export function initCardsToolbar() {
	const gridElement = document.getElementById("cards-grid");
	const noResultsElement = document.getElementById("no-results");
	if (!gridElement || !noResultsElement) return;

	// Связываем после проверки: внутрь замыканий сужение типа не проходит.
	const cardsGrid = gridElement;
	const noResults = noResultsElement;

	const searchForm = document.querySelector<HTMLFormElement>("[data-search-form]");
	const searchInput = document.querySelector<HTMLInputElement>("[data-toolbar-search]");
	const suggestionList = document.querySelector<HTMLUListElement>("[data-search-suggestions]");
	const searchSubmit = document.querySelector<HTMLButtonElement>("[data-search-submit]");
	const searchClear = document.querySelector<HTMLButtonElement>("[data-search-clear]");
	const filtersToggle = document.querySelector<HTMLButtonElement>("[data-filters-toggle]");
	const filtersShell = document.querySelector<HTMLElement>("[data-filters-shell]");
	const filtersPanel = document.getElementById("filters-panel");
	const filtersBadge = document.querySelector<HTMLElement>("[data-filters-badge]");
	const filtersResetButtons =
		document.querySelectorAll<HTMLButtonElement>("[data-filters-reset]");
	const stickyBar = document.querySelector<HTMLElement>("[data-catalog-bar]");
	const activeFiltersBar = document.querySelector<HTMLElement>("[data-active-filters-bar]");
	const activeFiltersTokens = document.querySelector<HTMLElement>(
		"[data-active-filters-tokens]",
	);
	const resultsCount = document.querySelector<HTMLElement>("[data-results-count]");
	const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-filter-section]"));
	const groupElements = Array.from(
		document.querySelectorAll<HTMLElement>("[data-filter-group]"),
	);
	const scopeGroup = document.querySelector<HTMLElement>("[data-scope-group]");
	const scopeButtons = Array.from(
		document.querySelectorAll<HTMLButtonElement>("[data-scope-value]"),
	);
	const scopeAllButton = document.querySelector<HTMLButtonElement>("[data-scope-all]");

	const facetKeys: FacetKey[] = groupElements
		.map((group) => group.dataset.filterGroup ?? "")
		.filter(Boolean);

	// --- разметка -> модель -------------------------------------------------

	const cards: CardIndexItem[] = Array.from(
		cardsGrid.querySelectorAll<HTMLElement>(`:scope > [${CARD_ATTR.id}]`),
	).map((element, order) => {
		const fields = readCard(element);
		const { country, type, category, region, title, summary, city } = fields;
		const facets: Record<FacetKey, string> = {};
		for (const key of facetKeys) facets[key] = isFacetField(key) ? fields[key] : "";

		return {
			id: fields.id || String(order),
			element,
			scope: fields.scope as CenterScope,
			facets,
			country,
			type,
			category,
			region,
			title,
			summary,
			city,
			order,
			terms: uniqueTerms([title, city, country, region, category]),
			searchText: normalizeSearchText(
				`${title} ${summary} ${city} ${country} ${type} ${category} ${region}`,
			),
		};
	});

	const filter = createCatalogFilter(cards, facetKeys);
	const search = createCenterSearch(cards, searchForm?.dataset.searchIndexUrl);

	let searchQuery = "";
	let searchTimer = 0;
	let blurTimer = 0;
	let filterFrame = 0;
	/** Поиск переставляет карточки; после сброса порядок надо вернуть один раз. */
	let gridReordered = false;

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const isDesktopLayout = window.matchMedia("(min-width: 1024px)");

	// --- доступ к разметке фильтров ----------------------------------------

	const groupChips = (key: FacetKey) =>
		Array.from(document.querySelectorAll<HTMLButtonElement>(`[data-filter-chip="${key}"]`));
	const allChip = (key: FacetKey) =>
		document.querySelector<HTMLButtonElement>(`[data-filter-all="${key}"]`);
	const moreButton = (key: FacetKey) =>
		document.querySelector<HTMLButtonElement>(`[data-filter-more="${key}"]`);
	const groupLimit = (key: FacetKey) =>
		Number(
			groupElements.find((element) => element.dataset.filterGroup === key)?.dataset
				.filterLimit ?? 0,
		);
	const allowedValues = (key: FacetKey) =>
		new Set(groupChips(key).map((chip) => chip.dataset.filterValue ?? "").filter(Boolean));

	// --- рендер -------------------------------------------------------------

	function scrollBehavior(): ScrollBehavior {
		const motionOff = document.documentElement.dataset.motion === "off";
		return motionOff || prefersReducedMotion.matches ? "auto" : "smooth";
	}

	function renderFacets() {
		for (const section of sections) {
			const key = section.dataset.filterSection ?? "";
			const gate = (section.dataset.filterGate ?? "always") as FilterGate;
			const counts = filter.countFacet(key);
			const selected = filter.selected(key);
			const limit = groupLimit(key);
			const more = moreButton(key);
			const isExpanded = more?.dataset.expanded === "true";

			let shown = 0;
			let hidden = 0;

			for (const chip of groupChips(key)) {
				const value = chip.dataset.filterValue ?? "";
				const count = counts.get(value) ?? 0;
				const isActive = selected.has(value);
				const countEl = chip.querySelector<HTMLElement>("[data-chip-count]");
				if (countEl) countEl.textContent = String(count);

				chip.toggleAttribute("data-active", isActive);
				chip.setAttribute("aria-pressed", String(isActive));

				if (count === 0 && !isActive) {
					chip.hidden = true;
					continue;
				}

				const overLimit = limit > 0 && shown >= limit && !isActive && !isExpanded;
				chip.hidden = overLimit;
				if (overLimit) hidden += 1;
				else shown += 1;
			}

			const isAllActive = selected.size === 0;
			allChip(key)?.toggleAttribute("data-active", isAllActive);
			allChip(key)?.setAttribute("aria-pressed", String(isAllActive));

			if (more) {
				more.hidden = hidden === 0 && !isExpanded;
				more.textContent = isExpanded
					? (more.dataset.showLess ?? "")
					: (more.dataset.showMore ?? "").replace("__COUNT__", String(hidden));
			}

			section.hidden = !filter.isSectionVisible(gate, key) || shown === 0;
		}

		const scopeCounts = filter.countScopes();
		let scopeTotal = 0;

		for (const button of scopeButtons) {
			const value = button.dataset.scopeValue ?? "";
			const isActive = filter.scope === value;
			const count = scopeCounts.get(value) ?? 0;
			scopeTotal += count;

			button.toggleAttribute("data-active", isActive);
			button.setAttribute("aria-pressed", String(isActive));
			button.hidden = count === 0 && !isActive;
			const countEl = button.querySelector<HTMLElement>("[data-scope-count]");
			if (countEl) countEl.textContent = String(count);
		}

		const scopeAllCount = scopeAllButton?.querySelector<HTMLElement>("[data-scope-count]");
		if (scopeAllCount) scopeAllCount.textContent = String(scopeTotal);
		scopeAllButton?.toggleAttribute("data-active", filter.scope === "");
		scopeAllButton?.setAttribute("aria-pressed", String(filter.scope === ""));
		scopeGroup?.toggleAttribute("hidden", scopeButtons.length === 0);
	}

	function createToken(label: string, onRemove: () => void, flag = "") {
		const removeLabel = activeFiltersBar?.dataset.removeLabel ?? "";
		const token = document.createElement("button");
		token.type = "button";
		token.setAttribute("aria-label", removeLabel ? `${removeLabel}: ${label}` : label);
		token.className = TOKEN_CLASS;

		if (flag) {
			const flagEl = document.createElement("span");
			flagEl.className = "text-sm leading-none";
			flagEl.textContent = flag;
			token.append(flagEl);
		}

		const labelEl = document.createElement("span");
		labelEl.className = "min-w-0 truncate";
		labelEl.textContent = label;
		token.append(labelEl);

		const closeEl = document.createElement("span");
		closeEl.setAttribute("aria-hidden", "true");
		closeEl.className = "text-base leading-none opacity-80 transition group-hover:opacity-100";
		closeEl.textContent = "×";
		token.append(closeEl);

		token.addEventListener("click", onRemove);

		return token;
	}

	function chipMeta(key: FacetKey, value: string) {
		const chip = groupChips(key).find((item) => (item.dataset.filterValue ?? "") === value);
		if (!chip) return { label: value, flag: "" };

		return {
			label: chip.querySelector<HTMLElement>("[data-chip-label]")?.textContent?.trim() || value,
			flag: chip.querySelector<HTMLElement>(".leading-none")?.textContent?.trim() ?? "",
		};
	}

	function renderActiveFilters() {
		if (!activeFiltersTokens) return;
		activeFiltersTokens.replaceChildren();

		if (filter.scope) {
			const button = scopeButtons.find(
				(item) => item.dataset.scopeValue === filter.scope,
			);
			const label = button?.querySelector("span")?.textContent?.trim() ?? filter.scope;
			activeFiltersTokens.append(createToken(label, () => changeScope("")));
		}

		for (const key of facetKeys) {
			for (const value of filter.selected(key)) {
				const { label, flag } = chipMeta(key, value);
				activeFiltersTokens.append(
					createToken(label, () => toggleChip(key, value), flag),
				);
			}
		}

		const query = searchQuery.trim();
		if (query) activeFiltersTokens.append(createToken(`«${query}»`, clearSearchQuery));
	}

	function renderBadge() {
		const total = filter.activeCount();
		if (filtersBadge) {
			filtersBadge.textContent = String(total);
			filtersBadge.classList.toggle("hidden", total === 0);
		}

		const hasAnything = total > 0 || searchQuery.trim().length > 0;
		filtersResetButtons.forEach((button) => {
			button.hidden = !hasAnything;
		});
	}

	function syncSearchActions() {
		if (searchSubmit) searchSubmit.disabled = !searchInput?.value.trim();
		if (searchClear) searchClear.hidden = searchQuery.trim().length === 0;
	}

	function renderResultsCount(visible: number) {
		if (!resultsCount) return;
		const template = resultsCount.dataset.resultsTemplate ?? "{count}";
		resultsCount.textContent = template.replace("__COUNT__", String(visible));
	}

	// --- подсказки ----------------------------------------------------------

	const suggestions = createSearchSuggestions(suggestionList, searchInput, commitSuggestion);

	async function updateSuggestions() {
		const query = searchQuery.trim();
		if (query.length < MIN_SUGGESTION_QUERY) {
			suggestions.hide();
			return;
		}

		const needle = normalizeSearchText(query);
		const results = await search.run(query);
		// Пока ждали, посетитель мог дописать запрос — эта выдача уже неактуальна.
		if (query !== searchQuery.trim()) return;

		const values = new Set<string>();
		for (const { item } of results.slice(0, SUGGESTION_SOURCE_LIMIT)) {
			const term = item.terms.find((candidate) =>
				normalizeSearchText(candidate).includes(needle),
			);
			values.add(term ?? item.title);
		}

		suggestions.show([...values].slice(0, MAX_SUGGESTIONS));
	}

	function commitSuggestion(value: string) {
		window.clearTimeout(searchTimer);
		searchQuery = value;
		if (searchInput) searchInput.value = value;
		syncSearchActions();
		suggestions.hide();
		schedule(true);
	}

	// --- действия -----------------------------------------------------------

	function toggleChip(key: FacetKey, value: string) {
		filter.toggle(key, value);
		filter.pruneEmpty();
		schedule(true);
	}

	function changeScope(next: CenterScope) {
		filter.setScope(next);
		schedule(true);
	}

	function resetFilters() {
		window.clearTimeout(searchTimer);
		filter.reset();
		searchQuery = "";
		if (searchInput) searchInput.value = "";
		suggestions.hide();
		schedule(true);
	}

	function clearSearchQuery() {
		window.clearTimeout(searchTimer);
		searchQuery = "";
		if (searchInput) {
			searchInput.value = "";
			searchInput.focus();
		}
		syncSearchActions();
		suggestions.hide();
		schedule(false);
	}

	function toggleOverflow(key: FacetKey) {
		const more = moreButton(key);
		if (!more) return;

		more.dataset.expanded = String(more.dataset.expanded !== "true");
		renderFacets();
	}

	async function apply(shouldScroll = false) {
		const query = searchQuery.trim();
		const ranked = await search.run(query);
		if (query !== searchQuery.trim()) return;

		const rank = new Map(ranked.map((result, index) => [result.item.id, index]));
		filter.limitTo(query ? new Set(ranked.map((result) => result.item.id)) : null);
		filter.pruneEmpty();

		const ordered = query
			? [...cards].sort((a, b) => {
					const left = rank.get(a.id) ?? Number.MAX_SAFE_INTEGER;
					const right = rank.get(b.id) ?? Number.MAX_SAFE_INTEGER;
					return left - right || a.order - b.order;
				})
			: cards;

		// Переставляем узлы только когда порядок действительно менялся:
		// иначе каждый клик по фильтру дёргал бы весь грид.
		const shouldReorder = Boolean(query) || gridReordered;
		let visible = 0;

		for (const item of ordered) {
			const show = filter.matches(item);
			item.element.hidden = !show;
			if (shouldReorder) cardsGrid.append(item.element);
			if (show) visible += 1;
		}
		gridReordered = Boolean(query);

		renderFacets();
		noResults.hidden = visible > 0;
		renderBadge();
		renderResultsCount(visible);
		syncSearchActions();
		renderActiveFilters();

		window.history.replaceState(
			null,
			"",
			writeCatalogQuery(
				window.location.href,
				{ ...filter.snapshot(), search: searchQuery },
				facetKeys,
			),
		);

		if (shouldScroll && !isDesktopLayout.matches) {
			cardsGrid.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
		}
	}

	function schedule(shouldScroll = false) {
		window.cancelAnimationFrame(filterFrame);
		filterFrame = window.requestAnimationFrame(() => {
			void apply(shouldScroll);
		});
	}

	// --- события ------------------------------------------------------------

	filtersToggle?.addEventListener("click", () => {
		if (!filtersPanel) return;

		const isHidden = filtersPanel.classList.contains("hidden");
		filtersShell?.classList.toggle("hidden", !isHidden);
		filtersPanel.classList.toggle("hidden", !isHidden);
		filtersToggle.setAttribute("aria-expanded", String(isHidden));

		if (isHidden && !isDesktopLayout.matches && filtersShell) {
			const barBottom = stickyBar?.getBoundingClientRect().bottom ?? 0;
			const target = filtersShell.getBoundingClientRect().top + window.scrollY - barBottom - 8;
			window.scrollTo({ top: Math.max(target, 0), behavior: scrollBehavior() });
		}
	});

	filtersResetButtons.forEach((button) => button.addEventListener("click", resetFilters));
	searchClear?.addEventListener("click", clearSearchQuery);

	searchForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!searchInput?.value.trim()) return;

		window.clearTimeout(searchTimer);
		searchQuery = searchInput.value;
		suggestions.hide();
		schedule(true);
	});

	for (const key of facetKeys) {
		allChip(key)?.addEventListener("click", () => {
			filter.resetGroup(key);
			schedule(true);
		});
		moreButton(key)?.addEventListener("click", () => toggleOverflow(key));

		for (const chip of groupChips(key)) {
			chip.addEventListener("click", () => {
				const value = chip.dataset.filterValue ?? "";
				if (value) toggleChip(key, value);
			});
		}
	}

	for (const button of scopeButtons) {
		button.addEventListener("click", () =>
			changeScope(button.dataset.scopeValue as CenterScope),
		);
	}
	scopeAllButton?.addEventListener("click", () => changeScope(""));

	searchInput?.addEventListener("input", (event) => {
		const value = (event.target as HTMLInputElement).value;
		if (searchSubmit) searchSubmit.disabled = !value.trim();
		if (searchClear) searchClear.hidden = value.trim().length === 0;

		window.clearTimeout(searchTimer);
		searchTimer = window.setTimeout(() => {
			searchQuery = value;
			void updateSuggestions();
			schedule(false);
		}, SEARCH_DEBOUNCE_MS);
	});

	searchInput?.addEventListener("keydown", (event) => {
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			if (suggestions.move(event.key === "ArrowDown" ? 1 : -1)) event.preventDefault();
			return;
		}

		if (event.key === "Enter") {
			const active = suggestions.active();
			if (active !== null) {
				event.preventDefault();
				commitSuggestion(active);
			}
			return;
		}

		if (event.key === "Escape") suggestions.hide();
	});

	searchInput?.addEventListener("focus", () => {
		window.clearTimeout(blurTimer);
		void updateSuggestions();
	});
	searchInput?.addEventListener("blur", () => {
		blurTimer = window.setTimeout(() => suggestions.hide(), SUGGESTION_BLUR_DELAY_MS);
	});

	// --- запуск -------------------------------------------------------------

	const initial = readCatalogQuery(
		window.location.search,
		facetKeys,
		allowedValues,
		(scope) => scopeButtons.some((button) => button.dataset.scopeValue === scope),
	);
	searchQuery = initial.search;
	if (searchInput) searchInput.value = searchQuery;
	filter.restore(initial);

	renderFacets();
	void apply();
}
