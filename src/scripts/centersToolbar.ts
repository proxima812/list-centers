/**
 * Движок каталога: поиск, фасеты, активные фильтры.
 *
 * Фасеты обобщены. Раньше имя каждой группы («country», «type», «category»,
 * «region») было вписано в тип `FilterState`, в карту query-параметров, в
 * `groupElements` и в четыре ветки `applyFilters` — добавление пятой оси
 * означало правку в восьми местах. Теперь набор осей читается из разметки:
 * группа объявляет себя `data-filter-group`, и остальное следует.
 *
 * Три вещи, которых раньше не было и без которых иерархия не читается:
 *
 * 1. Счётчики живые. До этого они приезжали с сервера один раз, и после
 *    выбора «Казахстан» рядом с «Пермский край» продолжала висеть цифра 17.
 * 2. Опции с нулём скрываются. Это же делает и всю работу по согласованию
 *    уровней: выбрал Украину — регионы и города других стран обнулились и
 *    ушли сами, отдельного дерева в состоянии не нужно.
 * 3. Секции появляются по условию (`data-filter-gate`): город не показывают,
 *    пока не выбрана страна или регион, иначе это список на 122 строки.
 *
 * Выбор внутри группы один. Раньше он был множественным, и «СНГ» вместе с
 * «Азией» складывались в сумму двух веток дерева — набор, у которого нет
 * общих потомков, так что следующий уровень после него показывать нечего.
 */

type FacetKey = string;
type FilterState = Record<FacetKey, Set<string>>;

/** Условие показа секции фильтров. */
type FilterGate = "always" | "world" | "ru" | "country" | "region" | "city";

type CenterScope = "" | "ru" | "abroad" | "online";

type ExpandableFilterButton = HTMLButtonElement & {
	dataset: DOMStringMap & {
		filterMore?: string;
		expanded?: string;
		showMore?: string;
		showLess?: string;
	};
};

// Карточка больше не `<a>`: внутри неё живут быстрые ссылки, а вложенные
// ссылки невалидны. Ищем по data-атрибуту, а не по тегу.
type FilterableCard = HTMLElement & {
	dataset: DOMStringMap & {
		searchId?: string;
		scope?: string;
		macro?: string;
		okrug?: string;
		country?: string;
		region?: string;
		city?: string;
		type?: string;
		category?: string;
		title?: string;
		summary?: string;
	};
};

type CardIndexItem = {
	id: string;
	element: FilterableCard;
	scope: CenterScope;
	facets: Record<FacetKey, string>;
	title: string;
	summary: string;
	city: string;
	country: string;
	region: string;
	type: string;
	category: string;
	searchText: string;
	terms: string[];
	order: number;
};

type SearchIndexItem = Omit<CardIndexItem, "element" | "facets" | "scope">;

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

const SCOPE_QUERY_KEY = "scope";
/**
 * Кто под кем стоит в дереве географии.
 *
 * Нужно для двух вещей, и обе — про то, чтобы родителя нельзя было запереть
 * собственным потомком. Во-первых, счётчик страны считается без учёта города:
 * иначе, выбрав Киев, пользователь видит у Казахстана ноль (Киева там нет),
 * чип прячется, и переключить страну можно только сняв сначала город.
 * Во-вторых, смена родителя обнуляет потомков: выбрал другую страну — город
 * прежней страны уходит сам, а не остаётся висеть в активных фильтрах.
 */
const FACET_CHILDREN: Record<string, string[]> = {
	macro: ["country", "region", "city"],
	okrug: ["region", "city"],
	country: ["region", "city"],
	region: ["city"],
};
/** Всё, что зависит от корня: смена scope обнуляет географию целиком. */
const GEO_FACETS = ["macro", "okrug", "country", "region", "city"];
/**
 * Обратная совместимость со ссылками, сохранёнными до появления scope: там
 * лежал `?type=Регион+РФ`. Поле `type` в карточках осталось, но фильтром быть
 * перестало — старая ссылка переводится в новый корень дерева.
 */
const LEGACY_TYPE_TO_SCOPE: Record<string, CenterScope> = {
	"Регион РФ": "ru",
	Зарубежный: "abroad",
	Онлайн: "online",
};

