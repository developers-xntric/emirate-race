import { getPayload } from "payload";
import config from "../../../payload.config";

type ContentField = {
  path?: string;
  english?: string | null;
  arabic?: string | null;
  value?: string | null;
  media?: unknown;
  mediaList?: unknown[];
};

type ContentSection = { fields?: ContentField[] };

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
const hasContent = (value: unknown) => Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== "";
const mediaUrl = (value: unknown) => {
  if (!value || typeof value !== "object") return undefined;
  const media = value as { url?: string; filename?: string };
  return media.url || (media.filename ? "/api/media/file/" + encodeURIComponent(media.filename) : undefined);
};
const tokens = (path: string) => path.split(".").flatMap((part) => {
  const result: (string | number)[] = [];
  part.replace(/([^\[\]]+)|\[(\d+)\]/g, (_match, key, index) => { result.push(index === undefined ? key : Number(index)); return ""; });
  return result;
});
const assign = (target: Record<string, unknown>, path: string, value: unknown) => {
  const parts = tokens(path);
  let current: Record<string | number, unknown> | unknown[] = target;
  for (let index = 0; index < parts.length - 1; index++) {
    const key = parts[index];
    const nextKey = parts[index + 1];
    if ((current as Record<string | number, unknown>)[key] === undefined) (current as Record<string | number, unknown>)[key] = typeof nextKey === "number" ? [] : {};
    current = (current as Record<string | number, unknown>)[key] as Record<string | number, unknown>;
  }
  (current as Record<string | number, unknown>)[parts.at(-1)!] = value;
};

const sourceMediaIDs = (value: unknown, ids = new Set<string>()) => {
  if (Array.isArray(value)) value.forEach((item) => sourceMediaIDs(item, ids));
  else if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (typeof object._payloadMediaSourceId === "string") ids.add(object._payloadMediaSourceId);
    Object.values(object).forEach((item) => sourceMediaIDs(item, ids));
  }
  return ids;
};
const resolveSourceMedia = (value: unknown, mediaBySourceID: Map<string, unknown>): unknown => {
  if (Array.isArray(value)) return value.map((item) => resolveSourceMedia(item, mediaBySourceID));
  if (!value || typeof value !== "object") return value;
  const object = value as Record<string, unknown>;
  if (typeof object._payloadMediaSourceId === "string") return mediaUrl(mediaBySourceID.get(object._payloadMediaSourceId)) || value;
  return Object.fromEntries(Object.entries(object).map(([key, item]) => [key, resolveSourceMedia(item, mediaBySourceID)]));
};
export async function cmsDocument(where: Record<string, unknown>, preview = false) {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: "cms-documents", where: where as never, limit: 1, depth: 2, overrideAccess: true, draft: preview });
  const document = result.docs[0] as unknown as { content?: Record<string, unknown>; contentFields?: ContentField[]; contentSections?: ContentSection[]; seo?: Record<string, unknown> };
  if (!document?.content) return null;
  let content = clone(document.content);
  // SEO is deliberately edited in its own top-level admin group instead of
  // appearing again in Page sections. Apply those values to the delivered
  // content so both published pages and draft requests use the one editor.
  if (document.seo) content.seo = { ...(content.seo as Record<string, unknown> | undefined), ...document.seo };
  const unresolvedMediaSourceIDs = [...sourceMediaIDs(content)];
  if (unresolvedMediaSourceIDs.length) {
    const media = await payload.find({ collection: "media", where: { sourceId: { in: unresolvedMediaSourceIDs } }, pagination: false, depth: 0, overrideAccess: true });
    content = resolveSourceMedia(content, new Map(media.docs.map((item) => [item.sourceId as string, item])) ) as Record<string, unknown>;
  }
  const sectionFields = document.contentSections?.flatMap((section) => section.fields || []) || [];
  for (const field of sectionFields.length ? sectionFields : document.contentFields || []) {
    if (!field.path) continue;
    if (hasContent(field.english) || hasContent(field.arabic)) {
      if (hasContent(field.english)) assign(content, field.path + "En", field.english);
      if (hasContent(field.arabic)) assign(content, field.path + "Ar", field.arabic);
    } else if (hasContent(field.media)) {
      const url = mediaUrl(field.media);
      if (url) assign(content, field.path, url);
    } else if (hasContent(field.mediaList)) {
      assign(content, field.path, (field.mediaList || []).map(mediaUrl).filter(Boolean));
    } else if (hasContent(field.value)) {
      assign(content, field.path, field.value);
    }
  }
  return content;
}

export const cmsBySourceId = (sourceId: string, preview = false) => cmsDocument({ sourceId: { equals: sourceId } }, preview);
export const cmsByType = (documentType: string, preview = false) => cmsDocument({ documentType: { equals: documentType } }, preview);
export const cmsRace = (slug: string, preview = false) => cmsDocument({ and: [{ documentType: { equals: "racePage" } }, { slug: { equals: slug } }] }, preview);