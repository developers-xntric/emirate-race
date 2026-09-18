"use client";

import Image from "next/image";
import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useHomeData } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";

export default function FaqPage() {
  const data = useHomeData();
  const [openQuestion, setOpenQuestion] = useState<string | null>(
    data.faq.columns[0][0]?.question ?? null,
  );
  const questions = data.faq.columns.flat();

  return (
    <>
      <main id="main-content" className="overflow-hidden">
        <section className="relative isolate m-2 flex min-h-[410px] flex-col overflow-hidden rounded-[10px] text-white md:min-h-[470px] lg:aspect-[1891.51/741.569] lg:min-h-0">
          <Image
            src="/races/hero.png"
            alt="Runners taking part in the Emirates Villages Run Series"
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-black/55" />
          <Navbar homeHrefPrefix="/" />
          <div className="mx-auto mt-auto w-[90%] pb-8 pt-28 2xl:max-w-[1440px] md:pb-12">
           
            <h1 className="max-w-[960px] text-[clamp(32px,2.3vw,102px)]  md:text-[clamp(42px,4.3vw,102px)] leading-[.98] font-bold uppercase">
              Frequently Asked Questions
            </h1>
           
          </div>
        </section>

        <section className="bg-[#f8f8f8] pb-10 pt-4 lg:pb-20 lg:pt-20">
          <div className="mx-auto w-[90%] 2xl:max-w-[1040px]">
            
            <div className="mt-7 space-y-3 ">
              {questions.map((item) => {
                const isOpen = openQuestion === item.question;
                return (
                  <article
                    key={item.question}
                    className="overflow-hidden rounded-[10px] border border-[#bb0054] bg-white"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenQuestion(isOpen ? null : item.question)
                      }
                      className="flex w-full items-center cursor-pointer justify-between gap-5 px-5 py-5 text-left text-[14px] font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#072f4f] md:min-h-[82px] md:px-7 md:text-lg"
                    >
                      <span>{item.question}</span>
                      <span
                        aria-hidden="true"
                        className={`flex size-8 md:size-10 shrink-0 pt-1.5 md:pt-2 items-center justify-center rounded-full bg-[#bb0054] text-3xl md:text-4xl font-normal leading-none text-white transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 text-sm md:leading-relaxed text-[#171717] md:px-7 md:pb-7 md:text-lg">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer homeHrefPrefix="/" />
    </>
  );
}
