import type { MapCenter, MapCopy } from "./types";

type MapPanelProps = {
  copy: MapCopy;
  centers: MapCenter[];
  activeCenter?: MapCenter;
  search: string;
  loading: boolean;
  error: boolean;
  onSearch: (value: string) => void;
  onSelect: (center: MapCenter) => void;
};

export default function MapPanel({
  copy,
  centers,
  activeCenter,
  search,
  loading,
  error,
  onSearch,
  onSelect,
}: MapPanelProps) {
  const normalizedSearch = search.trim().toLowerCase();
  const visibleCenters = normalizedSearch
    ? centers.filter((center) => center.searchText?.includes(normalizedSearch))
    : centers;
  const detailTitle = error
    ? copy.loadError
    : loading
      ? copy.loading
      : activeCenter?.title || copy.empty;
  const detailLocation =
    activeCenter?.precision === "exact" && activeCenter.address
      ? activeCenter.address
      : activeCenter?.location || activeCenter?.address || "";

  return (
    <aside className="flex min-h-0 min-w-0 flex-col border-t border-border-muted pt-4 lg:max-h-[calc(100svh-10rem)] lg:border-t-0 lg:border-l lg:py-1 lg:pl-6">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-subtle-foreground">
          {copy.selected}
        </p>
        <h2 className="mt-0.5 text-lg font-bold tracking-tight text-foreground">
          {detailTitle}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {detailLocation}
        </p>
        <p className="mt-1 text-xs font-semibold text-subtle-foreground">
          {activeCenter?.precisionLabel || ""}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={activeCenter?.href || "/centers/"}
          aria-disabled={!activeCenter}
          className={`inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold no-underline transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            activeCenter
              ? "text-primary-foreground"
              : "pointer-events-none text-primary-foreground/60"
          }`}
        >
          {copy.openCenter}
        </a>
        <a
          href={activeCenter?.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-disabled={!activeCenter?.mapUrl}
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold no-underline ring ring-border-muted transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            activeCenter?.mapUrl
              ? "text-foreground hover:bg-muted"
              : "pointer-events-none text-muted-foreground/50"
          }`}
        >
          {copy.openMap}
        </a>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-foreground">{copy.listTitle}</h3>
        <p className="text-xs font-semibold text-muted-foreground">
          {visibleCenters.length}
        </p>
      </div>
      <label className="sr-only" htmlFor="map-center-search">
        {copy.search}
      </label>
      <input
        id="map-center-search"
        type="search"
        value={search}
        placeholder={copy.searchPlaceholder}
        onChange={(event) => onSearch(event.currentTarget.value)}
        className="mt-3 w-full rounded-full border border-border-muted bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-foreground"
      />
      <div className="mt-3 flex max-h-[320px] flex-col overflow-y-auto border-y border-border-muted lg:max-h-none lg:flex-1">
        {visibleCenters.map((center) => {
          const isActive = center.id === activeCenter?.id;
          return (
            <button
              key={center.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(center)}
              className={`group flex w-full items-start gap-3 border-b border-border-muted px-1 py-3 text-left last:border-b-0 hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${
                isActive
                  ? "bg-muted shadow-[inset_3px_0_0_var(--color-foreground)]"
                  : ""
              }`}
            >
              <span
                className="mt-1.5 size-2.5 shrink-0 rounded-full ring-4"
                style={{
                  background: center.color,
                  ["--tw-ring-color" as string]: center.softColor,
                }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {center.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {center.location || center.address || ""}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {center.precisionLabel || ""}
              </span>
            </button>
          );
        })}
        {visibleCenters.length === 0 ? (
          <p className="px-1 py-4 text-sm text-muted-foreground">
            {copy.noResults}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
