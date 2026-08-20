export const markdownTone = {
	text: "text-foreground",
	muted: "text-muted-foreground",
	subtle: "text-subtle-foreground",
	border: "border-border",
	accent: "text-primary",
};

export const markdownClasses = {

	strong: `${markdownTone.text} font-semibold`,
	// `>` в наших MDX — не цитата. Под «Прочее» им размечены регистровые
	// сведения: официальное имя организации, ОГРН, пометка об источнике.
	// Поэтому прямое начертание вместо курсива, никаких кавычек от плагина
	// typography и хайрлайн вместо плашки — как и весь центр, блок отделён
	// линейкой и отступом, а не собственной поверхностью.
	blockquote: [
		// Вертикальный ритм остаётся за prose (1.6em): свой `my-*` тут в любом
		// случае проигрывает плагину и только делает вид, что что-то задаёт.
		"border-l pl-4 text-[0.9375em] not-italic font-normal",
		markdownTone.border,
		markdownTone.muted,
		// Плагин дорисовывает « » вокруг первого абзаца цитаты — на строке
		// «…, ОГРН» это выглядит как цитирование реестра.
		"[&>p]:before:content-none [&>p]:after:content-none",
		// Внешние поля первого и последнего ребёнка растягивали бы линейку
		// за пределы текста.
		"[&>:first-child]:mt-0 [&>:last-child]:mb-0",
		// Регистровая строка размечена списком из одного пункта; маркер и его
		// отступ здесь только шумят.
		"[&_ul]:my-0 [&_ul]:list-none [&_ul]:pl-0 [&_li]:my-0 [&_li]:pl-0",
		// Два `>` подряд — один блок сведений, а не две плашки встык.
		"[&+blockquote]:mt-0",
	].join(" "),
	hr: `my-8 border-0 h-px bg-linear-to-r from-transparent via-border to-transparent`,
} as const;
