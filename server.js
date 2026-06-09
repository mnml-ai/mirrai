// Production entry point for Node hosting (e.g. Hostinger / Passenger).
// Boots Next.js programmatically and listens on the port/socket provided by the host.
const { createServer } = require("node:http");
const next = require("next");

// Resolve to this file's directory so Next finds .next/ and next.config
// regardless of the working directory Passenger launches us from.
const dir = __dirname;
process.chdir(dir);

// Passenger may pass a unix socket path (string) instead of a numeric port.
const rawPort = process.env.PORT;
const port = rawPort && /^\d+$/.test(rawPort) ? Number(rawPort) : rawPort || 3000;
const hostname = process.env.HOST || "0.0.0.0";

const app = next({ dev: false, dir });
const handle = app.getRequestHandler();

function logShopifyEnvOnStartup() {
  const required = [
    "SHOPIFY_API_KEY",
    "SHOPIFY_API_SECRET",
    "SHOPIFY_SHOP",
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_SCOPES",
    "SHOPIFY_ADMIN_ACCESS_TOKEN",
  ];
  const optional = [
    "SHOPIFY_API_VERSION",
    "SHOPIFY_WEBHOOK_SECRET",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ];
  const shopPresent = Boolean(
    process.env.SHOPIFY_SHOP?.trim() || process.env.SHOPIFY_STORE_DOMAIN?.trim()
  );

  console.log(`[Shopify env:startup] NODE_ENV=${process.env.NODE_ENV || "unknown"}`);
  console.log(
    `[Shopify env:startup] required ${required
      .map((name) => {
        if (name === "SHOPIFY_SHOP" || name === "SHOPIFY_STORE_DOMAIN") {
          return `${name}=${shopPresent ? "set" : "MISSING"}`;
        }

        return `${name}=${process.env[name]?.trim() ? "set" : "MISSING"}`;
      })
      .join(", ")}`
  );
  console.log(
    `[Shopify env:startup] optional ${optional
      .map((name) => `${name}=${process.env[name]?.trim() ? "set" : "missing"}`)
      .join(", ")}`
  );

  if (!process.env.SHOPIFY_API_KEY?.trim()) {
    console.error(
      "[Shopify env:startup] SHOPIFY_API_KEY is missing. Add Shopify secrets in Hostinger environment variables, then redeploy."
    );
  }
}

app
  .prepare()
  .then(() => {
    logShopifyEnvOnStartup();
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`MIRRAI ready (dir=${dir}, port=${port})`);
    });
  })
  .catch((err) => {
    console.error("Failed to start MIRRAI server:", err);
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection in MIRRAI server:", err);
});
