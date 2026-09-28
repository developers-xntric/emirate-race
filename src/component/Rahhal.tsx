"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHomeData } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";
import Button from "./Button";

// Keep the default and all four previews in exactly the same video frame.
const videoFrameClassName =
  "pointer-events-none absolute inset-0 z-10 size-full object-contain object-center";

function ChallengeMessage({ className = "" }: { className?: string }) {
  const data = useHomeData();
  return (
    <div
      className={`md:mt-8 flex md:flex-col items-center 2xl:mt-16 lg:items-start ${className}`}
    >
      <p className="w-full md:w-fit bg-[#0b2d4d] md:rounded-l-none rounded-l-[4px] rtl:rounded-r-[4px] rtl:rounded-l-[0px] px-2 md:px-4 py-2 md:py-3 rtl:text-[9px] text-[12px] md:text-xl md:rtl:text-xl leading-none font-bold text-white uppercase 2xl:text-[28px]">
        {data.rahhal.challenge}
      </p>
      <p className="w-full md:w-fit bg-[#bb0054] px-2 md:px-4 py-2 md:py-3 md:rounded-r-none rounded-r-[4px] rtl:rounded-l-[4px] rtl:rounded-r-[0px] rtl:text-[9px] md:rtl:text-xl text-[12px] md:text-lg leading-none font-bold text-white uppercase 2xl:text-[24px]">
        {data.rahhal.invitation}
      </p>
    </div>
  );
}

