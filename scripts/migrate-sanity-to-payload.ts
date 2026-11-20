import fs from "node:fs/promises";
import path from "node:path";
import { getPayload } from "payload";
import config from "../payload.config";
import { cloudinaryEnabled } from "../src/payload/cloudinary";

type Report = {
  documentsExported: number; documentsImported: number; mediaImported: number; mediaCloudinarySynced: number; videosAndFiles: number;
  assetReferences: number; resolvedMediaReferences: number;
  failed: string[]; unresolvedReferences: string[];
};

const root = path.resolve(process.cwd(), ".migration", "sanity-export", "production-export-2026-11-09t09-39-05-930z");
const pages = new Set(["navbar", "footer", "homePage", "aboutPage", "contactPage", "faqPage", "partnerLandingPage", "vendorFormPage", "racePage"]);
const leads = new Set(["contactLead", "pressKitLead", "vendorLead", "corporatePartnerLead", "communityPartnerLead"]);
const ignored = new Set(["_createdAt", "_updatedAt", "_rev", "_system", "_type", "_id"]);
const mime = (name: string) => name.endsWith(".webm") ? "video/webm" : name.endsWith(".mp4") || name.endsWith(".bin") ? "video/mp4" : name.endsWith(".svg") ? "image/svg+xml" : name.endsWith(".png") ? "image/png" : name.endsWith(".webp") ? "image/webp" : "image/jpeg";
const assetID = (ref: string) => {
  const type = ref.includes("/images/") ? "image" : ref.includes("/files/") ? "file" : "";
  // Images are exported as `<hash>-dimensions.ext`, while videos are exported
  // as either `<hash>.webm` or `file-<hash>-mp4.bin`. Extract the asset hash
  // instead of splitting on the first dash so both forms resolve correctly.
  const hash = ref.match(/(?:image-|file-)?([a-f0-9]{40})(?:[-.]|$)/i)?.[1];
  return type && hash ? `${type}-${hash}` : null;
};
const label = (pathValue: string) => pathValue.replace(/\[\d+\]/g, "").split(".").pop()?.replace(/([A-Z])/g, " $1").replace(/^./, (value) => value.toUpperCase()) || pathValue;
const unique = <T>(values: T[]) => [...new Set(values)];

function editableFields(value: unknown, pathValue = "", fields: Record<string, unknown>[] = []): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    // A gallery is one editor-controlled media list, not a collection of
    // technical images[0], images[1], ... fields. This also covers video
    // galleries and keeps the original source order.
    const mediaSourceIds = value.map((entry) => {
      if (!entry || typeof entry !== "object") return undefined;
      const reference = (entry as Record<string, unknown>)._sanityAsset;
      return typeof reference === "string" ? assetID(reference) || undefined : undefined;
    });
    if (mediaSourceIds.length > 0 && mediaSourceIds.every(Boolean)) {
      fields.push({ path: pathValue, label: label(pathValue), mediaSourceIds });
      return fields;
    }
    value.forEach((entry, index) => editableFields(entry, pathValue + "[" + index + "]", fields));
    return fields;
  }
  if (!value || typeof value !== "object") return fields;
  const object = value as Record<string, unknown>;
  for (const [key, child] of Object.entries(object)) {
    if (ignored.has(key) || key.startsWith("_") || key.endsWith("Ar")) continue;
    const currentPath = pathValue ? pathValue + "." + key : key;
    if (key.endsWith("En") && typeof child === "string") {
      const baseKey = key.slice(0, -2);
      const arabic = object[baseKey + "Ar"];
      fields.push({ path: pathValue ? pathValue + "." + baseKey : baseKey, label: label(baseKey), english: child, arabic: typeof arabic === "string" ? arabic : undefined });
      continue;
    }
    if (child && typeof child === "object" && !Array.isArray(child) && typeof (child as Record<string, unknown>)._sanityAsset === "string") {
      fields.push({ path: currentPath, label: label(key), mediaSourceId: assetID((child as Record<string, string>)._sanityAsset) || undefined });
      continue;
    }
    if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
      fields.push({ path: currentPath, label: label(key), value: String(child) });
      continue;
    }
    editableFields(child, currentPath, fields);
  }
  return fields;
}

function rewriteAssets(value: unknown, report: Report): unknown {
  if (Array.isArray(value)) return value.map((entry) => rewriteAssets(entry, report));
  if (!value || typeof value !== "object") return value;
  const object = value as Record<string, unknown>;
  if (typeof object._sanityAsset === "string") {
    report.assetReferences++;
    const id = assetID(object._sanityAsset);
    if (!id) report.unresolvedReferences.push(object._sanityAsset);
    return id ? { _payloadMediaSourceId: id } : value;
  }
  return Object.fromEntries(Object.entries(object).filter(([key]) => !ignored.has(key)).map(([key, child]) => [key, rewriteAssets(child, report)]));
}

