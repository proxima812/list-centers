type FilterGroupName = "country" | "type" | "category" | "region";

type FilterState = {
	country: Set<string>;
	type: Set<string>;
	category: Set<string>;
	region: Set<string>;
};

type ExpandableFilterButton = HTMLButtonElement & {
	dataset: DOMStringMap & {
		filterMore?: FilterGroupName;
		expanded?: string;
		showMore?: string;
		showLess?: string;
	};
};

type FilterableCard = HTMLAnchorElement & {
	dataset: DOMStringMap & {
		country?: string;
		searchId?: string;
		type?: string;
		category?: string;
		region?: string;
		title?: string;
		summary?: string;
		city?: string;
	};
};

type CardIndexItem = {
	id: string;
	element: FilterableCard;
	country: string;
	type: string;
	category: string;
	region: string;
	title: string;
	summary: string;
	city: string;
	searchText: string;
	terms: string[];
	order: number;
};

type SearchIndexItem = Omit<CardIndexItem, "element">;

type SearchResult = {
	item: CardIndexItem;
	score: number;
};

type FuseResult = {
	item: SearchIndexItem;
	score?: number;
};

type FuseInstance = {
	search: (query: string) => FuseResult[];
};

type FuseConstructor = new (
	items: SearchIndexItem[],
	options: {
		includeScore: boolean;
		ignoreLocation: boolean;
		threshold: number;
		minMatchCharLength: number;
		keys: { name: keyof SearchIndexItem; weight: number }[];
	},
) => FuseInstance;

type VoiceRecognitionResultEvent = {
	results: ArrayLike<{
		0?: {
			transcript?: string;
		};
	}>;
};

type VoiceRecognition = {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	start: () => void;
	stop: () => void;
	onstart: (() => void) | null;
	onend: (() => void) | null;
	onresult: ((event: VoiceRecognitionResultEvent) => void) | null;
	onerror: (() => void) | null;
};

type VoiceRecognitionConstructor = new () => VoiceRecognition;

declare global {
	interface Window {
		SpeechRecognition?: VoiceRecognitionConstructor;
		webkitSpeechRecognition?: VoiceRecognitionConstructor;
	}
}

const filterQueryKeys: Record<FilterGroupName, string> = {
	country: "country",
	type: "type",
	category: "category",
	region: "region",
};

