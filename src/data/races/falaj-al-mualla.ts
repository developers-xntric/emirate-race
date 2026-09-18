import type { RacePageData } from "./types";
import { qidfa } from "./qidfa";
export const falajAlMualla: RacePageData = {
  name: "Falaj Al Mualla",
  heroTitle: ["Journey Reaches", "Falaj Al Mualla"],
  heroPosition: "center 45%",
  aboutAlt: "Runners exploring the Falaj Al Mualla route in Umm Al Quwain",
  registerUrl:
    "https://www.premieronline.com/event/emirates_villages_run_series_race_4_uaq_8817",
  date: "Saturday, 31 October 2026",
  introduction:
    "The EVRS journey reaches Umm Al Quwain for race four, where village heritage, farmland and desert landscapes come together.",
  paragraphs: [
    "Falaj Al Mualla marks the midpoint of the EVRS journey.",
    "With four races completed by this stage, participants continue their nationwide running experience through another village that adds its own identity to the series.",
    "This race invites participants into a distinctive village environment within Umm Al Quwain.",
  ],
  distances: qidfa.distances,
  assets: {
    hero: "/races/falaj-al-mualla/hero.png",
    about: "/races/falaj-al-mualla/about.png",
    pattern: "/races/falaj-al-mualla/about-pattern.png",
    mark: "/races/falaj-al-mualla/mark.svg",
    location: "/races/beach-map.png",
    routeLogo: "/races/falaj-al-mualla/route-logo.svg",
  },
  routes: [
    {
      id: "family",
      label: "1.5KM Family Run",
      image: "/races/falaj-al-mualla/route-family2.png",
      imageHeight: "105.15%",
      logoLeft: "77.83%",
      logoTop: "8.78%",
    },
    {
      id: "community",
      label: "5KM Community Run",
      image: "/races/falaj-al-mualla/route-community2.png",
      imageHeight: "108.27%",
      imageTop: "-1.2%",
      logoLeft: "78.36%",
      logoTop: "8.32%",
    },
    {
      id: "competitive",
      label: "10KM Competitive Run",
      image: "/races/falaj-al-mualla/route-competitive2.png",
      imageHeight: "117.21%",
      imageTop: "-3.64%",
      logoLeft: "80.94%",
      logoTop: "6.69%",
    },
  ],
  routeCta: {
    eyebrow: "Falaj Al Mualla, Umm Al Quwain",
    title: "Halfway. Keep Moving.",
    description:
      "Reach the midpoint of the series and add another village to your EVRS journey.",
    button: "Run Falaj Al Mualla",
  },
  location: {
    name: "Falaj Almualla Fort",
    address: "9R2X+QV5 - Al Shareiah - Emirate of Umm Al Quwain",
    query: "Falaj Al Mualla Fort Umm Al Quwain",
  },
  journey: {
    title: "Reach the Midpoint of the Journey",
    description:
      "Choose your race and join EVRS in Falaj Al Mualla.",
  },
};
