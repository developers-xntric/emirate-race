import type { RacePageData } from "./types";
import { qidfa } from "./qidfa";
export const masfout: RacePageData = {
  name: "Masfout",
  heroTitle: ["Take the Journey", "Higher"],
  heroPosition: "center 45%",
  aboutAlt: "Runners discovering the Masfout route in Ajman",
  registerUrl:
    "https://www.premieronline.com/event/emirates_villages_run_series_race_5_ajman_8818",
  date: "Saturday, 14 November 2026",
  introduction:
    "Race five brings EVRS to Masfout for another village experience shaped by movement, nature and discovery.",
  paragraphs: [
    "Masfout adds another memorable chapter to the EVRS journey.",
    "As race five of seven, it keeps the momentum going while continuing the series mission of connecting runners to communities, landscapes and stories across the UAE.",
    "The race takes place in Masfout, one of Ajman’s most distinctive destinations.",
  ],
  distances: qidfa.distances,
  assets: {
    hero: "/races/masfout/hero.png",
    about: "/races/masfout/about.png",
    pattern: "/races/masfout/about-pattern.png",
    mark: "/races/masfout/mark.svg",
    location: "/races/beach-map.png",
    routeLogo: "/races/masfout/route-logo.svg",
  },
  routes: [
    {
      id: "family",
      label: "1.5KM Family Run",
      image: "/races/masfout/route-family2.png",
      imageHeight: "112.34%",
      imageTop: "-3.75%",
      logoLeft: "79.64%",
      logoTop: "6.03%",
    },
    {
      id: "community",
      label: "5KM Community Run",
      image: "/races/masfout/route-community2.png",
      imageHeight: "101.68%",
      imageTop: "-1.68%",
      logoLeft: "77.13%",
      logoTop: "6.88%",
    },
    {
      id: "competitive",
      label: "10KM Competitive Run",
      image: "/races/masfout/route-competitive2.png",
      imageHeight: "100%",
      logoLeft: "80.94%",
      logoTop: "6.69%",
    },
  ],
  routeCta: {
    eyebrow: "Masfout, Ajman",
    title: "Take the Journey Higher",
    description:
      "Continue the challenge in Masfout and move one step closer to completing all seven races.",
    button: "Run Masfout",
  },
  location: {
    name: "Masfout Gate",
    address: "R39X+PM - Ajman",
    query: "Masfout Gate Ajman",
  },
  journey: {
    title: "Keep Moving. Keep Discovering.",
    description:
      "Join race five and continue your EVRS journey across the Emirates.",
  },
};
