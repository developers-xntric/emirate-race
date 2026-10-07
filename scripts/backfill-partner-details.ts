import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { createClient } from "next-sanity";

loadEnvConfig(process.cwd());
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-09",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
const root = process.cwd();
const villages = [
  ["qidfa", "Qidfa", "Fujairah", "2026-10-10", "Coastal waves", "#3d93cf"],
  ["lahbab", "Lahbab", "Dubai", "2026-10-17", "Palm frond", "#6c71b8"],
  ["wadi", "Wadi Al Helo", "Sharjah", "2026-10-24", "Ghaf tree", "#b80356"],
  ["falaj", "Falaj Al Mualla", "Umm Al Quwain", "2026-10-31", "The falaj channel", "#4db4a8"],
  ["masfout", "Masfout", "Ajman", "2026-11-14", "The fort", "#bb866a"],
  ["rams", "Al Rams", "Ras Al Khaimah", "2026-11-28", "Pearls & fishing", "#f1926e"],
  ["shuwaib", "Al Shuwaib", "Abu Dhabi", "2026-12-05", "Desert dunes", "#dccbc0"],
] as const;

const ref = (asset: { _id: string }) => ({ _type: "image", asset: { _type: "reference", _ref: asset._id } });
async function upload(relativePath: string) {
  const fullPath = path.join(root, relativePath);
  return client.assets.upload("image", fs.createReadStream(fullPath), { filename: path.basename(fullPath) });
}

async function pageDetails(id: string, corporate: boolean) {
  const base = corporate ? "public/evrs-corporate" : "public/evrs-community";
  const invitationImage = ref(await upload(`${base}/assets/img/club-run.webp`));
  const medalImages = await Promise.all(villages.map(async ([key]) => ref(await upload(`${base}/assets/medals/${key}.webp`))));
  const distanceImages = await Promise.all(["rahhal-kick.webp", "rahhal-run.webp", "rahhal-bottle.webp"].map(async (file) => ref(await upload(`${base}/assets/img/${file}`))));
  const races = villages.map(([key, name, emirate, date, meaning, color], index) => ({ _key: key, key, name, emirate, date, meaning, color, image: medalImages[index] }));
  const distances = [
    { _key: "10km", distance: 10, tabLabel: "10KM", tabCaption: "Competitive · timed", tagline: "The race", description: "A competitive timed race", laps: "≈ 25 laps of a 400 m track", image: distanceImages[0] },
    { _key: "5km", distance: 5, tabLabel: "5KM", tabCaption: "Clubs & groups", tagline: "The club run", description: "A community run for clubs and groups", laps: "≈ 12.5 laps of a 400 m track", image: distanceImages[1] },
    { _key: "1-5km", distance: 1.5, tabLabel: "1.5KM", tabCaption: "Family · all ages", tagline: "The family run", description: "A family run for all ages", laps: "≈ 3.75 laps of a 400 m track", image: distanceImages[2] },
  ];
  const statement = corporate
    ? { statementEyebrow: "Your commitment", statementLine1: "Start with one race.", statementLine2: "Or make the full season", statementLine3: "your company’s challenge." }
    : { statementEyebrow: "Your call", statementLine1: "Run one race together.", statementLine2: "Or make the full season", statementLine3: "your club’s challenge." };
  await client.patch(id).setIfMissing({
    "invitation.scrollCue": "Keep scrolling", "invitation.image": invitationImage, ...Object.fromEntries(Object.entries(statement).map(([key, value]) => [`invitation.${key}`, value])),
    "season.races": races, "raceDay.distances": distances,
  }).commit();
}

async function run() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) throw new Error("Sanity project ID or write token is missing.");
  await pageDetails("evrs-community", false);
  await pageDetails("evrs-corporate", true);
  console.log("Backfilled partner invitation, season, and race-day CMS content.");
}
run().catch((error) => { console.error(error); process.exit(1); });