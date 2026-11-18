import fs from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";
import { cloudinaryEnabled } from "../src/payload/cloudinary";

const exportRoot = path.resolve(
  process.cwd(),
  ".migration",
  "sanity-export",
  "production-export-2026-11-09t09-39-05-930z",
);

const mimeType = (name: string) => {
  const extension = path.extname(name).toLowerCase();
  if (extension === ".webm") return "video/webm";
  if (extension === ".mp4" || extension === ".bin") return "video/mp4";
  if (extension === ".svg") return "image/svg+xml";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  return "image/jpeg";
};

type AssetMeta = { originalFilename?: string };
type MediaDoc = { id: number | string; sourceId?: string | null; cloudinaryPublicId?: string | null };

async function main() {
  if (!cloudinaryEnabled) throw new Error("Cloudinary configuration is missing; no assets were changed.");

  const payload = await getPayload({ config });
  const assets = JSON.parse(await fs.readFile(path.join(exportRoot, "assets.json"), "utf8")) as Record<string, AssetMeta>;
  const filesByFolder = new Map<string, string[]>();
  for (const folder of ["images", "files"]) {
    filesByFolder.set(folder, await fs.readdir(path.join(exportRoot, folder)));
  }

  const result = { total: 0, alreadyOnCloudinary: 0, uploaded: 0, skipped: 0, failed: [] as string[] };
  const records = await payload.find({ collection: "media", pagination: false, overrideAccess: true });
  const missing = records.docs.filter((doc) => !(doc as MediaDoc).cloudinaryPublicId) as unknown as MediaDoc[];
  result.total = missing.length;
  result.alreadyOnCloudinary = records.docs.length - missing.length;
  console.log(`Cloudinary backfill: ${result.total} pending, ${result.alreadyOnCloudinary} already complete.`);

  for (const [index, media] of missing.entries()) {
    const sourceId = media.sourceId;
    if (!sourceId) {
      result.skipped++;
      console.log(`[${index + 1}/${result.total}] skipped ${media.id}: no Sanity source asset.`);
      continue;
    }
    const folder = sourceId.startsWith("image-") ? "images" : sourceId.startsWith("file-") ? "files" : undefined;
    const hash = sourceId.replace(/^(image|file)-/, "");
    const filename = folder ? filesByFolder.get(folder)?.find((name) => name.startsWith(hash)) : undefined;
    if (!folder || !filename) {
      result.failed.push(`${media.id} (${sourceId}): exported source file not found`);
      console.error(`[${index + 1}/${result.total}] source file missing for ${sourceId}`);
      continue;
    }

    try {
      const fullPath = path.join(exportRoot, folder, filename);
      const stat = await fs.stat(fullPath);
      const meta = assets[sourceId];
      await payload.update({
        collection: "media",
        id: media.id,
        data: {},
        file: {
          data: Buffer.from(await fs.readFile(fullPath)),
          mimetype: mimeType(filename),
          name: meta?.originalFilename || filename,
          size: stat.size,
        },
        overrideAccess: true,
      });
      result.uploaded++;
      console.log(`[${index + 1}/${result.total}] uploaded ${filename}`);
    } catch (error) {
      const detail = error instanceof Error ? (error.stack || error.message) : JSON.stringify(error, Object.getOwnPropertyNames(error as object));
      const message = `${media.id} (${sourceId}): ${detail}`;
      result.failed.push(message);
      console.error(`[${index + 1}/${result.total}] failed ${message}`);
    }
  }

  const reportPath = path.resolve(process.cwd(), ".migration", "reports", "cloudinary-backfill-report.json");
  await fs.writeFile(reportPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (result.failed.length) process.exitCode = 1;
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});