import { NextResponse, type NextRequest } from "next/server";
import {
  exchangeShopifyCodeForOfflineToken,
  getShopifyStateCookieName,
  persistShopifyAdminToken,
  verifyShopifyOAuthHmac,
} from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const state = url.searchParams.get("state") || "";
  const expectedState = request.cookies.get(getShopifyStateCookieName())?.value || "";
  const shop = url.searchParams.get("shop") || "";
  const code = url.searchParams.get("code") || "";

  try {
    if (!state || !expectedState || state !== expectedState) {
      return NextResponse.json(
        { error: "Invalid Shopify OAuth state." },
        { status: 400 }
      );
    }

    if (!verifyShopifyOAuthHmac(url.searchParams)) {
      return NextResponse.json(
        { error: "Invalid Shopify OAuth HMAC." },
        { status: 400 }
      );
    }

    if (!shop || !code) {
      return NextResponse.json(
        { error: "Missing Shopify OAuth code." },
        { status: 400 }
      );
    }

    const token = await exchangeShopifyCodeForOfflineToken(shop, code);
    await persistShopifyAdminToken(token.accessToken);

    const response = NextResponse.json({
      success: true,
      message: "Shopify offline Admin API token saved to .env.local. Restart dev server before using checkout.",
      scope: token.scope,
    });

    response.cookies.delete(getShopifyStateCookieName());

    return response;
  } catch (error) {
    console.error("Shopify OAuth callback error:", error);
    return NextResponse.json(
      { error: "Could not complete Shopify OAuth." },
      { status: 500 }
    );
  }
}
