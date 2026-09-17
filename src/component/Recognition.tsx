"use client";

import { useEffect, useRef } from "react";
import { useHomeData } from "./LanguageProvider";
import Button from "./Button";

function InlineRunVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (video) void video.play().catch(() => {});
  }, []);

  return (
    <span className="mx-[0.14em] inline-block h-[0.95em] w-[1.4em] overflow-hidden align-[-0.08em] md:h-[0.82em] md:w-[1.36em]">
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
  const data = useHomeData();
  return (
    <section
      id="recognition"
      className="mx-auto w-[90%] scroll-mt-8 py-8 md:py-16 2xl:max-w-[1440px] 2xl:py-[60px]"
    >
      <p className="text-center text-sm font-bold text-[#bb0054] uppercase 2xl:text-lg">
        {data.recognition.eyebrow}
      </p>
      <h2 className="mt-2 md:mt-6 text-center text-[40px] leading-[1] font-bold uppercase md:text-[40px] lg:text-[65px] 2xl:text-[80px]">
        <InlineRunVideo src={data.assets.recognitionRunA} />
        {data.recognition.title}
        <InlineRunVideo src={data.assets.recognitionRunB} />
      </h2>
      <div className="mx-auto mt-2 md:mt-4 flex md:max-w-[80%] flex-col items-center text-center">
        <div className="space-y-3 text-base leading-tight text-black 2xl:text-lg">
          {data.recognition.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <Button href={data.register.href} tone="pink" className="mt-3 md:mt-6">
          {data.recognition.cta}
        </Button>
      </div>
    </section>
  );
}
