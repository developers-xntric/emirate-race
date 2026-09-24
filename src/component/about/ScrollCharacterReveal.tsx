"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollCharacterRevealProps = {
  text: string;
  className?: string;
};

export default function ScrollCharacterReveal({
  text,
  className = "",
}: ScrollCharacterRevealProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const characters = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    const element = textRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const characterElements = gsap.utils.toArray<HTMLElement>(
        "[data-scroll-character]",
      );

      gsap.to(characterElements, {
        color: "#bb0054",
        ease: "none",
        stagger: 0.018,
        scrollTrigger: {
          trigger: element,
          start: "top 78%",
          end: "bottom 42%",
          scrub: true,
        },
      });
    }, element);

    return () => context.revert();
  }, []);

  return (
    <p ref={textRef} className={className} aria-label={text}>
      <span aria-hidden="true">
        {characters.map((character, index) =>
          character === " " ? (
            " "
          ) : (
            <span key={`${character}-${index}`} data-scroll-character>
              {character}
            </span>
          ),
        )}
      </span>
    </p>
  );
}
