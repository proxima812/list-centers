import { LiquidMetal } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

/**
 * Фон шейдера прозрачный, а не подогнанный под --color-background.
 *
 * Шейдер выводит premultiplied alpha:
 *   vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
 *   opacity = opacity + u_colorBack.a * (1. - opacity);
 * при a = 0 фон не вносит ничего, и сквозь марку видно страницу. Контекст
 * webgl2 по умолчанию идёт с alpha: true и premultipliedAlpha: true, так что
 * дополнительных атрибутов не нужно.
 *
 * Это надёжнее, чем красить фон в цвет темы: марка works на любой подложке и
 * не разъедется, если фон когда-нибудь поменяют.
 */
const TRANSPARENT = "#00000000";

/**
 * Шейдер принимает цвет строкой и не понимает CSS-переменные, поэтому токен
 * нужно разрешить в hex: подставляем значение в пробный элемент и читаем то,
 * что вернул движок (всегда rgb()).
 */
const resolveToken = (probe: HTMLElement, token: string) => {
	const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
	if (!raw) return null;

	probe.style.color = "";
	probe.style.color = raw;
	const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g);
	if (!rgb || rgb.length < 3) return null;

	return `#${rgb
		.slice(0, 3)
		.map((value) => Math.round(Number(value)).toString(16).padStart(2, "0"))
		.join("")}`;
};

export default function LiquidMetalMark() {
	const hostRef = useRef<HTMLDivElement>(null);
	// null, а не литеральный фолбэк: остров ещё и SSR-ится, так что любой
	// стартовый цвет попал бы в HTML и мигнул бы не тем оттенком до того, как
	// эффект прочитает акцент. Пока цвет не измерен, шейдера просто нет —
	// вместо него виден статичный flower.svg из обёртки.
	const [tint, setTint] = useState<string | null>(null);
	// Тумблер анимаций из шапки. Шейдер не просто прячется, а размонтируется:
	// иначе WebGL продолжал бы крутить кадры за скрытым канвасом. На месте
	// марки в этом режиме — статичная .flower-solid из обёртки.
	const [motionOff, setMotionOff] = useState(false);

	useEffect(() => {
		const read = () => setMotionOff(document.documentElement.dataset.motion === "off");

		read();

		const observer = new MutationObserver(read);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-motion"],
		});

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const probe = document.createElement("span");
		probe.style.display = "none";
		document.body.append(probe);

		// Наблюдатель срабатывает на любое изменение class у <html> — в том
		// числе на overflow-hidden, которым мобильное меню лочит скролл.
		// setState с тем же значением React отсекает сам.
		const read = () => setTint(resolveToken(probe, "--color-accent-vivid"));

		read();

		// Тема и палитра живут в class/data-accent на <html>. Наблюдаем за ними,
		// а не за событиями переключателей: источник правды один, и марка
		// перекрашивается даже когда тему поменяли из соседней вкладки.
		const observer = new MutationObserver(read);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-accent"],
		});

		return () => {
			observer.disconnect();
			probe.remove();
		};
	}, []);

	useEffect(() => {
		if (!tint) return;

		// Статичный цветок гаснет только когда шейдер уже смонтирован и успел
		// нарисовать кадр, иначе между ними будет провал в пустоту.
		const frame = requestAnimationFrame(() =>
			requestAnimationFrame(() =>
				hostRef.current?.closest("[data-liquid-metal]")?.classList.add("webgl-ready"),
			),
		);

		return () => cancelAnimationFrame(frame);
	}, [tint]);

	return (
		<div ref={hostRef}>
			{tint && !motionOff && (
				<LiquidMetal
					width={140}
					height={140}
					image="/flower.svg"
					colorBack={TRANSPARENT}
					colorTint={tint}
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
			)}
		</div>
	);
}
