import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { previewSignature } from "@/lib/preview";

const validPath = (value: string | null) => Boolean(value && value.startsWith("/") && !value.startsWith("//"));

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const secret = request.nextUrl.searchParams.get("secret");
  if (!validPath(path) || !secret || secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid preview request" }, { status: 401 });
  }

  // Draft mode is browser-wide. Disable it so a normal site tab can never
  // inherit an editor's unpublished content; the signed URL scopes preview.
  (await draftMode()).disable();
  const destination = new URL(path!, process.env.NEXT_PUBLIC_SERVER_URL || request.url);
  destination.searchParams.set("preview", previewSignature(path!));
  return NextResponse.redirect(destination);
}