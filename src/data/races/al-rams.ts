import type { RacePageData } from "./types";
import { qidfa } from "./qidfa";

export const alRams: RacePageData = {
  name: "Al Rams",
  heroTitle: ["One More Village", "Before the Final Race"],
  heroPosition: "center 45%",
  aboutAlt: "Runners exploring the Al Rams route in Ras Al Khaimah",
  registerUrl:
    "https://www.premieronline.com/event/emirates_villages_run_series_race_6_rak_8819",
  date: "Saturday, 28 November 2026",
  introduction:
    "Race six takes EVRS to Al Rams for another distinctive stop in the series.",
  paragraphs: [
    "Al Rams is the sixth race of the season and the final step before the concluding chapter of EVRS 2026.",
    "With just one race to follow, this is another opportunity for runners, families and communities to be part of the journey.",
    "Set within Ras Al Khaimah, Al Rams offers another unique EVRS village destination.",
  ],
  distances: qidfa.distances,
  assets: {
    hero: "/races/al-rams/hero.png",
    about: "/races/al-rams/about.png",
    pattern: "/races/al-rams/about-pattern.png",
    mark: "/races/al-rams/mark.svg",
    location: "/races/beach-map.png",
  },
  routes: [
    {
      id: "family",
      label: "1.5KM Family Run",
      image: "/races/al-rams/route-family.png",
      imageHeight: "100%",
      logoLeft: "0%",
      logoTop: "0%",
    },
    {
      id: "community",
      label: "5KM Community Run",
      image: "/races/al-rams/route-community.png",
      imageHeight: "100%",
      logoLeft: "0%",
      logoTop: "0%",
    },
    {
      id: "competitive",
      label: "10KM Competitive Run",
      image: "/races/al-rams/route-competitive.png",
      imageHeight: "100%",
      logoLeft: "0%",
      logoTop: "0%",
    },
  ],
  routeCta: {
    eyebrow: "Al Rams, Ras Al Khaimah",
    title: "One Race From the Final",
    description:
      "Take on race six in Al Rams and keep your seven-race journey moving forward.",
    button: "Join Race",
  },
  location: {
    name: "Rams Children's Park",
    address: "5 18A St - Ar Rams - Ras Al Khaimah",
    query: "RAMS Children's Park, 5 18A St - Ar Rams - Ras Al Khaimah",
  },
  journey: {
    title: "Take On Race Six",
    description:
      "Be part of the penultimate chapter of the EVRS journey.",
  },
};
