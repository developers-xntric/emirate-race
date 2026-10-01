const PAGE_TYPES = {
  "EVRS community partners landing page": "Community",
  "EVRS corporate partners landing page": "Corporate",
} as const;

const MAX_FIELD_LENGTH = 2_000;

function text(value: unknown): string {
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(", ");
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const source = text(input.source);
  const partnerType = PAGE_TYPES[source as keyof typeof PAGE_TYPES];
  const submission = {
    partner_type: partnerType,
    club: text(input.club),
    name: text(input.name),
    email: text(input.email),
    phone: text(input.phone),
    members: text(input.members),
    villages: Array.isArray(input.villages) ? input.villages.map(text).filter(Boolean) : [],
    note: text(input.note),
    source,
    submitted_at: text(input.submittedAt) || new Date().toISOString(),
  };

  if (!partnerType || !submission.club || !submission.name || !/^\S+@\S+\.\S+$/.test(submission.email)) {
    return Response.json({ error: "Missing or invalid required form details." }, { status: 400 });
  }

  const endpoint = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
  if (!endpoint) {
    console.error("GOOGLE_APPS_SCRIPT_WEB_APP_URL is not configured.");
    return Response.json({ error: "Form delivery is not configured." }, { status: 503 });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    const result: unknown = await response.json().catch(() => null);
    if (!response.ok || !result || typeof result !== "object" || (result as { ok?: unknown }).ok !== true) {
      console.error("Google Apps Script rejected EVRS partner form:", response.status);
      return Response.json({ error: "Unable to submit the form." }, { status: 502 });
    }
  } catch (error) {
    console.error("EVRS partner form delivery failed:", error);
    return Response.json({ error: "Unable to submit the form." }, { status: 502 });
  }

  return Response.json({ ok: true });
}