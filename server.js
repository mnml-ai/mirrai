// Production entry point for Node hosting (e.g. Hostinger / Passenger).
// Boots Next.js programmatically and listens on the port/socket provided by the host.
const { existsSync } = require("node:fs");
const { createServer } = require("node:http");
const { join } = require("node:path");
const next = require("next");

// Resolve to this file's directory so Next finds .next/ and next.config
// regardless of the working directory Passenger launches us from.
const dir = __dirname;
process.chdir(dir);

// Passenger may pass a unix socket path (string) instead of a numeric port.
const rawPort = process.env.PORT;
const port = rawPort && /^\d+$/.test(rawPort) ? Number(rawPort) : rawPort || 3000;
const hostname = process.env.HOST || "0.0.0.0";

const buildIdPath = join(dir, ".next", "BUILD_ID");
const hasProductionBuild = existsSync(buildIdPath);

console.log(`[MIRRAI startup] dir=${dir}`);
console.log(`[MIRRAI startup] PORT=${rawPort ?? "(unset)"} parsedPort=${port}`);
console.log(`[MIRRAI startup] NODE_ENV=${process.env.NODE_ENV || "unknown"}`);
console.log(
  `[MIRRAI startup] production build ${hasProductionBuild ? "found" : "MISSING"} at ${buildIdPath}`
);

if (!hasProductionBuild) {
  console.error(
    "[MIRRAI startup] No .next production build. Run `npm run build` during deploy (postinstall) before starting server.js."
  );
}

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

    const server = createServer((req, res) => handle(req, res));

    server.on("error", (err) => {
      console.error("[MIRRAI startup] HTTP server error:", err);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      console.log(`MIRRAI ready (dir=${dir}, host=${hostname}, port=${port})`);
    });
  })
  .catch((err) => {
    console.error("Failed to start MIRRAI server:", err);
    process.exit(1);
  });

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection in MIRRAI server:", err);
});
