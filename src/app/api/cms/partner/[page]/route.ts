import { NextRequest, NextResponse } from "next/server";
import { cmsBySourceId } from "@/lib/payload/cms";
import { isValidPreview } from "@/lib/preview";
export const dynamic = "force-dynamic";
const pages: Record<string, { sourceId: string; path: string }> = {
  corporate: { sourceId: "evrs-corporate", path: "/evrs-corporate" },
  community: { sourceId: "evrs-community", path: "/evrs-community" },
};
export async function GET(request: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const target = pages[page];
  const preview = target ? isValidPreview(target.path, request.nextUrl.searchParams.get("preview")) : false;
  const content = target ? await cmsBySourceId(target.sourceId, preview) : null;
  return NextResponse.json(content, { status: content ? 200 : 404 });
}