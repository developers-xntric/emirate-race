"use client";

import Hero from "@/component/Hero";
import About from "@/component/About";
import Rahhal from "@/component/Rahhal";
import RaceDistances from "@/component/RaceDistances";
import RaceCalendar from "@/component/RaceCalendar";
import MedalJourney from "@/component/MedalJourney";
import Recognition from "@/component/Recognition";
import FAQs from "@/component/FAQs";
import CallToAction from "@/component/CallToAction";
import Footer from "@/component/Footer";
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
        <FAQs />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
