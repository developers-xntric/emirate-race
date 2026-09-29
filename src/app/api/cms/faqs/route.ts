import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";

export async function GET() {
  const faq = await sanityClient.fetch(`*[_type == "faqPage" && _id == "faqs"][0]{seo{titleEn,titleAr,descriptionEn,descriptionAr},hero{titleEn,titleAr,"image":image.asset->url},questions[]{questionEn,questionAr,answerEn,answerAr}}`);
  return NextResponse.json(faq ?? null, { headers: { "Cache-Control": "no-store" } });
}
