import { NextResponse } from "next/server";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

const CONTACT_EMAIL_SUBJECT = "Website Contact us";
const DEFAULT_CONTACT_FROM_EMAIL = "MIRRAI <custom.mirrai@odxstudio.com>";
const DEFAULT_CONTACT_TO_EMAIL = "mirrai@odxstudio.com";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || DEFAULT_CONTACT_FROM_EMAIL;
    const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO_EMAIL;
    const isDevelopment = process.env.NODE_ENV !== "production";

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY." },
        { status: 500 }
      );
    }

    const rawBody = await request.json();
    const body: ContactPayload =
      rawBody && typeof rawBody === "object" && !Array.isArray(rawBody)
        ? rawBody
        : {};

    const name = asString(body.name);
    const customerEmail = asString(body.email);
    const phone = asString(body.phone);
    const visitorSubject = asString(body.subject);
    const message = asString(body.message);

    if (!name || !customerEmail || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone, and message are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: "A valid customer email is required." },
        { status: 400 }
      );
    }

    const text = [
      "New MIRRAI website contact message",
      "",
      `Name: ${name}`,
      `Email: ${customerEmail}`,
      `Phone: ${phone}`,
      visitorSubject ? `Subject: ${visitorSubject}` : "",
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <h2>New MIRRAI website contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      ${
        visitorSubject
          ? `<p><strong>Subject:</strong> ${escapeHtml(visitorSubject)}</p>`
          : ""
      }
      <hr />
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: customerEmail,
        subject: visitorSubject
          ? `${CONTACT_EMAIL_SUBJECT} — ${visitorSubject}`
          : CONTACT_EMAIL_SUBJECT,
        text,
        html,
      }),
    });

    const data = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Contact email error response:", data);
      return NextResponse.json(
        {
          error: "Failed to send contact email.",
          ...(isDevelopment ? { details: data } : {}),
        },
        { status: resendResponse.status }
      );
    }

    return NextResponse.json({ success: true, emailId: data.id });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
