import { NextResponse } from "next/server";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

const CONTACT_EMAIL_SUBJECT = "Website Contact us";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const toEmail = process.env.CONTACT_TO_EMAIL || "mirrai@odxstudio.com";
    const isDevelopment = process.env.NODE_ENV !== "production";

    if (!resendApiKey || !fromEmail) {
      return NextResponse.json(
        { error: "Missing contact email environment variables." },
        { status: 500 }
      );
    }

    const rawBody = await request.json();
    const body: ContactPayload =
      rawBody && typeof rawBody === "object" && !Array.isArray(rawBody)
        ? rawBody
        : {};

    const name = asString(body.name);
    const email = asString(body.email);
    const phone = asString(body.phone);
    const visitorSubject = asString(body.subject);
    const message = asString(body.message);

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Name, email, phone, and message are required." },
        { status: 400 }
      );
    }

    const text = [
      "New MIRRAI website contact message",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      visitorSubject ? `Visitor subject: ${visitorSubject}` : "",
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <h2>New MIRRAI website contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      ${
        visitorSubject
          ? `<p><strong>Visitor subject:</strong> ${escapeHtml(visitorSubject)}</p>`
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
        to: toEmail,
        reply_to: email,
        subject: CONTACT_EMAIL_SUBJECT,
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
