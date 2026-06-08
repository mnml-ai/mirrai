import { NextResponse, type NextRequest } from "next/server";
import {
  buildShopifyAuthUrl,
  createShopifyOAuthState,
  getShopifyStateCookieName,
} from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest) {
  try {
    const state = createShopifyOAuthState();
    const authUrl = buildShopifyAuthUrl(state);
    const response = NextResponse.redirect(authUrl);

    response.cookies.set(getShopifyStateCookieName(), state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Shopify OAuth auth error:", error);
    return NextResponse.json(
      { error: "Could not start Shopify OAuth." },
      { status: 500 }
    );
  }
}
