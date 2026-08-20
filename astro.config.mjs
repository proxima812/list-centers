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
      // `/saved` — личный список из localStorage конкретного браузера. Для
      // робота он всегда пустой каркас, поэтому его нет ни в карте сайта, ни в
      // обходе (Disallow ниже), а сама страница отдаёт noindex.
      sitemap({
          filter: (page) => {
              const path = new URL(page).pathname.replace(/\/$/, "");
              // Кроме /saved исключаем noindex-страницу печати и
              // 301-заглушки непереведённых EN-разделов: страницы с
              // редиректом/noindex в карте сайта — мусор для Search Console.
              const excluded = new Set([
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
              // Каталог центров — основной контент сайта. Конвертер `docs`, а
              // не `blog`: у карточки нет автора и даты публикации, зато есть
              // структурированное тело (контакты, ссылки, источники).
              // Маршрут совпадает с id: все карточки лежат как `tbk-N`, и
              // createCenterRouteIdMap отображает такие id сами на себя.
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
          // Главная не входит ни в одну коллекцию, поэтому её markdown-двойник
          // (`/index.md`) описывается тут явно. Без него проверка `md.fetch`
          // из AEO Spec отдаёт 404 на корне сайта.
          //
          // `render` собран через `new Function`, а не написан стрелкой,
          // намеренно: пакет сериализует функцию через `render.toString()` в
          // отдельный модуль, а `astro.config.mjs` к тому моменту уже прошёл
          // через Vite. Любое замыкание там теряется, а `import()` внутри тела
          // превращается в `__vite_ssr_dynamic_import__` и роняет сборку.
          // Функция, созданная в рантайме, до Vite не доезжает и отдаёт
          // готовый литерал — см. src/integrations/homeMarkdown.ts.
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
          // Сайт статический (output: "static"), поэтому middleware пакета на
          // проде не выполняется — он ставит заголовок Link на рантайме,
          // которого нет. Тот же альтернейт отдаётся тегом в <head> через
          // SEO.astro и заголовком из public/_headers на стороне Cloudflare.
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
    // redirects: {},
    output: "static",
});
