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

app
  .prepare()
  .then(() => {
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
