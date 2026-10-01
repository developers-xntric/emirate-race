import nodemailer from "nodemailer";

const recipients = (process.env.ADMIN_EMAIL ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

function toText(value: unknown): string {
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(", ");
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatFields(fields: [string, string][]) {
  return fields
    .map(([key, value]) => {
      const label = key.replaceAll("_", " ");
      return `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;border:1px solid #d9dfe3;text-transform:capitalize">${escapeHtml(label)}</th><td style="padding:8px 12px;border:1px solid #d9dfe3;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`;
    })
    .join("");
}

async function sendVendorLeadToGoogleSheet(fields: [string, string][]) {
  const endpoint = process.env.GOOGLE_APPS_SCRIPT_VENDOR_FORM_URL;
  if (!endpoint) {
    console.warn("GOOGLE_APPS_SCRIPT_VENDOR_FORM_URL is not configured; vendor lead was emailed only.");
    return;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...Object.fromEntries(fields),
      submitted_at: new Date().toISOString(),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const result: unknown = await response.json().catch(() => null);

  if (!response.ok || !result || typeof result !== "object" || (result as { success?: unknown }).success !== true) {
    throw new Error(`Google Apps Script rejected vendor lead (${response.status}).`);
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const data = payload as Record<string, unknown>;
  const fields = Object.entries(data)
    .filter(([key]) => key !== "notify_email")
    .map(([key, value]) => [key, toText(value)] as [string, string]);
  const email = toText(data.email_address);
  const brand = toText(data.brand_name);

  if (!email || !brand) {
    return Response.json({ error: "Missing required vendor details." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !pass || !from || recipients.length === 0) {
    return Response.json({ error: "Email delivery is not configured." }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await Promise.all([
      transporter.sendMail({
        from,
        to: recipients.join(", "),
        subject: `EVRS 2026 vendor booking: ${brand}`,
        text: fields.map(([key, value]) => `${key}: ${value}`).join("\n"),
        html: `<h1>EVRS 2026 Vendor Booking Form</h1><table style="border-collapse:collapse">${formatFields(fields)}</table>`,
      }),
      sendVendorLeadToGoogleSheet(fields),
    ]);

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Vendor form delivery failed:", error);
    return Response.json({ error: "Unable to submit the form." }, { status: 502 });
  }
}