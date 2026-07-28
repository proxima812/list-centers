type MapTextProps = {
  value: string;
  x: number;
  y: number;
  fill?: string;
  size?: number;
  weight?: number;
  opacity?: number;
  anchor?: "start" | "middle" | "end";
};

export default function MapText({
  value,
  x,
  y,
  fill = "var(--color-foreground)",
  size = 14,
  weight = 800,
  opacity = 1,
  anchor = "middle",
}: MapTextProps) {
  return (
    <>
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={size}
        fontWeight={weight}
        fill="none"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinejoin="round"
        opacity={opacity * 0.88}
      >
        {value}
      </text>
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        dominantBaseline="middle"
        fontSize={size}
        fontWeight={weight}
        fill={fill}
        opacity={opacity}
      >
        {value}
      </text>
    </>
  );
}
