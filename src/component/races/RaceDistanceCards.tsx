"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { RacePageData } from "@/data/races/types";

const tabMeta = [
  {
    color: "#b80356",
    tag: "The race",
    rahhal: "/races/rahhal-kick.webp",
  },
  {
    color: "#2e8c81",
    tag: "The club run",
    rahhal: "/rahhal-run.webp",
  },
  {
    color: "#d9663a",
    tag: "The family run",
    rahhal: "/rahhal-bottle.webp",
  },
];

const lanes = [
  "M190 30 H450 A150 150 0 0 1 450 330 H190 A150 150 0 0 1 190 30 Z",
  "M190 48 H450 A132 132 0 0 1 450 312 H190 A132 132 0 0 1 190 48 Z",
  "M190 72 H450 A108 108 0 0 1 450 288 H190 A108 108 0 0 1 190 72 Z",
  "M190 90 H450 A90 90 0 0 1 450 270 H190 A90 90 0 0 1 190 90 Z",
];

export default function RaceDistanceCards({
  distances,
}: {
  distances: RacePageData["distances"];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDistance = distances[activeIndex] ?? distances[0];
  const activeMeta = tabMeta[activeIndex] ?? tabMeta[0];

  useEffect(() => {
    if (distances.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % distances.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [distances.length]);

  if (!activeDistance) return null;

  return (
    <div className="overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_-22px_rgba(10,50,81,.35)] ring-1 ring-[#0a3251]/10 md:grid md:grid-cols-[minmax(230px,320px)_1fr]">
      <div
        className="grid grid-cols-3 border-b border-[#0a3251]/10 md:grid-cols-1 md:border-r md:border-b-0"
        role="tablist"
        aria-label="Race distances"
      >
        {distances.map((distance, index) => {
          const meta = tabMeta[index] ?? tabMeta[0];
          const selected = index === activeIndex;

          return (
            <button
              key={`${distance.distance}-${distance.title}`}
              type="button"
              role="tab"
              id={`race-distance-tab-${index}`}
              aria-selected={selected}
              aria-controls="race-distance-panel"
              onClick={() => setActiveIndex(index)}
              className={`relative min-h-[116px] cursor-pointer overflow-hidden px-3 py-5 text-left rtl:text-right transition-colors md:min-h-[145px] md:px-7 md:py-6 ${selected ? "bg-[#0a3251]/[.035]" : "hover:bg-[#0a3251]/[.02]"}`}
            >
              <strong
                className="block text-xl leading-none font-extrabold uppercase md:text-4xl"
                style={{ color: selected ? "#0a3251" : "rgba(10,50,81,.3)" }}
              >
                {distance.distance}
              </strong>
              <span className="mt-2 block text-[9px] leading-tight font-bold tracking-[.1em] text-[#5d6f80] uppercase md:text-[11px] md:tracking-[.16em]">
                {distance.title}
              </span>
              <i
                aria-hidden
                className="absolute bottom-0 left-0 h-1 w-full origin-left transition-transform duration-500"
                style={{
                  backgroundColor: meta.color,
                  transform: selected ? "scaleX(1)" : "scaleX(0)",
                }}
              />
            </button>
          );
        })}
      </div>

      <div
        id="race-distance-panel"
        role="tabpanel"
        aria-labelledby={`race-distance-tab-${activeIndex}`}
        aria-live="polite"
        className="relative min-h-[390px] overflow-hidden px-4 py-14 sm:min-h-[460px] md:px-10"
      >
        <span
          className="absolute top-5 left-5 text-[10px] font-bold tracking-[.22em] uppercase sm:top-7 sm:left-8 md:top-8 md:left-10"
          style={{ color: activeMeta.color }}
        >
        {activeDistance.title}
        </span>

        <div
          aria-hidden
          className="absolute inset-x-0 top-[40%] md:top-1/2 -translate-y-1/2 px-2  md:px-10"
        >
          <svg
            className="mx-auto w-full max-w-[640px] overflow-visible"
            viewBox="0 0 640 360"
          >
            <path
              fill="none"
              stroke={activeMeta.color}
              strokeWidth="70"
              className="transition-[stroke] duration-500"
              d="M190 60 H450 A120 120 0 0 1 450 300 H190 A120 120 0 0 1 190 60 Z"
            />
            {lanes.map((path) => (
              <path
                key={path}
                fill="none"
                stroke="rgba(255,255,255,.55)"
                strokeWidth="1.4"
                d={path}
              />
            ))}
            <path
              fill="#f5f6f7"
              d="M190 95 H450 A85 85 0 0 1 450 265 H190 A85 85 0 0 1 190 95 Z"
            />
            <line
              x1="320"
              y1="26"
              x2="320"
              y2="94"
              stroke="#fff"
              strokeWidth="4"
            />
            <path
              fill="none"
              stroke="#fff"
              strokeWidth="7"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="18 82"
              strokeDashoffset="18"
              d="M320 60 H450 A120 120 0 0 1 450 300 H190 A120 120 0 0 1 190 60 H320"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="18"
                to="-82"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </path>
            <circle r="10" fill="#fff" stroke="#fff" strokeWidth="4">
              <animateMotion
                dur="2.4s"
                repeatCount="indefinite"
                path="M320 60 H450 A120 120 0 0 1 450 300 H190 A120 120 0 0 1 190 60 H320"
              />
            </circle>
          </svg>
        </div>

        <div
          key={`${activeDistance.distance}-${activeDistance.title}`}
          className="relative z-10 mx-auto grid min-h-[270px] md:mb-0 mb-16 md:mt-10 max-w-[280px] content-center text-center motion-safe:animate-[distance-readout_.5s_ease-out]"
        >
          <div className="font-bold leading-0.5 md:leading-[0.55] text-[#0a3251]  ">
            <span className="text-[50px] md:text-[96px] rtl:text-[30px] md:rtl:text-[80px]">
              {activeDistance.distance.replace(/KM$/i, "")}
            </span>
            <small className="ml-1 text-[10px] font-normal">KM</small>
          </div>
          <h3 className="mt-4 text-lg rtl:text-[12px] md:rtl:text-[10px] leading-snug font-semibold text-[#0a3251]">
            {activeDistance.title}
          </h3>
        </div>

        <Image
          key={activeMeta.rahhal}
          src={activeDistance.tabImage || activeMeta.rahhal}
          alt=""
          width={230}
          height={260}
          className="pointer-events-none absolute right-[2%] bottom-0 block max-h-[90%] w-[45%] md:w-[20%] object-contain object-bottom drop-shadow-[0_20px_20px_rgba(10,50,81,.3)] md:max-h-[82%] sm:w-[clamp(120px,16vw,230px)] motion-safe:animate-[distance-rahhal_.55s_ease-out]"
        />
      </div>
      <style jsx>{`
        @keyframes race-track {
          from {
            stroke-dashoffset: 18;
          }
          to {
            stroke-dashoffset: -82;
          }
        }
        @keyframes distance-readout {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes distance-rahhal {
          from {
            opacity: 0;
            transform: translate(56px, 36px) rotate(8deg);
          }
          to {
            opacity: 1;
            transform: translate(0) rotate(0);
          }
        }
      `}</style>
    </div>
  );
}
