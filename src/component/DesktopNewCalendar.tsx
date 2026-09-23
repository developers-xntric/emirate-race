"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";

const locations = [
  { date: "2026-10-10", x: 1235.31, y: 388.15, mobileX: 90, mobileY: 37.5 },
  { date: "2026-10-17", x: 759.69, y: 327.5, mobileX: 47.8, mobileY: 39.6 },
  { date: "2026-10-24", x: 870.04, y: 263.13, mobileX: 54.7, mobileY: 31 },
  { date: "2026-10-31", x: 1040, y: 140.2, mobileX: 68, mobileY: 15 },
  { date: "2026-11-14", x: 954, y: 220, mobileX: 62, mobileY: 23 },
  { date: "2026-11-28", x: 1138.26, y: 73.27, mobileX: 80, mobileY: 6 },
  { date: "2026-12-05", x: 459.25, y: 497.62, mobileX: 24, mobileY: 60.2 },
] as const;

export default function DesktopNewCalendar() {
  const { data, language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<string>(locations[0].date);
  const [mobileConnector, setMobileConnector] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLSpanElement>(null);
  const id = useId();
  const selectedLocation = locations.find(
    (location) => location.date === selectedDate,
  )!;
  const raceIndex = data.calendar.races.findIndex(
    (race) => race.date === selectedDate,
  );
  const race = data.calendar.races[raceIndex];

  useEffect(() => {
    const map = mapRef.current;
    const connector = connectorRef.current;
    if (!map || !connector) return;

    const updateConnector = () => {
      const mapRect = map.getBoundingClientRect();
      const dotRect = connector.getBoundingClientRect();
      if (!mapRect.width || !mapRect.height) return;

      setMobileConnector({
        x: ((dotRect.left + dotRect.width / 2 - mapRect.left) / mapRect.width) * 1122,
        y: ((dotRect.top + dotRect.height / 2 - mapRect.top) / mapRect.height) * 1402,
      });
    };

    const frame = window.requestAnimationFrame(updateConnector);
    const observer = new ResizeObserver(updateConnector);
    observer.observe(map);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [selectedDate]);


  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="mx-auto w-[95%] pt-5 md:pt-0 pb-4 md:pb-12 2xl:max-w-[1590px]"
      data-desktop-new-calendar
    >
      <div id={`${id}-heading`}>
        <SectionHeading
          eyebrow={data.calendar.eyebrow}
          title={data.calendar.title}
          centered
        />
      </div>

      <div
        ref={mapRef} dir="ltr"
        className="@container relative isolate mt-6 aspect-[1122/1402] overflow-hidden rounded-[16px] bg-[#e7f4f6] lg:mt-10 lg:aspect-[1590/825.956] lg:rounded-[20px]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block">
          <Image
            src="/home/calendar-map/map.png"
            alt=""
            fill
            sizes="(min-width: 1680px) 1590px, 95vw"
            className="object-fill scale-y-[1] scale-x-[0.9992]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden lg:hidden">
          <Image src="/home/calendar-map/map-mobile.svg" alt="" fill sizes="95vw" className="object-fill" />
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 1590 825.956"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
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
        <svg
          aria-hidden="true"
          viewBox="0 0 1122 1402"
          className="pointer-events-none absolute inset-0 z-20 h-full w-full lg:hidden"
        >
          <line
            x1={mobileConnector.x}
            y1={mobileConnector.y}
            x2={(selectedLocation.mobileX / 100) * 1122}
            y2={(selectedLocation.mobileY / 100) * 1402}
            stroke="#bb0054"
            strokeWidth="6"
            className="motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out"
          />
        </svg>

        <div
          id={`${id}-card`}
          role="region"
          aria-live="polite"
          aria-atomic="true"
          aria-label={
            language === "ar" ? "تفاصيل السباق المحدد" : "Selected race details"
          }
          className="absolute left-[3%] md:left-[5%] top-[6%] md:top-[8%] w-[40%] md:w-[48%] lg:left-[2.9184%] lg:top-[9.3545%] lg:w-[18.2438%]"
        >
          <a
            href={race.href}
            target="_blank"
            rel="noreferrer"
            dir={language === "ar" ? "rtl" : "ltr"}
            aria-label={`${data.register.label}: ${race.village}`}
            className="relative block aspect-square rounded-[10px] bg-[#072f4f] text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#bb0054] lg:rounded-[0.8223cqw]"
          >
            <Image
              src={race.art}
              alt=""
              width={race.artWidth}
              height={race.artHeight}
              className="pointer-events-none absolute -top-[18%] md:-top-[24%] left-1/2 h-[36%] md:h-[43%] w-[35%] md:w-[55%] -translate-x-1/2 object-contain"
            />
            <div className="absolute inset-x-[8.5%] top-[18.8%] text-[11px] font-bold leading-[1.2] lg:text-[1.2cqw]">
              <p className="uppercase !text-[10px] md:!text-base">
                {data.calendar.raceLabel}{" "}
                {String(raceIndex + 1).padStart(2, "0")}
              </p>
              <p className="!text-[10px] md:!text-base">{race.emirate}</p>
            </div>
            <Image
              src={race.icon}
              alt=""
              width={race.iconWidth}
              height={race.iconHeight}
              className="absolute start-[8.5%] top-[40%] h-[27%] w-[25%] md:w-[34.5%] object-contain"
            />
            <time
              dateTime={race.date}
              className="absolute end-[8%] top-[33%] flex w-[35%] flex-col items-center text-center leading-none"
            >
              <span className="text-[12px] lg:text-[1.55cqw]">
                {data.calendar.dayLabel}
              </span>
              <strong className="mt-[0.2cqw] text-[30px] md:text-[34px] leading-[0.9] font-bold lg:text-[4.035cqw]">
                {race.day}
              </strong>
              <span className="mt-[0.4cqw] whitespace-nowrap text-[10px] lg:text-[1.3557cqw]">
                {race.month}
              </span>
            </time>
            <h3 className="absolute inset-x-[9.9%] bottom-[7%] md:bottom-[9.5%] text-[16px] md:text-[17px] leading-none font-bold lg:text-[1.8cqw]">
              {race.village}
            </h3>
          </a>
          <span
            ref={connectorRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-[45.15%] -right-[5.37%] size-4 rounded-full border-2 border-white bg-[#bb0054] lg:size-[1.96cqw] lg:border-[0.19cqw]"
          />
        </div>

        {locations.map((location) => {
          const markerRace = data.calendar.races.find(
            (item) => item.date === location.date,
          )!;
          const selected = selectedDate === location.date;
          const label = `${data.calendar.raceLabel}: ${markerRace.village}, ${markerRace.emirate}`;

          return (
            <span key={location.date}>
              <button
                type="button"
                aria-label={label}
                aria-pressed={selected}
                aria-controls={`${id}-card`}
                onClick={() => setSelectedDate(location.date)}
                title={markerRace.village}
                style={{
                  left: `${location.mobileX}%`,
                  top: `${location.mobileY}%`,
                }}
                className="absolute z-30 flex min-h-9 w-[7%] min-w-9 -translate-x-1/2 -translate-y-[40.91%] cursor-pointer items-start justify-center rounded-full outline-offset-2 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-[#072f4f] lg:hidden"
              >
                <Image
                  src="/home/calendar-map/marker.svg"
                  alt=""
                  width={40.6195}
                  height={49.647}
                  className="h-auto w-[20px] shrink-0 md:w-full"
                />
              </button>
              <button
                type="button"
                aria-label={label}
                aria-pressed={selected}
                aria-controls={`${id}-card`}
                onClick={() => setSelectedDate(location.date)}
                title={markerRace.village}
                style={{
                  left: `${(location.x / 1590) * 100}%`,
                  top: `${(location.y / 825.956) * 100}%`,
                }}
                className="absolute hidden min-h-11 w-[2.5547%] min-w-11 -translate-x-1/2 -translate-y-[40.91%] cursor-pointer items-start justify-center rounded-full outline-offset-2 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-[#072f4f] lg:flex"
              >
                <Image
                  src="/home/calendar-map/marker.svg"
                  alt=""
                  width={40.6195}
                  height={49.647}
                  className="h-auto w-[2.5547cqw] shrink-0"
                />
              </button>
            </span>
          );
        })}

        <Image
          src="/home/calendar-map/brand.svg"
          alt={data.brand}
          width={422.855}
          height={91.992}
          className="pointer-events-none absolute right-[5%] bottom-[3%] h-auto w-[42%] lg:right-[2.7405%] lg:bottom-[4.031%] lg:w-[26.5947%]"
        />
      </div>
    </section>
  );
}
