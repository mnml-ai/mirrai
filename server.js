// Production entry point for Hostinger / Passenger.
// Hostinger hPanel: use start command `npm start` only — do NOT also set `next start`.
const { existsSync } = require("node:fs");
const { createServer } = require("node:http");
const { join } = require("node:path");
const next = require("next");

const BOOT_KEY = "__MIRRAI_SERVER_BOOT__";

if (global[BOOT_KEY]) {
  console.log("[MIRRAI startup] Duplicate server.js load suppressed.");
  module.exports = global[BOOT_KEY];
  return;
}

const dir = __dirname;
process.chdir(dir);

const rawPort = process.env.PORT;
const numericPort =
  rawPort && /^\d+$/.test(rawPort) ? Number(rawPort) : rawPort ? null : 3000;
const listenTarget = numericPort ?? rawPort ?? 3000;
const hostname = process.env.HOST || "0.0.0.0";
const isPassengerSocket = typeof listenTarget === "string";

const buildIdPath = join(dir, ".next", "BUILD_ID");
const hasProductionBuild = existsSync(buildIdPath);

console.log(`[MIRRAI startup] entry=server.js (custom Next handler)`);
console.log(`[MIRRAI startup] dir=${dir}`);
console.log(
  `[MIRRAI startup] PORT=${rawPort ?? "(unset)"} listenTarget=${listenTarget} passengerSocket=${isPassengerSocket}`
);
console.log(`[MIRRAI startup] NODE_ENV=${process.env.NODE_ENV || "unknown"}`);
console.log(
  `[MIRRAI startup] production build ${hasProductionBuild ? "found" : "MISSING"} at ${buildIdPath}`
);

if (!hasProductionBuild) {
  console.error(
    "[MIRRAI startup] No .next production build. Run `npm run build` during deploy before starting."
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

function listen(httpServer) {
  return new Promise((resolve, reject) => {
    httpServer.once("error", reject);

    if (isPassengerSocket) {
      httpServer.listen(listenTarget, () => {
        console.log(`[MIRRAI startup] listening on Passenger socket ${listenTarget}`);
        resolve();
      });
      return;
    }

    httpServer.listen(numericPort, hostname, () => {
      console.log(
        `[MIRRAI startup] listening on http://${hostname}:${numericPort} (use npm start — not next start)`
      );
      resolve();
    });
  });
}

const bootPromise = app
  .prepare()
  .then(() => {
    logShopifyEnvOnStartup();

    const httpServer = createServer((req, res) => handle(req, res));

    httpServer.on("error", (err) => {
      console.error("[MIRRAI startup] HTTP server error:", err);
      process.exit(1);
    });

    return listen(httpServer).then(() => ({
      app,
      httpServer,
      handle,
    }));
  })
  .catch((err) => {
    console.error("[MIRRAI startup] Failed to boot:", err);
    process.exit(1);
  });

global[BOOT_KEY] = bootPromise;
module.exports = bootPromise;

process.on("unhandledRejection", (err) => {
  console.error("[MIRRAI startup] Unhandled rejection:", err);
});
