import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import icon from "astro-icon";
import metaTags from "astro-meta-tags";
import { defineConfig } from "astro/config";
import { config } from "./src/config";

import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";

import rehypePrism from "rehype-prism-plus";

const remarkPlugins = [remarkGfm, remarkGemoji];
const rehypePlugins = [rehypePrism];

export default defineConfig({
	site: config.site.url,
	integrations: [
		sitemap(),
		mdx(),
		icon(),
		metaTags(),
		AstroPWA({
			manifestFilename: "site.webmanifest",
			registerType: "autoUpdate",
			devOptions: {
				enabled: false,
			},
			includeAssets: [
				"favicon.svg",
				"favicon.ico",
				"favicon-16x16.png",
				"favicon-32x32.png",
				"favicon-48x48.png",
				"apple-touch-icon.png",
				"mstile-150x150.png",
			],
			manifest: {
				name: "Xima Tatars",
				short_name: "Xima Tatars",
				description: "Татарские центры, сообщества и ссылки по всему миру.",
				theme_color: "#080214",
				background_color: "#fafafa",
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
			},
			workbox: {
				clientsClaim: true,
				skipWaiting: true,
				cleanupOutdatedCaches: true,
				globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,avif,woff2}"],
			},
		}),
	],
	markdown: {
		syntaxHighlight: false,
		remarkPlugins,
		rehypePlugins,
	},
	prefetch: {
		defaultStrategy: "viewport",
		prefetchAll: true,
	},
	vite: {
		plugins: [tailwindcss()],
	},
	// devToolbar: {
	// 	enabled: false,
	// },
	output: "static",
});
