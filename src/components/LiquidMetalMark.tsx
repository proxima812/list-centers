import { LiquidMetal } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

const FALLBACK = { colorBack: "#ffffff", colorTint: "#16a249" };

/**
 * Шейдер принимает цвет строкой и не понимает CSS-переменные, поэтому токен
 * нужно разрешить в hex: подставляем значение в пробный элемент и читаем то,
 * что вернул движок (всегда rgb()).
 */
const resolveToken = (probe: HTMLElement, token: string, fallback: string) => {
	const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
	if (!raw) return fallback;

	probe.style.color = "";
	probe.style.color = raw;
	const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
	if (!rgb || rgb.length < 3) return fallback;

	return `#${rgb
		.slice(0, 3)
		.map((value) => Math.round(Number(value)).toString(16).padStart(2, "0"))
		.join("")}`;
};

export default function LiquidMetalMark() {
	const hostRef = useRef<HTMLDivElement>(null);
	const [colors, setColors] = useState(FALLBACK);

	useEffect(() => {
		const probe = document.createElement("span");
		probe.style.display = "none";
		document.body.append(probe);

		const read = () =>
			setColors({
				colorBack: resolveToken(probe, "--color-background", FALLBACK.colorBack),
				colorTint: resolveToken(probe, "--color-accent-vivid", FALLBACK.colorTint),
			});

		read();

		// Тема и палитра живут в class/data-accent на <html>. Наблюдаем за ними,
		// а не за событиями переключателей: источник правды один, и марка
		// перекрашивается даже когда тему поменяли из соседней вкладки.
		const observer = new MutationObserver(read);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-accent"],
		});

		// Статичный цветок гаснет только когда шейдер успел нарисовать кадр,
		// иначе между ними будет провал в пустоту.
		const frame = requestAnimationFrame(() =>
			requestAnimationFrame(() =>
				hostRef.current?.closest("[data-liquid-metal]")?.classList.add("webgl-ready"),
			),
		);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
			probe.remove();
		};
	}, []);

	return (
		<div ref={hostRef}>
			<LiquidMetal
				width={140}
				height={140}
				image="/flower.svg"
				colorBack={colors.colorBack}
				colorTint={colors.colorTint}
				repetition={2}
				softness={0.1}
				shiftRed={0.3}
				shiftBlue={0.3}
				distortion={0.07}
				contour={0.4}
				angle={70}
				speed={0.6}
				scale={0.6}
				fit="contain"
			/>
		</div>
	);
}
