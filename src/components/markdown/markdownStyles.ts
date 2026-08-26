export const markdownTone = {
	text: "text-foreground",
	muted: "text-muted-foreground",
	subtle: "text-subtle-foreground",
	border: "border-border",
	accent: "text-primary",
};

export const markdownClasses = {

	strong: `${markdownTone.text} font-semibold`,
	blockquote: [
		"border-l pl-4 text-[0.9375em] not-italic font-normal",
		markdownTone.border,
		markdownTone.muted,
		"[&>p]:before:content-none [&>p]:after:content-none",
		"[&>:first-child]:mt-0 [&>:last-child]:mb-0",
		"[&_ul]:my-0 [&_ul]:list-none [&_ul]:pl-0 [&_li]:my-0 [&_li]:pl-0",
		"[&+blockquote]:mt-0",
	].join(" "),
	hr: `my-8 border-0 h-px bg-linear-to-r from-transparent via-border to-transparent`,
} as const;
