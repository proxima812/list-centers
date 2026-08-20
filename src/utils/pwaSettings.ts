import { config } from "../config.ts";

export const includeAssets = [
	"favicon.svg",
	"favicon.ico",
	"favicon-16x16.png",
	"favicon-32x32.png",
	"favicon-48x48.png",
	"apple-touch-icon.png",
	"mstile-150x150.png",
];

export const workbox = {
	clientsClaim: true,
	skipWaiting: true,
	cleanupOutdatedCaches: true,
	navigationPreload: true,
	navigateFallback: null,
	globPatterns: ["**/*.{js,css,ico,woff2,webmanifest}"],
	globIgnores: ["**/fuse.*.js"],
	runtimeCaching: [
		{
			urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
			handler: "NetworkFirst",
			options: {
				cacheName: "pages-cache",
				networkTimeoutSeconds: 3,
				expiration: {
					maxEntries: 30,
					maxAgeSeconds: 60 * 60 * 24,
				},
			},
		},
		{
			urlPattern: ({ request }: { request: Request }) =>
				["image", "font"].includes(request.destination),
			handler: "CacheFirst",
			options: {
				cacheName: "assets-cache",
				expiration: {
					maxEntries: 80,
					maxAgeSeconds: 60 * 60 * 24 * 30,
				},
			},
		},
	],
};

export const manifest = {
	name: config.site.OG.title,
	short_name: "tatarverse",
	description: config.site.OG.description,
	// Манифест — одно статическое значение на все шесть акцентов и обе темы,
	// поэтому здесь дефолтный вид: тёмная бумага пресета green, тонированная
	// в hue 142 (--color-background тёмной темы). Значение должно совпадать с
	// запасным theme-color в Layout.astro — иначе установленное приложение и
	// первый кадр сайта откроются разным цветом.
	theme_color: "#0e1310",
	background_color: "#0e1310",
	display: "standalone",
	orientation: "portrait",
	start_url: "/",
	scope: "/",
	icons: [
		{
			src: "/android-chrome-192x192.png",
			sizes: "192x192",
			type: "image/png",
		},
		{
			src: "/android-chrome-512x512.png",
			sizes: "512x512",
			type: "image/png",
		},
		{
			src: "/icon-72x72.png",
			sizes: "72x72",
			type: "image/png",
		},
		{
			src: "/icon-96x96.png",
			sizes: "96x96",
			type: "image/png",
		},
		{
			src: "/icon-128x128.png",
			sizes: "128x128",
			type: "image/png",
		},
		{
			src: "/icon-144x144.png",
			sizes: "144x144",
			type: "image/png",
		},
		{
			src: "/icon-152x152.png",
			sizes: "152x152",
			type: "image/png",
		},
		{
			src: "/icon-167x167.png",
			sizes: "167x167",
			type: "image/png",
		},
		{
			src: "/apple-touch-icon.png",
			sizes: "180x180",
			type: "image/png",
		},
		{
			src: "/icon-256x256.png",
			sizes: "256x256",
			type: "image/png",
		},
		{
			src: "/icon-384x384.png",
			sizes: "384x384",
			type: "image/png",
		},
		{
			src: "/android-chrome-512x512.png",
			sizes: "512x512",
			type: "image/png",
		},
	],
};
