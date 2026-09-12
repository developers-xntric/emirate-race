"use client";
import { useEffect, useRef } from "react";
import { homeData as data } from "@/data/home-data";
import Button from "./Button";

function InlineRunVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (video) void video.play().catch(() => {});
  }, []);

  return (
    <span className="mx-[0.14em] inline-block  w-[1.4em] h-[0.95em] md:h-[0.82em] md:w-[1.36em] overflow-hidden  align-[-0.08em]">
      <video
        ref={ref}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="size-full object-cover"
      />
    </span>
  );
}

export default function Recognition() {
  return (
    <section
      id="recognition"
      className="mx-auto w-[90%] scroll-mt-8 py-16  2xl:max-w-[1440px] 2xl:py-[60px]"
    >
      <p className="text-center text-sm font-bold text-[#bb0054] uppercase 2xl:text-lg">
        {data.recognition.eyebrow}
      </p>
      <h5 className="mt-6 text-center text-[40px] leading-[1.12] font-bold uppercase md:text-[40px] lg:text-[65px] 2xl:text-[80px]">
        <span>A</span>
        <InlineRunVideo src={data.assets.recognitionRunA} />
        <span>National Journey with International</span>
        <InlineRunVideo src={data.assets.recognitionRunB} />
        <span>Recognition</span>
      </h5>
      <div className="mt-8 grid items-start gap-6 md:grid-cols-[auto_1fr]">
        <div className="space-y-3 md:hidden block text-base leading-tight text-black text-center 2xl:text-lg">
          {data.recognition.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <Button href={data.register.href}>{data.recognition.cta}</Button>
        <div className="space-y-3 md:block hidden text-base leading-tight text-black 2xl:text-lg">
          {data.recognition.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
