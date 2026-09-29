"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useHomeData, useLanguage } from "./LanguageProvider";

type CmsText = Record<string, string | undefined>;
type CmsFaq = {
  seo?: CmsText;
  hero?: CmsText & { image?: string };
  questions?: CmsText[];
};

const localized = (value: CmsText | undefined, field: string, language: "en" | "ar", fallback: string) =>
  value?.[`${field}${language === "en" ? "En" : "Ar"}`] || fallback;

export default function FaqPage() {
  const data = useHomeData();
  const { language } = useLanguage();
  const [cms, setCms] = useState<CmsFaq | null>(null);
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const fallbackQuestions = data.faq.columns.flat();

  useEffect(() => {
    fetch("/api/cms/faqs")
      .then((response) => (response.ok ? response.json() : null))
      .then(setCms)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const title = localized(cms?.seo, "title", language, "");
    const description = localized(cms?.seo, "description", language, "");
    if (title) window.document.title = title;
    if (description) document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [cms, language]);

  const questions = cms?.questions?.length
    ? cms.questions.map((item, index) => ({
        question: localized(item, "question", language, fallbackQuestions[index]?.question || ""),
        answer: localized(item, "answer", language, fallbackQuestions[index]?.answer || ""),
      }))
    : fallbackQuestions;
  const heroTitle = localized(cms?.hero, "title", language, data.faq.title);
  const heroImage = cms?.hero?.image || "/races/hero.png";

  return (
    <>
      <main id="main-content" className="overflow-hidden">
        <section className="relative isolate m-2 flex min-h-[410px] flex-col overflow-hidden rounded-[10px] text-white md:min-h-[470px] lg:aspect-[1891.51/741.569] lg:min-h-0">
          <Image
            src={heroImage}
            alt="Runners taking part in the Emirates Villages Run Series"
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-black/55" />
          <Navbar homeHrefPrefix="/" />
          <div className="mx-auto mt-auto w-[90%] pb-8 pt-28 2xl:max-w-[1440px] md:pb-12">
            <h1 className="max-w-[960px] text-[clamp(32px,2.3vw,102px)] font-bold uppercase leading-[.98] md:text-[clamp(42px,4.3vw,102px)]">
              {heroTitle}
            </h1>
          </div>
        </section>

        <section className="bg-[#f8f8f8] pb-10 pt-4 lg:pb-20 lg:pt-20">
          <div className="mx-auto w-[90%] 2xl:max-w-[1040px]">
            <div className="mt-7 space-y-3">
              {questions.map((item, index) => {
                const isOpen = openQuestion === index;
                return (
                  <article key={`${item.question}-${index}`} className="overflow-hidden rounded-[10px] border border-[#bb0054] bg-white">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenQuestion(isOpen ? null : index)}
                      className="flex w-full cursor-pointer items-center justify-between gap-5 px-5 py-5 text-start text-[14px] font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#072f4f] md:min-h-[82px] md:px-7 md:text-lg"
                    >
                      <span>{item.question}</span>
                      <span aria-hidden="true" className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-[#bb0054] pt-1.5 text-3xl font-normal leading-none text-white transition-transform duration-200 md:size-10 md:pt-2 md:text-4xl rtl:pb-3 ${isOpen ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <p className="px-5 pb-6 text-sm text-[#171717] md:px-7 md:pb-7 md:text-lg md:leading-relaxed">
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
