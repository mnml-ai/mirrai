import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getSiteOriginUrl } from "@/lib/site-url";

type ShopifyEnv = {
  apiKey: string;
  apiSecret: string;
  shop: string;
  scopes: string;
  apiVersion: string;
};

type ShopifyAdminEnv = ShopifyEnv & {
  adminAccessToken: string;
};

type ShopifyTokenResponse = {
  access_token?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

type ShopifyGraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: unknown }>;
};

const SHOPIFY_STATE_COOKIE = "mirrai_shopify_oauth_state";

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

function normalizeShop(value: string) {
  const shop = value.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();

  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) {
    throw new Error("Invalid Shopify shop domain.");
  }

  return shop;
}

export function getShopifyEnv(): ShopifyEnv {
  return {
    apiKey: requiredEnv("SHOPIFY_API_KEY"),
    apiSecret: requiredEnv("SHOPIFY_API_SECRET"),
    shop: normalizeShop(requiredEnv("SHOPIFY_SHOP")),
    scopes: requiredEnv("SHOPIFY_SCOPES"),
    apiVersion: process.env.SHOPIFY_API_VERSION?.trim() || "2026-04",
  };
}

export function getShopifyAdminEnv(): ShopifyAdminEnv {
  return {
    ...getShopifyEnv(),
    adminAccessToken: requiredEnv("SHOPIFY_ADMIN_ACCESS_TOKEN"),
  };
}

export function createShopifyOAuthState() {
  return randomBytes(24).toString("hex");
}

export function getShopifyStateCookieName() {
  return SHOPIFY_STATE_COOKIE;
}

export function buildShopifyAuthUrl(state: string) {
  const { apiKey, shop, scopes } = getShopifyEnv();
  const redirectUri = getSiteOriginUrl("/api/shopify/callback");
  const authUrl = new URL(`https://${shop}/admin/oauth/authorize`);

  authUrl.searchParams.set("client_id", apiKey);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", state);

  return authUrl;
}

export function verifyShopifyOAuthHmac(searchParams: URLSearchParams) {
  const { apiSecret } = getShopifyEnv();
  const hmac = searchParams.get("hmac") || "";

  if (!hmac) {
    return false;
  }

  const message = Array.from(searchParams.entries())
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const digest = createHmac("sha256", apiSecret).update(message).digest("hex");
  const digestBuffer = Buffer.from(digest, "hex");
  const hmacBuffer = Buffer.from(hmac, "hex");

  if (digestBuffer.length !== hmacBuffer.length) {
    return false;
  }

  return timingSafeEqual(digestBuffer, hmacBuffer);
}

export async function exchangeShopifyCodeForOfflineToken(shop: string, code: string) {
  const { apiKey, apiSecret } = getShopifyEnv();
  const normalizedShop = normalizeShop(shop);
  const response = await fetch(`https://${normalizedShop}/admin/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    }),
  });
  const data = (await response.json()) as ShopifyTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "Could not exchange Shopify OAuth code."
    );
  }

  return {
    accessToken: data.access_token,
    scope: data.scope || "",
  };
}

function setEnvValue(contents: string, key: string, value: string) {
  const escaped = JSON.stringify(value);
  const line = `${key}=${escaped}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(contents)) {
    return contents.replace(pattern, line);
  }

  return `${contents.replace(/\s*$/, "")}\n${line}\n`;
}

export async function persistShopifyAdminToken(accessToken: string) {
  const envPath = join(process.cwd(), ".env.local");
  let contents = "";

  try {
    contents = await readFile(envPath, "utf8");
  } catch {
    contents = "";
  }

  const nextContents = setEnvValue(contents, "SHOPIFY_ADMIN_ACCESS_TOKEN", accessToken);
  await writeFile(envPath, nextContents, "utf8");
  process.env.SHOPIFY_ADMIN_ACCESS_TOKEN = accessToken;
}

export async function shopifyAdminGraphql<TData>(
  query: string,
  variables?: Record<string, unknown>
) {
  const { shop, apiVersion, adminAccessToken } = getShopifyAdminEnv();
  const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminAccessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const data = (await response.json()) as ShopifyGraphqlResponse<TData>;

  if (!response.ok || data.errors?.length) {
    throw new Error(data.errors?.[0]?.message || "Shopify Admin GraphQL request failed.");
  }

  if (!data.data) {
    throw new Error("Shopify Admin GraphQL response did not include data.");
  }

  return data.data;
}
