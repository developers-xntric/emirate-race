import { getPayload } from "payload";
import config from "../payload.config";

type ContentEntry = {
  id?: string;
  path?: string;
  label?: string;
  media?: unknown;
  mediaList?: unknown[];
  [key: string]: unknown;
};

type ContentSection = { fields?: ContentEntry[]; [key: string]: unknown };
type SourceAsset = { _payloadMediaSourceId?: unknown };
type GalleryItem = { images?: SourceAsset[]; images2026?: SourceAsset[] };
type HomeContent = { gallery?: { items?: GalleryItem[] } };

const imagePath = /^(gallery\.items\[\d+\])\.(images|images2026)\[\d+\]$/;
const annualGalleryPath = /^(gallery\.items\[\d+\])\.(images|images2026)$/;

const uniqueMediaList = (media: unknown[] = []) => {
  const keys = new Set<string>();
  return media.filter((item) => {
    const value = item && typeof item === "object" ? item as { id?: unknown; value?: unknown } : undefined;
    const key = value?.id !== undefined ? `id:${String(value.id)}` : value?.value !== undefined ? `value:${String(value.value)}` : `${typeof item}:${String(item)}`;
    if (keys.has(key)) return false;
    keys.add(key);
    return true;
  });
};
const galleryLabel = (field: "images" | "images2026") =>
  field === "images2026" ? "2026 gallery images" : "2025 gallery images";

function collapseGalleryImageRows(fields: ContentEntry[] = [], raceCount = 0) {
  const groups = new Map<string, { path: string; label: string; mediaList: unknown[] }>();
  for (const field of fields) {
    const match = field.path?.match(imagePath);
    if (!match || !field.media) continue;
    const path = `${match[1]}.${match[2]}`;
    const existing = groups.get(path) || { path, label: galleryLabel(match[2] as "images" | "images2026"), mediaList: [] };
    existing.mediaList = uniqueMediaList([...existing.mediaList, field.media]);
    groups.set(path, existing);
  }

  // Keep existing media lists and create both year controls for every race,
  // including an intentionally empty 2026 list ready for new uploads.
  for (const field of fields) {
    const match = field.path?.match(annualGalleryPath);
    if (!match || !Array.isArray(field.mediaList) || field.mediaList.length === 0) continue;
    groups.set(field.path!, { path: field.path!, label: galleryLabel(match[2] as "images" | "images2026"), mediaList: uniqueMediaList(field.mediaList) });
  }
  for (let index = 0; index < raceCount; index += 1) {
    for (const field of ["images", "images2026"] as const) {
      const path = `gallery.items[${index}].${field}`;
      if (!groups.has(path)) groups.set(path, { path, label: galleryLabel(field), mediaList: [] });
    }
  }

  const emitted = new Set<string>();
  const collapsed = fields.flatMap((field) => {
    const indexed = field.path?.match(imagePath);
    const annual = field.path?.match(annualGalleryPath);
    const path = indexed ? `${indexed[1]}.${indexed[2]}` : annual ? field.path! : undefined;
    if (!path) return [field];
    const replacement = groups.get(path);
    if (!replacement || emitted.has(path)) return [];
    emitted.add(path);
    return [{ ...replacement }];
  });

  for (const [path, field] of groups) {
    if (!emitted.has(path)) collapsed.push(field);
  }
  return collapsed;
}

const sourceIdFromAsset = (asset: SourceAsset) =>
  typeof asset?._payloadMediaSourceId === "string" ? asset._payloadMediaSourceId : undefined;

function sourceIdsInGallery(content?: HomeContent) {
  return [...new Set((content?.gallery?.items || []).flatMap((item) =>
    [...(item.images || []), ...(item.images2026 || [])]
      .map(sourceIdFromAsset)
      .filter((sourceId): sourceId is string => Boolean(sourceId)),
  ))];
}

function populateMediaListsFromContent(fields: ContentEntry[], content: HomeContent | undefined, mediaIds: Map<string, number | string>) {
  const items = content?.gallery?.items || [];
  return fields.map((field) => {
    const match = field.path?.match(annualGalleryPath);
    if (!match || (Array.isArray(field.mediaList) && field.mediaList.length > 0)) return field;
    const index = Number(match[1].match(/\[(\d+)\]/)?.[1]);
    const images = match[2] === "images2026" ? items[index]?.images2026 : items[index]?.images;
    const mediaList = (images || []).map(sourceIdFromAsset).flatMap((sourceId) => {
      const id = sourceId ? mediaIds.get(sourceId) : undefined;
      return id === undefined ? [] : [id];
    });
    return { ...field, mediaList: uniqueMediaList(mediaList) };
  });
}
async function run() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "cms-documents",
    where: { sourceId: { equals: "home" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    context: { skipCmsEditorFieldOrdering: true },
  });
  const document = result.docs[0];
  if (!document) throw new Error("The Home CMS document was not found.");

  const content = document.content as HomeContent | undefined;
  const raceCount = content?.gallery?.items?.length || 0;
  const sourceIds = sourceIdsInGallery(content);
  const mediaResult = sourceIds.length
    ? await payload.find({ collection: "media", where: { sourceId: { in: sourceIds } }, limit: sourceIds.length, depth: 0, overrideAccess: true })
    : { docs: [] };
  const mediaIds = new Map(mediaResult.docs.map((media) => [String(media.sourceId), media.id]));
  const unresolved = sourceIds.filter((sourceId) => !mediaIds.has(sourceId));

  const contentFields = populateMediaListsFromContent(
    collapseGalleryImageRows((document.contentFields || []) as ContentEntry[], raceCount),
    content,
    mediaIds,
  );
  const contentSections = ((document.contentSections || []) as ContentSection[]).map((section) => ({
    ...section,
    fields: populateMediaListsFromContent(collapseGalleryImageRows(section.fields || [], raceCount), content, mediaIds),
  }));

  await payload.update({
    collection: "cms-documents",
    id: document.id,
    data: { contentFields, contentSections },
    overrideAccess: true,
    context: { skipCmsEditorFieldOrdering: true },
  });
  console.log(`Created gallery media arrays for ${raceCount} Home races using ${mediaIds.size} existing Payload Media item(s).${unresolved.length ? ` ${unresolved.length} source asset(s) were not found in Media.` : ""}`);
}

// Payload's database pool is intentionally unref'ed. Keep this CLI process alive
// until the read and update complete; otherwise Node can exit after config loading.
const keepProcessAlive = setInterval(() => undefined, 1_000);
void run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => clearInterval(keepProcessAlive));