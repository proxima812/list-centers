import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import dualmark from "@dualmark/astro";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import icon from "astro-icon";
import metaTags from "astro-meta-tags";
import { defineConfig } from "astro/config";
import { config } from "./src/config.ts";
import aiTxt from "./src/integrations/aiTxt.ts";
import { buildHomeMarkdown } from "./src/integrations/homeMarkdown.ts";
import indexNow from "./src/integrations/indexNow.ts";
import llmsTxt from "./src/integrations/llmsTxt.ts";
import robotsTxt from "./src/integrations/robotsTxt.ts";
import { includeAssets, manifest, workbox } from "./src/utils/pwaSettings.ts";

export default defineConfig({
    site: config.site.url,
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
                  "/centers/print",
                  "/en/posts",
                  "/en/policy",
                  "/en/sources",
                  "/en/translations",
                  "/en/thanks",
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
});
