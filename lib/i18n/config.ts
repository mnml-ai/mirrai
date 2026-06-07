export const LOCALES = ["en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];
export type Direction = "ltr" | "rtl";
export type SiteRouteKey = "home" | "collection" | "custom" | "designers" | "faq" | "contact" | "delivery" | "privacy" | "refund" | "terms" | "warranty";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "En",
  ar: "عربي",
};

export const LOCALE_DIRECTIONS: Record<Locale, Direction> = {
  en: "ltr",
  ar: "rtl",
};

export const SITE_ROUTE_PATHS: Record<SiteRouteKey, string> = {
  home: "/",
  collection: "/collection",
  custom: "/custom",
  designers: "/designers",
  faq: "/faq",
  contact: "/contact",
  delivery: "/delivery-policy",
  privacy: "/privacy",
  refund: "/refund-policy",
  terms: "/terms",
  warranty: "/warranty-policy",
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getDirection(locale: Locale): Direction {
  return LOCALE_DIRECTIONS[locale];
}

export function getLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isLocale(segment) ? segment : DEFAULT_LOCALE;
}

export function stripLocaleFromPathname(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] && isLocale(parts[0])) {
    const stripped = `/${parts.slice(1).join("/")}`;
    return stripped === "/" ? "/" : stripped.replace(/\/$/, "") || "/";
  }

  return pathname === "" ? "/" : pathname.replace(/\/$/, "") || "/";
}

export function getRouteKeyFromPathname(pathname: string): SiteRouteKey {
  const cleanPath = stripLocaleFromPathname(pathname);

  if (cleanPath === SITE_ROUTE_PATHS.collection) return "collection";
  if (cleanPath === SITE_ROUTE_PATHS.custom) return "custom";
  if (cleanPath === SITE_ROUTE_PATHS.designers) return "designers";
  if (cleanPath === SITE_ROUTE_PATHS.faq) return "faq";
  if (cleanPath === SITE_ROUTE_PATHS.contact) return "contact";
  if (cleanPath === SITE_ROUTE_PATHS.delivery) return "delivery";
  if (cleanPath === SITE_ROUTE_PATHS.privacy) return "privacy";
  if (cleanPath === SITE_ROUTE_PATHS.refund) return "refund";
  if (cleanPath === SITE_ROUTE_PATHS.terms) return "terms";
  if (cleanPath === SITE_ROUTE_PATHS.warranty) return "warranty";

  return "home";
}

export function getLocalizedPath(routeKey: SiteRouteKey, locale: Locale): string {
  const basePath = SITE_ROUTE_PATHS[routeKey];
  return locale === DEFAULT_LOCALE ? basePath : `/${locale}${basePath === "/" ? "" : basePath}`;
}

export function getLocalizedHref(href: string, locale: Locale): string {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;

  const [pathPart, hashPart] = href.split("#");
  const basePath = pathPart || "/";
  const hash = hashPart !== undefined ? `#${hashPart}` : "";

  if (locale === DEFAULT_LOCALE) {
    return `${basePath}${hash}`;
  }

  if (basePath === "/") {
    return `/${locale}${hash}`;
  }

  return `/${locale}${basePath}${hash}`;
}

export function switchLocalePathname(pathname: string, nextLocale: Locale): string {
  const cleanPathname = stripLocaleFromPathname(pathname);

  if (nextLocale === DEFAULT_LOCALE) {
    return cleanPathname;
  }

  return cleanPathname === "/" ? `/${nextLocale}` : `/${nextLocale}${cleanPathname}`;
}
