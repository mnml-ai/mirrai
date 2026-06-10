const REQUIRED_SHOPIFY_ENV = [
  "SHOPIFY_API_KEY",
  "SHOPIFY_API_SECRET",
  "SHOPIFY_SHOP",
  "SHOPIFY_SCOPES",
  "SHOPIFY_ADMIN_ACCESS_TOKEN",
] as const;

const OPTIONAL_SHOPIFY_ENV = [
  "SHOPIFY_API_VERSION",
  "SHOPIFY_WEBHOOK_SECRET",
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
] as const;

const SHOPIFY_SHOP_ALIASES = ["SHOPIFY_SHOP", "SHOPIFY_STORE_DOMAIN"] as const;

function isSet(name: string) {
  return Boolean(process.env[name]?.trim());
}

export function resolveShopifyShopEnv() {
  for (const name of SHOPIFY_SHOP_ALIASES) {
    const value = process.env[name]?.trim();
    if (value) {
      return { value, source: name };
    }
  }

  return null;
}

export function logShopifyEnvDiagnostics(context = "startup") {
  const required = REQUIRED_SHOPIFY_ENV.map((name) => {
    if (name === "SHOPIFY_SHOP") {
      const shop = resolveShopifyShopEnv();
      return {
        name,
        present: Boolean(shop),
        source: shop?.source,
      };
    }

    return {
      name,
      present: isSet(name),
      source: name,
    };
  });

  const optional = OPTIONAL_SHOPIFY_ENV.map((name) => ({
    name,
    present: isSet(name),
  }));

  const missingRequired = required.filter((entry) => !entry.present).map((entry) => entry.name);

  console.error(`[Shopify env:${context}] NODE_ENV=${process.env.NODE_ENV || "unknown"}`);
  console.error(
    `[Shopify env:${context}] required`,
    required.map((entry) => `${entry.name}=${entry.present ? `set${entry.source && entry.source !== entry.name ? ` (via ${entry.source})` : ""}` : "MISSING"}`).join(", ")
  );
  console.error(
    `[Shopify env:${context}] optional`,
    optional.map((entry) => `${entry.name}=${entry.present ? "set" : "missing"}`).join(", ")
  );

  if (missingRequired.length > 0) {
    console.error(
      `[Shopify env:${context}] missing required keys: ${missingRequired.join(", ")}. ` +
        "Set them in Hostinger environment variables (not .env.local — that file is local-only)."
    );
  }

  if (!isSet("SHOPIFY_SHOP") && isSet("SHOPIFY_STORE_DOMAIN")) {
    console.error(
      "[Shopify env] SHOPIFY_STORE_DOMAIN is set; using it as shop domain. Prefer SHOPIFY_SHOP in Hostinger."
    );
  }

  if (isSet("SHOPIFY_STOREFRONT_ACCESS_TOKEN")) {
    console.error(
      "[Shopify env] SHOPIFY_STOREFRONT_ACCESS_TOKEN is set but not used by current MIRRAI checkout code."
    );
  }

  return {
    missingRequired,
    required,
    optional,
  };
}
