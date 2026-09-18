"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { RacePageData } from "@/data/races/types";

gsap.registerPlugin(ScrollTrigger);

export default function RaceDistanceCards({
  distances,
}: {
  distances: RacePageData["distances"];
}) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards =
      scope.current?.querySelectorAll<HTMLElement>("[data-distance-card]");
    if (!cards?.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "power3.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: scope.current,
          start: "top 90%",
          end: "bottom 20%",
          scrub: 1,
         
        },
      });
    }, scope);

    return () => context.revert();
  }, []);

  return (
    <div ref={scope} className="grid gap-3 md:grid-cols-3 md:gap-5">
      {distances.map((item) => (
        <article
          key={item.distance}
          data-distance-card
          className="h-full rounded-[8px] border border-dashed border-[#bb0054] bg-white p-3 md:p-4 opacity-0 translate-y-14 scale-95 motion-reduce:!opacity-100 motion-reduce:!translate-y-0 motion-reduce:!scale-100"
        >
          <h3 className="md:text-2xl leading-tight font-bold uppercase 2xl:text-[35px]">
            <span className="block text-[#bb0054]">{item.distance}</span>
            {item.title}
          </h3>
          <p className="text-base leading-snug text-[#303030] 2xl:text-xl">
            {item.description}
          </p>
        </article>
      ))}
    </div>
  );
}