export default function Rahhal() {
  const data = useHomeData();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldPreloadVideos, setShouldPreloadVideos] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const defaultVideoRef = useRef<HTMLVideoElement>(null);
  const videoIsVisibleRef = useRef(false);
  const defaultVideoEndedRef = useRef(false);
  const [defaultVideoReady, setDefaultVideoReady] = useState(false);
  const activeTraitRef = useRef<number | null>(null);
  const [activeTrait, setActiveTrait] = useState<number | null>(null);
  const [playingTrait, setPlayingTrait] = useState<number | null>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPreloadVideos(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldPreloadVideos) return;

    const defaultVideo = defaultVideoRef.current;
    videoFrameRef.current
      ?.querySelectorAll<HTMLVideoElement>("video")
      .forEach((video) => video.load());

    if (videoIsVisibleRef.current && activeTraitRef.current === null) {
      void defaultVideo?.play().catch(() => {});
    }
  }, [shouldPreloadVideos]);

  const previewTrait = useCallback((index: number | null) => {
    activeTraitRef.current = index;
    setActiveTrait(index);
    setPlayingTrait(null);
    videoRefs.current.forEach((video) => video?.pause());
    const video = index === null ? null : videoRefs.current[index];
    if (video && !video.error) {
      video.currentTime = 0;
      void video.play().catch(() => {
        // Keep the default video visible if the card preview cannot play.
      });
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setAnimationCycle((current) => current + 1);
        } else {
          setIsVisible(false);
          videoIsVisibleRef.current = false;
          previewTrait(null);
          defaultVideoRef.current?.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [previewTrait]);

  useEffect(() => {
    const videoFrame = videoFrameRef.current;
    if (!videoFrame) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoIsVisibleRef.current = true;
          defaultVideoEndedRef.current = false;
          const defaultVideo = defaultVideoRef.current;
          if (activeTraitRef.current === null && defaultVideo) {
            defaultVideo.currentTime = 0;
            void defaultVideo.play().catch(() => {});
          }
        } else {
          videoIsVisibleRef.current = false;
          defaultVideoRef.current?.pause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(videoFrame);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={sectionRef}
      id="rahhal"
      className="relative mx-auto w-[90%] scroll-mt-8 pb-8 md:pb-16 2xl:max-w-[1440px] 2xl:pb-[82px]"
    >
      <p
        aria-hidden="true"
        className="pointer-events-none relative z-20 bg-linear-to-t from-white from-[16.513%] to-[#bb0054] to-[562.82%] bg-clip-text text-center text-[15rem] leading-none font-bold text-transparent uppercase hidden lg:block lg:text-[11.2em] 2xl:text-[14rem] rtl:lg:text-[10.5rem] rtl:2xl:text-[11rem]"
      >
        {data.rahhal.eyebrow}
      </p>
      <div className="relative grid items-center md:gap-8 lg:-mt-19 rtl:xl:-mt-4  lg:grid-cols-[1fr_.88fr_1fr] lg:gap-5">
        <div>
          <SectionHeading
            eyebrow={data.rahhal.eyebrow}
            title={data.rahhal.title}
            compact
          />
          <div className="mt-2 md:mt-3 space-y-3 md:space-y-5 text-lg leading-[1.25] text-black lg:text-base 2xl:text-lg">
            {data.rahhal.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <ChallengeMessage className="hidden lg:block" />
        </div>
        <div className="mx-auto w-full  md:max-w-[340px] lg:max-w-[420px]">
          <div className="relative w-full md:mt-0 mt-4">
            <p
              aria-hidden="true"
              className="pointer-events-none absolute top-[1%] left-1/2 z-20 w-max text-center -translate-x-1/2 -translate-y-1/2 tracking-widest text-[12vw] leading-none font-bold text-[#bb0054]/20 uppercase hidden lg:hidden"
            >
              {data.rahhal.eyebrow === "Meet Rahhal" ? (
                <>
                  <span className="block">Meet Rahhal</span>
                  {/* <span className="block">Rahhal</span> */}
                </>
              ) : (
                data.rahhal.eyebrow.split(/ (?=\S+$)/).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))
              )}
            </p>
            <ChallengeMessage className="lg:hidden" />
            <div
              ref={videoFrameRef}
              className="relative mx-auto aspect-[460.39/689.87] w-full max-w-[240px] md:max-w-full"
            >
              <Image
                src={data.assets.rahhal}
                alt={data.rahhal.eyebrow}
                fill
                sizes="(min-width: 1024px) 28vw, 80vw"
                className={`z-10 object-contain ${defaultVideoReady || (playingTrait !== null && playingTrait === activeTrait) ? "opacity-0" : "opacity-100"}`}
              />
              <video
                ref={defaultVideoRef}
                src={data.assets.rahhalDefaultVideo}
                preload={shouldPreloadVideos ? "auto" : "none"}
                muted
                playsInline
                aria-hidden="true"
                onPlaying={() => {
                  setDefaultVideoReady(true);
                  const active = activeTraitRef.current;
                  if (
                    active !== null &&
                    videoRefs.current[active]?.paused === false
                  ) {
                    defaultVideoRef.current?.pause();
                  }
                }}
                onEnded={() => {
                  defaultVideoEndedRef.current = true;
                }}
                onError={() => setDefaultVideoReady(false)}
                className={`${videoFrameClassName} ${defaultVideoReady && !(playingTrait !== null && playingTrait === activeTrait) ? "opacity-100" : "opacity-0"} md:scale-[97%]`}
              />
              {data.rahhal.traits.map((trait, index) => (
                <video
                  key={trait.video}
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  src={trait.video}
                  preload={shouldPreloadVideos ? "auto" : "none"}
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                  onPlaying={(event) => {
                    if (activeTraitRef.current === index) {
                      setPlayingTrait(index);
                      defaultVideoRef.current?.pause();
                    } else event.currentTarget.pause();
                  }}
                  onError={() => {
                    if (activeTraitRef.current === index) {
                      setPlayingTrait(null);
                      void defaultVideoRef.current?.play().catch(() => {});
                    }
                  }}
                  className={`${videoFrameClassName} ${playingTrait === index && activeTrait === index ? "opacity-100" : "opacity-0"} ${index === 0 ? "md:scale-[97%]" : ""}`}
                />
              ))}
            </div>
          </div>{" "}
        </div>
        <div className="grid grid-cols-2">
          {data.rahhal.traits.map((trait, i) => (
            <article
              key={`${trait.title}-${animationCycle}`}
              role="button"
              tabIndex={0}
              aria-pressed={activeTrait === i}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") previewTrait(i);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== "touch") previewTrait(null);
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible"))
                  previewTrait(i);
              }}
              onBlur={() => previewTrait(null)}
              onClick={() => previewTrait(i)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  previewTrait(i);
                } else if (event.key === "Escape") {
                  previewTrait(null);
                }
              }}
              className={`relative flex md:min-h-[235px] cursor-pointer flex-col justify-center gap-2 md:gap-3 rounded-[12px] md:rounded-[20px] p-3 md:p-5 text-white transition-[opacity,transform,scale] duration-500 hover:z-20 focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b2d4d] motion-safe:hover:scale-105 motion-safe:focus-visible:scale-105 ${isVisible ? "motion-safe:animate-rahhal-trait-reveal" : "opacity-0 scale-0"} motion-reduce:opacity-100 motion-reduce:scale-100 2xl:min-h-[253px] ${trait.color}`}
              style={{ animationDelay: `${i * 0.18}s` }}
            >
              <h3 className="text-xl leading-none font-bold uppercase 2xl:text-[24px]">
                {trait.title}
              </h3>
              <p className="!text-[14px] md:!text-[16px] font-light leading-[1.25] !2xl:text-lg">
                {trait.description}
              </p>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-5 md:mt-10 flex flex-wrap justify-center gap-2 md:gap-5">
        <Button href="#calendar">{data.rahhal.follow}</Button>
        <Button href={data.register.href} tone="pink">
          {data.rahhal.register}
        </Button>
      </div>
    </section>
  );
}
