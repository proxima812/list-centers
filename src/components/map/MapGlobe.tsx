import { useMemo } from "react";
import {
  centerX,
  centerY,
  clamp,
  makeLinePath,
  projectPoint,
  radius,
} from "./mapMath";
import MapText from "./MapText";
import type { MapCenter, MapCopy, MapCountry, Rotation } from "./types";

type PointGroup = {
  lat: number;
  lng: number;
  color: string;
  softColor: string;
  centers: MapCenter[];
};

type MapGlobeProps = {
  copy: MapCopy;
  centers: MapCenter[];
  countries: MapCountry[];
  activeId?: string;
  rotation: Rotation;
  onRotationChange: (rotation: Rotation) => void;
  onInteraction: () => void;
  onSelect: (center: MapCenter) => void;
};

const countryFills = ["#e8dec3", "#dbe8d9", "#d8e5ee", "#ead8ca", "#dde0c4"];
const continentLabels = [
  { key: "europe", lat: 50, lng: 15 },
  { key: "asia", lat: 46, lng: 82 },
  { key: "africa", lat: 3, lng: 20 },
  { key: "northAmerica", lat: 48, lng: -106 },
  { key: "southAmerica", lat: -24, lng: -60 },
  { key: "australia", lat: -25, lng: 135 },
];

const getCountryFill = (name: string) => {
  let hash = 0;
  for (let index = 0; index < name.length; index += 1)
    hash += name.charCodeAt(index);
  return countryFills[hash % countryFills.length];
};

