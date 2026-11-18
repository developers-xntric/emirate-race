import { NextRequest, NextResponse } from "next/server";
import { cmsBySourceId } from "@/lib/payload/cms";
import { isValidPreview } from "@/lib/preview";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const preview = isValidPreview("/faqs", request.nextUrl.searchParams.get("preview"));
  return NextResponse.json(await cmsBySourceId("faqs", preview), { headers: { "Cache-Control": "no-store, max-age=0" } });
}