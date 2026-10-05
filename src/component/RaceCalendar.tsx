"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useHomeData, useLanguage } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import RaceMap from "./backup/calender";

gsap.registerPlugin(ScrollTrigger);

const desktopRaceColors = [
  "#3383cb",
  "#675ec4",
  "#b80547",
  "#33aba1",
  "#b78063",
  "#f38f69",
  "#dac9bd",
] as const;

const desktopRaceIcons = [
  "/races/icons/qidfa.png",
  "/races/icons/lehbab.png",
  "/races/icons/wadi.png",
  "/races/icons/falaj.png",
  "/races/icons/masfout.png",
  "/races/icons/rams.png",
  "/races/icons/shuwaib.png",
] as const;
const desktopMedalAssets = [
  "/medals/qidfa.webp",
  "/medals/lehbab.webp",
  "/medals/wadi.webp",
  "/medals/falaj.webp",
  "/medals/masfout.webp",
  "/medals/rams.webp",
  "/medals/shuwaib.webp",
] as const;

function DesktopRaceCard({
  race,
  index,
  language,
}: {
  race: ReturnType<typeof useHomeData>["calendar"]["races"][number];
  index: number;
  language: "en" | "ar";
}) {
  const data = useHomeData();
  const color = desktopRaceColors[index] ?? "#072f4f";
  const darkText = index === desktopRaceColors.length - 1;
  const medalAsset = (race as any).medalImage || desktopMedalAssets[index] || "/home/medal.png";
  const raceIcon = (race as any).icon || desktopRaceIcons[index] || race.icon;

  return (
    <a
      href={race.href}
      target="_blank"
      rel="noreferrer"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-label={`${data.calendar.raceLabel} ${index + 1}: ${race.village}, ${race.day} ${race.month}. ${data.calendar.viewMedalLabel}`}
      className="group block h-[clamp(300px,38vh,410px)] w-[82vw] sm:w-[clamp(230px,45vw,310px)] lg:w-[clamp(230px,21vw,310px)] shrink-0 [perspective:1200px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054]"
    >
      <div className="relative size-full [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateX(180deg)] group-focus-visible:[transform:rotateX(180deg)]">
        <div
          className={`absolute inset-0 flex flex-col overflow-hidden rounded-[22px] p-5 shadow-[0_26px_42px_-28px_rgba(7,47,79,0.8)] [backface-visibility:hidden] ${darkText ? "text-[#072f4f]" : "text-white"}`}
          style={{ backgroundColor: color }}
        >
          
          <div className="relative flex items-start justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em]">
            <span
              className={`rounded-full px-3 py-2 ${darkText ? "bg-[#072f4f] text-white" : "bg-white/20"}`}
            >
              {data.calendar.raceLabel} {String(index + 1).padStart(2, "0")}
            </span>
            <span className="max-w-[45%] pt-1.5 text-right leading-tight opacity-85">
              {race.emirate}
            </span>
          </div>

          <Image
            src={raceIcon}
            alt=""
            width={2000}
            height={2000}
            className="relative z-10 mx-auto mt-2 h-[25%] w-[90%] object-contain"
          />

          <div className="relative mt-auto flex items-end gap-4">
            <time
              dateTime={race.date}
              className="min-w-[42%] text-left leading-none"
            >
              <span className="block text-[11px] font-bold uppercase tracking-[0.16em] opacity-80">
                {data.calendar.dayLabel}
              </span>
              <strong className="block text-6xl font-bold tracking-[-0.06em]">
                {race.day}
              </strong>
              <span className="block text-[11px] font-bold uppercase tracking-[0.12em]">
                {race.month}
              </span>
            </time>
          </div>
          <div className="relative mt-5 flex items-end justify-between gap-3 border-t border-current/25 pt-4">
            <h3 className="max-w-[78%] text-[clamp(18px,1.55vw,23px)] leading-[0.92] font-bold uppercase">
              {race.village}
            </h3>
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full border border-current/60"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-4"
              >
                <path
                  d="M4 8V4h4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M4.7 4.7A8 8 0 0 1 19.3 8" strokeLinecap="round" />
                <path
                  d="M20 16v4h-4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M19.3 19.3A8 8 0 0 1 4.7 16" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 grid overflow-hidden rounded-[22px] border-[3px] bg-[#f8faf9] p-4 text-[#072f4f] shadow-[0_26px_42px_-28px_rgba(7,47,79,0.8)] [backface-visibility:hidden] [transform:rotateX(180deg)]"
          style={{
            borderColor: color,
            gridTemplateRows: "auto minmax(0, 1fr) auto",
          }}
        >
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-[#072f4f]/65">
            <span>{data.calendar.medalPieceLabel}</span>
            <span>
              {data.calendar.raceLabel} {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <Image
            src={medalAsset}
            alt={`${race.village} ${data.calendar.medalAltLabel}`}
            width={320}
            height={320}
            className="mx-auto min-h-0 h-full w-full max-h-[220px] object-contain py-3 drop-shadow-[0_14px_14px_rgba(7,47,79,0.25)]"
          />
          <div className="border-t border-[#072f4f]/15 pt-4">
            <p className="text-[clamp(17px,1.45vw,22px)] leading-none font-bold uppercase">
              {race.village} {data.calendar.medalLabel}
            </p>
            <p className="mt- text-[10px] font-bold uppercase tracking-[0.16em] text-[#072f4f]/65">

              {race.village}, {race.emirate}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
function CalendarSequence() {
  const data = useHomeData();
  const { language } = useLanguage();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isMobileCarousel, setIsMobileCarousel] = useState(false);
  const sequenceRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<HTMLImageElement>(null);
  const runnerPathRef = useRef<SVGPathElement>(null);
  const routeFillRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const updateViewport = () => setIsMobileCarousel(media.matches);
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!isMobileCarousel || data.calendar.races.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveCardIndex((current) => (current + 1) % data.calendar.races.length);
    }, 1500);
    return () => window.clearInterval(timer);
  }, [data.calendar.races.length, isMobileCarousel]);
  useEffect(() => {
    const sequence = sequenceRef.current;
    const panel = panelRef.current;
    const track = trackRef.current;
    const cards = cardsRef.current;
    const route = routeRef.current;
    const runner = runnerRef.current;
    const runnerPath = runnerPathRef.current;
    const routeFill = routeFillRef.current;
    if (
      !sequence ||
      !panel ||
      !track ||
      !cards ||
      !route ||
      !runner ||
      !runnerPath ||
      !routeFill
    )
      return;

    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const travelDistance = () =>
          Math.max(0, cards.scrollWidth - track.clientWidth);
        const moveRunner = (progress: number) => {
          const clampedProgress = Math.min(1, Math.max(0, progress));
          const pathLength = runnerPath.getTotalLength();
          const point = runnerPath.getPointAtLength(
            pathLength * clampedProgress,
          );
          const x = ((language === "ar" ? 1 - point.x / 1600 : point.x / 1600) * route.clientWidth) - 34;
          const y = (point.y / 100) * route.clientHeight - 64;
          routeFill.style.strokeDasharray = `${pathLength}`;
          routeFill.style.strokeDashoffset = `${pathLength * (1 - clampedProgress)}`;
          gsap.set(runner, { x, y });
        };

        const context = gsap.context(() => {
          gsap.set(track, { overflow: "hidden" });
          gsap.set(cards, { x: 0 });
          moveRunner(0);

          const animation = gsap.to(cards, {
            x: () => language === "ar" ? travelDistance() : -travelDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: sequence,
              start: "top top",
              end: () => `+=${Math.max(1200, travelDistance() * 1.15)}`,
              pin: panel,
              pinSpacing: true,
              scrub: 0.35,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (trigger) => moveRunner(trigger.progress),
            },
          });

          return () => {
            animation.kill();
            gsap.set(track, { clearProps: "overflow" });
          };
        }, sequence);

        return () => context.revert();
      },
    );

    return () => media.revert();
  }, [data.calendar.races.length, language]);

  const routePath =
    "M0 48 C70 48 100 22 170 22 S290 78 360 78 S490 26 560 26 S690 74 760 74 S890 30 960 30 S1090 80 1160 80 S1290 28 1360 28 S1490 68 1600 68";
  const routeStops = [
    { x: 170, y: 22 },
    { x: 360, y: 78 },
    { x: 560, y: 26 },
    { x: 760, y: 74 },
    { x: 960, y: 30 },
    { x: 1160, y: 80 },
    { x: 1360, y: 28 },
  ];

  return (
    <>
      <div className="lg:hidden">
        <div className="relative overflow-hidden py-6">
          <div className="relative z-20 mx-auto w-[90%] max-w-[1440px]">
            <SectionHeading eyebrow={data.calendar.eyebrow} title={data.calendar.title} />
          </div>
          <div className="mt-7 overflow-hidden" dir={language === "ar" ? "rtl" : "ltr"}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${language === "ar" ? activeCardIndex * 100 : -activeCardIndex * 100}%)` }}
            >
              {data.calendar.races.map((race, index) => (
                <div key={race.date} className="min-w-full px-[9vw]">
                  <DesktopRaceCard race={race} index={index} language={language} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-2" aria-label="Choose a race">
            {data.calendar.races.map((race, index) => (
              <button
                key={race.date}
                type="button"
                aria-label={`Show ${race.village}`}
                aria-current={activeCardIndex === index ? "true" : undefined}
                onClick={() => setActiveCardIndex(index)}
                className={`h-2.5 rounded-full transition-all ${activeCardIndex === index ? "w-7 bg-[#bb0054]" : "w-2.5 bg-[#072f4f]/25"}`}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            <Button href={data.register.href} tone="pink">{data.calendar.register}</Button>
            <Button href="#distances" tone="navy">{data.calendar.details}</Button>
          </div>
        </div>
      </div>

      <div ref={sequenceRef} className="hidden lg:block">
      <div
        ref={panelRef}
        className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden py-10"
      >
        <div className="mx-auto w-[90%] max-w-[1440px]">
          <SectionHeading
            eyebrow={data.calendar.eyebrow}
            title={data.calendar.title}
          />
        </div>

        <div
          dir={language === "ar" ? "rtl" : "ltr"}
          ref={trackRef}
          className="relative mt-8 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Race calendar journey"
        >
          <div ref={cardsRef} dir={language === "ar" ? "rtl" : "ltr"} className="flex w-max gap-6 px-0 pb-24 pt-5">
            {data.calendar.races.map((race, index) => (
              <DesktopRaceCard
                key={race.date}
                race={race}
                index={index}
                language={language}
              />
            ))}
          </div>

          <div
            ref={routeRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 1600 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible" style={language === "ar" ? { transform: "scaleX(-1)" } : undefined}
            >
              <path
                d={routePath}
                fill="none"
                stroke="#072f4f"
                strokeOpacity="0.22"
                strokeWidth="3"
                strokeDasharray="3 10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {routeStops.map((stop, index) => (
                <g key={index}>
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r="7"
                    fill="#f7faf9"
                    stroke="#072f4f"
                    strokeWidth="2"
                  />
                  <circle
                    cx={stop.x}
                    cy={stop.y}
                    r="3"
                    fill={desktopRaceColors[index] ?? "#bb0054"}
                  />
                </g>
              ))}
              <path
                ref={routeFillRef}
                d={routePath}
                fill="none"
                stroke="#0b2d4d"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                ref={runnerPathRef}
                d={routePath}
                fill="none"
                stroke="transparent"
                strokeWidth="14"
              />
            </svg>
            <Image
              ref={runnerRef}
              src="/races/rahhal-kick.webp"
              alt=""
              width={148}
              height={180}
             className={`absolute left-0 top-0 h-16 w-auto ${
  language === "ar" ? "scale-x-100" : "scale-x-[-1]"
} object-contain object-bottom drop-shadow-[0_8px_8px_rgba(7,47,79,0.25)]`}
            />
          </div>
        </div>

        <div className="mx-auto mt-5 flex w-[90%] max-w-[1440px] flex-wrap justify-center gap-5">
          <Button href={data.register.href} tone="pink">
            {data.calendar.register}
          </Button>
          <Button href="#distances" tone="navy">
            {data.calendar.details}
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}
export default function RaceCalendar() {
  return (
    <section
      id="calendar"
      className="mx-auto w-[95%] scroll-mt-8 py-6 md:py-16 lg:w-full"
    >
      <RaceMap/>
      <CalendarSequence />
    </section>
  );
}
