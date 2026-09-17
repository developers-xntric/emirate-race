"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useHomeData } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";
export default function FAQs() {
  const data = useHomeData();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mobileQuery.matches);

    updateViewport();
    mobileQuery.addEventListener("change", updateViewport);
    return () => mobileQuery.removeEventListener("change", updateViewport);
  }, []);
  return (
    <section id="faqs" className="bg-[#f8f8f8] pt-8 md:pt-20">
      <div className="mx-auto w-[90%] 2xl:max-w-[1440px]">
        <SectionHeading
          eyebrow={data.faq.eyebrow}
          title={data.faq.title}
          centered
        />
        <div className="mt-5 md:mt-10 grid gap-[8px] md:grid-cols-2 md:gap-[30px]">
          {data.faq.columns.map((column, index) => (
            <div key={index} className="space-y-2 md:space-y-5">
              {column.map((item, itemIndex) => (
                <details
                  key={item.question}
                  open={isMobile === false && index === 0 && itemIndex === 0}
                  id={
                    index === 1 && itemIndex === 2
                      ? "prize-answer"
                      : undefined
                  }
                  className="group scroll-mt-8 rounded-[10px] border border-[#bb0054] md:open:min-h-[168px] open:bg-white"
                >
                  <summary className="flex md:min-h-[74px] cursor-pointer list-none items-center justify-between gap-4 px-3 md:px-5 py-4 text-[13px] md:text-base leading-tight font-bold uppercase focus-visible:outline-2 focus-visible:outline-[#072f4f] 2xl:text-lg [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <Image
                      src={data.assets.plus}
                      alt=""
                      width={17}
                      height={17}
                      className="size-[12px] md:size-[17px] shrink-0 transition-transform group-open:rotate-45"
                    />
                  </summary>
                  {item.answer && (
                    <p className="px-3 md:px-5 pb-5 !text-[12px] leading-snug text-[#171717] md:!text-base 2xl:!text-lg">
                      {item.answer}
                    </p>
                  )}
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
