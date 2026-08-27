import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import dualmark from "@dualmark/astro";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import icon from "astro-icon";
import metaTags from "astro-meta-tags";
import { defineConfig, fontProviders } from "astro/config";
import { config } from "./src/config.ts";
import aiTxt from "./src/integrations/aiTxt.ts";
import { buildHomeMarkdown } from "./src/integrations/homeMarkdown.ts";
import indexNow from "./src/integrations/indexNow.ts";
import llmsTxt from "./src/integrations/llmsTxt.ts";
import robotsTxt from "./src/integrations/robotsTxt.ts";
import { includeAssets, manifest, workbox } from "./src/utils/pwaSettings.ts";

export default defineConfig({
    site: config.site.url,
    fonts: [
        {
            provider: fontProviders.local(),
            name: "Tatarverse Sans",
            cssVariable: "--font-tatarverse-sans",
            options: {
                variants: [
                    {
                        src: ["./src/assets/fonts/tatarverse-sans.woff2"],
                        weight: "100 900",
                        style: "normal",
                        display: "optional",
                    },
                ],
            },
        },
        {
            provider: fontProviders.local(),
            name: "Twemoji Country Flags",
            cssVariable: "--font-country-flags",
            fallbacks: [],
            options: {
                variants: [
                    {
                        src: ["./src/assets/fonts/twemoji-country-flags.woff2"],
                        weight: 400,
                        style: "normal",
                        display: "swap",
                        unicodeRange: ["U+1F1E6-1F1FF", "U+1F3F4", "U+E0062-E007F"],
                    },
                ],
            },
        },
    ],
    i18n: {
        locales: ["ru", "en"],
        defaultLocale: "ru",
        routing: {
            prefixDefaultLocale: false,
        },
    },
    integrations: [
      sitemap({
          filter: (page) => {
              const path = new URL(page).pathname.replace(/\/$/, "");
              const excluded = new Set([
                  "/saved",
                  "/en/saved",
                  "/nearby",
                  "/en/nearby",
                  "/en/thanks",
                  "/centers/print",
                  "/en/centers/print",
              ]);
              return !excluded.has(path);
          },
      }),
      mdx(),
      icon({ uis: ["*"] }),
      metaTags(),
      robotsTxt(),
      ...(config.features.llms ? [llmsTxt()] : []),
      ...(config.features.ai ? [aiTxt()] : []),
      dualmark({
          siteUrl: config.site.url.replace(/\/$/, ""),
          collections: {
              posts: {
                  converter: "blog",
                  route: "posts",
                  slugStrategy: "single",
                  listingMetadata: {
                      title: "Посты tatarverse",
                      description:
                          "Редакционные заметки tatarverse о культуре, языке и сообществах.",
                  },
              },
              centers: {
                  converter: "docs",
                  route: "centers",
                  slugStrategy: "single",
                  listingMetadata: {
                      title: "Центры tatarverse",
                      description:
                          "Каталог татарских, башкирских и крымскотатарских культурных центров и сообществ.",
                  },
              },
          },
          staticPages: [
              {
                  pattern: "/",
                  render: new Function(
                      `return ${JSON.stringify(buildHomeMarkdown(config.site.url))};`,
                  ),
              },
          ],
          llmsTxt: {
              enabled: false,
          },
          middleware: {
              injectLinkHeader: false,
          },
      }),
      ...(config.features.indexNow
          ? [
                  indexNow({
                      key: config.indexNow.key,
                      siteUrl: config.site.url,
                      collections: ["centers", "posts"],
                      maxUrls: 500,
                  }),
              ]
          : []),
      AstroPWA({
          manifestFilename: "site.webmanifest",
          registerType: "autoUpdate",
          includeAssets,
          manifest,
          workbox,
      }),
    ],
    prefetch: {
        defaultStrategy: "tap",
        prefetchAll: false,
    },
    vite: {
        plugins: [tailwindcss()],
        server: {
            watch: {
                ignored: ["**/.impeccable/**"],
            },
        },
        ssr: {
            external: ["@dualmark/astro", "@dualmark/core", "@dualmark/converters"],
        },
    },
    devToolbar: {
        enabled: true,
    },
    output: "static",
    experimental: {
        // Пропускаем ререндер страниц, чей cacheKey и граф зависимостей не менялись.
        incrementalBuild: true,
    },
});
