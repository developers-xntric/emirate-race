import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { homeData } from "../src/data/home-data";
import { arabicData } from "../src/data/home-data/arabic-index";

for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, "");
}
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!, token: process.env.SANITY_API_TOKEN!, useCdn: false });
const links = [
  ["home", "/"], ["about", "/about"], ["contact", "/contact"], ["faqs", "/faqs"],
].map(([name, href], index) => ({ _key: `primary-${index}`, labelEn: homeData.ui.nav[name as keyof typeof homeData.ui.nav], labelAr: arabicData.ui.nav[name as keyof typeof arabicData.ui.nav], href }));
links.push({ _key: "primary-press-kit", labelEn: "Press Kit", labelAr: "الحقيبة الإعلامية", href: "#", isPressKit: true } as never);
async function fixFooter() {
await client.patch("footer").unset(["quickLinks"]).set({
  quickLinksPrimary: links,
  quickLinksRaces: homeData.ui.navRaces.map((race, index) => ({ _key: `race-${index}`, labelEn: race.label, labelAr: arabicData.ui.navRaces[index]?.label ?? race.label, href: race.href })),
}).commit();
}
fixFooter().catch((error) => { console.error(error); process.exit(1); });
