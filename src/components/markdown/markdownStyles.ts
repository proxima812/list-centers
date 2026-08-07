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
		"my-0 rounded-control border-l-4 px-4 py-3 italic",
		markdownTone.border,
		"text-foreground/90 bg-depth-100/40",
	].join(" "),
	hr: `my-8 border-0 h-px bg-linear-to-r from-transparent via-border to-transparent`,
} as const;
