import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { homeData } from "../src/data/home-data";
import { arabicData } from "../src/data/home-data/arabic-index";
import { qidfa } from "../src/data/races/qidfa";
import { alLehbab } from "../src/data/races/al-lehbab";
import { wadiAlHelo } from "../src/data/races/wadi-al-helo";
import { falajAlMualla } from "../src/data/races/falaj-al-mualla";
import { masfout } from "../src/data/races/masfout";
import { alRams } from "../src/data/races/al-rams";
import { alShuwaib } from "../src/data/races/al-shuwaib";
import type { RacePageData } from "../src/data/races/types";

for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, "");
}
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!, token: process.env.SANITY_API_TOKEN!, useCdn: false });
const key = (name: string, index: number) => ({ _key: `${name}-${index}` });
const localImage = async (url: string) => {
  const file = resolve("public", url.replace(/^\//, ""));
  const asset = await client.assets.upload("image", readFileSync(file), { filename: url.split("/").pop() });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
};
const bilingual = (en: string, ar = en) => ({ titleEn: en, titleAr: ar });
const section = (sectionName: string, values: Record<string, unknown> = {}) => ({ _key: sectionName.toLowerCase().replace(/[^a-z0-9]+/g, "-"), sectionName, ...values });

async function raceDocument(race: RacePageData, slug: string) {
  const hero = await localImage(race.assets.hero);
  const about = await localImage(race.assets.about);
  const sections = [
    section("Hero", { ...bilingual(race.heroTitle.join("\n")), paragraphEn: race.introduction, paragraphAr: race.introduction, ctaEn: `Register for ${race.name}`, ctaAr: `Register for ${race.name}`, ctaHref: race.registerUrl, image: hero }),
    section("About the Race", { ...bilingual(`Discover ${race.name}`), paragraphEn: race.paragraphs.join("\n\n"), paragraphAr: race.paragraphs.join("\n\n"), image: about, items: [{ ...key("race-day", 0), itemName: "Race Day Information", titleEn: "Race Day Information", titleAr: "Race Day Information", paragraphEn: `${race.date}\nArrival Time: 2:30 PM\nRace Start: 4:00 PM`, paragraphAr: `${race.date}\nArrival Time: 2:30 PM\nRace Start: 4:00 PM` }] }),
    section("Distances", { ...bilingual("Choose Your Challenge"), ctaEn: "Register Now", ctaAr: "Register Now", ctaHref: race.registerUrl, items: race.distances.map((item, index) => ({ ...key("distance", index), itemName: item.distance, titleEn: `${item.distance} ${item.title}`, titleAr: `${item.distance} ${item.title}`, paragraphEn: item.description, paragraphAr: item.description })) }),
    section("Race Maps", { ...bilingual("Explore the Route"), items: await Promise.all(race.routes.map(async (route, index) => ({ ...key("route", index), itemName: route.label, titleEn: route.label, titleAr: route.label, image: await localImage(route.image), images: route.images ? await Promise.all(route.images.map(localImage)) : undefined }))) }),
    section("Route map CTA", { ...bilingual(race.routeCta.title), paragraphEn: race.routeCta.description, paragraphAr: race.routeCta.description, ctaEn: race.routeCta.button, ctaAr: race.routeCta.button, ctaHref: race.registerUrl }),
    section("Location and registration", { ...bilingual(race.journey.title), paragraphEn: race.journey.description, paragraphAr: race.journey.description, ctaEn: "Register to Race", ctaAr: "Register to Race", ctaHref: race.registerUrl, items: [{ ...key("location", 0), itemName: "Location", titleEn: race.location.name, titleAr: race.location.name, paragraphEn: race.location.address, paragraphAr: race.location.address }] }),
  ];
  await client.createOrReplace({ _id: `race-${slug}`, _type: "racePage", pageName: race.name, slug, sections });
}

async function seed() {
  await client.createOrReplace({ _id: "navbar", _type: "navbar", sectionName: "Navbar", logo: await localImage("/home/logo.svg"), brandEn: homeData.brand, brandAr: arabicData.brand, navigation: ["home", "about", "races", "faqs", "contact"].map((name, index) => ({ ...key("nav", index), labelEn: homeData.ui.nav[name as keyof typeof homeData.ui.nav], labelAr: arabicData.ui.nav[name as keyof typeof arabicData.ui.nav], href: ["/", "/about", "/races/qidfa", "/faqs", "/contact"][index] })), races: homeData.ui.navRaces.map((race, index) => ({ ...key("race", index), labelEn: race.label, labelAr: arabicData.ui.navRaces[index]?.label ?? race.label, href: race.href })), registerEn: homeData.register.label, registerAr: arabicData.register.label, registerHref: homeData.register.href });
  await client.createOrReplace({ _id: "footer", _type: "footer", sectionName: "Footer", logo: await localImage("/home/footer-logo.png"), descriptionEn: homeData.footer.description, descriptionAr: arabicData.footer.description, organizerEn: homeData.footer.organizer, organizerAr: arabicData.footer.organizer, quickLinksTitleEn: homeData.footer.quickLinks, quickLinksTitleAr: arabicData.footer.quickLinks, email: homeData.footer.email, emailHref: `mailto:${homeData.footer.email}`, quickLinks: homeData.ui.navRaces.map((race, index) => ({ ...key("quick", index), labelEn: race.label, labelAr: arabicData.ui.navRaces[index]?.label ?? race.label, href: race.href })), socials: homeData.footer.socials.map((social, index) => ({ ...key("social", index), ...social })), copyrightEn: homeData.footer.copyright, copyrightAr: arabicData.footer.copyright, legal: homeData.footer.legal.map((label, index) => ({ ...key("legal", index), labelEn: label, labelAr: arabicData.footer.legal[index], href: "#" })) });
  await Promise.all([
    raceDocument(qidfa, "qidfa"), raceDocument(alLehbab, "al-lehbab"), raceDocument(wadiAlHelo, "wadi-al-helo"), raceDocument(falajAlMualla, "falaj-al-mualla"), raceDocument(masfout, "masfout"), raceDocument(alRams, "al-rams"), raceDocument(alShuwaib, "al-shuwaib"),
  ]);
}
seed().catch((error) => { console.error(error); process.exit(1); });
