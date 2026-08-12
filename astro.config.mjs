import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import dualmark from "@dualmark/astro";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import icon from "astro-icon";
import metaTags from "astro-meta-tags";
import { defineConfig } from "astro/config";
import { config } from "./main.config.ts";
import aiTxt from "./src/integrations/aiTxt.ts";
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
      // `/saved` — личный список из localStorage конкретного браузера. Для
      // робота он всегда пустой каркас, поэтому его нет ни в карте сайта, ни в
      // обходе (Disallow ниже), а сама страница отдаёт noindex.
      sitemap({
          filter: (page) => {
              const path = new URL(page).pathname.replace(/\/$/, "");
              // Кроме /map и /saved исключаем noindex-страницу печати и
              // 301-заглушки непереведённых EN-разделов: страницы с
              // редиректом/noindex в карте сайта — мусор для Search Console.
              const excluded = new Set([
                  "/map",
                  "/saved",
                  "/en/saved",
                  "/centers/print",
                  "/en/posts",
                  "/en/sabantye",
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
          },
          llmsTxt: {
              enabled: false,
          },
          middleware: {
              injectLinkHeader: true,
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
        enabled: false,
    },
    redirects: {
        "/support": "/projects",
        "/support/[id]": "/projects/[id]",
        "/centers/tbk-265": "/centers/tbk-4",
        "/en/centers/tbk-265": "/en/centers/tbk-4",
        "/centers/tbk-286": "/centers/tbk-19",
        "/en/centers/tbk-286": "/en/centers/tbk-19",
        "/centers/tbk-372": "/centers/tbk-21",
        "/en/centers/tbk-372": "/en/centers/tbk-21",
        "/centers/tbk-211": "/centers/tbk-205",
        "/en/centers/tbk-211": "/en/centers/tbk-205",
    },
    output: "static",
});
