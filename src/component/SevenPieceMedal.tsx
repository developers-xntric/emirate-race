"use client";

import Confetti from "react-confetti";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "./Button";
import { useHomeData } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";

const medalAssets = [
  "/medals/qidfa.webp",
  "/medals/lehbab.webp",
  "/medals/wadi.webp",
  "/medals/falaj.webp",
  "/medals/masfout.webp",
  "/medals/rams.webp",
  "/medals/shuwaib.webp",
] as const;
const villageIds = [
  "qidfa",
  "lehbab",
  "wadi",
  "falaj",
  "masfout",
  "rams",
  "shuwaib",
] as const;
const villageColors: Record<(typeof villageIds)[number], string> = {
  qidfa: "#3d93cf",
  lehbab: "#6c71b8",
  wadi: "#b80356",
  falaj: "#4db4a8",
  masfout: "#bb866a",
  rams: "#f1926e",
  shuwaib: "#dccbc0",
};

function MarkSeven({
  markup,
  selected,
  className = "",
}: {
  markup: string;
  selected: number[];
  className?: string;
}) {
  const coloredMarkup = useMemo(() => {
    const selectedVillages = new Set(
      selected.map((index) => villageIds[index]),
    );
    const isComplete = selectedVillages.size === villageIds.length;
    return markup
      .replace(
        /<path class="m7-base"([^>]*)\/>/g,
        '<path class="m7-base"$1 style="opacity:0"/>',
      )
      .replace(
        /(<g class="m7-seg" data-v="([^"]+)"[^>]*>)([\s\S]*?)(<\/g>)/g,
        (_group, opening, village, contents, closing) => {
          const opacity = selectedVillages.has(village) ? "1" : "0";
          const animatedOpening = opening.replace(
            /style="([^"]*)"/,
            (_match: string, existingStyle: string) =>
              `style="${existingStyle};opacity:${opacity};transition:opacity 420ms ease;"`,
          );
          const coloredContents = contents.replace(
            /<path class="m7-fill"/g,
            `<path fill="${villageColors[village as keyof typeof villageColors]}" class="m7-fill"`,
          );
          return `${animatedOpening}${coloredContents}${closing}`;
        },
      )
      .replace(
        /(<path[^>]*class="m7-head"[^>]*)(\/>)/g,
        `$1 style="opacity:${isComplete ? "1" : "0"};transition:opacity 420ms ease;"$2`,
      );
  }, [markup, selected]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 [&>svg]:block [&>svg]:h-full [&>svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: coloredMarkup }}
    />
  );
}
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateSize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
export default function SevenPieceMedal() {
  const data = useHomeData();
  const [selected, setSelected] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [markMarkup, setMarkMarkup] = useState("");
  const [confettiKey, setConfettiKey] = useState(0);
  const [confettiPieces, setConfettiPieces] = useState(0);
  const timerRef = useRef<number | null>(null);
  const completed = selected.length === villageIds.length;
  const { width, height } = useWindowSize();

  useEffect(() => {
    let cancelled = false;
    fetch("/mark7-grouped.svg")
      .then((response) => response.text())
      .then((svg) => {
        if (!cancelled) setMarkMarkup(svg);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const triggerConfetti = (pieces: number) => {
    setConfettiPieces(pieces);
    setConfettiKey((current) => current + 1);
  };

  const toggle = (index: number) => {
    if (isRunning) return;
    const wasSelected = selected.includes(index);
    setSelected((current) =>
      wasSelected
        ? current.filter((item) => item !== index)
        : [...current, index].sort((a, b) => a - b),
    );
    if (!wasSelected)
      triggerConfetti(selected.length + 1 === villageIds.length ? 500 : 110);
  };
  const runSeason = () => {
    if (isRunning) return;
    setSelected([]);
    setIsRunning(true);
    let index = 0;
    const collectNext = () => {
      const nextIndex = index;
      setSelected((current) => [...current, nextIndex]);
      triggerConfetti(nextIndex === villageIds.length - 1 ? 500 : 110);
      index += 1;
      if (index < villageIds.length)
        timerRef.current = window.setTimeout(collectNext, 420);
      else {
        timerRef.current = null;
        setIsRunning(false);
      }
    };
    timerRef.current = window.setTimeout(collectNext, 180);
  };
  const reset = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
    setSelected([]);
  };

  return (
    <section id="seven-piece-medal" className="bg-white  md:pt-0 pb-10">
      {confettiKey > 0 && width > 0 && height > 0 && (
        <Confetti
          key={confettiKey}
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={confettiPieces}
          gravity={0.8}
          friction={0.9}
          initialVelocityY={24}
          tweenDuration={400}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        />
      )}
      <div className="mx-auto w-[90%] 2xl:max-w-[1440px]">
        <div className="grid items-center gap-3 md:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="The seven-piece medal"
              title="Seven villages. One medal to finish."
            />
            <p className="mt-2 text-base leading-[1.5] text-[#0b2d4d]/75 md:text-lg">
              Complete all seven to collect the full seven-piece medal. Every
              village adds its own piece. Collect them in race order, or choose
              any order you like.
            </p>
            <div className="mt-5 flex items-end gap-3" aria-live="polite">
              <strong className="text-[clamp(70px,8vw,120px)] leading-[0.75] font-bold tracking-[-0.06em] text-[#0b2d4d]">
                {selected.length}
              </strong>
              <span className="text-3xl font-bold text-[#0b2d4d]/30">/7</span>
              <span className="mb-1 max-w-24 text-[10px] font-bold uppercase leading-snug tracking-[0.16em] text-[#0b2d4d]/65">
                {completed ? "Full medal unlocked" : "Pieces collected"}
              </span>
            </div>
            <div className="mt-2 md:mt-7 flex flex-wrap gap-3">
              <Button
                onClick={runSeason}
                disabled={isRunning}
                className="min-w-[224px]"
              >
                {isRunning ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="size-4 animate-spin"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeOpacity=".3"
                        strokeWidth="3"
                      />
                      <path
                        d="M12 3a9 9 0 0 1 9 9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Collecting the season
                  </span>
                ) : (
                  "Run the whole season"
                )}
              </Button>
              {selected.length > 0 && (
                <Button
                  tone="white"
                  onClick={reset}
                  className="border border-[#0b2d4d]/30"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
          <div className="mx-auto w-full max-w-[570px]">
            <div className="relative mx-auto w-[min(100%,150px)] md:w-[340px]">
              <Image
                src="/default-7-mark.png"
                alt="EVRS seven-piece medal mark"
                width={340}
                height={340}
                className="h-auto w-full"
              />
              {markMarkup && (
                <MarkSeven
                  markup={markMarkup}
                  selected={selected}
                  className="translate-x-1 md:translate-x-[9px] "
                />
              )}
            </div>
            <div
              className="mt-4 md:mt-7 grid grid-cols-4 gap-2 md:grid-cols-7 md:gap-3"
              aria-label="Medal pieces"
            >
              {data.calendar.races.map((race, index) => {
                const active = selected.includes(index);
                return (
                  <button
                    key={race.date}
                    type="button"
                    onClick={() => toggle(index)}
                    aria-pressed={active}
                    disabled={isRunning}
                    className={`relative grid min-h-[104px] cursor-pointer place-items-center rounded-[14px] border-2 bg-white p-2 transition hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054] disabled:cursor-wait ${active ? "shadow-lg" : "border-transparent shadow-[0_10px_24px_-18px_rgba(7,47,79,0.55)]"}`}
                    style={{
                      borderColor: active
                        ? villageColors[villageIds[index]]
                        : undefined,
                    }}
                  >
                    <Image
                      src={medalAssets[index]}
                      alt={`${race.village} medal piece`}
                      width={88}
                      height={88}
                      className="h-16 w-full object-contain sm:h-20"
                    />
                    <span className="text-center text-[8px] font-bold uppercase leading-tight tracking-[0.08em] text-[#0b2d4d]">
                      {race.village}
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-[#0b2d4d] text-[10px] text-white"
                      >
                        &#10003;
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {completed && (
          <div className="mt-10 grid overflow-hidden rounded-[12px] md:mt-12 md:grid-cols-[60fr_40fr]">
            <div className="relative min-h-[320px] md:min-h-[440px]">
              <Image
                src="/medal-7-desert.webp"
                alt="Completed seven-piece EVRS medal in the desert"
                fill
                sizes="(min-width: 768px) 50vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#072f4f]/95 via-[#072f4f]/55 to-transparent p-5 md:pt-20 text-white sm:p-9 sm:pt-28">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#fff]">
                  7 / 7 &middot; Unlocked
                </p>
                <h3 className="mt-3 text-xl md:text-2xl leading-[0.95] font-bold uppercase text-white md:text-4xl">
                  Seven races.
                  <br />
                  Seven pieces.
                  <br />
                  One medal.
                </h3>
                <p className="md:mt-3 max-w-[36ch] text-base nd:leading-relaxed text-white/90 md:text-lg">
                  Every village now has its place in your finished EVRS medal.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center bg-[#072f4f] bg-[url('/outline-navy.webp')] bg-[length:700px_auto] p-4 text-white md:p-8">
              <h3 className="text-2xl leading-[0.95] font-bold uppercase text-white md:text-4xl">
                {data.prizes.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-white/85 md:text-lg">
                {data.prizes.description}
              </p>

              <div className="relative flex  min-h-[230px] flex-1">
                <Image
                  src={data.assets.prizeRahhal}
                  alt={data.prizes.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 80vw"
                  className="object-contain object-center"
                />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="#prize-answer">{data.prizes.cta}</Button>
                <Button href={data.register.href} tone="pink">
                  {data.register.label}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
