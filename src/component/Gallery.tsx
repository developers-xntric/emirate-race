"use client";

import SectionHeading from "./SectionHeading";
import AccordionGallery from "./AccordionGallery";
import { useHomeData } from "./LanguageProvider";

export default function Gallery() {
  const data = useHomeData();

  return (
    <section id="gallery" className="py-10 md:py-16">
      <div className="mx-auto w-[90%] 2xl:max-w-[1440px]">
        <SectionHeading eyebrow={data.gallery.eyebrow} title={data.gallery.title} />
        <div className="mt-3 md:mt-8">
          <AccordionGallery
            items={data.gallery.items}
            defaultIndex={2}
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
            autoplayDelay={1300}
          />
        </div>
      </div>
    </section>
  );
}