import { NextRequest, NextResponse } from "next/server";
import { cmsBySourceId } from "@/lib/payload/cms";
import { isValidPreview } from "@/lib/preview";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "";
  const preview = isValidPreview(path, request.nextUrl.searchParams.get("preview"));
  const [navbar, home, footer] = await Promise.all([
    cmsBySourceId("navbar", preview),
    cmsBySourceId("home", preview),
    cmsBySourceId("footer", preview),
  ]);
  return NextResponse.json({ navbar, home, footer }, { headers: { "Cache-Control": "no-store" } });
}