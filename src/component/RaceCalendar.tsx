"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { useHomeData } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

function RaceCard({
  race,
  index,
  className = "",
  visible = true,
}: {
  race: ReturnType<typeof useHomeData>["calendar"]["races"][number];
  index: number;
  className?: string;
  visible?: boolean;
}) {
  const data = useHomeData();
  return (
    <article
      aria-label={`${data.calendar.raceLabel} ${index + 1}: ${race.village}, ${race.day} ${race.month}`}
      className={`relative z-10 flex aspect-[7/5] md:aspect-square w-20 md:w-full flex-col justify-end rounded-[9px] bg-[#072f4f] p-3 text-white transition-[opacity,transform] duration-700 ease-out hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054] ${visible ? "opacity-100" : "pointer-events-none opacity-0"} ${className}`}
    >
      <Image
        src={race.art}
        alt=""
        width={race.artWidth * 0.80}
        height={race.artHeight * 0.75}
        className="absolute -top-8 left-1/2 -translate-x-1/2 object-contain"
      />
      <div className="relative pt-5 text-xs leading-tight font-bold 2xl:text-sm">
        <p className="uppercase">
          {data.calendar.raceLabel} {String(index + 1).padStart(2, "0")}
        </p>
        <p>{race.emirate}</p>
      </div>
      <div className="mt-2 flex items-center justify-between gap-1">
        <Image
          src={race.icon}
          alt=""
          width={race.iconWidth * 0.7}
          height={race.iconHeight * 0.7}
          className="shrink-0 object-contain"
        />
        <time dateTime={race.date} className="text-center text-[10px] leading-none">
          <span className="block">{data.calendar.dayLabel}</span>
          <strong className="block text-[32px] 2xl:text-[40px]">
            {race.day}
          </strong>
          <span>{race.month}</span>
        </time>
      </div>
      <h3 className="mt-2 text-[17px] leading-none font-bold 2xl:text-xl">
        {race.village}
      </h3>
    </article>
  );
}

function MobileRaceMarquee() {
  const data = useHomeData();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let frameId = 0;
    let previousTime = performance.now();
    const move = (time: number) => {
      const elapsed = time - previousTime;
      previousTime = time;

      if (!isInteracting.current) {
        const loopWidth = marquee.scrollWidth / 2;
        const direction = getComputedStyle(marquee).direction === "rtl" ? -1 : 1;
        marquee.scrollLeft += elapsed * 0.08 * direction;
        if (Math.abs(marquee.scrollLeft) >= loopWidth) marquee.scrollLeft -= loopWidth * direction;
      }

      frameId = window.requestAnimationFrame(move);
    };

    frameId = window.requestAnimationFrame(move);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const stopAutoScroll = () => {
    isInteracting.current = true;
  };
  const resumeAutoScroll = () => {
    isInteracting.current = false;
  };

  const marqueeRaces = [...data.calendar.races, ...data.calendar.races];

  return (
    <div
      ref={marqueeRef}
      aria-label={data.calendar.title}
      onPointerDown={stopAutoScroll}
      onPointerUp={resumeAutoScroll}
      onPointerCancel={resumeAutoScroll}
      className="relative start-1/2 mt-3 lg:mt-20 w-screen -translate-x-1/2 rtl:translate-x-1/2 overflow-x-auto touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max gap-4 px-4 pt-12">
        {marqueeRaces.map((race, index) => (
          <RaceCard
            key={`${race.date}-${index}`}
            race={race}
            index={index % data.calendar.races.length}
            className="w-[250px] shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

function DesktopCalendarSequence() {
  const data = useHomeData();
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
        <SectionHeading
          eyebrow={data.calendar.eyebrow}
          title={data.calendar.title}
          centered
        />
        <div className="relative mt-[115px] mb-[125px] grid grid-cols-7 gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 1500 220"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 -top-24 z-0 aspect-[1500/220] w-full overflow-visible"
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
        <div className="flex flex-wrap justify-center gap-5">
          <Button href={data.register.href} tone="pink">{data.calendar.register}</Button>
          <Button href="#distances" tone="navy">
            {data.calendar.details}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function RaceCalendar() {
  const data = useHomeData();
  return (
    <section
      id="calendar"
      className="mx-auto w-[95%] scroll-mt-8 py-6 md:py-16 2xl:max-w-[1600px] "
    >
      <div className="relative isolate overflow-visible rounded-[20px] border border-[#bb0054]/10 px-5 py-6  lg:hidden">
        <Image
          src={data.assets.calendarGrid}
          alt=""
          fill
          className="-z-10 object-cover"
          sizes="90vw"
        />
        <SectionHeading
          eyebrow={data.calendar.eyebrow}
          title={data.calendar.title}
          centered
        />
        <MobileRaceMarquee />
        <div className="mt-8 flex flex-wrap justify-center gap-1.5 md:gap-5">
          <Button href={data.register.href} tone="pink">{data.calendar.register}</Button>
          <Button href="#distances" tone="navy">
            {data.calendar.details}
          </Button>
        </div>
      </div>
      <DesktopCalendarSequence />
    </section>
  );
}