import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { qidfa } from "../src/data/races/qidfa";
import { alLehbab } from "../src/data/races/al-lehbab";
import { wadiAlHelo } from "../src/data/races/wadi-al-helo";
import { falajAlMualla } from "../src/data/races/falaj-al-mualla";
import { masfout } from "../src/data/races/masfout";
import { alRams } from "../src/data/races/al-rams";
import { alShuwaib } from "../src/data/races/al-shuwaib";

for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) { const match = line.match(/^([^#=]+)=(.*)$/); if (match) process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, ""); }
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!, token: process.env.SANITY_API_TOKEN!, useCdn: false });
const races = [["qidfa", qidfa], ["al-lehbab", alLehbab], ["wadi-al-helo", wadiAlHelo], ["falaj-al-mualla", falajAlMualla], ["masfout", masfout], ["al-rams", alRams], ["al-shuwaib", alShuwaib]] as const;
async function fixRaceDocuments() {
  await Promise.all(races.map(async ([slug, race]) => {
    const document = await client.getDocument(`race-${slug}`) as any;
    const sections = document?.sections?.map((section: any) => { if (section.sectionName === "About the Race") return { ...section, items: (section.items || []).filter((item: any) => item.itemName !== "Race Day Information"), eyebrowEn: "About the Race", raceDayInformationEn: "Race Day Information", dateLabelEn: "Date:", dateValueEn: race.date, arrivalTimeLabelEn: "Arrival Time:", arrivalTimeValueEn: "2:30 PM", raceStartLabelEn: "Race Start:", raceStartValueEn: "4:00 PM" }; if (section.sectionName === "Distances") return { ...section, eyebrowEn: "Distances" }; if (section.sectionName === "Race Maps") return { ...section, eyebrowEn: "Race Maps" }; if (section.sectionName === "Route map CTA") return { ...section, eyebrowEn: race.routeCta.eyebrow || "" }; return section; });
    if (sections) await client.patch(`race-${slug}`).set({ sections }).commit();
  }));
}
fixRaceDocuments().catch((error) => { console.error(error); process.exit(1); });
