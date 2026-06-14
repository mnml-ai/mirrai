const { existsSync } = require("node:fs");
const { execSync } = require("node:child_process");
const { join } = require("node:path");

const buildIdPath = join(__dirname, "..", ".next", "BUILD_ID");

if (process.env.SKIP_NEXT_BUILD === "1") {
  console.log("[postinstall] SKIP_NEXT_BUILD=1 — skipping next build.");
  process.exit(0);
}

if (existsSync(buildIdPath)) {
  console.log("[postinstall] Existing .next build found — skipping next build.");
  process.exit(0);
}

console.log("[postinstall] No production build found — running next build...");
execSync("next build", { stdio: "inherit" });
