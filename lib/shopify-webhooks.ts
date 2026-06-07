import { createHmac, timingSafeEqual } from "node:crypto";

function getWebhookSecret() {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET?.trim();

  if (!secret) {
    throw new Error("Missing SHOPIFY_WEBHOOK_SECRET.");
  }

  return secret;
}

export function verifyShopifyWebhookHmac(rawBody: string, hmacHeader: string | null) {
  if (!hmacHeader) {
    return false;
  }

  const digest = createHmac("sha256", getWebhookSecret()).update(rawBody, "utf8").digest("base64");
  const digestBuffer = Buffer.from(digest, "utf8");
  const hmacBuffer = Buffer.from(hmacHeader.trim(), "utf8");

  if (digestBuffer.length !== hmacBuffer.length) {
    return false;
  }

  return timingSafeEqual(digestBuffer, hmacBuffer);
}

export function parseShopifyWebhookPayload(rawBody: string) {
  const payload = JSON.parse(rawBody) as unknown;

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("Shopify webhook payload must be a JSON object.");
  }

  return payload as Record<string, unknown>;
}
