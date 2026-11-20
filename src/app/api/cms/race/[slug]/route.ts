import { NextRequest, NextResponse } from "next/server";
import { cmsRace } from "@/lib/payload/cms";
import { isValidPreview } from "@/lib/preview";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const preview = isValidPreview(`/races/${slug}`, request.nextUrl.searchParams.get("preview"));
  return NextResponse.json(await cmsRace(slug, preview), { headers: { "Cache-Control": "no-store, max-age=0" } });
}