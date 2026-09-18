"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RaceRevealProps = {
  children: ReactNode;
  className: string;
  delay?: number;
};

export default function RaceReveal({ children, className, delay = 0 }: RaceRevealProps) {
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
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={element}
      data-revealed={revealed}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group transition-[opacity,transform] duration-700 ease-out motion-reduce:!transform-none motion-reduce:!opacity-100 ${revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}