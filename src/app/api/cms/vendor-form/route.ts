import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
export async function GET() {
  const content = await sanityClient.fetch(`*[_type == "vendorFormPage" && _id == "vendor-form-2026"][0]{seo,"logo":logo.asset->url,translations[]{key,label,valueEn,valueAr}}`);
  return NextResponse.json(content ?? null, { headers: { "Cache-Control": "no-store" } });
}