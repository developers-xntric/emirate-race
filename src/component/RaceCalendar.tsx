"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useHomeData, useLanguage } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import DesktopNewCalendar from "./DesktopNewCalendar";

gsap.registerPlugin(ScrollTrigger);

function RaceCard({
  race,
  index,
  className = "",
  visible = true,
  active = true,
  mobileStackCard = false,
}: {
  race: ReturnType<typeof useHomeData>["calendar"]["races"][number];
  index: number;
  className?: string;
  visible?: boolean;
  active?: boolean;
  mobileStackCard?: boolean;
}) {
  const data = useHomeData();
  return (
    <a
      href={race.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${data.calendar.raceLabel} ${index + 1}: ${race.village}, ${race.day} ${race.month}`}
      data-active={active}
      data-mobile-stack-card={mobileStackCard || undefined}
      className={`calendar-race-card relative z-10 flex aspect-[6/5] md:aspect-square w-20 md:w-full flex-col justify-end rounded-[9px] bg-[#072f4f] p-3 text-white cursor-pointer transition-[opacity,transform] duration-700 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054] ${visible ? "opacity-100" : "pointer-events-none opacity-0"} ${className}`}
    >
      {(!mobileStackCard || active) && (
        <>
          <Image
            src={race.art}
            alt=""
            width={race.artWidth * 0.8}
            height={race.artHeight * 0.75}
            className="absolute -top-8 left-1/2 -translate-x-1/2 object-contain"
          />
          <div className="relative pt-5 text-base md:text-xs leading-tight font-bold 2xl:text-sm">
            <p className="uppercase">
              {data.calendar.raceLabel} {String(index + 1).padStart(2, "0")}
            </p>
            <p>{race.emirate}</p>
          </div>
          <div className="md:mt-2 flex items-center justify-between gap-1">
            <Image
              src={race.icon}
              alt=""
              width={race.iconWidth * 0.7}
              height={race.iconHeight * 0.7}
              className="shrink-0 object-contain"
            />
            <time
              dateTime={race.date}
              className="text-center text-[14px] md:text-[10px] leading-none"
            >
              <span className="block">{data.calendar.dayLabel}</span>
              <strong className="block text-[55px] md:text-[32px] 2xl:text-[40px]">
                {race.day}
              </strong>
              <span>{race.month}</span>
            </time>
          </div>
          <h3 className="md:mt-2 text-[26px] md:text-[17px] leading-none font-bold 2xl:text-xl">
            {race.village}
          </h3>
        </>
      )}
    </a>
  );
}

export default function RaceCalendar() {
  const data = useHomeData();
  return (
    <section
      id="calendar"
      className="mx-auto w-[95%] scroll-mt-8 py-6 md:py-16 2xl:max-w-[1600px] "
    >
  
      <DesktopNewCalendar />
  
    </section>
  );
}
