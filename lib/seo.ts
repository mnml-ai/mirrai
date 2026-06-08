import type { Metadata } from "next";
import { getSiteOriginUrl } from "@/lib/site-url";

type Locale = "en" | "ar";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  locale?: Locale;
  image?: string;
};

const DEFAULT_OG_IMAGE = "/images/collection-section.png";

function getEnglishPath(path: string) {
  if (path === "/ar") {
    return "/";
  }

  if (path.startsWith("/ar/")) {
    return path.slice(3) || "/";
  }

  return path;
}

function getArabicPath(path: string) {
  const englishPath = getEnglishPath(path);

  return englishPath === "/" ? "/ar" : `/ar${englishPath}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  locale = "en",
  image = DEFAULT_OG_IMAGE,
}: PageMetadataOptions): Metadata {
  const canonical = getSiteOriginUrl(path);
  const englishPath = getEnglishPath(path);
  const arabicPath = getArabicPath(path);
  const imageUrl = getSiteOriginUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: getSiteOriginUrl(englishPath),
        ar: getSiteOriginUrl(arabicPath),
        "x-default": getSiteOriginUrl(englishPath),
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "MIRRAI",
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_EG"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "MIRRAI",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
