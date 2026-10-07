import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { createClient } from "next-sanity";

loadEnvConfig(process.cwd());
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "", dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-09-09", token: process.env.SANITY_API_TOKEN, useCdn: false });
const keys = ["qidfa", "lahbab", "wadi", "falaj", "masfout", "rams", "shuwaib"];
const image = (asset: { _id: string }) => ({ _type: "image", asset: { _type: "reference", _ref: asset._id } });

async function run() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) throw new Error("Sanity project ID or write token is missing.");
  for (const page of ["community", "corporate"] as const) {
    const id = `evrs-${page}`;
    const document = await client.fetch<{ season?: { races?: Array<Record<string, unknown>> } } | null>(`*[_id == $id][0]{season{races}}`, { id });
    const races = document?.season?.races ?? [];
    const base = path.join(process.cwd(), `public/evrs-${page}/assets/icons`);
    const icons = await Promise.all(keys.map(async (key) => image(await client.assets.upload("image", fs.createReadStream(path.join(base, `${key}.png`)), { filename: `${key}.png` }))));
    const updated = races.map((race, index) => ({ ...race, icon: icons[index] }));
    await client.patch(id).set({ "season.races": updated }).commit();
  }
  console.log("Backfilled all fourteen partner-page race-card icons.");
}
run().catch((error) => { console.error(error); process.exit(1); });