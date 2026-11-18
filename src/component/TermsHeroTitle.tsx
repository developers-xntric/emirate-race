"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/component/LanguageProvider";
import { previewQuery } from "@/lib/payload/preview-client";
import { usePayloadCmsPreview } from "@/component/usePayloadCmsPreview";

type TermsContent = { titleEn?: string; titleAr?: string };

export default function TermsHeroTitle({ fallbackTitle }: { fallbackTitle: string }) {
  const { language } = useLanguage();
  const [cms, setCms] = useState<TermsContent | null>(null);
  usePayloadCmsPreview((sourceId, content) => { if (sourceId === "terms-and-conditions") setCms(content as TermsContent); });
  useEffect(() => { fetch("/api/cms/terms-and-conditions" + previewQuery(), { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then(setCms).catch(() => {}); }, []);
  const title = (language === "ar" ? cms?.titleAr : cms?.titleEn) || fallbackTitle;
  return <h1 className="text-4xl font-bold uppercase leading-[.98] md:text-6xl">{title}</h1>;
}