import { loadEnvConfig } from "@next/env";
import { createClient } from "next-sanity";
loadEnvConfig(process.cwd());
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "", dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-09", token: process.env.SANITY_API_TOKEN, useCdn: false });
async function run() {
  await client.patch("evrs-community").set({ "raceDay.title": "A race day worth\nbringing the club to" }).commit();
  await client.patch("evrs-corporate").set({ "raceDay.title": "A race day built\nfor every colleague" }).commit();
  console.log("Restored the original two-line race-day headings.");
}
run().catch((error) => { console.error(error); process.exit(1); });