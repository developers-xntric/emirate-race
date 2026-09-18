import type { RacePageData } from "./types";
export const wadiAlHelo: RacePageData = {
  name: "Wadi Al Helo",
  heroTitle: ["Run Into the", "Sweet Valley"],
  heroPosition: "center 45%",
  aboutAlt: "Runners discovering the Wadi Al Helo route in Sharjah",
  registerUrl:
    "https://www.premieronline.com/event/emirates_villages_run_series_race_3_sharjah_8816",
  date: "Saturday, 24 October 2026",
  introduction:
    "Race three takes EVRS to Wadi Al-Hilo for another chapter of discovery, movement and community.",
  paragraphs: [
    "As the third stop of EVRS 2026, Al-Wadi Al-Hilo brings runners into a village setting known for its natural and cultural character.",
    "Each race in the series reveals another side of the UAE, and this chapter continues the journey with a route shaped by place, community and shared experience.",
    "Set within one of Sharjah’s distinctive village destinations, this race gives runners another opportunity to discover the UAE beyond the familiar.",
  ],
  distances: [
    {
      distance: "9.6KM",
      title: "Competitive Run",
      description:
        "A timed challenge for runners ready to test their pace across the valley route.",
    },
    {
      distance: "6.4KM",
      title: "Community Run",
      description: "A timed run for clubs, groups and active communities.",
    },
    {
      distance: "1.5KM",
      title: "Family Run",
      description:
        "A fun and inclusive run for families, children and first-time runners.",
    },
  ],
  assets: {
    hero: "/races/wadi-al-helo/hero.png",
    about: "/races/wadi-al-helo/about.png",
    pattern: "/races/wadi-al-helo/about-pattern.png",
    mark: "/races/wadi-al-helo/mark.svg",
    location: "/races/beach-map.png",
    routeLogo: "/races/wadi-al-helo/route-logo.svg",
  },
  routes: [
    {
      id: "family",
      label: "1.5KM Family Run",
      image: "/races/wadi-al-helo/route-family2.png",
      imageHeight: "108.96%",
      logoLeft: "79.14%",
      logoTop: "9.17%",
    },
    {
      id: "community",
      label: "6.4KM Community Run",
      image: "/races/wadi-al-helo/route-community2.png",
      imageHeight: "103.9%",
      imageTop: "-1.95%",
      logoLeft: "77.96%",
      logoTop: "6.49%",
    },
    {
      id: "competitive",
      label: "9.6KM Competitive Run",
      image: "/races/wadi-al-helo/route-competitive2.png",
      imageHeight: "103.86%",
      imageTop: "-1.93%",
      logoLeft: "78.05%",
      logoTop: "6.17%",
    },
  ],
  routeCta: {
    eyebrow: "Wadi Al Helo, Sharjah",
    title: "The Journey Gets Deeper",
    description:
      "Discover a new landscape, a new community and your third EVRS finish line.",
    button: "Join Race 03",
  },
  location: {
    name: "Al Hefaiyah Lake",
    address: "X8W6+P2 Al Hafiya Hiking Trails - Alhafyah - Sharjah",
    query: "Al Hefaiyah Lake Sharjah",
  },
  journey: {
    title: "Discover the Next Chapter",
    description:
      "Join the third race of the series and continue your EVRS journey.",
  },
};
