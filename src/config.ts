const siteUrl = "https://tatarverse.cc/" as const;
const siteHost = new URL(siteUrl).hostname.replace(/^www\./, "");
const siteLocale = "ru-RU" as const;
const siteAuthor = "proxima812" as const;
const siteName = "tatarverse" as const;
const siteThemeColors = {
  maskIcon: "#080214",
  tile: "#080214",
  theme: "#080214",
  background: "#fafafa",
} as const;

export const config = {
  features: {
    manifest: true,
    ai: true,
    llms: true,
    indexNow: false,
  },
  indexNow: {
    key: "",
  },
  site: {
    url: siteUrl,
    language: "ru-RU",
    OG: {
      title: siteName,
      description:
        "ТБК — это татары, башкиры и крымские татары. tatarverse помогает найти культурные центры, сообщества, источники и справочную информацию по странам, городам, регионам и категориям.",
      author: siteAuthor,
      locale: siteLocale,
      site_name: siteName,
      defaultImage: "default-ogImage.png",
      imageAlt: `Превью страницы ${siteHost}`,
      keywords: [
        "ТБК",
        "татары",
        "башкиры",
        "крымские татары",
        "татарские центры",
        "башкирские центры",
        "крымскотатарские центры",
        "татарская диаспора",
        "культурные центры",
        "национально-культурные автономии",
      ],
      titleSeparator: "•",
      twitterCard: "summary_large_image",
      twitterSite: "",
      twitterCreator: "",
      organizationName: siteName,
      logo: "",
    },
    theme: {
      colors: siteThemeColors,
    },
    verifications: [
      { name_verification: "yandex-verification", content: "ef2c55e1bcb7f431" },
      { name_verification: "p:domain_verify", content: "" },
      {
        name_verification: "google-site-verification",
        content: "ax8dybdaENiWae9wwuPwxMC0GOluT8W9v0yDpIM1AKo",
      },
      { name_verification: "msvalidate.01", content: "" },
      { name_verification: "facebook-domain-verification", content: "" },
      { name_verification: "baidu-site-verification", content: "" },
      { name_verification: "apple-site-verification", content: "" },
      { name_verification: "norton-safeweb-site-verification", content: "" },
      { name_verification: "twitter-site-verification", content: "" },
      { name_verification: "linkedin-site-verification", content: "" },
      { name_verification: "adobe-site-verification", content: "" },
      { name_verification: "mail.ru-verification", content: "" },
      { name_verification: "tumblr-site-verification", content: "" },
      { name_verification: "shopify-site-verification", content: "" },
      { name_verification: "weebly-site-verification", content: "" },
      { name_verification: "whatsapp-site-verification", content: "" },
      { name_verification: "stripe-site-verification", content: "" },
    ],
    analytics: {
      yandexMetrika: {
        enabled: false,
        counterId: "",
      },
      googleTagManager: {
        enabled: false,
        gtmId: "",
      },
    },
  },
} satisfies AppConfig;

export type SeoPageType = "website" | "article";
export type SeoKeywords = string | string[];

export interface SiteVerification {
  name_verification: string;
  content: string;
}

export interface YandexMetrikaConfig {
  enabled: boolean;
  counterId: number | `${number}` | "";
}

export interface GoogleTagManagerConfig {
  enabled: boolean;
  gtmId: number | `${number}` | "";
}

export interface SiteOpenGraphConfig {
  title: string;
  description: string;
  author: string;
  locale: `${string}-${string}`;
  site_name: string;
  defaultImage: string;
  imageAlt: string;
  keywords: SeoKeywords;
  titleSeparator: string;
  twitterCard: "summary" | "summary_large_image";
  twitterSite: string;
  twitterCreator: string;
  organizationName: string;
  logo: string;
}

export interface SiteThemeColors {
  maskIcon: `#${string}`;
  tile: `#${string}`;
  theme: `#${string}`;
  background: `#${string}`;
}

export interface SiteConfig {
  url: `http${"" | "s"}://${string}`;
  language: string;
  OG: SiteOpenGraphConfig;
  theme: {
    colors: SiteThemeColors;
  };
  verifications: SiteVerification[];
  analytics: {
    yandexMetrika: YandexMetrikaConfig;
    googleTagManager: GoogleTagManagerConfig;
  };
}

export interface AppConfig {
  features: {
    manifest: boolean;
    ai: boolean;
    llms: boolean;
    indexNow: boolean;
  };
  indexNow: {
    key: string;
  };
  site: SiteConfig;
}
