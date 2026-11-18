import { NextRequest, NextResponse } from "next/server";
import { migrateSanityBackup } from "../../../../../scripts/migrate-sanity-to-payload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (request.headers.get("x-payload-migration-key") !== process.env.PAYLOAD_MIGRATION_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const report = await migrateSanityBackup();
  return NextResponse.json(report, { status: report.failed.length || report.unresolvedReferences.length ? 207 : 200 });
}