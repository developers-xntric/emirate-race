"use client";

import dynamic from "next/dynamic";
import Hero from "@/component/Hero";
const About = dynamic(() => import("@/component/About"));
const Rahhal = dynamic(() => import("@/component/Rahhal"));
const RaceDistances = dynamic(() => import("@/component/RaceDistances"));
const RaceCalendar = dynamic(() => import("@/component/RaceCalendar"));
const MedalJourney = dynamic(() => import("@/component/MedalJourney"));
const Recognition = dynamic(() => import("@/component/Recognition"));
const Gallery = dynamic(() => import("@/component/Gallery"));
const FAQs = dynamic(() => import("@/component/FAQs"));
const CallToAction = dynamic(() => import("@/component/CallToAction"));
const Footer = dynamic(() => import("@/component/Footer"));
import { useHomeData } from "@/component/LanguageProvider";

export default function Home() {
  const homeData = useHomeData();
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:not-sr-only focus:rounded focus:bg-white focus:p-4 focus:text-[#072f4f]"
      >
        {homeData.ui.skip}
      </a>
      <main id="main-content" className="overflow-hidden">
        <Hero />
        <About />
        <Rahhal />
        <RaceDistances />
        <RaceCalendar />
        <MedalJourney />
        <Recognition />
        <Gallery />
        <FAQs />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
