import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { priceMirraiConfiguration } from "@/lib/mirrai-pricing";
import { shopifyAdminGraphql } from "@/lib/shopify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DraftOrderCreateResponse = {
  draftOrderCreate: {
    draftOrder: null | {
      id: string;
      name: string;
      invoiceUrl: string | null;
    };
    userErrors: Array<{
      field: string[] | null;
      message: string;
    }>;
  };
};

const DRAFT_ORDER_CREATE_MUTATION = `
  mutation MirraiDraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function money(value: number) {
  return value.toFixed(2);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const configuration = priceMirraiConfiguration(payload);
    const referralCode = configuration.referralCode || "None";
    const checkoutId = randomUUID();
    const customAttributes = [
      { key: "MIRRAI Checkout ID", value: checkoutId },
      { key: "Product model", value: configuration.productTitle },
      { key: "Size", value: configuration.sizeLabel },
      { key: "Frame color", value: configuration.frameColorLabel },
      { key: "TV size", value: `${configuration.tvSize}"` },
      { key: "TV availability", value: configuration.tvAvailabilityLabel },
      { key: "Lighting type", value: configuration.lightingLabel },
      { key: "Light color", value: configuration.lightColorLabel },
      { key: "Referral / discount code", value: referralCode },
      { key: "Backend calculated price", value: `EGP ${configuration.price.toLocaleString("en-US")}` },
    ];
    const draftOrderInput = {
      note: [
        "MIRRAI website draft order",
        `Model: ${configuration.productTitle}`,
        `Size: ${configuration.sizeLabel}`,
        `Frame color: ${configuration.frameColorLabel}`,
        `TV size: ${configuration.tvSize}"`,
        `TV availability: ${configuration.tvAvailabilityLabel}`,
        `Lighting: ${configuration.lightingLabel}`,
        `Light color: ${configuration.lightColorLabel}`,
        `Referral / discount code: ${referralCode}`,
        `Backend calculated price: EGP ${configuration.price.toLocaleString("en-US")}`,
        `MIRRAI Checkout ID: ${checkoutId}`,
      ].join("\n"),
      customAttributes: [
        { key: "MIRRAI Checkout ID", value: checkoutId },
      ],
      tags: ["MIRRAI Website", configuration.productTitle, "Draft Checkout"],
      lineItems: [
        {
          title: `${configuration.productTitle} - ${configuration.sizeLabel}`,
          quantity: 1,
          originalUnitPrice: money(configuration.price),
          requiresShipping: true,
          taxable: true,
          customAttributes,
        },
      ],
    };
    const data = await shopifyAdminGraphql<DraftOrderCreateResponse>(
      DRAFT_ORDER_CREATE_MUTATION,
      { input: draftOrderInput }
    );
    const result = data.draftOrderCreate;

    if (result.userErrors.length > 0) {
      return NextResponse.json(
        { error: result.userErrors[0].message, userErrors: result.userErrors },
        { status: 400 }
      );
    }

    if (!result.draftOrder?.invoiceUrl) {
      return NextResponse.json(
        { error: "Shopify did not return a draft order invoice URL." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      invoiceUrl: result.draftOrder.invoiceUrl,
      draftOrderId: result.draftOrder.id,
      draftOrderName: result.draftOrder.name,
      checkoutId,
      price: configuration.price,
    });
  } catch (error) {
    console.error("Shopify draft order error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create Shopify draft order.",
      },
      { status: 500 }
    );
  }
}
