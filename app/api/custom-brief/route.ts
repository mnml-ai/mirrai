import { NextResponse } from "next/server";

type CustomBriefPayload = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  projectType?: unknown;
  cityArea?: unknown;
  city?: unknown;
  district?: unknown;
  spaceLocation?: unknown;
  preferredMirrorSize?: unknown;
  notes?: unknown;
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_ID = process.env.AIRTABLE_TABLE_ID;
    const isDevelopment = process.env.NODE_ENV !== "production";

    console.info("Custom brief Airtable config", {
      hasAirtablePat: Boolean(AIRTABLE_PAT),
      airtableBaseId: AIRTABLE_BASE_ID,
      airtableTableId: AIRTABLE_TABLE_ID,
    });

    if (!AIRTABLE_PAT || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_ID) {
      return NextResponse.json(
        { error: "Missing Airtable environment variables." },
        { status: 500 }
      );
    }

    const rawBody = await request.json();
    const body: CustomBriefPayload =
      rawBody && typeof rawBody === "object" && !Array.isArray(rawBody)
        ? rawBody
        : {};

    const fullName = asString(body.fullName);
    const email = asString(body.email);
    const phone = asString(body.phone);
    const projectType = asString(body.projectType);
    const cityArea =
      asString(body.cityArea) || asString(body.city) || asString(body.district);
    const spaceLocation = asString(body.spaceLocation);
    const preferredMirrorSize = asString(body.preferredMirrorSize);
    const notes = asString(body.notes);

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "Full name and phone are required." },
        { status: 400 }
      );
    }

    const finalNotes = [
      notes ? `Client notes: ${notes}` : "",
      projectType ? `Project type: ${projectType}` : "",
      preferredMirrorSize ? `Preferred mirror size: ${preferredMirrorSize}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const fields: Record<string, string | undefined> = {
      Name: fullName,
      Phone: phone,
      Email: email || undefined,
      Source: "Website Form",
      "Lead Type": "Custom",
      "City / Area": cityArea || undefined,
      "Space / Room": spaceLocation || undefined,
      "Approximate Size": preferredMirrorSize || undefined,
      Notes: finalNotes || undefined,
      Status: "New",
      "Lead Priority": "Medium",
    };

    Object.keys(fields).forEach((key) => {
      if (fields[key] === undefined || fields[key] === "") {
        delete fields[key];
      }
    });

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [{ fields }],
        }),
      }
    );

    const data = await airtableResponse.json();
    console.info("Airtable custom brief status", {
      status: airtableResponse.status,
    });

    if (!airtableResponse.ok) {
      console.error("Airtable custom brief error response:", data);
      return NextResponse.json(
        {
          error: "Failed to create Airtable record.",
          ...(isDevelopment ? { details: data } : {}),
        },
        { status: airtableResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      recordId: data.records?.[0]?.id,
    });
  } catch (error) {
    console.error("Custom brief API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
