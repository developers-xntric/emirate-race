"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Button from "@/component/Button";
import { villages } from "./data";

const count = villages.length;
const wrap = (value: number) => ((value % count) + count) % count;

export default function CircularGallery() {
  const viewport = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const position = useRef({ current: 2, target: 2 });
  const drag = useRef<{ x: number; origin: number; moved: boolean } | null>(
    null,
  );
  const suppressClick = useRef(false);
  const [selected, setSelected] = useState(2);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let width = element.clientWidth;
    const resize = new ResizeObserver(() => {
      width = element.clientWidth;
    });
    resize.observe(element);
    const animate = () => {
      const state = position.current;
      state.current +=
        (state.target - state.current) * (reduced.matches ? 1 : 0.15);
      const cardWidth = Math.min(300, width * 0.52);
      const step = cardWidth * 1.48;
      cards.current.forEach((card, index) => {
        if (!card) return;
        const offset = wrap(index - state.current + count / 2) - count / 2;
        const x = offset * step;
        const radius = width * 1.45;
        const angle = Math.asin(Math.max(-0.9, Math.min(0.9, x / radius)));
        const y = radius * (1 - Math.cos(angle));
        card.style.width = cardWidth + "px";
        card.style.transform = `translate(-50%, 0) translate(${x}px, ${y}px) rotate(${(angle * 180) / Math.PI}deg)`;
        card.style.zIndex = String(10 - Math.round(Math.abs(offset)));
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
    };
  }, []);

  const go = (target: number) => {
    position.current.target = target;
    setSelected(wrap(Math.round(target)));
  };
  const step = (direction: number) =>
    go(Math.round(position.current.target) + direction);
  const finishDrag = () => {
    if (!drag.current) return;
    suppressClick.current = drag.current.moved;
    drag.current = null;
    go(Math.round(position.current.target));
  };
  const current = villages[selected];

  return (
    <div className="relative mt-[35px]">
      <div
        ref={viewport}
        className="relative h-[450px] touch-pan-y cursor-grab overflow-hidden select-none active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#bb0054] min-[1600px]:h-[480px] max-md:h-[340px] [@media(max-width:420px)]:h-[290px]!"
        role="region"
        aria-label="Seven races gallery. Use the arrow keys, drag, or swipe to explore."
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            step(event.key === "ArrowRight" ? 1 : -1);
          } else if (event.key === "Home") {
            event.preventDefault();
            go(0);
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          suppressClick.current = false;
          drag.current = {
            x: event.clientX,
            origin: position.current.target,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const distance = drag.current.x - event.clientX;
          if (Math.abs(distance) > 8) {
            drag.current.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          const width = viewport.current?.clientWidth ?? 1000;
          position.current.target =
            drag.current.origin +
            distance / (Math.min(300, width * 0.52) * 1.48);
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
      >
        {villages.map((village, index) => (
          <button
            key={village.name}
            ref={(node) => {
              cards.current[index] = node;
            }}
            type="button"
            className="absolute top-[10px] left-1/2 aspect-[375/465.549] w-[300px] cursor-[inherit] overflow-hidden rounded-[10px] border-8 border-solid bg-[#eee] focus-visible:outline-[3px] focus-visible:outline-offset-[5px] focus-visible:outline-[#072f4f] [&_img]:pointer-events-none [&_img]:object-cover"
            style={{ borderColor: village.color }}
            aria-label={`Show ${village.name}`}
            aria-pressed={selected === index}
            onClick={() => {
              if (suppressClick.current) {
                suppressClick.current = false;
                return;
              }
              const delta =
                wrap(index - position.current.target + count / 2) - count / 2;
              go(position.current.target + delta);
            }}
          >
            <Image
              src={village.image}
              alt={`${village.name} race medal`}
              fill
              sizes="(max-width: 600px) 52vw, 300px"
              draggable={false}
            />
          </button>
        ))}
      </div>
      <div className="pointer-events-none absolute top-[170px] left-1/2 z-20 flex w-[min(96%,500px)] -translate-x-1/2 justify-between max-md:top-[120px] [&_button]:pointer-events-auto [&_button]:cursor-pointer [&_button]:rounded-[50%] [&_img]:h-auto [&_img]:w-10 max-md:[&_img]:w-8">
        <button
          type="button"
          aria-label="Previous race"
          onClick={() => step(-1)}
        >
          <Image src="/about/gallery-prev.svg" alt="" width={56} height={61} />
        </button>
        <button type="button" aria-label="Next race" onClick={() => step(1)}>
          <Image
            src="/about/gallery-next.svg"
            alt=""
            width={56}
            height={61}
            className="-scale-x-100"
          />
        </button>
      </div>
      <div
        className="mx-auto w-[90%] max-w-[380px] text-center [&_h3]:text-[28px] [&_h3]:font-bold [&_h3]:uppercase [&_p]:mt-2 [&_p]:min-h-10 md:[&_p]:min-h-20 [&_p]:text-xl [&_p]:leading-[1.25] max-md:[&_p]:text-lg"
        aria-live="polite"
        aria-atomic="true"
      >
        <h3>{current.name}</h3>
        <p>{current.description}</p>
        <Button href={current.registerUrl} tone="pink">
          Register Now
        </Button>
      </div>
    </div>
  );
}
