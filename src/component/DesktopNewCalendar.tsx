"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";

// Positions are in the 1590 x 825.956 Figma map coordinate system.
// Keep geography LTR in both languages; only the card copy changes direction.
const locations = [
  { date: "2026-10-10", x: 1235.31, y: 388.15 }, // Qidfa / Fujairah
  { date: "2026-10-17", x: 759.69, y: 327.50 }, // Al Lehbab / Dubai
  { date: "2026-10-24", x: 870.04, y: 263.13 }, // Wadi Al Helo / Sharjah
  { date: "2026-10-31", x: 1040, y: 140.20 }, // Falaj Al Mualla / Umm Al Quwain
  { date: "2026-11-14", x: 954, y: 220 }, // Masfout / Ajman (missing marker in Figma)
  { date: "2026-11-28", x: 1138.26, y: 73.27 }, // Al Rams / Ras Al Khaimah
  { date: "2026-12-05", x: 459.25, y: 497.62 }, // Al Shuwaib / Abu Dhabi
] as const;

export default function DesktopNewCalendar() {
  const { data, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>(locations[0].date);
  const id = useId();
  const selectedLocation = locations.find((location) => location.date === selectedDate)!;
  const raceIndex = data.calendar.races.findIndex((race) => race.date === selectedDate);
  const race = data.calendar.races[raceIndex];

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="mx-auto hidden w-[95%] pb-12 lg:block 2xl:max-w-[1590px]"
      data-desktop-new-calendar
    >
      <div id={`${id}-heading`}>
        <SectionHeading eyebrow={data.calendar.eyebrow} title={data.calendar.title} centered />
      </div>
      <div
        dir="ltr"
        className="@container relative isolate mt-10 aspect-[1590/825.956] overflow-hidden rounded-[20px] bg-[#e7f4f6]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/home/calendar-map/map.png"
            alt=""
            fill
            sizes="(min-width: 1680px) 1590px, 95vw"
            className="object-fill scale-y-[1] scale-x-[0.9992]"
          />
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1590 825.956"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <line
            x1="335.13"
            y1="223.98"
            x2={selectedLocation.x}
            y2={selectedLocation.y}
            stroke="#bb0054"
            strokeWidth="5"
            className="motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out"
          />
        </svg>

        <div
          id={`${id}-card`}
          role="region"
          aria-live="polite"
          aria-atomic="true"
          aria-label={language === "ar" ? "\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0633\u0628\u0627\u0642 \u0627\u0644\u0645\u062d\u062f\u062f" : "Selected race details"}
          className="absolute left-[2.9184%] top-[9.3545%] w-[18.2438%]"
        >
          <a
            href={race.href}
            target="_blank"
            rel="noreferrer"
            dir={language === "ar" ? "rtl" : "ltr"}
            aria-label={`${data.register.label}: ${race.village}`}
            className="relative block aspect-square rounded-[0.8223cqw] bg-[#072f4f] text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#bb0054]"
          >
            <Image
              src={race.art}
              alt=""
              width={race.artWidth}
              height={race.artHeight}
              className="pointer-events-none absolute -top-[24%] left-1/2 h-[43%] w-[55%] -translate-x-1/2 object-contain"
            />
            <div className="absolute inset-x-[8.5%] top-[18.8%] text-[1.2cqw] font-bold leading-[1.2]">
              <p className="uppercase">{data.calendar.raceLabel} {String(raceIndex + 1).padStart(2, "0")}</p>
              <p>{race.emirate}</p>
            </div>
            <Image
              src={race.icon}
              alt=""
              width={race.iconWidth}
              height={race.iconHeight}
              className="absolute start-[8.5%] top-[40%] h-[27%] w-[34.5%] object-contain"
            />
            <time
              dateTime={race.date}
              className="absolute end-[8%] top-[33%] flex w-[35%] flex-col items-center text-center leading-none"
            >
              <span className="text-[1.55cqw]">{data.calendar.dayLabel}</span>
              <strong className="mt-[0.2cqw] text-[4.035cqw] leading-[0.9] font-bold">{race.day}</strong>
              <span className="mt-[0.4cqw] whitespace-nowrap text-[1.3557cqw]">{race.month}</span>
            </time>
            <h3 className="absolute inset-x-[9.9%] bottom-[9.5%] text-[1.8cqw] leading-none font-bold">
              {race.village}
            </h3>
          </a>
          <span aria-hidden="true" className="pointer-events-none absolute top-[45.15%] -right-[5.37%] size-[1.96cqw] rounded-full border-[0.19cqw] border-white bg-[#bb0054]" />
        </div>

        {locations.map((location) => {
          const markerRace = data.calendar.races.find((item) => item.date === location.date)!;
          const selected = selectedDate === location.date;
          return (
            <button
              key={location.date}
              type="button"
              aria-label={`${data.calendar.raceLabel}: ${markerRace.village}, ${markerRace.emirate}`}
              aria-pressed={selected}
              aria-controls={`${id}-card`}
              onClick={() => setSelectedDate(location.date)}
              title={markerRace.village}
              style={{ left: `${location.x / 1590 * 100}%`, top: `${location.y / 825.956 * 100}%` }}
              className="absolute flex min-h-11 w-[2.5547%] min-w-11 -translate-x-1/2 -translate-y-[40.91%] cursor-pointer items-start justify-center rounded-full outline-offset-2 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-[#072f4f]"
            >
              <Image src="/home/calendar-map/marker.svg" alt="" width={40.6195} height={49.647} className="h-auto w-[2.5547cqw] shrink-0" />
            </button>
          );
        })}

        <Image
          src="/home/calendar-map/brand.svg"
          alt={data.brand}
          width={422.855}
          height={91.992}
          className="pointer-events-none absolute right-[2.7405%] bottom-[4.031%] h-auto w-[26.5947%]"
        />
      </div>
    </section>
  );
}
