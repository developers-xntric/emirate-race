import { loadEnvConfig } from "@next/env";
import { createClient } from "next-sanity";

loadEnvConfig(process.cwd());
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "", dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-09", token: process.env.SANITY_API_TOKEN, useCdn: false });
const numberCards = [
  { _key: "followers", value: "6K+", unit: "● = 100 followers", label: "Followers across EVRS social pages", countTo: 6000, format: "K", dots: 60 },
  { _key: "views", value: "2M+", unit: "● = 100K views", label: "Views last season", countTo: 2000000, format: "M", dots: 20 },
  { _key: "registrations", value: "5,000+", unit: "● = 100 registrations", label: "Registrations last season", countTo: 5000, format: "comma", dots: 50 },
  { _key: "communities", value: "25+", unit: "● = 1 community", label: "Running communities engaged", countTo: 25, format: "plain", dots: 25 },
];
async function run() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) throw new Error("Sanity project ID or write token is missing.");
  await Promise.all(["evrs-community", "evrs-corporate"].map((id) => client.patch(id).setIfMissing({
    "season.raceLabel": "Race", "season.medalLabel": "Medal piece", "medal.cta": "Run the whole season", "numbers.cards": numberCards,
  }).commit()));
  console.log("Backfilled partner card labels, medal CTA, and number-card defaults.");
}
run().catch((error) => { console.error(error); process.exit(1); });