import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { clamp } from "./mapMath";
import type {
  MapCenter,
  MapCopy,
  MapCountry,
  MapPayload,
  Rotation,
} from "./types";

const MapGlobe = lazy(() => import("./MapGlobe"));
const MapPanel = lazy(() => import("./MapPanel"));

type MapClientProps = {
  copy: MapCopy;
  centersUrl: string;
  countriesUrl: string;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MapClient({
  copy,
  centersUrl,
  countriesUrl,
}: MapClientProps) {
  const [payload, setPayload] = useState<MapPayload>({
    centers: [],
    totalCenters: 0,
    exactCentersCount: 0,
    cityCentersCount: 0,
    countryCentersCount: 0,
  });
  const [countries, setCountries] = useState<MapCountry[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const [rotation, setRotation] = useState<Rotation>({ lat: 35, lng: 55 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [autoPausedUntil, setAutoPausedUntil] = useState(0);

  const centers = payload.centers;
  const activeCenter = useMemo(
    () => centers.find((center) => center.id === activeId),
    [activeId, centers],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadMapData() {
      try {
        const [centersResponse, countriesResponse] = await Promise.all([
          fetch(centersUrl, { signal: controller.signal }),
          fetch(countriesUrl, { signal: controller.signal }),
        ]);

        if (!centersResponse.ok || !countriesResponse.ok) {
          throw new Error("Map data request failed");
        }

        const [centersPayload, countriesPayload] = await Promise.all([
          centersResponse.json() as Promise<MapPayload>,
          countriesResponse.json() as Promise<MapCountry[]>,
        ]);

        setPayload(centersPayload);
        setCountries(countriesPayload);

        const firstCenter = centersPayload.centers[0];
        if (firstCenter) {
          setActiveId(firstCenter.id);
          setRotation({
            lat: firstCenter.lat ?? 35,
            lng: firstCenter.lng ?? 55,
          });
        }
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          console.error(caughtError);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadMapData();
    return () => controller.abort();
  }, [centersUrl, countriesUrl]);

  useEffect(() => {
    if (prefersReducedMotion() || !centers.length) return;

    let frame = 0;
    let lastFrame = 0;
    const tick = (time = 0) => {
      if (Date.now() > autoPausedUntil && time - lastFrame > 48) {
        lastFrame = time;
        setRotation((current) => ({ ...current, lng: current.lng + 0.045 }));
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [autoPausedUntil, centers.length]);

  const pauseAuto = () => setAutoPausedUntil(Date.now() + 12000);

  const selectCenter = (center: MapCenter) => {
    pauseAuto();
    setActiveId(center.id);
    setRotation({ lat: clamp(center.lat, -70, 70), lng: center.lng });
  };

  return (
    <section
      className="relative isolate min-h-[calc(100svh-4.75rem)] overflow-x-hidden px-5 py-5 sm:px-8 lg:px-12"
      aria-label={copy.title}
    >
      <header className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
            {copy.heading}
          </h1>
          <p className="mt-2 max-w-[52ch] text-base leading-7 text-muted-foreground">
            {copy.intro}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground sm:justify-end sm:text-right">
          <p>
            <strong className="text-foreground">{centers.length}</strong>{" "}
            {copy.countLabel}
          </p>
          <p>
            <strong className="text-foreground">
              {payload.exactCentersCount}
            </strong>{" "}
            {copy.exactLabel}
          </p>
          <p>
            <strong className="text-foreground">
              {payload.cityCentersCount}
            </strong>{" "}
            {copy.cityLabel}
          </p>
          <p>
            <strong className="text-foreground">
              {payload.countryCentersCount}
            </strong>{" "}
            {copy.countryLabel}
          </p>
          <p>
            <strong className="text-foreground">{payload.totalCenters}</strong>{" "}
            {copy.totalLabel}
          </p>
        </div>
      </header>

      <div className="mx-auto mt-6 grid min-w-0 max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-stretch">
        <Suspense
          fallback={
            <div
              className="min-h-[420px] lg:min-h-[700px]"
              aria-hidden="true"
            />
          }
        >
          <MapGlobe
            copy={copy}
            centers={centers}
            countries={countries}
            activeId={activeId}
            rotation={rotation}
            onRotationChange={setRotation}
            onInteraction={pauseAuto}
            onSelect={selectCenter}
          />
        </Suspense>
        <Suspense
          fallback={
            <div className="border-t border-border-muted pt-4 lg:border-l lg:pl-6" />
          }
        >
          <MapPanel
            copy={copy}
            centers={centers}
            activeCenter={activeCenter}
            search={search}
            loading={loading}
            error={error}
            onSearch={setSearch}
            onSelect={selectCenter}
          />
        </Suspense>
      </div>
    </section>
  );
}
