import { createHash } from "node:crypto";
import { contactEmails, pressKitEmails } from "@/lib/contact/email";
import { isEmail, raceOptions, validateContact } from "@/lib/contact/validation";
import { sanityClient } from "@/sanity/lib/client";
import { smtpConfig } from "@/lib/contact/smtp";
import { saveContactLead, savePressKitLead } from "@/lib/leads/save";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; expires: number }>();
function allowed(key: string) { const now = Date.now(); for (const [id, entry] of attempts) if (entry.expires <= now) attempts.delete(id); const previous = attempts.get(key); if (previous && previous.count >= 5) return false; attempts.set(key, { count: (previous?.count ?? 0) + 1, expires: previous?.expires ?? now + 900000 }); return true; }
const out = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const requestIdOk = (id: unknown) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
const text = (value: unknown, max: number) => typeof value === "string" && value.trim().length > 0 && value.length <= max && !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value);
function isSameSiteRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const requestUrl = new URL(request.url);
  const protocol = request.headers.get("x-forwarded-proto") || requestUrl.protocol.replace(":", "");
  const hosts = [request.headers.get("host"), request.headers.get("x-forwarded-host")].filter(Boolean);
  const allowedOrigins = new Set([requestUrl.origin, ...hosts.map((host) => `${protocol}://${host}`)]);
  return allowedOrigins.has(origin);
}
const pressKitSheetUrl = "https://script.google.com/macros/s/AKfycbyK3maTuJhK4W8YlpsTwSJdEKvR0AbRJs7-ISLd88SVVD73JaDomD0G8kfQ66ri4rbgsg/exec";
async function appendPressKitToSheet(input: { name: string; email: string; channelLink: string }) {
  try { const response = await fetch(pressKitSheetUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessEmail: input.email, fullName: input.name, channelLink: input.channelLink }) }); if (!response.ok) throw new Error(`Sheet response ${response.status}`); } catch (error) { console.error("Press Kit sheet submission failed", { error: error instanceof Error ? error.message : "unknown" }); }
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) return out({ message: "Please send your enquiry from this website." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return out({ message: "Please submit the form again." }, 415);
  let input: unknown; try { input = await request.json(); } catch { return out({ message: "We could not read your request. Please try again." }, 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return out({ message: "Please complete the form." }, 400);
  const raw = input as Record<string, unknown>;
  if (raw.website) return out({ message: "Please complete the form." }, 400);
  if (!requestIdOk(raw.requestId)) return out({ message: "Please refresh and submit again." }, 400);
  const config = smtpConfig();
  const requestId = raw.requestId as string;

  if (raw.kind === "press-kit") {
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
    const channelLink = typeof raw.channelLink === "string" ? raw.channelLink.trim() : "";
    const errors: Record<string, string> = {};
    if (!text(name, 100) || name.length < 2) errors.name = "Please enter your full name.";
    if (!isEmail(email)) errors.email = "Please enter a valid email address.";
    if (channelLink && !text(channelLink, 500)) errors.channelLink = "Please enter a valid channel link.";
    if (Object.keys(errors).length) return out({ message: "Please review the highlighted fields.", errors }, 422);
    const key = createHash("sha256").update(email).digest("hex");
    if (!allowed(key)) return out({ message: "Please wait 15 minutes before requesting another press kit." }, 429);
    const reference = `EVRS-PK-${requestId.slice(0, 8).toUpperCase()}`;
    await appendPressKitToSheet({ name, email, channelLink });
    await savePressKitLead({ name, email, channelLink }).catch((error) => console.error("Press Kit lead storage failed", error));
    if (!config || !isEmail(config.admin)) {
      console.warn("Press Kit submitted without SMTP configuration", { reference });
      return out({ message: "Thank you. Your press kit is ready to download.", reference });
    }
    try {
      const [admin, visitor] = pressKitEmails({ name, email, channelLink }, { from: config.from, admin: config.admin }, reference);
      await config.transporter.sendMail(admin);
      await config.transporter.sendMail(visitor);
      return out({ message: "Thank you. Your press kit is ready to download.", reference });
    } catch (error) {
      console.error("Press Kit SMTP delivery failed", { reference, error: error instanceof Error ? error.message : "unknown" });
      return out({ message: "Your details were received, but we could not send the confirmation email. Please use the download below.", reference });
    }
  }
  if (!config || !isEmail(config.admin)) return out({ message: "Our form is temporarily unavailable. Please email info@emiratesvillages.ae." }, 503);
  const cmsOptions = await sanityClient.fetch<string[]>(`*[_type == "contactPage" && _id == "contact"][0].form.raceOptions[].labelEn`).catch(() => raceOptions);
  const allowedOptions = cmsOptions?.filter(Boolean).map((option) => option.trim()) || raceOptions;
  const { data, errors } = validateContact(input, allowedOptions);
  if (Object.keys(errors).length) return out({ message: "Please review the highlighted fields.", errors }, 422);
  const key = createHash("sha256").update(data.email).digest("hex");
  if (!allowed(key)) return out({ message: "Please wait 15 minutes before sending another enquiry." }, 429);
  const reference = `EVRS-${requestId.slice(0, 8).toUpperCase()}`;
  try { const [admin, visitor] = contactEmails(data, { from: config.from, admin: config.admin }, reference); await config.transporter.sendMail(admin); await config.transporter.sendMail(visitor); await saveContactLead(data).catch((error) => console.error("Contact lead storage failed", error)); return out({ message: "Thank you. Your enquiry has been received by our team.", reference }); }
  catch (error) { console.error("Contact SMTP delivery failed", { reference, error: error instanceof Error ? error.message : "unknown" }); return out({ message: "We could not send your enquiry right now. Please try again shortly or email info@emiratesvillages.ae." }, 502); }
}
