import { loadEnvConfig } from "@next/env";
import { createClient } from "next-sanity";
loadEnvConfig(process.cwd());
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "", dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-09", token: process.env.SANITY_API_TOKEN, useCdn: false });
const keyed = <T extends object>(items: T[]) => items.map((item, index) => ({ _key: `step-${index + 1}`, ...item }));
const community = {
  leftTitle: "Your club", footer: "Hover a step to see how the two sides line up.",
  leftItems: keyed([
    { title: "Nominate a contact", description: "One person coordinates race choices, club communications and approvals.", channels: [] },
    { title: "Post to your community", description: "Publish an EVRS invitation as a social post and Stories, with the registration link and club code once confirmed.", channels: ["Social post", "Stories"] },
    { title: "Use your strongest channel", description: "Send an EDM if email works for your members; otherwise focus on the channel where your club gets the most engagement.", channels: ["EDM", "Top-engagement channel"] },
    { title: "Run and share together", description: "Choose a race for your members, tag EVRS in your coverage and invite them to the EVRS Strava Club.", channels: ["Tag EVRS", "EVRS Strava Club"] },
  ]),
  rightTitle: "EVRS", rightItems: keyed([
    { text: "Welcome your club into the series.", subtext: "" }, { text: "Make room for club recognition and shared content.", subtext: "" }, { text: "A visit from Rahhal to one of your club sessions.", subtext: "Planned with participating clubs where schedules allow." }, { text: "Explore a club offer together before outreach goes live.", subtext: "" },
  ]),
};
const corporate = {
  leftTitle: "Your organisation", footer: "Hover a step to see how the two sides line up.",
  leftItems: keyed([
    { title: "Nominate a contact", description: "A single point of contact, typically from HR, wellbeing or internal communications, coordinates race choices, staff communications and approvals.", channels: [] },
    { title: "Invite your people", description: "Share the EVRS invitation through your internal channels, with the registration link and your company code once confirmed.", channels: ["Intranet / Teams", "LinkedIn"] },
    { title: "Use your strongest channel", description: "Send a staff EDM or newsletter feature; otherwise focus on the channel where your people engage most.", channels: ["EDM", "Staff newsletter"] },
    { title: "Run and share together", description: "Choose a race for your teams, tag EVRS in your company coverage and invite colleagues to the EVRS Strava Club.", channels: ["Tag EVRS", "EVRS Strava Club"] },
  ]),
  rightTitle: "EVRS", rightItems: keyed([
    { text: "Welcome your organisation into the series as a corporate partner.", subtext: "" }, { text: "Recognise your company and create shared, brand-ready content.", subtext: "" }, { text: "A visit from Rahhal to your office or a team wellbeing session.", subtext: "Planned with participating organisations where schedules allow." }, { text: "Shape a corporate team offer together before your internal launch.", subtext: "" },
  ]),
};
async function save(id: string, content: typeof community, eyebrow: string, title: string) {
  await client.patch(id).set({
    "partnership.sectionName": "Partnership", "partnership.eyebrow": eyebrow, "partnership.title": title, "partnership.body": "",
    "partnership.footer": content.footer, "partnership.leftTitle": content.leftTitle, "partnership.leftItems": content.leftItems,
    "partnership.rightTitle": content.rightTitle, "partnership.rightItems": content.rightItems,
  }).commit();
}
async function run() {
  if (!process.env.SANITY_API_TOKEN) throw new Error("Sanity write token is missing.");
  await save("evrs-community", community, "The partnership", "Let’s bring your community\ninto the series");
  await save("evrs-corporate", corporate, "The partnership", "Let’s bring your organisation\ninto the series");
  console.log("Backfilled editable Partnership cards for both pages.");
}
run().catch((error) => { console.error(error); process.exit(1); });