/**
 * Единственный владелец формата маршрутного id центра (`tbk-N`).
 * Всё, что разбирает или собирает этот id, ходит сюда: и сортировка, и
 * построение карты маршрутов. Раньше регулярка жила в трёх файлах сразу.
 */

export const CENTER_ROUTE_PREFIX = "tbk-";
export const CENTER_ROUTE_ID_PATTERN = /^tbk-\d+$/;

export const isCenterRouteId = (id: string) => CENTER_ROUTE_ID_PATTERN.test(id);

export const centerRouteId = (index: number) => `${CENTER_ROUTE_PREFIX}${index}`;

/** Номер из `tbk-42` → 42. Для чужого id — `-1`, чтобы он уезжал в конец. */
export const centerRouteNumber = (id: string) =>
	isCenterRouteId(id) ? Number(id.slice(CENTER_ROUTE_PREFIX.length)) : -1;
