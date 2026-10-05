"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { useHomeData, useLanguage } from "../LanguageProvider";
import SectionHeading from "../SectionHeading";
import Button from "../Button";

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
      rel="noreferrer"      aria-label={`${data.calendar.raceLabel} ${index + 1}: ${race.village}, ${race.day} ${race.month}`}
      data-active={active}
      data-mobile-stack-card={mobileStackCard || undefined}
      className={`calendar-race-card relative z-10 flex aspect-[6/5] md:aspect-square w-20 md:w-full flex-col justify-end rounded-[9px] bg-[#072f4f] p-3 text-white cursor-pointer transition-[opacity,transform] duration-700 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054] ${visible ? "opacity-100" : "pointer-events-none opacity-0"} ${className}`}
    >
      {(!mobileStackCard || active) && (
        <>
      <Image
        src={race.art}
        alt=""
        width={race.artWidth * 0.80}
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
        <time dateTime={race.date} className="text-center text-[14px] md:text-[10px] leading-none">
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

function MobileCalendarSequence() {
  const data = useHomeData();
  const sequenceRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelinePathRef = useRef<SVGPathElement>(null);
  const timelineDotRef = useRef<SVGCircleElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const sequence = sequenceRef.current;
    const panel = panelRef.current;
    if (!sequence || !panel || window.innerWidth >= 1024) return;

    const context = gsap.context(() => {
      const cards = cardRefs.current.filter(
        (card): card is HTMLDivElement => card !== null,
      );
      const timelinePath = timelinePathRef.current;
      const timelineDot = timelineDotRef.current;
      if (!cards.length || !timelinePath || !timelineDot) return;

      const pathLength = timelinePath.getTotalLength();
      const drawTimeline = (progress: number) => {
        const clampedProgress = Math.min(1, Math.max(0, progress));
        timelinePath.style.strokeDasharray = `${pathLength}`;
        timelinePath.style.strokeDashoffset = `${pathLength * (1 - clampedProgress)}`;
        const point = timelinePath.getPointAtLength(pathLength * clampedProgress);
        timelineDot.setAttribute("cx", `${point.x}`);
        timelineDot.setAttribute("cy", `${point.y}`);
      };

      gsap.set(cards, { opacity: 0.35, zIndex: 0 });
      gsap.set(cards[0], { opacity: 1, zIndex: 20 });
      drawTimeline(0);
      let activeCard = 0;

      ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: "+=220%",
        pin: true,
        pinReparent: true,
        pinType: "fixed",
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (trigger) => {
          drawTimeline(trigger.progress);
          const nextCard = Math.min(
            data.calendar.races.length - 1,
            Math.floor(trigger.progress * (data.calendar.races.length - 1) + 0.0001),
          );
          if (nextCard === activeCard) return;

          gsap.to(cards[activeCard], {
            opacity: 0.35,
            zIndex: 0,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(cards[nextCard], {
            opacity: 1,
            zIndex: 20,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
          activeCard = nextCard;
          setActiveCardIndex(nextCard);
        },
      });
    }, sequence);

    return () => context.revert();
  }, [data.calendar.races.length]);

  const mobileStops = [34, 142, 250, 358, 466, 574, 686];

  return (
    <div ref={sequenceRef} className="relative ml-[calc((100vw-95vw)/-2)] w-screen lg:hidden">
      <div
        ref={panelRef}
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden rounded-[20px] border border-[#bb0054]/10 px-5 py-6"
      >
        <Image src={data.assets.calendarGrid} alt="" fill className="-z-10 object-cover" sizes="95vw" />
        <SectionHeading eyebrow={data.calendar.eyebrow} title={data.calendar.title} centered />
        <div className="relative flex flex-1 items-center justify-center">
          <svg aria-hidden="true" viewBox="0 0 44 720" preserveAspectRatio="xMidYMid meet" className="absolute inset-y-5 -left-5 h-[calc(100%-2.5rem)] w-11 overflow-visible">
            <path d="M22 34 V686" fill="none" stroke="#072F4F" strokeOpacity="0.32" strokeWidth="3" strokeDasharray="8 8" />
            {mobileStops.map((y, index) => (
              <g key={index}>
                <circle className="calendar-stop-pulse" cx="22" cy={y} r="6" fill="none" stroke="#bb0054" strokeWidth="2" style={{ animationDelay: `${index * 0.16}s` }} />
                <circle cx="22" cy={y} r="6" fill="#bb0054" stroke="white" strokeWidth="2" />
              </g>
            ))}
            <path ref={timelinePathRef} d="M22 34 V686" fill="none" stroke="#bb0054" strokeWidth="4" strokeLinecap="round" />
            <circle ref={timelineDotRef} r="8" fill="#bb0054" stroke="white" strokeWidth="3" />
          </svg>
          <div className="relative h-[350px] w-full max-w-[260px]">
            {data.calendar.races.map((race, index) => (
              <div key={race.date} ref={(element) => { cardRefs.current[index] = element; }} className="absolute inset-x-0 opacity-100"
                style={{ top: `${index * 10}px`, zIndex: data.calendar.races.length - index }}>
                <RaceCard race={race} index={index} active={index === activeCardIndex} mobileStackCard className="mx-auto w-[100%] border-b-[3px] border-b-[#bb0054] md:w-[250px]" />
              </div>
            ))}
          </div>        </div>
        <div className="flex flex-wrap justify-center gap-1.5">
          <Button href={data.register.href} tone="pink">{data.calendar.register}</Button>
          <Button href="#distances" tone="navy">{data.calendar.details}</Button>
        </div>
      </div>
    </div>
  );
}
function DesktopCalendarSequence() {
  const data = useHomeData();
  const { language } = useLanguage();
  const sequenceRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelinePathRef = useRef<SVGPathElement>(null);
  const timelineDotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const sequence = sequenceRef.current;
    const panel = panelRef.current;
    if (!sequence || !panel || window.innerWidth < 1024) return;

    const context = gsap.context(() => {
      const cards = cardRefs.current.filter(
        (card): card is HTMLDivElement => card !== null,
      );
      const timelinePath = timelinePathRef.current;
      const timelineDot = timelineDotRef.current;
      if (!cards.length || !timelinePath || !timelineDot) return;

      const pathLength = timelinePath.getTotalLength();
      const drawTimeline = (progress: number) => {
        const clampedProgress = Math.min(1, Math.max(0, progress));
        timelinePath.style.strokeDasharray = `${pathLength}`;
        timelinePath.style.strokeDashoffset = `${pathLength * (1 - clampedProgress)}`;
        const point = timelinePath.getPointAtLength(pathLength * clampedProgress);
        timelineDot.setAttribute("cx", `${point.x}`);
        timelineDot.setAttribute("cy", `${point.y}`);
      };

      drawTimeline(0);

      gsap.set(cards, { opacity: 0 });
      gsap.set(cards[0], { opacity: 1 });

      const cardStops = [0, 0.184, 0.336, 0.482, 0.675, 0.814, 1];
      const cardVisibility = cards.map((_, index) => index === 0);
      const updateCardVisibility = (progress: number) => {
        cards.forEach((card, index) => {
          const shouldShow = progress >= cardStops[index];
          if (cardVisibility[index] === shouldShow) return;

          cardVisibility[index] = shouldShow;
          gsap.to(card, {
            opacity: shouldShow ? 1 : 0,
            duration: 0.55,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        });
      };

      ScrollTrigger.create({
        trigger: sequence,
        start: "top top",
        end: "+=200%",
        pin: panel,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (trigger) => {
          drawTimeline(trigger.progress);
          updateCardVisibility(trigger.progress);
        },
      });
    }, sequence);

    return () => context.revert();
  }, []);

  return (
    <div ref={sequenceRef} className="hidden lg:block">
      <div
        ref={panelRef}
        className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden rounded-[20px] border border-[#bb0054]/10 px-8 py-12"
      >
        <Image
          src={data.assets.calendarGrid}
          alt=""
          fill
          className="-z-10 object-cover"
          sizes="90vw"
        />
        {/* <SectionHeading
          eyebrow={data.calendar.eyebrow}
          title={data.calendar.title}
          centered
        /> */}
        <div className="relative mt-[115px] mb-[125px] grid grid-cols-7 gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 1500 220"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 -top-24 z-0 aspect-[1500/220] w-full overflow-visible"
            style={language === "ar" ? { transform: "scaleX(-1)" } : undefined}
          >
            <path
              d="M0 186 L286 86 L513 191 L715 61 L1013 171 L1217 66 L1500 186"
              fill="none"
              stroke="#072F4F"
              strokeOpacity="0.32"
              strokeWidth="4.8"
              strokeDasharray="9.6 9.6"
            />
            {[
              { x: 0, y: 186 },
              { x: 286, y: 86 },
              { x: 513, y: 191 },
              { x: 715, y: 61 },
              { x: 1013, y: 171 },
              { x: 1217, y: 66 },
              { x: 1500, y: 186 },
            ].map((stop, index) => (
              <g key={index}>
                <circle
                  className="calendar-stop-pulse"
                  cx={stop.x}
                  cy={stop.y}
                  r="7"
                  fill="none"
                  stroke="#bb0054"
                  strokeWidth="2.5"
                  style={{ animationDelay: `${index * 0.05}s` }}
                />
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r="7"
                  fill="#bb0054"
                  stroke="white"
                  strokeWidth="2"
                />
              </g>
            ))}
            <path
              ref={timelinePathRef}
              d="M0 186 L286 86 L513 191 L715 61 L1013 171 L1217 66 L1500 186"
              fill="none"
              stroke="#bb0054"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle
              ref={timelineDotRef}
              r="9"
              fill="#bb0054"
              stroke="white"
              strokeWidth="3"
            />
          </svg>
          {data.calendar.races.map((race, index) => (
            <div
              key={race.date}
              ref={(element) => { cardRefs.current[index] = element; }}
              className={index === 0 ? "opacity-100" : "opacity-0"}
            >
              <RaceCard
                race={race}
                index={index}
                className={`mx-auto max-w-[195px] ${race.position}`}
              />
            </div>
          ))}
        </div>
        {/* <div className="flex flex-wrap justify-center gap-5">
          <Button href={data.register.href} tone="pink">{data.calendar.register}</Button>
          <Button href="#distances" tone="navy">
            {data.calendar.details}
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default function RaceMap() {
  const data = useHomeData();
  return (
    <section
      id="calendar"
      className="mx-auto w-[95%] scroll-mt-8 py-6 md:py-16 2xl:max-w-[1600px] "
    >
      <MobileCalendarSequence />
      <DesktopCalendarSequence />
    </section>
  );
}

