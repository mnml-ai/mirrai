function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSiteEnv() {
  return process.env.NEXT_PUBLIC_SITE_ENV === "production" ? "production" : "local";
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL.");
  }

  return trimTrailingSlash(configuredUrl);
}

export function getSiteOriginUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}
