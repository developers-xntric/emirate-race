"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RaceRevealProps = {
  children: ReactNode;
  className: string;
  delay?: number;
  effect?: "rise" | "scale";
};

export default function RaceReveal({ children, className, delay = 0, effect = "rise" }: RaceRevealProps) {
  const element = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setRevealed(true);
      observer.disconnect();
    }, { threshold: 0.8 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const revealState = effect === "scale"
    ? revealed ? "translate-y-0 scale-100 opacity-100" : "translate-y-5 scale-90 opacity-0"
    : revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0";

  return (
    <div ref={element} data-revealed={revealed} style={{ transitionDelay: `${delay}ms` }} className={`group transition-[opacity,transform] duration-[3500ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:!transform-none motion-reduce:!opacity-100 ${revealState} ${className}`}>
      {children}
    </div>
  );
}