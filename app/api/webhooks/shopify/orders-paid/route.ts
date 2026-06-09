import { NextResponse } from "next/server";
import {
  AirtableCommerceError,
  syncPaidOrderToAirtable,
} from "@/lib/airtable-commerce";
import {
  parseShopifyWebhookPayload,
  verifyShopifyWebhookHmac,
} from "@/lib/shopify-webhooks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getErrorDetails(error: unknown) {
  if (error instanceof AirtableCommerceError) {
    return error.details;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return error;
}

export async function POST(request: Request) {
  console.log("WEBHOOK HIT orders-paid");
  const isDevelopment = process.env.NODE_ENV !== "production";

  try {
    const rawBody = await request.text();
    const hmacHeader = request.headers.get("x-shopify-hmac-sha256");

    if (!verifyShopifyWebhookHmac(rawBody, hmacHeader)) {
      return NextResponse.json({ error: "Invalid Shopify webhook HMAC." }, { status: 401 });
    }

    const payload = parseShopifyWebhookPayload(rawBody);
    const result = await syncPaidOrderToAirtable(payload);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Shopify orders/paid webhook error:", error);

    return NextResponse.json(
      {
        error: "Failed to sync Shopify paid order.",
        ...(isDevelopment ? { details: getErrorDetails(error) } : {}),
      },
      { status: error instanceof AirtableCommerceError ? error.status : 500 }
    );
  }
}
