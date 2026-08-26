
export type CenterLinkKind =
	| "website"
	| "instagram"
	| "telegram"
	| "vk"
	| "youtube"
	| "facebook"
	| "ok";

export interface CenterLink {
	kind: CenterLinkKind;
	label: string;
	icon: string;
	href: string;
}

type Platform = { kind: CenterLinkKind; label: string; icon: string; pattern: RegExp };

const PLATFORMS: Platform[] = [
	{
		kind: "instagram",
		label: "Instagram",
		icon: "mdi:instagram",
		pattern: /(^|\.)instagram\.com$/,
	},
	{
		kind: "telegram",
		label: "Telegram",
		icon: "mdi:telegram",
		pattern: /(^|\.)(t\.me|telegram\.me|telegram\.org)$/,
	},
	{ kind: "vk", label: "VK", icon: "mdi:vk", pattern: /(^|\.)(vk\.com|vk\.ru)$/ },
	{
		kind: "youtube",
		label: "YouTube",
		icon: "mdi:youtube",
		pattern: /(^|\.)(youtube\.com|youtu\.be)$/,
	},
	{
		kind: "facebook",
		label: "Facebook",
		icon: "mdi:facebook",
		pattern: /(^|\.)(facebook\.com|fb\.com)$/,
	},
	{ kind: "ok", label: "OK", icon: "mdi:odnoklassniki", pattern: /(^|\.)ok\.ru$/ },
];

const LINKS_SECTION = /^##\s+(Ссылки|Links)\s*$/im;
const MARKDOWN_LINK = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;

function classify(href: string): Omit<CenterLink, "href"> | null {
	let host: string;

	try {
		host = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
	} catch {
		return null;
	}

	const platform = PLATFORMS.find((candidate) => candidate.pattern.test(host));
	if (platform) return { kind: platform.kind, label: platform.label, icon: platform.icon };

	return { kind: "website", label: "Сайт", icon: "mdi:web" };
}

export function formatCenterLinkLabel(href: string, maxLength = 26): string {
	let url: URL;

	try {
		url = new URL(href);
	} catch {
		return href;
	}

	const host = url.hostname.replace(/^www\./, "");
	const tail = `${url.pathname}${url.search}`.replace(/\/+$/, "");
	const full = `${host}${tail}`;

	if (full.length <= maxLength) return full;
	return `${full.slice(0, Math.max(host.length, maxLength - 1))}…`;
}

function extractSection(body: string): string {
	const start = body.search(LINKS_SECTION);
	if (start === -1) return "";

	const rest = body.slice(start);
	const nextHeading = rest.slice(1).search(/^##\s+/m);

	return nextHeading === -1 ? rest : rest.slice(0, nextHeading + 1);
}

export function getCenterLinks(body: string | undefined, source?: string): CenterLink[] {
	const found = new Map<CenterLinkKind, CenterLink>();

	const collect = (href: string) => {
		const classified = classify(href);
		if (!classified || found.has(classified.kind)) return;
		found.set(classified.kind, { ...classified, href });
	};

	for (const match of extractSection(body ?? "").matchAll(MARKDOWN_LINK)) {
		collect(match[1]);
	}

	if (source) collect(source);

	const order: CenterLinkKind[] = ["website", ...PLATFORMS.map((platform) => platform.kind)];

	return order
		.map((kind) => found.get(kind))
		.filter((link): link is CenterLink => Boolean(link));
}
