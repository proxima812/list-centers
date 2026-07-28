import type { Rotation } from "./types";

export const centerX = 380;
export const centerY = 380;
export const radius = 310;

export const toRad = (value: number) => (value * Math.PI) / 180;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const projectPoint = (lat: number, lng: number, rotation: Rotation) => {
  const phi = toRad(lat);
  const lambda = toRad(lng - rotation.lng);
  const tilt = toRad(rotation.lat);
  const cosPhi = Math.cos(phi);
  const x = radius * cosPhi * Math.sin(lambda);
  const y =
    -radius *
    (Math.sin(phi) * Math.cos(tilt) -
      cosPhi * Math.cos(lambda) * Math.sin(tilt));
  const z =
    Math.sin(phi) * Math.sin(tilt) + cosPhi * Math.cos(lambda) * Math.cos(tilt);

  return { x: centerX + x, y: centerY + y, visible: z > -0.03, depth: z };
};

export const makeLinePath = (
  points: Array<{ lat: number; lng: number }>,
  rotation: Rotation,
) => {
  let d = "";
  let drawing = false;

  for (const point of points) {
    const projected = projectPoint(point.lat, point.lng, rotation);
    if (!projected.visible) {
      drawing = false;
      continue;
    }

    d += `${drawing ? "L" : "M"}${projected.x.toFixed(2)} ${projected.y.toFixed(2)} `;
    drawing = true;
  }

  return d.trim();
};
