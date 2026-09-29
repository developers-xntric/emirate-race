import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
export async function GET() {
  const contact = await sanityClient.fetch(`*[_type == "contactPage" && _id == "contact"][0]{seo{titleEn,titleAr,descriptionEn,descriptionAr},hero{titleEn,titleAr,"image":image.asset->url},contactDetails{labelEn,labelAr,titleEn,titleAr,email,emailHref,"image":image.asset->url},form}`);
  return NextResponse.json(contact ?? null, { headers: { "Cache-Control": "no-store" } });
}