export default function MapGlobe({
  copy,
  centers,
  countries,
  activeId,
  rotation,
  onRotationChange,
  onInteraction,
  onSelect,
}: MapGlobeProps) {
  const pointGroups = useMemo(
    () =>
      Array.from(
        centers
          .reduce((groups, center) => {
            const key = `${center.lat.toFixed(3)}:${center.lng.toFixed(3)}:${center.color}`;
            const group = groups.get(key) ?? {
              lat: center.lat,
              lng: center.lng,
              color: center.color,
              softColor: center.softColor,
              centers: [],
            };
            group.centers.push(center);
            groups.set(key, group);
            return groups;
          }, new Map<string, PointGroup>())
          .values(),
      ),
    [centers],
  );

  const gridPaths = useMemo(() => {
    const paths: string[] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const points = [];
      for (let lng = -180; lng <= 180; lng += 5) points.push({ lat, lng });
      const d = makeLinePath(points, rotation);
      if (d) paths.push(d);
    }
    for (let lng = -150; lng <= 180; lng += 30) {
      const points = [];
      for (let lat = -85; lat <= 85; lat += 5) points.push({ lat, lng });
      const d = makeLinePath(points, rotation);
      if (d) paths.push(d);
    }
    return paths;
  }, [rotation]);

  const countryPaths = useMemo(
    () =>
      countries.flatMap((country) => {
        const pathParts: string[] = [];
        let visibleDepth = 0;
        let visiblePoints = 0;

        for (const polygon of country.polygons) {
          for (const ring of polygon) {
            let drawing = false;
            for (const coordinate of ring) {
              const [lng, lat] = coordinate;
              const point = projectPoint(lat, lng, rotation);
              if (point.depth <= -0.04) {
                drawing = false;
                continue;
              }
              pathParts.push(
                `${drawing ? "L" : "M"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
              );
              visibleDepth += point.depth;
              visiblePoints += 1;
              drawing = true;
            }
            if (drawing) pathParts.push("Z");
          }
        }

        if (!pathParts.length || !visiblePoints) return [];
        const depth = visibleDepth / visiblePoints;
        return [
          {
            id: country.id,
            name: country.name,
            d: pathParts.join(" "),
            opacity: clamp(depth * 0.34 + 0.58, 0.26, 0.9),
          },
        ];
      }),
    [countries, rotation],
  );

  return (
    <div className="relative z-0 flex min-w-0 items-center justify-center lg:min-h-[700px]">
      <svg
        className="block h-[min(48svh,520px)] min-h-[300px] w-full max-w-[900px] touch-none text-depth-500 sm:min-h-[420px] lg:h-[min(74svh,820px)] lg:min-h-[640px]"
        viewBox="0 0 760 760"
        role="img"
        aria-label={copy.title}
        onPointerDown={(event) => {
          onInteraction();
          const start = { x: event.clientX, y: event.clientY, rotation };
          event.currentTarget.setPointerCapture(event.pointerId);

          const move = (moveEvent: PointerEvent) => {
            const dx = moveEvent.clientX - start.x;
            const dy = moveEvent.clientY - start.y;
            onRotationChange({
              lng: start.rotation.lng - dx * 0.35,
              lat: clamp(start.rotation.lat + dy * 0.35, -70, 70),
            });
          };
          const cleanup = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", cleanup);
            window.removeEventListener("pointercancel", cleanup);
          };

          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", cleanup);
          window.addEventListener("pointercancel", cleanup);
        }}
      >
        <defs>
          <radialGradient id="globe-depth" cx="34%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#fbfdff" stopOpacity="1" />
            <stop offset="48%" stopColor="#edf7fb" stopOpacity="0.98" />
            <stop offset="78%" stopColor="#d7e9f0" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#9ab8c8" stopOpacity="0.56" />
          </radialGradient>
          <radialGradient id="globe-glow" cx="27%" cy="22%" r="38%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <clipPath id="globe-clip">
            <circle cx={centerX} cy={centerY} r={radius} />
          </clipPath>
          <filter
            id="globe-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="18"
              stdDeviation="18"
              floodColor="#355464"
              floodOpacity="0.16"
            />
          </filter>
          <filter id="pin-shadow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="4"
              floodColor="#0f172a"
              floodOpacity="0.18"
            />
          </filter>
        </defs>
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="#edf7fb"
          stroke="#9bb9c6"
          strokeWidth="1.35"
          filter="url(#globe-shadow)"
        />
        <circle cx={centerX} cy={centerY} r={radius} fill="url(#globe-depth)" />
        <circle cx={centerX} cy={centerY} r={radius} fill="url(#globe-glow)" />
        <g clipPath="url(#globe-clip)">
          {gridPaths.map((d, index) => (
            <path
              key={`grid-${index}`}
              d={d}
              fill="none"
              stroke="#7ea4b4"
              strokeWidth="0.9"
              opacity={index < 5 ? "0.24" : "0.2"}
            />
          ))}
          {countryPaths.map((country) => (
            <path
              key={country.id}
              d={country.d}
              fill={getCountryFill(country.name)}
              stroke="#8fb0b6"
              strokeWidth="0.72"
              strokeLinejoin="round"
              fillRule="evenodd"
              opacity={country.opacity}
            />
          ))}
          {continentLabels.map((label) => {
            const point = projectPoint(label.lat, label.lng, rotation);
            if (!point.visible || point.depth < 0.1) return null;
            return (
              <MapText
                key={label.key}
                value={copy.continents[label.key] ?? label.key}
                x={point.x}
                y={point.y}
                fill="rgba(29,29,29,0.62)"
                size={15}
                weight={800}
                opacity={clamp(point.depth, 0.34, 0.72)}
              />
            );
          })}
          {pointGroups.map((cluster) => {
            const point = projectPoint(cluster.lat, cluster.lng, rotation);
            if (!point.visible) return null;
            const activeCenter =
              cluster.centers.find((center) => center.id === activeId) ??
              cluster.centers[0];
            const isActive = activeCenter.id === activeId;
            const clusterRadius = clamp(
              6 + Math.sqrt(cluster.centers.length) * 2.2,
              7,
              24,
            );
            const haloRadius = isActive
              ? clusterRadius + 22
              : clusterRadius + 11;

            return (
              <g
                key={`${cluster.lat}:${cluster.lng}:${cluster.color}`}
                role="button"
                tabIndex={0}
                aria-label={activeCenter.title}
                style={{ cursor: "pointer" }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => onSelect(activeCenter)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(activeCenter);
                  }
                }}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={haloRadius}
                  fill={cluster.softColor}
                  stroke={cluster.color}
                  strokeWidth={isActive ? "2" : "1"}
                  opacity={clamp(point.depth, isActive ? 0.52 : 0.34, 0.9)}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? clusterRadius + 2.5 : clusterRadius}
                  fill={cluster.color}
                  stroke="white"
                  strokeWidth="4"
                  filter="url(#pin-shadow)"
                  opacity={clamp(point.depth, 0.45, 1)}
                />
                {cluster.centers.length > 1 ? (
                  <text
                    x={point.x}
                    y={point.y + 0.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={cluster.centers.length > 99 ? 10 : 11}
                    fontWeight="850"
                    fill="white"
                    pointerEvents="none"
                  >
                    {cluster.centers.length}
                  </text>
                ) : null}
                {isActive ? (
                  <MapText
                    value={[activeCenter.city, activeCenter.country]
                      .filter(Boolean)
                      .join(", ")}
                    x={point.x}
                    y={point.y - (haloRadius + 14)}
                    fill={activeCenter.color}
                    size={17}
                    weight={850}
                  />
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
