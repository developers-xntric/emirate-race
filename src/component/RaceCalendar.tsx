"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import DesktopNewCalendar from "./DesktopNewCalendar";

gsap.registerPlugin(ScrollTrigger);


export default function RaceCalendar() {

  return (
    <section
      id="calendar"
      className="mx-auto w-[95%] scroll-mt-8 py-6 md:py-16 2xl:max-w-[1600px] "
    >
  
      <DesktopNewCalendar />
  
    </section>
  );
}
