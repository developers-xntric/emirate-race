"use client";

import { useEffect, useState } from "react";
import { previewQuery } from "@/lib/payload/preview-client";
import { usePayloadCmsPreview } from "@/component/usePayloadCmsPreview";
import { useLanguage } from "@/component/LanguageProvider";

type TermsContent = { titleEn?: string; titleAr?: string; rulesEn?: string; rulesAr?: string };
const sectionTitles = new Set(["The competition", "Objective", "Competition period"]);
const heading = /^(?:1\. Eligibility|2\. How to enter|3\. Prizes|4\. How the winner is selected|5\. Announcement|6\. Prize collection|7\. General conditions|8\. Organizer|9\. Odds of winning|10\. Prize substitution|11\. Image rights & publicity|12\. Right to cancel or modify|13\. Liability|14\. Data & privacy|15\. Integrity of the selection process)/;

function Rules({ rules }: { rules: string }) {
  return <div className="rounded-[10px] bg-white p-6 text-[15px] leading-relaxed text-[#171717] shadow-sm md:p-10 md:text-base">
    {rules.split("\n").map((line, index) => {
      if (line.startsWith("EVRS 2026")) return <h2 key={index} className="mt-12 first:mt-0 text-xl font-bold leading-tight text-[#0b2d4d] md:text-[25px]">{line}</h2>;
      if (sectionTitles.has(line) || heading.test(line)) return <h3 key={index} className="mt-8 text-xl font-bold leading-tight text-[#0b2d4d] md:text-3xl">{line}</h3>;
      if (!line) return <div key={index} className="h-4" aria-hidden="true" />;
      return <p key={index}>{line}</p>;
    })}
  </div>;
}

export default function TermsRulesContent({ fallbackRules }: { fallbackRules: string }) {
  const { language } = useLanguage();
  const [cms, setCms] = useState<TermsContent | null>(null);
  usePayloadCmsPreview((sourceId, content) => { if (sourceId === "terms-and-conditions") setCms(content as TermsContent); });
  useEffect(() => { fetch("/api/cms/terms-and-conditions" + previewQuery(), { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then(setCms).catch(() => {}); }, []);
  return <Rules rules={(language === "ar" ? cms?.rulesAr : cms?.rulesEn) || fallbackRules} />;
}