export function initCardsToolbar() {
	const cardsGrid = document.getElementById("cards-grid");
	const noResults = document.getElementById("no-results");
	const searchForm = document.querySelector<HTMLFormElement>("[data-search-form]");
	const searchInput = document.querySelector<HTMLInputElement>("[data-toolbar-search]");
	const suggestions = document.querySelector<HTMLUListElement>("[data-search-suggestions]");
	const searchSubmit = document.querySelector<HTMLButtonElement>("[data-search-submit]");
	const filtersToggle = document.querySelector<HTMLButtonElement>("[data-filters-toggle]");
	const filtersShell = document.querySelector<HTMLElement>("[data-filters-shell]");
	const stickyBar = document.querySelector<HTMLElement>("[data-catalog-bar]");
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
	const cards = Array.from(
		cardsGridElement.querySelectorAll<FilterableCard>(":scope > [data-search-id]"),
	);

	// Набор осей объявляет разметка, а не этот файл.
	const groupElements = Array.from(
		document.querySelectorAll<HTMLElement>("[data-filter-group]"),
	);
	const facetKeys: FacetKey[] = groupElements
		.map((group) => group.dataset.filterGroup ?? "")
		.filter(Boolean);
	const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-filter-section]"));
	const scopeGroup = document.querySelector<HTMLElement>("[data-scope-group]");
	const scopeButtons = Array.from(
		document.querySelectorAll<HTMLButtonElement>("[data-scope-value]"),
	);
	const scopeAllButton = document.querySelector<HTMLButtonElement>("[data-scope-all]");

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
		const facets: Record<FacetKey, string> = {};
		for (const key of facetKeys) {
			facets[key] = card.dataset[key] ?? "";
		}

		return {
			id,
			element: card,
			scope: (card.dataset.scope ?? "") as CenterScope,
			facets,
			country,
			type,
			category,
			region,
			title,
			summary,
			city,
			terms: uniqueTerms([title, city, country, region, category]),
			order,
			searchText: normalize(
				`${title} ${summary} ${city} ${country} ${type} ${category} ${region}`,
			),
		};
	});
	const cardById = new Map(cardsIndex.map((item) => [item.id, item]));
	const searchIndexUrl = searchForm?.dataset.searchIndexUrl;

	const state: FilterState = Object.fromEntries(
		facetKeys.map((key) => [key, new Set<string>()]),
	);
	let scope: CenterScope = "";

	let searchQuery = "";
	let searchTimer = 0;
	let blurTimer = 0;
	let filterFrame = 0;
	// Поиск физически переставляет карточки в гриде; после очистки запроса
	// их нужно один раз вернуть в исходный порядок.
	let gridReordered = false;
	let activeSuggestionIndex = -1;
	let currentSuggestionValues: string[] = [];
	let searchItemsPromise: Promise<SearchIndexItem[]> | null = null;
	let fusePromise: Promise<FuseInstance> | null = null;
	let searchMatchIds: Set<string> | null = null;

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const isDesktopLayout = window.matchMedia("(min-width: 1024px)");

	function getGroupChips(groupName: FacetKey): HTMLButtonElement[] {
		return Array.from(
			document.querySelectorAll<HTMLButtonElement>(`[data-filter-chip="${groupName}"]`),
		);
	}

	function getAllChip(groupName: FacetKey): HTMLButtonElement | null {
		return document.querySelector<HTMLButtonElement>(`[data-filter-all="${groupName}"]`);
	}

	function getMoreButton(groupName: FacetKey): ExpandableFilterButton | null {
		return document.querySelector<ExpandableFilterButton>(`[data-filter-more="${groupName}"]`);
	}

	function getGroupLimit(groupName: FacetKey): number {
		const group = groupElements.find((element) => element.dataset.filterGroup === groupName);
		return Number(group?.dataset.filterLimit ?? 0);
	}

	function getValidValues(groupName: FacetKey): Set<string> {
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

		const scopeParam = params.get(SCOPE_QUERY_KEY) ?? "";
		const legacyType = params.get("type") ?? "";
		const nextScope = (scopeParam || LEGACY_TYPE_TO_SCOPE[legacyType] || "") as CenterScope;
		scope = scopeButtons.some((button) => button.dataset.scopeValue === nextScope)
			? nextScope
			: "";

		for (const key of facetKeys) {
			const validValues = getValidValues(key);
			state[key].clear();
			// Выбор в группе один, поэтому из ссылки берём первое валидное
			// значение: старая ссылка с двумя странами не должна воскрешать
			// мультивыбор.
			const value = params.getAll(key).find((candidate) => validValues.has(candidate));
			if (value) state[key].add(value);
		}

		// Подсказки не открываем: при загрузке по ссылке с ?q= инпут не в
		// фокусе, и закрыть дропдаун было бы нечем. Фокус в поле сам вызовет
		// updateSuggestions.
	}

	function writeStateToUrl() {
		const url = new URL(window.location.href);
		const query = searchQuery.trim();

		url.searchParams.delete("q");
		url.searchParams.delete(SCOPE_QUERY_KEY);
		url.searchParams.delete("type");
		for (const key of facetKeys) url.searchParams.delete(key);

		if (query) url.searchParams.set("q", query);
		if (scope) url.searchParams.set(SCOPE_QUERY_KEY, scope);
		for (const key of facetKeys) {
			for (const value of state[key]) url.searchParams.append(key, value);
		}

		window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
	}

	// `scroll-behavior: auto` из `[data-motion="off"]` не помогает: явный
	// `behavior: "smooth"` в scrollTo/scrollIntoView перебивает CSS-свойство.
	// Поэтому тумблер приходится читать руками — иначе он гасит весь сайт,
	// кроме доводки каталога.
	function getScrollBehavior(): ScrollBehavior {
		const motionOff = document.documentElement.dataset.motion === "off";
		return motionOff || prefersReducedMotion.matches ? "auto" : "smooth";
	}

	function scrollToCards() {
		if (isDesktopLayout.matches) return;
		cardsGridElement.scrollIntoView({ behavior: getScrollBehavior(), block: "start" });
	}

	function countActiveFilters() {
		return (
			facetKeys.reduce((total, key) => total + state[key].size, 0) + (scope ? 1 : 0)
		);
	}

	function updateFiltersBadge() {
		const total = countActiveFilters();
		const hasSearchQuery = searchQuery.trim().length > 0;
		if (filtersBadge) {
			filtersBadge.textContent = String(total);
			filtersBadge.classList.toggle("hidden", total === 0);
		}
		// Счётчик — постоянный якорь каталога: сколько всего центров видно
		// уже при загрузке. Поэтому бар не прячем, прячем только сброс,
		// когда сбрасывать нечего.
		const hasAnything = total > 0 || hasSearchQuery;
		filtersResetButtons.forEach((button) => {
			button.hidden = !hasAnything;
		});
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

	function getChipMeta(groupName: FacetKey, value: string) {
		const chip = getGroupChips(groupName).find(
			(item) => (item.dataset.filterValue ?? "") === value,
		);
		if (!chip) return { label: value, flag: "" };
		const labelEl = chip.querySelector<HTMLElement>("[data-chip-label]");
		const flagEl = chip.querySelector<HTMLElement>(".leading-none");
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

		if (scope) {
			const button = scopeButtons.find((item) => item.dataset.scopeValue === scope);
			const label = button?.querySelector("span")?.textContent?.trim() ?? scope;
			activeFiltersTokens.append(createToken(label, () => setScope("")));
		}

		for (const key of facetKeys) {
			for (const value of state[key]) {
				const { label, flag } = getChipMeta(key, value);
				activeFiltersTokens.append(createToken(label, () => toggleChip(key, value), flag));
			}
		}

		const query = searchQuery.trim();
		if (query) {
			activeFiltersTokens.append(createToken(`«${query}»`, clearSearchQuery));
		}
	}

	function clearSearchQuery() {
		// Иначе отложенный дебаунс-таймер воскресит только что стёртый запрос.
		window.clearTimeout(searchTimer);
		searchQuery = "";
		if (searchInput) {
			searchInput.value = "";
			searchInput.focus();
		}
		updateSearchClear();
		hideSuggestions();
		scheduleApplyFilters(false);
	}

	function matchesScope(item: CardIndexItem) {
		return !scope || item.scope === scope;
	}

	function matchesSearch(item: CardIndexItem) {
		return !searchMatchIds || searchMatchIds.has(item.id);
	}

	/**
	 * Совпадение по всем осям, кроме `skipKey`.
	 *
	 * Пропуск собственной оси — это и есть правило подсчёта фасетов: цифра
	 * рядом со «Свердловской областью» должна показывать, сколько карточек
	 * останется, если её выбрать, а не сколько их при уже выбранном другом
	 * регионе (там всегда ноль).
	 */
	function matchesExcept(item: CardIndexItem, skipKeys: readonly FacetKey[] | null) {
		if (!matchesScope(item) || !matchesSearch(item)) return false;
		for (const key of facetKeys) {
			if (skipKeys?.includes(key)) continue;
			const selected = state[key];
			if (selected.size > 0 && !selected.has(item.facets[key])) return false;
		}
		return true;
	}

	function countFacet(groupName: FacetKey) {
		const skip = [groupName, ...(FACET_CHILDREN[groupName] ?? [])];
		const counts = new Map<string, number>();
		for (const item of cardsIndex) {
			if (!matchesExcept(item, skip)) continue;
			const value = item.facets[groupName];
			if (!value) continue;
			counts.set(value, (counts.get(value) ?? 0) + 1);
		}
		return counts;
	}

	/**
	 * Счётчики корня считаются без географии вообще: она вся под ним, и
	 * «Зарубеж 194» не должно превращаться в «Зарубеж 0» только потому, что
	 * сейчас выбран Пермский край.
	 */
	function countScopes() {
		const counts = new Map<string, number>();
		for (const item of cardsIndex) {
			if (!matchesSearch(item)) continue;
			let matches = true;
			for (const key of facetKeys) {
				if (GEO_FACETS.includes(key)) continue;
				const selected = state[key];
				if (selected.size > 0 && !selected.has(item.facets[key])) {
					matches = false;
					break;
				}
			}
			if (matches) counts.set(item.scope, (counts.get(item.scope) ?? 0) + 1);
		}
		return counts;
	}

	function isSectionVisible(gate: FilterGate, key: FacetKey) {
		switch (gate) {
			case "ru":
				return scope === "ru";
			case "world":
				return scope !== "ru" && scope !== "online";
			// 42 зарубежные страны плоским списком — ровно та проблема, ради
			// которой заведены макрорегионы. Под «Все» страна ждёт выбора
			// корзины; под «Зарубеж» пользователь уже сузил каталог сам, и
			// порог «показать ещё» там честно работает.
			case "country":
				return scope === "abroad" || (state.macro?.size ?? 0) > 0;
			// Регион имеет смысл, только когда география уже сужена: список из
			// 79 регионов вперемешку с казахстанскими областями не читается, а
			// «Казахстан + Пермский край» — кликабельная комбинация, дающая
			// ноль. Сузить может любой из трёх уровней выше — корень «Россия»,
			// федеральный округ или страна.
			case "region":
				return (
					scope === "ru" || (state.okrug?.size ?? 0) > 0 || (state.country?.size ?? 0) > 0
				);
			// Тот самый случай из постановки: Киев — город, Украина — страна,
			// и город показывается только внутри своей страны или своего
			// региона.
			case "city":
				return (state.region?.size ?? 0) > 0 || (state.country?.size ?? 0) > 0;
			default:
				return key.length > 0;
		}
	}

	/**
	 * Выбранные значения, которые обнулились после изменения родителя.
	 * Выбрал Украину, потом переключил на Казахстан — Киев остаётся активным и
	 * схлопывает выдачу в ноль, хотя его чип уже скрыт.
	 */
	function pruneEmptySelections() {
		let pruned = false;
		for (const key of facetKeys) {
			if (state[key].size === 0) continue;
			const counts = countFacet(key);
			for (const value of [...state[key]]) {
				if ((counts.get(value) ?? 0) === 0) {
					state[key].delete(value);
					pruned = true;
				}
			}
		}
		return pruned;
	}

	function renderFacets() {
		for (const section of sections) {
			const key = section.dataset.filterSection ?? "";
			const gate = (section.dataset.filterGate ?? "always") as FilterGate;
			const counts = countFacet(key);
			const selected = state[key] ?? new Set<string>();
			const limit = getGroupLimit(key);
			const moreButton = getMoreButton(key);
			const isExpanded = moreButton?.dataset.expanded === "true";

			let shown = 0;
			let hidden = 0;

			for (const chip of getGroupChips(key)) {
				const value = chip.dataset.filterValue ?? "";
				const count = counts.get(value) ?? 0;
				const isActive = selected.has(value);
				const countEl = chip.querySelector<HTMLElement>("[data-chip-count]");
				if (countEl) countEl.textContent = String(count);

				chip.toggleAttribute("data-active", isActive);
				chip.setAttribute("aria-pressed", String(isActive));

				// Активный чип виден всегда, даже если оказался за порогом:
				// иначе снять фильтр можно было бы только через токен наверху.
				if (count === 0 && !isActive) {
					chip.hidden = true;
					continue;
				}

				const overLimit = limit > 0 && shown >= limit && !isActive && !isExpanded;
				chip.hidden = overLimit;
				if (overLimit) hidden += 1;
				else shown += 1;
			}

			const allChip = getAllChip(key);
			const isAllActive = selected.size === 0;
			allChip?.toggleAttribute("data-active", isAllActive);
			allChip?.setAttribute("aria-pressed", String(isAllActive));

			if (moreButton) {
				moreButton.hidden = hidden === 0 && !isExpanded;
				moreButton.textContent = isExpanded
					? (moreButton.dataset.showLess ?? "")
					: (moreButton.dataset.showMore ?? "").replace("__COUNT__", String(hidden));
			}

			// Секция без опций — это пустая рамка с одной кнопкой «все»,
			// поэтому прячем её целиком, а не только её содержимое.
			section.hidden = !isSectionVisible(gate, key) || shown === 0;
		}

		const scopeCounts = countScopes();
		let scopeTotal = 0;
		for (const button of scopeButtons) {
			const value = button.dataset.scopeValue ?? "";
			const isActive = scope === value;
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
		scopeAllButton?.toggleAttribute("data-active", scope === "");
		scopeAllButton?.setAttribute("aria-pressed", String(scope === ""));
		scopeGroup?.toggleAttribute("hidden", scopeButtons.length === 0);
	}

	function clearDescendants(groupName: FacetKey) {
		for (const child of FACET_CHILDREN[groupName] ?? []) {
			state[child]?.clear();
		}
	}

	/**
	 * Внутри группы выбор один.
	 *
	 * Мультивыбор здесь читался как «СНГ и Азия одновременно» — сумма двух
	 * веток дерева, у которой нет ни одного общего потомка, и следующий
	 * уровень после неё показывать нечего. Повторный клик по активному
	 * значению снимает его и возвращает группу в «все».
	 */
	function toggleChip(groupName: FacetKey, value: string) {
		const groupState = state[groupName];
		if (!groupState) return;

		const wasActive = groupState.has(value);
		groupState.clear();
		if (!wasActive) groupState.add(value);

		// Сменил страну — город прежней страны уходит вместе с ней. Иначе он
		// остался бы активным токеном, который тихо схлопывает выдачу в ноль.
		clearDescendants(groupName);
		pruneEmptySelections();
		scheduleApplyFilters(true);
	}

	function resetGroup(groupName: FacetKey) {
		state[groupName]?.clear();
		clearDescendants(groupName);
		scheduleApplyFilters(true);
	}

	function setScope(next: CenterScope) {
		scope = scope === next ? "" : next;
		// Корень обнуляет географию целиком: федеральных округов не бывает в
		// зарубежье, а стран — внутри России.
		for (const key of GEO_FACETS) state[key]?.clear();
		scheduleApplyFilters(true);
	}

	function resetFilters() {
		window.clearTimeout(searchTimer);
		for (const key of facetKeys) state[key].clear();
		scope = "";
		searchQuery = "";
		if (searchInput) searchInput.value = "";
		hideSuggestions();
		scheduleApplyFilters(true);
	}

	function getFallbackSearchItems(): SearchIndexItem[] {
		return cardsIndex.map(({ element: _element, facets: _facets, scope: _scope, ...item }) => item);
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

	/**
	 * Поисковый индекс приезжает отдельным JSON и знает только текст. Ключи
	 * фасетов остаются от карточки в DOM: индекс их не переопределяет, иначе
	 * фильтр разъехался бы с разметкой.
	 */
	function mergeWithCard(item: SearchIndexItem): CardIndexItem | null {
		const indexed = cardById.get(item.id);
		if (!indexed) return null;
		return { ...indexed, ...item, facets: indexed.facets, scope: indexed.scope, element: indexed.element };
	}

	function withCardElements(items: SearchIndexItem[]): CardIndexItem[] {
		return items
			.map(mergeWithCard)
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
							{ name: "region", weight: 0.12 },
							{ name: "category", weight: 0.06 },
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
				const item = mergeWithCard(result.item);
				return item ? { item, score: result.score ?? 1 } : null;
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

		searchResults.slice(0, 8).forEach(({ item }) => {
			const matchingTerm = item.terms.find((term) => normalize(term).includes(normalizedQuery));
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
		window.clearTimeout(searchTimer);
		searchQuery = value;
		if (searchInput) searchInput.value = value;
		syncSearchActions();
		hideSuggestions();
		scheduleApplyFilters(true);
	}

	function toggleOverflow(groupName: FacetKey) {
		const moreButton = getMoreButton(groupName);
		if (!moreButton) return;
		moreButton.dataset.expanded = String(moreButton.dataset.expanded !== "true");
		renderFacets();
	}

	async function applyFilters(shouldScrollToCards = false) {
		const query = searchQuery.trim();
		const rankedResults = await getSearchResults(query);
		if (query !== searchQuery.trim()) return;

		const searchOrder = new Map(rankedResults.map((result, index) => [result.item.id, index]));
		searchMatchIds = query ? new Set(rankedResults.map((result) => result.item.id)) : null;

		// Пересчёт после поиска: запрос сужает выдачу так же, как фильтр, и
		// выбранное значение могло обнулиться вместе с ним.
		pruneEmptySelections();

		let visible = 0;
		const orderedIndex = query
			? [...cardsIndex].sort((a, b) => {
					const left = searchOrder.get(a.id) ?? Number.MAX_SAFE_INTEGER;
					const right = searchOrder.get(b.id) ?? Number.MAX_SAFE_INTEGER;
					return left - right || a.order - b.order;
				})
			: cardsIndex;

		const shouldReorderGrid = Boolean(query) || gridReordered;
		orderedIndex.forEach((item) => {
			const show = matchesExcept(item, null);
			item.element.hidden = !show;
			if (shouldReorderGrid) cardsGridElement.append(item.element);
			if (show) visible += 1;
		});
		gridReordered = Boolean(query);

		renderFacets();
		noResultsElement.hidden = visible > 0;
		updateFiltersBadge();
		updateResultsCount(visible);
		updateSearchClear();
		renderActiveFilters();
		writeStateToUrl();
		if (shouldScrollToCards) scrollToCards();
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

		// Кнопка живёт в липкой панели и едет вместе со скроллом, а сами
		// фильтры остались в потоке. Без доводки тап в глубине каталога
		// раскрыл бы их за экраном. Целимся не в саму секцию, а под нижнюю
		// кромку липкой панели — её высота меняется вместе с активными
		// фильтрами, поэтому берём фактическую, а не константу.
		if (isHidden && !isDesktopLayout.matches && filtersShell) {
			const barBottom = stickyBar?.getBoundingClientRect().bottom ?? 0;
			const target =
				filtersShell.getBoundingClientRect().top + window.scrollY - barBottom - 8;
			window.scrollTo({ top: Math.max(target, 0), behavior: getScrollBehavior() });
		}
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

	for (const key of facetKeys) {
		getAllChip(key)?.addEventListener("click", () => resetGroup(key));
		getMoreButton(key)?.addEventListener("click", () => toggleOverflow(key));
		for (const chip of getGroupChips(key)) {
			chip.addEventListener("click", () => {
				const value = chip.dataset.filterValue ?? "";
				if (value) toggleChip(key, value);
			});
		}
	}

	for (const button of scopeButtons) {
		button.addEventListener("click", () => setScope(button.dataset.scopeValue as CenterScope));
	}
	scopeAllButton?.addEventListener("click", () => setScope(""));

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
		// Быстрый рефокус не должен дать отложенному blur-таймеру погасить
		// только что открытые подсказки.
		window.clearTimeout(blurTimer);
		void updateSuggestions();
	});
	searchInput?.addEventListener("blur", () => {
		blurTimer = window.setTimeout(hideSuggestions, 120);
	});

	readStateFromUrl();
	renderFacets();
	void applyFilters();
}
