import type { RacePageData } from "./types";
import { qidfa } from "./qidfa";

// Figma page 341:749 and route variants 341:1278.
export const lehbab: RacePageData = {
  name: "Lehbab",
  heroTitle: ["Run Beyond", "the City"],
  heroPosition: "center 45%",
  aboutAlt: "Two runners on a village trail in Lehbab, Dubai",
  registerUrl:
    "https://www.premieronline.com/event/emirates_villages_run_series_race_2_dubai_8813",
  date: "Saturday, 17 October 2026",
  introduction:
    "Race two takes EVRS to Lehbab, revealing a different side of Dubai through movement, landscape and discovery.",
  paragraphs: [
    "Lehbab brings the EVRS journey into a village setting that feels far removed from the city’s usual pace.",
    "As the second stop of the series, this race continues the nationwide journey across seven emirates and seven villages, welcoming competitive runners, communities and families alike.",
    "The race takes place in Lehbab, offering participants a chance to experience a distinct village setting within Dubai.",
  ],
  distances: qidfa.distances,
  assets: {
    hero: "/races/lehbab/hero.png",
    about: "/races/lehbab/about.png",
    pattern: "/races/lehbab/about-pattern.svg",
    mark: "/races/lehbab/mark.svg",
    location: "/races/lehbab/location.png",
    routeLogo: "/races/lehbab/route-logo.svg",
  },
  routes: [
    {
      id: "family",
      label: "1.5KM Family Run",
      image: "/races/lehbab/route-family2.png",
      imageHeight: "117.21%",
      logoLeft: "81.01%",
      logoTop: "10.22%",
    },
    {
      id: "community",
      label: "5KM Community Run",
      image: "/races/lehbab/route-community2.png",
      imageHeight: "117.35%",
      imageTop: "-4.35%",
      logoLeft: "81.63%",
      logoTop: "5.97%",
    },
    {
      id: "competitive",
      label: "10KM Competitive Run",
      image: "/races/lehbab/route-competitive2.png",
      imageHeight: "105.75%",
      imageTop: "-2.87%",
      logoLeft: "78.05%",
      logoTop: "6.17%",
    },
  ],
  routeCta: {
    eyebrow: "Lehbab, Dubai",
    title: "Keep the Momentum Going",
    description:
      "Take on race two and continue your EVRS journey through Lehbab.",
    button: "Run Lehbab",
  },
  location: {
    name: "Lehbab First Park",
    address: "Lehbab First - Lahbab - Dubai",
    query: "Lehbab First Park Dubai",
  },
  journey: {
    title: "Keep the Journey Going",
    description:
      "Take on race two and continue discovering the UAE, one village at a time.",
  },
};