export function initCardsToolbar() {
	const cardsGrid = document.getElementById("cards-grid");
	const noResults = document.getElementById("no-results");
	const searchForm = document.querySelector<HTMLFormElement>("[data-search-form]");
	const searchInput = document.querySelector<HTMLInputElement>("[data-toolbar-search]");
	const suggestions = document.querySelector<HTMLUListElement>("[data-search-suggestions]");
	const searchSubmit = document.querySelector<HTMLButtonElement>("[data-search-submit]");
	const voiceButton = document.querySelector<HTMLButtonElement>("[data-search-voice]");
	const voiceStatus = document.querySelector<HTMLElement>("[data-voice-status]");
	const filtersToggle = document.querySelector<HTMLButtonElement>("[data-filters-toggle]");
	const filtersShell = document.querySelector<HTMLElement>("[data-filters-shell]");
	const filtersPanel = document.getElementById("filters-panel");
	const filtersBadge = document.querySelector<HTMLElement>("[data-filters-badge]");
	const filtersResetButtons =
		document.querySelectorAll<HTMLButtonElement>("[data-filters-reset]");
	const searchClear = document.querySelector<HTMLButtonElement>("[data-search-clear]");
	const activeFiltersBar = document.querySelector<HTMLElement>("[data-active-filters-bar]");
	const activeFiltersTokens = document.querySelector<HTMLElement>(
		"[data-active-filters-tokens]",
	);
	const resultsCount = document.querySelector<HTMLElement>("[data-results-count]");

	if (!cardsGrid || !noResults) {
		return;
	}

	const cardsGridElement = cardsGrid;
	const noResultsElement = noResults;
	const cards = Array.from(cardsGridElement.querySelectorAll<FilterableCard>(":scope > a"));
	const cardBySearchId = new Map(
		cards.map((card, order) => [card.dataset.searchId ?? String(order), card] as const),
	);
	const normalize = (value: string) =>
		value
			.toLowerCase()
			.normalize("NFKD")
			.replace(/\p{Diacritic}/gu, "")
			.replace(/[ё]/g, "е")
			.replace(/[“”«»"']/g, "")
			.trim();
	const uniqueTerms = (terms: string[]) =>
		Array.from(new Set(terms.map((term) => term.trim()).filter((term) => term.length > 1)));
	const cardsIndex: CardIndexItem[] = cards.map((card, order) => {
		const id = card.dataset.searchId ?? String(order);
		const country = card.dataset.country ?? "";
		const type = card.dataset.type ?? "";
		const category = card.dataset.category ?? "";
		const region = card.dataset.region ?? "";
		const title = card.dataset.title ?? "";
		const summary = card.dataset.summary ?? "";
		const city = card.dataset.city ?? "";
		const terms = uniqueTerms([title, city, country, region, type, category]);

		return {
			id,
			element: card,
			country,
			type,
			category,
			region,
			title,
			summary,
			city,
			terms,
			order,
			searchText: normalize(
				`${title} ${summary} ${city} ${country} ${type} ${category} ${region}`,
			),
		};
	});
	const searchIndexUrl = searchForm?.dataset.searchIndexUrl;

	const state: FilterState = {
		country: new Set(),
		type: new Set(),
		category: new Set(),
		region: new Set(),
	};

	let searchQuery = "";
	let searchTimer = 0;
	let filterFrame = 0;
	let activeSuggestionIndex = -1;
	let currentSuggestionValues: string[] = [];
	let voiceRecognition: VoiceRecognition | null = null;
	let isListening = false;
	let searchItemsPromise: Promise<SearchIndexItem[]> | null = null;
	let fusePromise: Promise<FuseInstance> | null = null;

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const isDesktopLayout = window.matchMedia("(min-width: 1024px)");

	const groupElements = {
		country: document.querySelector<HTMLElement>('[data-filter-group="country"]'),
		type: document.querySelector<HTMLElement>('[data-filter-group="type"]'),
		category: document.querySelector<HTMLElement>('[data-filter-group="category"]'),
		region: document.querySelector<HTMLElement>('[data-filter-group="region"]'),
	};

	function getGroupChips(groupName: FilterGroupName): HTMLButtonElement[] {
		return Array.from(
			document.querySelectorAll<HTMLButtonElement>(`[data-filter-chip="${groupName}"]`),
		);
	}

	function getAllChip(groupName: FilterGroupName): HTMLButtonElement | null {
		return document.querySelector<HTMLButtonElement>(`[data-filter-all="${groupName}"]`);
	}

	function getMoreButton(groupName: FilterGroupName): ExpandableFilterButton | null {
		return document.querySelector<ExpandableFilterButton>(
			`[data-filter-more="${groupName}"]`,
		);
	}

	function getValidValues(groupName: FilterGroupName): Set<string> {
		return new Set(
			getGroupChips(groupName)
				.map((chip) => chip.dataset.filterValue ?? "")
				.filter(Boolean),
		);
	}

	function readStateFromUrl() {
		const params = new URLSearchParams(window.location.search);
		searchQuery = params.get("q") ?? "";
		if (searchInput) {
			searchInput.value = searchQuery;
		}
		void updateSuggestions();

		(Object.keys(state) as FilterGroupName[]).forEach((groupName) => {
			const validValues = getValidValues(groupName);
			const values = params.getAll(filterQueryKeys[groupName]);

			state[groupName].clear();
			values.forEach((value) => {
				if (validValues.has(value)) {
					state[groupName].add(value);
				}
			});
		});
	}

	function writeStateToUrl() {
		const url = new URL(window.location.href);
		const query = searchQuery.trim();

		url.searchParams.delete("q");
		(Object.keys(state) as FilterGroupName[]).forEach((groupName) => {
			url.searchParams.delete(filterQueryKeys[groupName]);
		});

		if (query) {
			url.searchParams.set("q", query);
		}

		(Object.keys(state) as FilterGroupName[]).forEach((groupName) => {
			state[groupName].forEach((value) => {
				url.searchParams.append(filterQueryKeys[groupName], value);
			});
		});

		window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
	}

	function scrollToCards() {
		if (isDesktopLayout.matches) return;
		cardsGridElement.scrollIntoView({
			behavior: prefersReducedMotion.matches ? "auto" : "smooth",
			block: "start",
		});
	}

	function updateFiltersBadge() {
		const total =
			state.country.size + state.type.size + state.category.size + state.region.size;
		const hasSearchQuery = searchQuery.trim().length > 0;
		if (filtersBadge) {
			filtersBadge.textContent = String(total);
			filtersBadge.classList.toggle("hidden", total === 0);
		}
		if (activeFiltersBar) {
			activeFiltersBar.hidden = total === 0 && !hasSearchQuery;
		}
	}

	function syncSearchActions() {
		if (searchSubmit) {
			searchSubmit.disabled = !searchInput?.value.trim();
		}
	}

	function updateSearchClear() {
		if (searchClear) {
			searchClear.hidden = searchQuery.trim().length === 0;
		}
		syncSearchActions();
	}

	function updateResultsCount(visible: number) {
		if (!resultsCount) return;
		const template = resultsCount.dataset.resultsTemplate ?? "{count}";
		resultsCount.textContent = template.replace("__COUNT__", String(visible));
	}

	function getChipMeta(groupName: FilterGroupName, value: string) {
		const chip = getGroupChips(groupName).find(
			(item) => (item.dataset.filterValue ?? "") === value,
		);
		if (!chip) return { label: value, flag: "" };
		const labelEl =
			chip.querySelector<HTMLElement>("[data-country-label]") ??
			chip.querySelector<HTMLElement>(".truncate");
		const flagEl =
			groupName === "country" ? chip.querySelector<HTMLElement>(".leading-none") : null;
		return {
			label: labelEl?.textContent?.trim() || value,
			flag: flagEl?.textContent?.trim() ?? "",
		};
	}

	function createToken(label: string, onRemove: () => void, flag = "") {
		const removeLabel = activeFiltersBar?.dataset.removeLabel ?? "";
		const token = document.createElement("button");
		token.type = "button";
		token.setAttribute("aria-label", removeLabel ? `${removeLabel}: ${label}` : label);
		token.className =
			"group inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-sm font-medium text-primary-foreground transition hover:bg-primary/85";

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

	function renderActiveFilters() {
		if (!activeFiltersTokens) return;
		activeFiltersTokens.replaceChildren();

		(Object.keys(state) as FilterGroupName[]).forEach((groupName) => {
			state[groupName].forEach((value) => {
				const { label, flag } = getChipMeta(groupName, value);
				activeFiltersTokens.append(
					createToken(label, () => toggleChip(groupName, value), flag),
				);
			});
		});

		const query = searchQuery.trim();
		if (query) {
			activeFiltersTokens.append(createToken(`«${query}»`, clearSearchQuery));
		}
	}

	function clearSearchQuery() {
		searchQuery = "";
		if (searchInput) {
			searchInput.value = "";
			searchInput.focus();
		}
		updateSearchClear();
		hideSuggestions();
		scheduleApplyFilters(false);
	}

	function syncGroupUI(groupName: FilterGroupName) {
		const selectedValues = state[groupName];
		const allChip = getAllChip(groupName);

		getGroupChips(groupName).forEach((chip) => {
			const value = chip.dataset.filterValue ?? "";
			const isActive = selectedValues.has(value);
			chip.toggleAttribute("data-active", isActive);
			chip.setAttribute("aria-pressed", String(isActive));
		});

		const isAllActive = selectedValues.size === 0;
		allChip?.toggleAttribute("data-active", isAllActive);
		allChip?.setAttribute("aria-pressed", String(isAllActive));
		syncOverflowUI(groupName);
	}

	function toggleChip(groupName: FilterGroupName, value: string) {
		const groupState = state[groupName];

		if (groupState.has(value)) {
			groupState.delete(value);
		} else {
			groupState.add(value);
		}

		syncGroupUI(groupName);
		scheduleApplyFilters(true);
	}

	function resetGroup(groupName: FilterGroupName) {
		state[groupName].clear();
		syncGroupUI(groupName);
		scheduleApplyFilters(true);
	}

	function resetFilters() {
		(Object.keys(state) as FilterGroupName[]).forEach((groupName) => {
			state[groupName].clear();
			syncGroupUI(groupName);
		});
		searchQuery = "";
		if (searchInput) {
			searchInput.value = "";
		}
		hideSuggestions();
		scheduleApplyFilters(true);
	}

	function matchesGroup(selectedValues: Set<string>, value: string) {
		return selectedValues.size === 0 || selectedValues.has(value);
	}

	function getFallbackSearchItems(): SearchIndexItem[] {
		return cardsIndex.map(({ element: _element, ...item }) => item);
	}

	async function loadSearchItems(): Promise<SearchIndexItem[]> {
		if (!searchIndexUrl) return getFallbackSearchItems();
		if (!searchItemsPromise) {
			searchItemsPromise = fetch(searchIndexUrl)
				.then((response) => {
					if (!response.ok) throw new Error(`Search index failed: ${response.status}`);
					return response.json() as Promise<SearchIndexItem[]>;
				})
				.catch(() => getFallbackSearchItems());
		}
		return searchItemsPromise;
	}

	function withCardElements(items: SearchIndexItem[]): CardIndexItem[] {
		return items
			.map((item) => {
				const element = cardBySearchId.get(item.id);
				return element ? { ...item, element } : null;
			})
			.filter((item): item is CardIndexItem => Boolean(item));
	}

	async function loadFuse() {
		if (!fusePromise) {
			fusePromise = Promise.all([import("fuse.js"), loadSearchItems()]).then(
				([{ default: Fuse }, items]) => {
					const FuseCtor = Fuse as FuseConstructor;
					return new FuseCtor(items, {
						includeScore: true,
						ignoreLocation: true,
						threshold: 0.32,
						minMatchCharLength: 2,
						keys: [
							{ name: "title", weight: 0.42 },
							{ name: "city", weight: 0.2 },
							{ name: "country", weight: 0.14 },
							{ name: "region", weight: 0.1 },
							{ name: "category", weight: 0.06 },
							{ name: "type", weight: 0.05 },
							{ name: "summary", weight: 0.03 },
						],
					});
				},
			);
		}
		return fusePromise;
	}

	async function getSearchResults(query: string): Promise<SearchResult[]> {
		const normalizedQuery = normalize(query);
		if (!normalizedQuery) {
			return cardsIndex.map((item) => ({ item, score: 0 }));
		}

		const searchItems = await loadSearchItems();
		const exactMatches = withCardElements(searchItems)
			.filter((item) => item.searchText.includes(normalizedQuery))
			.map((item) => ({ item, score: 0.01 }));
		if (exactMatches.length > 0) {
			return exactMatches.sort((a, b) => a.item.order - b.item.order);
		}

		const fuse = await loadFuse();
		const resultMap = new Map<FilterableCard, SearchResult>();

		fuse
			.search(query)
			.map((result) => {
				const element = cardBySearchId.get(result.item.id);
				return element ? { item: { ...result.item, element }, score: result.score ?? 1 } : null;
			})
			.filter((result): result is SearchResult => Boolean(result))
			.forEach((result) => {
				resultMap.set(result.item.element, result);
			});

		return Array.from(resultMap.values()).sort(
			(a, b) => a.score - b.score || a.item.order - b.item.order,
		);
	}

	function hideSuggestions() {
		if (!suggestions || !searchInput) return;
		suggestions.classList.add("hidden");
		suggestions.replaceChildren();
		searchInput.setAttribute("aria-expanded", "false");
		searchInput.removeAttribute("aria-activedescendant");
		activeSuggestionIndex = -1;
		currentSuggestionValues = [];
	}

	function renderSuggestions(values: string[]) {
		if (!suggestions || !searchInput) return;

		currentSuggestionValues = values;
		activeSuggestionIndex = -1;
		suggestions.replaceChildren();

		if (values.length === 0) {
			hideSuggestions();
			return;
		}

		values.forEach((value, index) => {
			const option = document.createElement("li");
			option.id = `search-suggestion-${index}`;
			option.role = "option";
			option.dataset.searchSuggestion = value;
			option.className =
				"cursor-pointer rounded-control px-3 py-2 text-surface-foreground transition hover:bg-muted aria-selected:bg-muted";
			option.textContent = value;
			option.addEventListener("mousedown", (event) => {
				event.preventDefault();
				commitSuggestion(value);
			});
			suggestions.append(option);
		});

		suggestions.classList.remove("hidden");
		searchInput.setAttribute("aria-expanded", "true");
	}

	async function updateSuggestions() {
		const query = searchQuery.trim();
		if (!query || query.length < 2) {
			hideSuggestions();
			return;
		}

		const normalizedQuery = normalize(query);
		const suggestionsSet = new Set<string>();

		const searchResults = await getSearchResults(query);
		if (query !== searchQuery.trim()) return;

		searchResults
			.slice(0, 8)
			.forEach(({ item }) => {
				const matchingTerm = item.terms.find((term) =>
					normalize(term).includes(normalizedQuery),
				);
				suggestionsSet.add(matchingTerm ?? item.title);
			});

		renderSuggestions(Array.from(suggestionsSet).slice(0, 6));
	}

	function setActiveSuggestion(nextIndex: number) {
		if (!suggestions || !searchInput || currentSuggestionValues.length === 0) return;

		const maxIndex = currentSuggestionValues.length - 1;
		activeSuggestionIndex = nextIndex < 0 ? maxIndex : nextIndex > maxIndex ? 0 : nextIndex;

		Array.from(suggestions.children).forEach((child, index) => {
			child.setAttribute("aria-selected", String(index === activeSuggestionIndex));
		});
		searchInput.setAttribute(
			"aria-activedescendant",
			`search-suggestion-${activeSuggestionIndex}`,
		);
	}

	function commitSuggestion(value: string) {
		searchQuery = value;
		if (searchInput) {
			searchInput.value = value;
		}
		syncSearchActions();
		hideSuggestions();
		scheduleApplyFilters(true);
	}

	function setListeningState(listening: boolean) {
		isListening = listening;
		if (!voiceButton) return;

		voiceButton.dataset.listening = String(listening);
		voiceButton.setAttribute("aria-pressed", String(listening));
		if (voiceStatus) {
			const listeningLabel = searchForm?.dataset.voiceListening ?? "";
			if (listening) {
				voiceStatus.textContent = listeningLabel;
			} else if (voiceStatus.textContent === listeningLabel) {
				voiceStatus.textContent = "";
			}
		}
	}

	function initVoiceSearch() {
		const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
		if (!Recognition || !voiceButton || !searchInput) return;

		voiceButton.hidden = false;
		voiceRecognition = new Recognition();
		voiceRecognition.lang = searchForm?.dataset.speechLang ?? "ru-RU";
		voiceRecognition.continuous = false;
		voiceRecognition.interimResults = false;

		voiceRecognition.onstart = () => {
			setListeningState(true);
		};

		voiceRecognition.onresult = (event) => {
			const lastResult = event.results[event.results.length - 1];
			const transcript = lastResult?.[0]?.transcript?.trim() ?? "";
			if (!transcript) return;

			window.clearTimeout(searchTimer);
			searchInput.value = transcript;
			searchQuery = transcript;
			if (voiceStatus) voiceStatus.textContent = "";
			syncSearchActions();
			void updateSuggestions();
			scheduleApplyFilters(false);
			searchInput.focus();
		};

		voiceRecognition.onerror = () => {
			setListeningState(false);
			if (voiceStatus) {
				voiceStatus.textContent = searchForm?.dataset.voiceError ?? "";
			}
		};

		voiceRecognition.onend = () => {
			setListeningState(false);
		};

		voiceButton.addEventListener("click", () => {
			if (!voiceRecognition) return;
			if (isListening) {
				voiceRecognition.stop();
				return;
			}

			if (voiceStatus) voiceStatus.textContent = "";
			try {
				voiceRecognition.start();
			} catch {
				if (voiceStatus) {
					voiceStatus.textContent = searchForm?.dataset.voiceError ?? "";
				}
			}
		});
	}

	function syncOverflowUI(groupName: FilterGroupName) {
		const moreButton = getMoreButton(groupName);
		if (!moreButton) return;

		const isExpanded = moreButton.dataset.expanded === "true";
		const overflowChips = Array.from(
			document.querySelectorAll<HTMLButtonElement>(
				`[data-filter-chip="${groupName}"][data-overflow-chip="true"]`,
			),
		);
		let hiddenCount = 0;

		overflowChips.forEach((chip) => {
			const value = chip.dataset.filterValue ?? "";
			const isSelected = state[groupName].has(value);
			const shouldHide = !isExpanded && !isSelected;

			chip.hidden = shouldHide;
			if (shouldHide) hiddenCount += 1;
		});

		moreButton.hidden = !isExpanded && hiddenCount === 0;
		moreButton.textContent = isExpanded
			? (moreButton.dataset.showLess ?? "")
			: (moreButton.dataset.showMore ?? "").replace("__COUNT__", String(hiddenCount));
	}

	function toggleOverflow(groupName: FilterGroupName) {
		const moreButton = getMoreButton(groupName);
		if (!moreButton) return;

		const isExpanded = moreButton.dataset.expanded === "true";
		moreButton.dataset.expanded = String(!isExpanded);
		syncOverflowUI(groupName);
	}

	async function applyFilters(shouldScrollToCards = false) {
		const query = searchQuery.trim();
		const rankedResults = await getSearchResults(query);
		if (query !== searchQuery.trim()) return;
		const searchMatches = new Map(
			rankedResults.map((result, index) => [result.item.element, index]),
		);
		const hasActiveFilters =
			state.country.size > 0 ||
			state.type.size > 0 ||
			state.category.size > 0 ||
			state.region.size > 0;
		let visible = 0;

		const shouldBypassFiltering = !hasActiveFilters && !query;
		const orderedIndex = query
			? [...cardsIndex].sort((a, b) => {
					const left = searchMatches.get(a.element) ?? Number.MAX_SAFE_INTEGER;
					const right = searchMatches.get(b.element) ?? Number.MAX_SAFE_INTEGER;
					return left - right || a.order - b.order;
				})
			: cardsIndex;

		orderedIndex.forEach((item) => {
			const matchesCountry = matchesGroup(state.country, item.country);
			const matchesType = matchesGroup(state.type, item.type);
			const matchesCategory = matchesGroup(state.category, item.category);
			const matchesRegion = matchesGroup(state.region, item.region);
			const matchesSearch = !query || searchMatches.has(item.element);

			const show =
				shouldBypassFiltering ||
				(matchesCountry && matchesType && matchesCategory && matchesRegion && matchesSearch);

			item.element.hidden = !show;
			if (query) {
				cardsGridElement.append(item.element);
			}

			if (show) {
				visible += 1;
			}
		});

		noResultsElement.hidden = visible > 0;
		updateFiltersBadge();
		updateResultsCount(visible);
		updateSearchClear();
		renderActiveFilters();
		writeStateToUrl();
		if (shouldScrollToCards) {
			scrollToCards();
		}
	}

	function scheduleApplyFilters(shouldScrollToCards = false) {
		window.cancelAnimationFrame(filterFrame);
		filterFrame = window.requestAnimationFrame(() => {
			void applyFilters(shouldScrollToCards);
		});
	}

	filtersToggle?.addEventListener("click", () => {
		if (!filtersPanel) return;
		const isHidden = filtersPanel.classList.contains("hidden");
		filtersShell?.classList.toggle("hidden", !isHidden);
		filtersPanel.classList.toggle("hidden", !isHidden);
		filtersToggle.setAttribute("aria-expanded", String(isHidden));
	});

	filtersResetButtons.forEach((button) => {
		button.addEventListener("click", resetFilters);
	});

	searchClear?.addEventListener("click", clearSearchQuery);
	searchForm?.addEventListener("submit", (event) => {
		event.preventDefault();
		if (!searchInput?.value.trim()) return;

		window.clearTimeout(searchTimer);
		searchQuery = searchInput.value;
		hideSuggestions();
		scheduleApplyFilters(true);
	});

	(Object.keys(groupElements) as FilterGroupName[]).forEach((groupName) => {
		const groupElement = groupElements[groupName];
		if (!groupElement) return;

		getAllChip(groupName)?.addEventListener("click", () => {
			resetGroup(groupName);
		});

		getMoreButton(groupName)?.addEventListener("click", () => {
			toggleOverflow(groupName);
		});

		getGroupChips(groupName).forEach((chip) => {
			chip.addEventListener("click", () => {
				const value = chip.dataset.filterValue ?? "";
				if (!value) return;
				toggleChip(groupName, value);
			});
		});
	});

	searchInput?.addEventListener("input", (event) => {
		const value = (event.target as HTMLInputElement).value;
		syncSearchActions();
		if (searchClear) {
			searchClear.hidden = value.trim().length === 0;
		}
		window.clearTimeout(searchTimer);
		searchTimer = window.setTimeout(() => {
			searchQuery = value;
			void updateSuggestions();
			scheduleApplyFilters(false);
		}, 150);
	});

	searchInput?.addEventListener("keydown", (event) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActiveSuggestion(activeSuggestionIndex + 1);
		}
		if (event.key === "ArrowUp") {
			event.preventDefault();
			setActiveSuggestion(activeSuggestionIndex - 1);
		}
		if (event.key === "Enter" && activeSuggestionIndex >= 0) {
			event.preventDefault();
			commitSuggestion(currentSuggestionValues[activeSuggestionIndex] ?? "");
		}
		if (event.key === "Escape") {
			hideSuggestions();
		}
	});

	searchInput?.addEventListener("focus", () => {
		void updateSuggestions();
	});
	searchInput?.addEventListener("blur", () => {
		window.setTimeout(hideSuggestions, 120);
	});

	initVoiceSearch();
	readStateFromUrl();
	(Object.keys(state) as FilterGroupName[]).forEach(syncGroupUI);
	void applyFilters();
}
