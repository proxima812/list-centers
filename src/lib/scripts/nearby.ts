import { matchCity, matchCountry } from "@/data/geo/detect";
import { countryFlagsByRu, getCountryLabel } from "@/data/worldCountries";
import { getCenterMarkHue } from "@/lib/center/centers";
import { syncSavedCenters } from "@/lib/scripts/savedCentersUi";
import { CARD_ATTR, CARD_PART, cardDataset } from "@/lib/site/cardAttributes";
import type { NearbyIndexItem } from "@/lib/types";

const COUNTRY_PARAM = "country";
const CITY_PARAM = "city";

/**
 * Страница «центры рядом»: индекс карточек, определение страны и ручной выбор.
 *
 * Разметку держит `components/nearby`, тексты приезжают из `data-*` на корне -
 * скрипт уезжает в браузерный бандл и словарь `useTranslations` ему недоступен.
 */
export function initNearby() {
	const root = document.querySelector<HTMLElement>("[data-nearby]");
	const place = root?.querySelector<HTMLElement>("[data-nearby-place]");
	const flagNode = root?.querySelector<HTMLElement>("[data-nearby-flag]");
	const labelNode = root?.querySelector<HTMLElement>("[data-nearby-label]");
	const countrySelect = root?.querySelector<HTMLSelectElement>("[data-nearby-country]");
	const status = root?.querySelector<HTMLElement>("[data-nearby-status]");
	const cities = root?.querySelector<HTMLElement>("[data-nearby-cities]");
	const grid = root?.querySelector<HTMLElement>("[data-nearby-grid]");
	const empty = root?.querySelector<HTMLElement>("[data-nearby-empty]");
	const emptyText = root?.querySelector<HTMLElement>("[data-nearby-empty-text]");
	const chipTemplate = root?.querySelector<HTMLTemplateElement>("[data-nearby-chip]");
	const cardTemplate = root?.querySelector<HTMLTemplateElement>("[data-nearby-card]");

	if (
		!root ||
		!place ||
		!flagNode ||
		!labelNode ||
		!countrySelect ||
		!status ||
		!cities ||
		!grid ||
		!empty ||
		!emptyText ||
		!chipTemplate ||
		!cardTemplate
	) {
		return;
	}

	const strings = {
		failed: root.dataset.textFailed ?? "",
		count: root.dataset.textCount ?? "",
		empty: root.dataset.textEmpty ?? "",
	};

	const dateFormat = new Intl.DateTimeFormat(document.documentElement.lang || "ru", {
		month: "short",
		year: "numeric",
	});

	let index: NearbyIndexItem[] = [];
	let country = "";
	let city = "";

	// Определиться можно и в стране, которой нет в каталоге: в списке её тогда
	// нет, а назвать посетителю его страну всё равно надо.
	const locale = document.documentElement.lang === "en" ? "en" : "ru";
	const optionFor = (value: string) =>
		[...countrySelect.options].find((option) => option.value === value);

	const labelOf = (value: string) =>
		optionFor(value)?.dataset.label ?? getCountryLabel(value, locale);

	const flagOf = (value: string) =>
		optionFor(value)?.dataset.flag ?? countryFlagsByRu[value] ?? "";

	/** Пустую часть прячем: иначе остаются висящие разделители и чипы. */
	const fill = (node: ParentNode, part: keyof typeof CARD_PART, value: string) => {
		const target = node.querySelector<HTMLElement>(`[${CARD_PART[part]}]`);
		if (!target) return;

		target.textContent = value;
		target.hidden = value.length === 0;
	};

	const formatDate = (value: string) => {
		if (!value) return "";

		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? "" : dateFormat.format(date);
	};

	function renderCards(list: NearbyIndexItem[]) {
		const fragment = document.createDocumentFragment();

		for (const item of list) {
			const node = cardTemplate!.content.cloneNode(true) as DocumentFragment;
			const article = node.querySelector<HTMLElement>(`[${CARD_ATTR.id}]`);
			const link = node.querySelector<HTMLAnchorElement>(`[${CARD_PART.link}]`);
			if (!article || !link) continue;

			// Полный набор атрибутов, а не один id: с него читает кнопка
			// «сохранить», и без него в localStorage уехала бы пустая карточка.
			const dataset = cardDataset({
				id: item.id,
				scope: "",
				macro: "",
				okrug: "",
				country: item.country,
				region: "",
				city: item.city,
				type: item.type,
				category: item.category,
				title: item.title,
				summary: item.summary,
				flag: item.flag,
				pubDate: item.pubDate,
				href: item.href,
			});
			for (const [name, value] of Object.entries(dataset)) article.setAttribute(name, value);

			node
				.querySelector<HTMLElement>(`[${CARD_PART.mark}]`)
				?.style.setProperty("--mark-hue", String(getCenterMarkHue(item.id)));

			link.href = item.linkHref;
			link.textContent = item.title;

			// Заготовка держит место под широкую кнопку «удалить» с /saved,
			// а здесь в углу обычная закладка — возвращаем отступ каталога.
			node
				.querySelector<HTMLElement>(`[${CARD_PART.location}]`)
				?.classList.replace("pr-24", "pr-9");

			const saveButton = node.querySelector<HTMLElement>("[data-save-center]");
			if (saveButton && item.title) {
				// Подпись читает `syncSavedCenters`, поэтому имя дописываем в
				// сам контракт, а не в aria-label поверх него.
				saveButton.dataset.labelSave = `${saveButton.dataset.labelSave}: ${item.title}`;
				saveButton.dataset.labelRemove = `${saveButton.dataset.labelRemove}: ${item.title}`;
			}

			fill(node, "flag", item.flag);
			fill(node, "city", item.city);
			fill(node, "country", item.countryLabel);
			fill(node, "summary", item.summary);
			fill(node, "category", item.category);
			fill(node, "type", item.type);
			fill(node, "date", formatDate(item.pubDate));

			const separator = node.querySelector<HTMLElement>(`[${CARD_PART.separator}]`);
			if (separator) separator.hidden = !(item.city && item.countryLabel);

			fragment.append(node);
		}

		grid!.replaceChildren(fragment);
		grid!.hidden = list.length === 0;
		// Кнопки «сохранить» появились только что: без пересинхронизации
		// уже сохранённая карточка выглядела бы несохранённой.
		syncSavedCenters();
	}

	function renderCities(list: NearbyIndexItem[]) {
		const counts = new Map<string, number>();
		for (const item of list) {
			if (!item.city) continue;
			counts.set(item.city, (counts.get(item.city) ?? 0) + 1);
		}

		const options = [...counts.entries()].sort(
			(left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "ru"),
		);

		// Один город на всю страну фильтром не является.
		if (options.length < 2) {
			cities!.replaceChildren();
			cities!.hidden = true;
			return;
		}

		const fragment = document.createDocumentFragment();
		const entries: Array<[string, string, number]> = [
			["", cities!.dataset.allLabel ?? "", list.length],
			...options.map(([name, count]) => [name, name, count] as [string, string, number]),
		];

		for (const [value, label, count] of entries) {
			const node = chipTemplate!.content.cloneNode(true) as DocumentFragment;
			const button = node.querySelector<HTMLButtonElement>("[data-nearby-city]");
			if (!button) continue;

			button.dataset.value = value;
			button.setAttribute("aria-pressed", String(value === city));
			if (value === city) button.dataset.active = "";
			else delete button.dataset.active;

			const chipLabel = node.querySelector<HTMLElement>("[data-chip-label]");
			if (chipLabel) chipLabel.textContent = label;
			const countNode = node.querySelector<HTMLElement>("[data-chip-count]");
			if (countNode) countNode.textContent = String(count);

			fragment.append(node);
		}

		cities!.replaceChildren(fragment);
		cities!.hidden = false;
	}

	function render() {
		countrySelect!.value = country;

		const inCountry = index.filter((item) => item.country === country);
		const shown = city ? inCountry.filter((item) => item.city === city) : inCountry;

		if (country) {
			place!.hidden = false;
			const flag = flagOf(country);
			flagNode!.textContent = flag;
			flagNode!.hidden = flag.length === 0;
			labelNode!.textContent = city ? `${labelOf(country)}, ${city}` : labelOf(country);
		} else {
			place!.hidden = true;
		}

		renderCities(inCountry);
		renderCards(shown);

		const missing = country && inCountry.length === 0;
		empty!.hidden = !missing;
		if (missing) emptyText!.textContent = strings.empty.replace("{country}", labelOf(country));

		status!.textContent = country
			? strings.count.replace("{count}", String(shown.length))
			: strings.failed;

		const url = new URL(location.href);
		if (country) url.searchParams.set(COUNTRY_PARAM, country);
		else url.searchParams.delete(COUNTRY_PARAM);
		if (city) url.searchParams.set(CITY_PARAM, city);
		else url.searchParams.delete(CITY_PARAM);
		history.replaceState(null, "", `${url.pathname}${url.search}`);
	}

	async function detect(): Promise<{ country: string; city: string }> {
		try {
			const response = await fetch(root!.dataset.geoUrl ?? "", {
				headers: { Accept: "application/json" },
			});
			if (!response.ok) return { country: "", city: "" };

			const data: unknown = await response.json();
			if (typeof data !== "object" || data === null) return { country: "", city: "" };

			const raw = data as Record<string, unknown>;
			return {
				country: typeof raw.country === "string" ? raw.country : "",
				city: typeof raw.city === "string" ? raw.city : "",
			};
		} catch {
			// Функции нет (локальная сборка) или сеть отвалилась — не ошибка
			// страницы: ниже включится ручной выбор.
			return { country: "", city: "" };
		}
	}

	countrySelect.addEventListener("change", () => {
		country = countrySelect.value;
		city = "";
		render();
	});

	cities.addEventListener("click", (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const button = target.closest<HTMLElement>("[data-nearby-city]");
		if (!button) return;

		city = button.dataset.value ?? "";
		render();
	});

	void (async () => {
		const params = new URLSearchParams(location.search);
		const [loaded, detected] = await Promise.all([
			fetch(root.dataset.indexUrl ?? "")
				.then((response) => (response.ok ? (response.json() as Promise<NearbyIndexItem[]>) : []))
				.catch(() => [] as NearbyIndexItem[]),
			detect(),
		]);

		index = Array.isArray(loaded) ? loaded : [];

		const known = new Set(index.map((item) => item.country));
		// Ссылка важнее геолокации: по ней страницу и шлют друг другу.
		const asked = params.get(COUNTRY_PARAM) ?? "";
		country = known.has(asked) ? asked : matchCountry(detected.country);

		const inCountry = index.filter((item) => item.country === country);
		const cityNames = new Set(inCountry.map((item) => item.city).filter(Boolean));
		const askedCity = params.get(CITY_PARAM) ?? "";
		city = cityNames.has(askedCity) ? askedCity : matchCity(detected.city, cityNames);

		render();
	})();
}
