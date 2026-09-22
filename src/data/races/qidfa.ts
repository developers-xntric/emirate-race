// Race page content transcribed from Figma.
import type { RacePageData } from "./types";

export const qidfa: RacePageData = {
  name: "Qidfa",
  heroTitle: ["Where the", "Journey Begins"],
  heroPosition: "center 18%",
  aboutAlt: "Runners enjoying a coastal route lined with palm trees",
  assets: {
    hero: "/races/hero.png",
    about: "/races/about.png",
    pattern: "/races/about-pattern.svg",
    mark: "/races/qidfa-mark.png",
    location: "/races/beach-map.png",
    routeLogo: "/races/route-logo.svg",
  },
  routeCta: {
    title: "Your First Finish Line Starts Here",
    description:
      "Join runners from across the UAE and begin the seven-race journey in Qidfa.",
    button: "Begin the Journey",
  },
  location: {
    name: "Qidfa Beach",
    address: "Qidfa Beach - Fujairah",
    query: "Qidfa Beach - Fujairah - United Arab Emirates",
  },
  journey: {
    title: "Start Your EVRS Journey in Qidfa",
    description:
      "Choose your distance and take your place at the first start line of the series.",
  },
  registerUrl:
    "https://www.premieronline.com/event/emirates_villages_run_series_race_1_fujairah_8815",
  date: "Saturday, 10 October 2026",
  introduction:
    "Start EVRS 2026 in Qidfa and discover Fujairah through a race experience shaped by coastline, community and movement.",
  paragraphs: [
    "Qidfa opens the Emirates Villages Run Series 2026 as the first of seven races across the UAE.",
    "From the shoreline to the village setting, this race introduces the spirit of EVRS running beyond the familiar and discovering places through sport, heritage and community.",
    "Whether you are racing for a personal best, running with friends or joining with family, Qidfa is where the journey begins.",
  ],
  distances: [
    {
      distance: "10KM",
      title: "Competitive Run",
      description:
        "A timed challenge for experienced runners and anyone ready to test their pace.",
    },
    {
      distance: "5KM",
      title: "Community Run",
      description: "A timed race for clubs, groups and active communities.",
    },
    {
      distance: "1.5KM",
      title: "Family Run",
      description:
        "A fun and inclusive run for families, children and first time runners.",
    },
  ],
  routes: [
    {
      id: "family",
      label: "1.5KM Family Run",
      image: "/races/route-family2.png",
      imageHeight: "100%",
      logoLeft: "81.01%",
      logoTop: "8.38%",
    },
    {
      id: "community",
      label: "5KM Community Run",
      image: "/races/route-community2.png",
      imageHeight: "117.21%",
      logoLeft: "78.62%",
      logoTop: "4.53%",
    },
    {
      id: "lap-1",
      label: "10KM Competitive Run",
      image: "/races/route-10km.png",
      images: ["/races/route-10km.png", "/races/route-10km-lap22.png"],
      imageHeight: "106.9%",
      logoLeft: "78.05%",
      logoTop: "7.61%",
    },
  ],
};
