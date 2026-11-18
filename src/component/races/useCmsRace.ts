"use client";

import { useEffect, useState } from "react";
import type { RacePageData } from "@/data/races/types";
import { previewQuery } from "@/lib/payload/preview-client";
import { usePayloadCmsPreview } from "@/component/usePayloadCmsPreview";

type CmsSection = Record<string, any>;
export type CmsRacePageData = RacePageData & { cms: { heroCta: string; aboutEyebrow: string; aboutTitle: string; distancesEyebrow: string; distancesTitle: string; distancesCta: string; distancesHref: string; mapsEyebrow: string; mapsTitle: string; routeCtaEyebrow: string; journeyCta: string; journeyHref: string; raceDayTitle: string; dateLabel: string; dateValue: string; arrivalLabel: string; arrivalValue: string; startLabel: string; startValue: string } };
const localize = (section: CmsSection | undefined, name: "title" | "paragraph" | "cta", language: "en" | "ar", fallback: string) => section?.[`${name}${language === "en" ? "En" : "Ar"}`] || fallback;

export function useCmsRace(race: RacePageData, slug: string, language: "en" | "ar"): CmsRacePageData {
  const [document, setDocument] = useState<{ sections?: CmsSection[]; seo?: CmsSection } | null>(null);
  usePayloadCmsPreview((sourceId, content, raw) => { if (sourceId.startsWith("race-") && raw.slug === slug) setDocument(content as { sections?: CmsSection[]; seo?: CmsSection }); });
  useEffect(() => { fetch(`/api/cms/race/${slug}${previewQuery()}`, { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then(setDocument).catch(() => {}); }, [slug]);
  useEffect(() => { const seo = document?.seo; if (!seo) return; const suffix = language === "en" ? "En" : "Ar"; const title = seo[`title${suffix}`]; const description = seo[`description${suffix}`]; if (title) window.document.title = title; if (description) window.document.querySelector('meta[name="description"]')?.setAttribute("content", description); }, [document, language]);
  const fallback = { heroCta: `Register for ${race.name}`, aboutEyebrow: "About the Race", aboutTitle: `Discover ${race.name}`, distancesEyebrow: "Distances", distancesTitle: "Choose Your Challenge", distancesCta: "Register Now", distancesHref: race.registerUrl, mapsEyebrow: "Race Maps", mapsTitle: "Explore the Route", routeCtaEyebrow: race.routeCta.eyebrow || "", journeyCta: "Register to Race", journeyHref: race.registerUrl, raceDayTitle: "Race Day Information", dateLabel: "Date:", dateValue: race.date, arrivalLabel: "Arrival Time:", arrivalValue: "2:30 PM", startLabel: "Race Start:", startValue: "4:00 PM" };
  if (!document?.sections) return { ...race, cms: fallback };
  const [hero, about, distances, maps, mapCta, journey] = document.sections;
  return {
    ...race,
    heroTitle: localize(hero, "title", language, race.heroTitle.join("\n")).split("\n"),
    introduction: localize(hero, "paragraph", language, race.introduction),
    date: hero?.[language === "en" ? "heroDateEn" : "heroDateAr"] || race.date,
    registerUrl: hero?.ctaHref || race.registerUrl,
    assets: { ...race.assets, ...(hero?.image ? { hero: hero.image } : {}), ...(about?.image ? { about: about.image } : {}) },
    paragraphs: localize(about, "paragraph", language, race.paragraphs.join("\n\n")).split("\n\n"),
    distances: distances?.items?.map((item: CmsSection, index: number) => { const base = race.distances[index]; const title = localize(item, "title", language, base?.title || ""); const distance = item[language === "en" ? "itemNameEn" : "itemNameAr"] || base?.distance || ""; return { ...base, distance, title: title.replace(new RegExp(`^${base?.distance}\\s*`, "i"), ""), description: localize(item, "paragraph", language, base?.description || ""), tabImage: item.image || base?.tabImage }; }) || race.distances,
    routes: maps?.items?.map((item: CmsSection, index: number) => ({ ...race.routes[index], label: localize(item, "title", language, race.routes[index]?.label || ""), image: item.image || race.routes[index]?.image, ...(item.images?.length ? { images: item.images } : {}) })) || race.routes,
    routeCta: { ...race.routeCta, title: localize(mapCta, "title", language, race.routeCta.title), description: localize(mapCta, "paragraph", language, race.routeCta.description), button: localize(mapCta, "cta", language, race.routeCta.button) },
    journey: { ...race.journey, title: localize(journey, "title", language, race.journey.title), description: localize(journey, "paragraph", language, race.journey.description) },
    cms: { heroCta: localize(hero, "cta", language, fallback.heroCta), aboutEyebrow: about?.[language === "en" ? "eyebrowEn" : "eyebrowAr"] || fallback.aboutEyebrow, aboutTitle: localize(about, "title", language, fallback.aboutTitle), distancesEyebrow: distances?.[language === "en" ? "eyebrowEn" : "eyebrowAr"] || fallback.distancesEyebrow, distancesTitle: localize(distances, "title", language, fallback.distancesTitle), distancesCta: localize(distances, "cta", language, fallback.distancesCta), distancesHref: distances?.ctaHref || fallback.distancesHref, mapsEyebrow: maps?.[language === "en" ? "eyebrowEn" : "eyebrowAr"] || fallback.mapsEyebrow, mapsTitle: localize(maps, "title", language, fallback.mapsTitle), routeCtaEyebrow: mapCta?.[language === "en" ? "eyebrowEn" : "eyebrowAr"] || fallback.routeCtaEyebrow, journeyCta: localize(journey, "cta", language, fallback.journeyCta), journeyHref: journey?.ctaHref || race.registerUrl, raceDayTitle: about?.[language === "en" ? "raceDayInformationEn" : "raceDayInformationAr"] || fallback.raceDayTitle, dateLabel: about?.[language === "en" ? "dateLabelEn" : "dateLabelAr"] || fallback.dateLabel, dateValue: about?.[language === "en" ? "dateValueEn" : "dateValueAr"] || fallback.dateValue, arrivalLabel: about?.[language === "en" ? "arrivalTimeLabelEn" : "arrivalTimeLabelAr"] || fallback.arrivalLabel, arrivalValue: about?.[language === "en" ? "arrivalTimeValueEn" : "arrivalTimeValueAr"] || fallback.arrivalValue, startLabel: about?.[language === "en" ? "raceStartLabelEn" : "raceStartLabelAr"] || fallback.startLabel, startValue: about?.[language === "en" ? "raceStartValueEn" : "raceStartValueAr"] || fallback.startValue },
  };
}
