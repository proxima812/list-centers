type Link = {
	label: string;
	labelKey: string;
	icon?: string;
	class: string;
	href: string;
	size: "default";
	variant: "default" | "outline" | "disabled" | "ghost";
	target?: "_blank";
};

export const links: Link[] = [
	{
		label: "Перейти к центрам",
		labelKey: "nav.toCenters",
		icon: "mdi:account-group",
		class: "sm:px-4 sm:py-2 py-1.5 px-3 text-sm ",
		href: "/centers",
		size: "default",
		variant: "default",
	},
	{
		label: "Посты",
		labelKey: "nav.posts",
		icon: "mdi:access-point-check",
		class: "sm:px-4 sm:py-2 py-1.5 px-3 text-sm",
		href: "/posts",
		size: "default",
		variant: "outline",
	},
	{
		label: "Переводы",
		labelKey: "nav.translations",
		icon: "mdi:translate",
		class: "sm:px-4 sm:py-2 py-1.5 px-3 text-sm ",
		href: "/translations",
		size: "default",
		variant: "outline",
	},
	{
		label: "Источники",
		labelKey: "nav.sources",

		class: "sm:px-4 sm:py-2 py-1.5 px-3 text-sm",
		href: "/sources",
		size: "default",
		variant: "outline",
	},
	{
		label: "Политика",
		labelKey: "nav.policy",
		class: "sm:px-4 sm:py-2 py-1.5 px-3 text-sm",
		href: "/policy",
		size: "default",
		variant: "outline",
	},
	{
		label: "#сабантуй",
		labelKey: "nav.sabantuy",
    icon: "mdi:puzzle-star",
		class: "sm:px-4 sm:py-2 py-1.5 px-3 text-sm",
		href: "/sabantye",
		size: "default",
		variant: "ghost",
	},
	{
		label: "#поддержка",
		labelKey: "nav.support",
    icon: "mdi:puzzle-star",
		class: "sm:px-4 sm:py-2 py-1.5 px-3 text-sm",
    href: "/projects",
		size: "default",
    variant: "ghost",
	},
];
