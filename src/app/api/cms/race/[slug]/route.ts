import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const race = await sanityClient.fetch(`*[_type == "racePage" && slug == $slug][0]{pageName,slug,sections[]{sectionName,eyebrowEn,eyebrowAr,titleEn,titleAr,paragraphEn,paragraphAr,raceDayInformationEn,raceDayInformationAr,dateLabelEn,dateLabelAr,dateValueEn,dateValueAr,arrivalTimeLabelEn,arrivalTimeLabelAr,arrivalTimeValueEn,arrivalTimeValueAr,raceStartLabelEn,raceStartLabelAr,raceStartValueEn,raceStartValueAr,ctaEn,ctaAr,ctaHref,"image": image.asset->url,items[]{itemName,titleEn,titleAr,paragraphEn,paragraphAr,ctaEn,ctaAr,ctaHref,"image": image.asset->url,"images": images[].asset->url},"images": images[].asset->url}}`, { slug });
  return NextResponse.json(race ?? null, { headers: { "Cache-Control": "no-store" } });
}
