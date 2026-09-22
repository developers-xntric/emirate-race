import type { RacePageData } from "./types";
import { qidfa } from "./qidfa";

export const alShuwaib: RacePageData = {
  name: "Al Shuwaib",
  heroTitle: ["The Final Race.", "The Final Chapter."],
  heroPosition: "center 45%",
  aboutAlt: "Runners completing the EVRS journey in Al Shuwaib",
  registerUrl:
    "https://www.premieronline.com/event/emirates_villages_run_series_race_7_alain_8820",
  date: "Saturday, 5 December 2026",
  introduction:
    "EVRS 2026 concludes in Al Shuwaib, where the seven race journey reaches its final finish line.",
  paragraphs: [
    "The final EVRS race brings participants to Al Shuwaib for the last chapter of a nationwide running series that connects all seven emirates.",
    "For those completing all seven races, this is where the full journey comes together.",
    "The final race takes place in Al Shuwaib, offering a fitting setting for the closing chapter of EVRS 2026.",
  ],
  distances: qidfa.distances,
  assets: {
    hero: "/races/al-shuwaib/hero.png",
    about: "/races/al-shuwaib/about.png",
    pattern: "/races/al-shuwaib/about-pattern.png",
    mark: "/races/al-shuwaib/mark2.png",
    location: "/races/beach-map.png",
  },
  routes: [
    {
      id: "family",
      label: "1.5KM Family Run",
      image: "/races/al-shuwaib/route-family.png",
      imageHeight: "100%",
      logoLeft: "0%",
      logoTop: "0%",
    },
    {
      id: "community",
      label: "5KM Community Run",
      image: "/races/al-shuwaib/route-community.png",
      imageHeight: "100%",
      logoLeft: "0%",
      logoTop: "0%",
    },
    {
      id: "competitive",
      label: "10KM Competitive Run",
      image: "/races/al-shuwaib/route-competitive.png",
      imageHeight: "100%",
      logoLeft: "0%",
      logoTop: "0%",
    },
  ],
  routeCta: {
    eyebrow: "Al Shuwaib, Abu Dhabi",
    title: "Complete the Journey",
    description:
      "Seven villages. Seven races. One final finish line to complete your EVRS 2026 journey.",
    button: "Run the Final Race",
  },
  location: {
    name: "Al Shuwaib Family Park",
    address: "7HPQPQQQ+RC Alain - Al Shiwayb - New Shwaib - Abu Dhabi",
    query:
      "Al Shuwaib Family Park, Al Shiwayb, Abu Dhabi, United Arab Emirates",
  },
  journey: {
    title: "Complete Your EVRS Journey",
    description:
      "Seven races. Seven villages. One unforgettable finish.",
  },
};
