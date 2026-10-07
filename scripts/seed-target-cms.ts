import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { loadEnvConfig } from "@next/env";
import { createClient } from "next-sanity";

loadEnvConfig(process.cwd());
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-09";
const client = createClient({ projectId, dataset, apiVersion, token: process.env.SANITY_API_TOKEN, useCdn: false });
const section = (sectionName: string, eyebrow: string, title: string, body: string) => ({ sectionName, eyebrow, title, body });
const partner = (id: string, pageName: string, isCorporate: boolean) => ({
  _id: id, _type: "partnerLandingPage", pageName,
  hero: section("Hero", `EVRS 2026 · ${isCorporate ? "Corporate" : "Community"} partners`, isCorporate ? "Bring your team\nto the next village" : "Bring your runners\nto the next village", isCorporate ? "An invitation to join EVRS as a corporate partner." : "An invitation to join EVRS as a community partner."),
  invitation: section("Invitation", "The invitation", isCorporate ? "A shared reason\nto move" : "Bring your runners\nto the next village", "EVRS connects seven emirates through running, local communities and places many of us have never explored."),
  season: section("Season", "The season", "Seven Saturdays.\nSeven emirates.", ""),
  raceDay: section("Race day", isCorporate ? "For your team" : "For your runners", isCorporate ? "A race day worth\nbringing the team to" : "A race day worth\nbringing the club to", isCorporate ? "Three distances on race day, so every member of your team has a start line." : "Three distances on race day, so every member of your club has a start line: the racers, the regulars and the families."),
  medal: section("Seven-piece medal", "The seven-piece medal", "Seven villages.\nOne medal to finish.", "Complete all seven to collect the full seven-piece medal. Every village adds its own piece. Try it: collect them in race order."),
  numbers: section("EVRS in numbers", "EVRS in numbers", isCorporate ? "A team on the move" : "A community\nalready on the move", ""),
  partnership: section("Partnership", "The partnership", isCorporate ? "Let’s bring your team\ninto the series" : "Let’s bring your community\ninto the series", ""),
  moment: section("Community / team moment", isCorporate ? "A team moment" : "A community moment", isCorporate ? "Our team is running EVRS." : "Our club is running EVRS.", isCorporate ? "Bring your team together around a shared start line and a series that travels across the UAE." : "Rahhal can bring his competitive spirit to selected club sessions: a playful warm-up, a group run and a shared invitation to the next village."),
  join: section("Partner enquiry form", "Your next village is waiting", isCorporate ? "Bring your team\nalong for the run." : "Bring your club\nalong for the run.", isCorporate ? "Interested in joining EVRS as a corporate partner? Share your team contact and let’s plan your place in the series." : "Interested in joining EVRS as a community partner? Share your club contact and let’s plan your place in the series."),
});

function vendorTranslations() {
  const html = fs.readFileSync(path.join(process.cwd(), "public/vendor-form-2026.html"), "utf8");
  const start = html.indexOf("const I18N = {"); const end = html.indexOf("let currentLang", start);
  const source = html.slice(start, end).replace(/const I18N\s*=/, "globalThis.I18N =");
  const context: { I18N?: Record<string, Record<string, string>> } = {};
  vm.runInNewContext(source, context);
  const en = context.I18N?.en ?? {}; const ar = context.I18N?.ar ?? {};
  return Object.keys(en).map((key) => ({ _key: key, key, label: key.replace(/_/g, " "), valueEn: en[key], valueAr: ar[key] ?? "" }));
}

async function run() {
  if (!projectId || !process.env.SANITY_API_TOKEN) throw new Error("Sanity project ID or write token is missing.");
  await client.createIfNotExists(partner("evrs-community", "EVRS Community partners", false));
  await client.createIfNotExists(partner("evrs-corporate", "EVRS Corporate partners", true));
  await client.createIfNotExists({ _id: "vendor-form-2026", _type: "vendorFormPage", pageName: "EVRS 2026 Vendor booking form", translations: vendorTranslations() });
  console.log("Seeded the Community, Corporate, and Vendor CMS documents when absent.");
}
run().catch((error) => { console.error(error); process.exit(1); });