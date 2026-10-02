"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import AccordionGallery from "./AccordionGallery";
import { useHomeData } from "./LanguageProvider";

const DESKTOP_VISIBLE_IMAGES = 7;
type GalleryYear = "2025" | "2026";

export default function Gallery() {
  const data = useHomeData();
  const [galleryYear, setGalleryYear] = useState<GalleryYear>("2025");
  const [activeRace, setActiveRace] = useState(0);
  const [desktopStart, setDesktopStart] = useState(0);
  const [desktopSliderPosition, setDesktopSliderPosition] = useState(0.15);

  const race = data.gallery.races[activeRace];
  const comingSoonImage = (race as { comingSoonImage?: string })
    .comingSoonImage;
  const images =
    galleryYear === "2026"
      ? comingSoonImage
        ? race.images.map(() => comingSoonImage)
        : []
      : race.images;
  const maxDesktopStart = Math.max(images.length - DESKTOP_VISIBLE_IMAGES, 0);
  const visibleDesktopImages = images.slice(
    Math.min(desktopStart, maxDesktopStart),
    Math.min(desktopStart, maxDesktopStart) + DESKTOP_VISIBLE_IMAGES,
  );

  function selectYear(year: GalleryYear) {
    setGalleryYear(year);
    setDesktopStart(0);
    setDesktopSliderPosition(0);
  }

  function selectRace(index: number) {
    setActiveRace(index);
    setDesktopStart(0);
    setDesktopSliderPosition(0.15);
  }

  return (
    <section id="gallery" className="pt-10 pb-10 md:pt-10 md:pb-16">
      <div className="mx-auto w-[90%] 2xl:max-w-[1440px]">
        <SectionHeading
          eyebrow={data.gallery.eyebrow}
          title={data.gallery.title}
          centered
        />

        <div
          className="mt-6 flex justify-center md:mt-5"
          role="tablist"
          aria-label={`${data.gallery.title} year`}
        >
          <div className="inline-flex overflow-hidden rounded-full border border-[#072f4f] bg-white p-1 shadow-sm">
            <button
              type="button"
              role="tab"
              onClick={() => selectYear("2025")}
              aria-selected={galleryYear === "2025"}
              className={
                "min-w-16 md:min-w-20 rounded-full px-3 md:px-5 py-2 text-[12px] md:text-sm cursor-pointer font-bold uppercase transition-colors " +
                (galleryYear === "2025"
                  ? "bg-[#bb0054] text-white"
                  : "text-[#072f4f] hover:bg-[#072f4f]/10")
              }
            >
              {data.gallery.year2025}
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => selectYear("2026")}
              aria-selected={galleryYear === "2026"}
              className={
                "min-w-16 md:min-w-20 rounded-full px-3 md:px-5 py-2 cursor-pointer text-[12px] md:text-sm font-bold uppercase transition-colors " +
                (galleryYear === "2026"
                  ? "bg-[#bb0054] text-white"
                  : "text-[#072f4f] hover:bg-[#072f4f]/10")
              }
            >
              {data.gallery.year2026}
            </button>
          </div>
        </div>

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
              onClick={() => selectRace(index)}
              className={
                "shrink-0 rounded-[5px] px-4 py-2.5 cursor-pointer text-xs font-bold uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bb0054] md:px-5 md:text-sm " +
                (activeRace === index
                  ? "bg-[#bb0054] text-white"
                  : "bg-[#072f4f] text-white hover:bg-[#bb0054]")
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <div id="gallery-race-panel" role="tabpanel" className="mt-3 md:mt-8">
          {galleryYear === "2026" && images.length === 0 ? (
            <div className="flex h-[460px] items-center justify-center rounded-2xl bg-[#072f4f] px-6 text-center text-3xl font-bold uppercase tracking-[0.16em] text-white md:text-5xl">
              {data.gallery.comingSoon}
            </div>
          ) : (
            <>
              <AccordionGallery
                key={`${galleryYear}-${activeRace}-${desktopStart}`}
                items={visibleDesktopImages.map((image, index) => ({
                  image,
                  label:
                    race.label +
                    " " +
                    (index + 1 + Math.min(desktopStart, maxDesktopStart)),
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
                imageFit={galleryYear === "2026" ? "contain" : "cover"}
              />

              {images.length > DESKTOP_VISIBLE_IMAGES && (
                <div className="gallery-slider mx-auto mt-7 max-w-[720px]">
                  <div
                    className="gallery-slider__track"
                    style={
                      {
                        "--gallery-slider-progress": `${(desktopSliderPosition / maxDesktopStart) * 100}%`,
                      } as React.CSSProperties
                    }
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
                          const position = Math.min(
                            maxDesktopStart,
                            Math.max(0, current + (event.deltaY > 0 ? 1 : -1)),
                          );
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
