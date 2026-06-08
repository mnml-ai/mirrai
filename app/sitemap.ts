import type { MetadataRoute } from "next";
import { PRODUCT_SLUGS } from "@/lib/products";
import { getSiteOriginUrl } from "@/lib/site-url";

const STATIC_ROUTES = [
  "/",
  "/collection",
  "/custom",
  "/designers",
  "/faq",
  "/contact",
  "/delivery-policy",
  "/privacy",
  "/refund-policy",
  "/terms",
  "/warranty-policy",
];

function withArabicRoute(path: string) {
  return path === "/" ? "/ar" : `/ar${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const productRoutes = PRODUCT_SLUGS.map((slug) => `/products/${slug}`);
  const englishRoutes = [...STATIC_ROUTES, ...productRoutes];

  return englishRoutes.flatMap((route) => {
    const arabicRoute = withArabicRoute(route);

    return [
      {
        url: getSiteOriginUrl(route),
        changeFrequency: "weekly" as const,
        priority: route === "/" ? 1 : 0.8,
        alternates: {
          languages: {
            en: getSiteOriginUrl(route),
            ar: getSiteOriginUrl(arabicRoute),
          },
        },
      },
      {
        url: getSiteOriginUrl(arabicRoute),
        changeFrequency: "weekly" as const,
        priority: route === "/" ? 0.95 : 0.75,
        alternates: {
          languages: {
            en: getSiteOriginUrl(route),
            ar: getSiteOriginUrl(arabicRoute),
          },
        },
      },
    ];
  });
}
