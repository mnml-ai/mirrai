// Production entry point for Node hosting (e.g. Hostinger / Passenger).
// Boots Next.js programmatically and listens on the port provided by the host.
const { createServer } = require("node:http");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOST || "0.0.0.0";

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`MIRRAI ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start MIRRAI server:", err);
    process.exit(1);
  });
