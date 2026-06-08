import type { MetadataRoute } from "next";
import { getSiteOriginUrl, getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getSiteOriginUrl("/sitemap.xml"),
    host: getSiteUrl(),
  };
}