export async function migrateSanityBackup(): Promise<Report> {
  const report: Report = { documentsExported: 0, documentsImported: 0, mediaImported: 0, mediaCloudinarySynced: 0, videosAndFiles: 0, assetReferences: 0, resolvedMediaReferences: 0, failed: [], unresolvedReferences: [] };
  const payload = await getPayload({ config });
  const assets = JSON.parse(await fs.readFile(path.join(root, "assets.json"), "utf8")) as Record<string, { originalFilename?: string }>;
  const filesByFolder = new Map<string, string[]>();
  for (const folder of ["images", "files"]) filesByFolder.set(folder, await fs.readdir(path.join(root, folder)));

  for (const [sourceId, meta] of Object.entries(assets)) {
    const folder = sourceId.startsWith("image-") ? "images" : "files";
    const hash = sourceId.replace(/^image-/, "").replace(/^file-/, "");
    const filename = filesByFolder.get(folder)?.find((name) => name.startsWith(hash));
    if (!filename) { report.failed.push("Missing asset " + sourceId); continue; }
    const existing = await payload.find({ collection: "media", where: { sourceId: { equals: sourceId } }, limit: 1, overrideAccess: true });
    try {
      const fullPath = path.join(root, folder, filename);
      const stat = await fs.stat(fullPath);
      const file = { data: Buffer.from(await fs.readFile(fullPath)), mimetype: mime(filename), name: meta.originalFilename || filename, size: stat.size };
      const existingMedia = existing.docs[0] as { id: string; cloudinaryPublicId?: string } | undefined;
      if (existingMedia) {
        if (cloudinaryEnabled && !existingMedia.cloudinaryPublicId) {
          await payload.update({ collection: "media", id: existingMedia.id, data: {}, file, overrideAccess: true });
          report.mediaCloudinarySynced++;
        }
        continue;
      }
      await payload.create({
        collection: "media", overrideAccess: true,
        data: { sourceId, originalFilename: meta.originalFilename || filename, altEn: meta.originalFilename || filename, altAr: meta.originalFilename || filename },
        file,
      });
      report.mediaImported++;
      if (folder === "files") report.videosAndFiles++;
    } catch (error) { report.failed.push("Asset " + sourceId + ": " + String(error)); }
  }

  const media = await payload.find({ collection: "media", pagination: false, overrideAccess: true });
  const mediaIds = new Map(media.docs.map((item) => [item.sourceId, item.id]));
  for (const line of (await fs.readFile(path.join(root, "data.ndjson"), "utf8")).split(/\r?\n/)) {
    if (!line) continue;
    const source = JSON.parse(line) as Record<string, unknown>;
    if (typeof source._id !== "string" || source._id.startsWith("drafts.")) continue;
    report.documentsExported++;
    const documentType = source._type;
    const collection = pages.has(String(documentType)) ? "cms-documents" : leads.has(String(documentType)) ? "submissions" : undefined;
    if (!collection) continue;
    try {
      const sourceData = rewriteAssets(source, report);
      const found = await payload.find({ collection: collection as "cms-documents" | "submissions", where: { sourceId: { equals: source._id } }, limit: 1, overrideAccess: true });
      const fields = collection === "cms-documents" ? editableFields(source) : [];
      const referencedMediaSourceIds = unique(fields.flatMap((field) => [
        field.mediaSourceId,
        ...(Array.isArray(field.mediaSourceIds) ? field.mediaSourceIds : []),
      ]).filter((sourceId): sourceId is string => typeof sourceId === "string"));
      for (const sourceId of referencedMediaSourceIds) {
        if (!mediaIds.has(sourceId)) report.unresolvedReferences.push(`Missing Payload media for ${sourceId} used by ${source._id}`);
      }
      report.resolvedMediaReferences += referencedMediaSourceIds.filter((sourceId) => mediaIds.has(sourceId)).length;
      const data = collection === "cms-documents"
        ? {
            adminTitle: String(source.pageName || source.sectionName || source._type),
            sourceId: source._id, documentType: source._type, slug: source.slug, pageName: source.pageName, seo: source.seo,
            content: sourceData,
            contentSections: [],
            contentFields: fields.map((field) => {
              const sourceId = field.mediaSourceId as string | undefined;
              const sourceIds = Array.isArray(field.mediaSourceIds)
                ? field.mediaSourceIds.filter((item): item is string => typeof item === "string")
                : [];
              if (sourceIds.length) {
                return { path: field.path, label: field.label, mediaList: sourceIds.map((item) => mediaIds.get(item)).filter(Boolean) };
              }
              return sourceId ? { path: field.path, label: field.label, media: mediaIds.get(sourceId) } : field;
            }),
          }
        : { sourceId: source._id, submissionType: source._type, submission: sourceData };
      if (found.docs[0]) await payload.update({ collection: collection as "cms-documents" | "submissions", id: found.docs[0].id, data, overrideAccess: true });
      else await payload.create({ collection: collection as "cms-documents" | "submissions", data, overrideAccess: true });
      report.documentsImported++;
    } catch (error) { report.failed.push("Document " + source._id + ": " + String(error)); }
  }
  await fs.mkdir(path.resolve(process.cwd(), ".migration", "reports"), { recursive: true });
  report.unresolvedReferences = unique(report.unresolvedReferences);
  await fs.writeFile(path.resolve(process.cwd(), ".migration", "reports", "payload-import-report.json"), JSON.stringify(report, null, 2));
  return report;
}

if (process.argv[1]?.includes("migrate-sanity-to-payload")) {
  migrateSanityBackup().then((report) => console.log(JSON.stringify(report, null, 2))).catch((error) => { console.error(error); process.exitCode = 1; });
}
