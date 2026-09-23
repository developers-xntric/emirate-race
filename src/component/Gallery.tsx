"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import AccordionGallery from "./AccordionGallery";
import { useHomeData } from "./LanguageProvider";

const DESKTOP_VISIBLE_IMAGES = 7;

export default function Gallery() {
  const data = useHomeData();
  const [activeRace, setActiveRace] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [desktopStart, setDesktopStart] = useState(0);
  const [desktopSliderPosition, setDesktopSliderPosition] = useState(0.15);
  const race = data.gallery.races[activeRace];
  const maxDesktopStart = Math.max(race.images.length - DESKTOP_VISIBLE_IMAGES, 0);
  const visibleDesktopImages = race.images.slice(
    Math.min(desktopStart, maxDesktopStart),
    Math.min(desktopStart, maxDesktopStart) + DESKTOP_VISIBLE_IMAGES,
  );

  useEffect(() => {
    if (race.images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % race.images.length);
    }, 1500);

    return () => window.clearInterval(timer);
  }, [race.images.length, activeRace]);

  return (
    <section id="gallery" className="pt-10 pb-10 md:pt-10 md:pb-16">
      <div className="mx-auto w-[90%] 2xl:max-w-[1440px]">
        <SectionHeading eyebrow={data.gallery.eyebrow} title={data.gallery.title} centered />

        <div
          className="mt-6 flex gap-2 overflow-x-auto px-1 pb-3 md:mt-5 md:justify-center md:overflow-visible md:pb-0"
          role="tablist"
          aria-label={data.gallery.title}
        >
          {data.gallery.races.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={activeRace === index}
              aria-controls="gallery-race-panel"
              onClick={() => {
                setActiveRace(index);
                setActiveImage(0);
                setDesktopStart(0);
                setDesktopSliderPosition(0.15);
              }}
              className={"shrink-0 rounded-[5px] px-4 py-2.5 text-xs font-bold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0054] md:px-5 md:text-sm " + (activeRace === index ? "bg-[#bb0054] text-white" : "bg-[#072f4f] text-white hover:bg-[#bb0054]")}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div id="gallery-race-panel" role="tabpanel" className="mt-3 md:mt-8">
          <div className="hidden md:block">
            <AccordionGallery
              key={desktopStart}
              items={visibleDesktopImages.map((image, index) => ({
                image,
                label: race.label + " " + (index + 1 + Math.min(desktopStart, maxDesktopStart)),
                link: race.link,
              }))}
              defaultIndex={0}
              expandRatio={0.52}
              trigger="hover"
              accentColor="#bb0054"
              overlayColor="#072f4f"
              textColor="#ffffff"
              grayscale
              showLabels={false}
              duration={0.6}
              ease="power3.out"
              parallax={0.5}
              tilt={8}
              stagger={0.06}
              height={460}
              gap={10}
              radius={16}
              orientation="horizontal"
              autoplay
              autoplayDelay={1500}
            />

            {race.images.length > DESKTOP_VISIBLE_IMAGES && (
              <div className="gallery-slider mx-auto mt-7 max-w-[720px]">
                <div
                  className="gallery-slider__track"
                  style={{
                    "--gallery-slider-progress": `${(desktopSliderPosition / maxDesktopStart) * 100}%`,
                  } as React.CSSProperties}
                >
                  <span className="gallery-slider__knob" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="m14.5 6.5 5 5.5-5 5.5M9.5 6.5l-5 5.5 5 5.5" />
                    </svg>
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={maxDesktopStart}
                    step={0.01}
                    value={desktopSliderPosition}
                    onChange={(event) => {
                      const position = Number(event.target.value);
                      setDesktopSliderPosition(position);
                      setDesktopStart(Math.round(position));
                    }}
                    onWheel={(event) => {
                      event.preventDefault();
                      setDesktopSliderPosition((current) => {
                        const position = Math.min(maxDesktopStart, Math.max(0, current + (event.deltaY > 0 ? 1 : -1)));
                        setDesktopStart(Math.round(position));
                        return position;
                      });
                    }}
                    aria-label={race.label + " gallery image navigation"}
                    className="gallery-image-slider"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <div className="relative aspect-[3.5/3] overflow-hidden rounded-[10px] bg-[#072f4f]">
              {race.images.map((image, index) => (
                <Image
                key={image + index}
                  src={image}
                  alt={race.label + " gallery image " + (index + 1)}
                  fill
                  sizes="90vw"
                  className="object-cover transition-opacity duration-500"
                  style={{ opacity: activeImage === index ? 1 : 0 }}
                  priority={index === 0}
                />
              ))}
              <a
                href={race.link}
                className="absolute inset-x-2 bottom-2 rounded-[5px] bg-[#072f4f]/85 px-4 py-3 text-center text-sm font-bold uppercase text-white backdrop-blur-sm"
              >
                {race.label}
              </a>
            </div>

            <div className="mt-4 flex justify-center gap-2" aria-label={race.label + " gallery slides"}>
              {race.images.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  aria-label={"Show " + race.label + " image " + (index + 1)}
                  aria-current={activeImage === index}
                  onClick={() => setActiveImage(index)}
                  className={"size-2.5 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0054] " + (activeImage === index ? "bg-[#bb0054]" : "bg-[#072f4f]/30")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
