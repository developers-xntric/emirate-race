"use client";

import { useEffect, useRef } from "react";

type RecordValue = Record<string, unknown>;
type Field = { path?: string; english?: unknown; arabic?: unknown; value?: unknown; media?: unknown; mediaList?: unknown[] };
type Section = { fields?: Field[] };
type PayloadMessage = { collectionSlug?: string; data?: RecordValue; type?: string };

const hasContent = (value: unknown) => Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== "";
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const mediaUrl = (value: unknown) => {
  if (!value || typeof value !== "object") return undefined;
  const media = value as { url?: string; filename?: string };
  return media.url || (media.filename ? `/api/media/file/${encodeURIComponent(media.filename)}` : undefined);
};
const mediaID = (value: unknown) => {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return undefined;
  const media = value as { id?: unknown; value?: unknown };
  return typeof media.id === "string" || typeof media.id === "number"
    ? String(media.id)
    : typeof media.value === "string" || typeof media.value === "number"
      ? String(media.value)
      : undefined;
};

const resolveMedia = async (value: unknown, cache: Map<string, Promise<unknown>>) => {
  if (mediaUrl(value)) return value;
  const id = mediaID(value);
  if (!id) return value;
  let request = cache.get(id);
  if (!request) {
    request = fetch(`/api/media/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : value)
      .catch(() => value);
    cache.set(id, request);
  }
  return request;
};

const resolveSelectedMedia = async (document: RecordValue, cache: Map<string, Promise<unknown>>) => {
  const resolved = clone(document);
  const sections = Array.isArray(resolved.contentSections) ? resolved.contentSections as Section[] : [];
  const fields = sections.flatMap((section) => section.fields || []).length
    ? sections.flatMap((section) => section.fields || [])
    : Array.isArray(resolved.contentFields) ? resolved.contentFields as Field[] : [];
  await Promise.all(fields.map(async (field) => {
    if (field.media) field.media = await resolveMedia(field.media, cache);
    if (field.mediaList?.length) field.mediaList = await Promise.all(field.mediaList.map((media) => resolveMedia(media, cache)));
  }));
  return resolved;
};
const tokens = (path: string) => path.split(".").flatMap((part) => {
  const result: (string | number)[] = [];
  part.replace(/([^\[\]]+)|\[(\d+)\]/g, (_match, key, index) => { result.push(index === undefined ? key : Number(index)); return ""; });
  return result;
});
const contentAtPath = (content: unknown, path: string) => tokens(path).reduce<unknown>((value, part) => {
  if (Array.isArray(value)) return value[Number(part)];
  return value && typeof value === "object" ? (value as RecordValue)[part] : undefined;
}, content);
const isMediaReference = (value: unknown): boolean =>
  Array.isArray(value)
    ? value.some(isMediaReference)
    : Boolean(value && typeof value === "object" && typeof (value as RecordValue)._payloadMediaSourceId === "string");
const assign = (target: RecordValue, path: string, value: unknown) => {
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

const isRecord = (value: unknown): value is RecordValue => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isUnresolvedMediaReference = (value: unknown) => isRecord(value) && typeof value._payloadMediaSourceId === "string";

// Live-preview messages retain source-media references while the initial preview
// response uses browser-usable URLs. Keep those URLs for text-only edits.
export function mergePayloadCmsPreview<T>(current: T, next: T): T {
  if (isUnresolvedMediaReference(next) && typeof current === "string") return current;
  if (Array.isArray(next)) {
    const previous = Array.isArray(current) ? current : [];
    return next.map((item, index) => mergePayloadCmsPreview(previous[index], item)) as T;
  }
  if (isRecord(next)) {
    const previous: RecordValue = isRecord(current) ? current : {};
    return Object.fromEntries(Object.entries(next).map(([key, value]) => [key, mergePayloadCmsPreview(previous[key], value)])) as T;
  }
  return next;
}
const previewContent = (document: RecordValue) => {
  if (!document.content || typeof document.content !== "object") return null;
  const content = clone(document.content as RecordValue);
  if (document.seo && typeof document.seo === "object") {
    content.seo = { ...(content.seo as RecordValue | undefined), ...(document.seo as RecordValue) };
  }
  const sections = Array.isArray(document.contentSections) ? document.contentSections as Section[] : [];
  const fields = sections.flatMap((section) => section.fields || []).length
    ? sections.flatMap((section) => section.fields || [])
    : Array.isArray(document.contentFields) ? document.contentFields as Field[] : [];
  for (const field of fields) {
    if (!field.path) continue;
    if (hasContent(field.english) || hasContent(field.arabic)) {
      if (hasContent(field.english)) assign(content, `${field.path}En`, field.english);
      if (hasContent(field.arabic)) assign(content, `${field.path}Ar`, field.arabic);
    } else if (hasContent(field.media)) {
      const url = mediaUrl(field.media);
      if (url) assign(content, field.path, url);
    } else if (field.media === null && isMediaReference(contentAtPath(document.content, field.path))) {
      // A media selection was deliberately removed, so discard the old URL.
      assign(content, field.path, "");
    } else if (hasContent(field.mediaList)) {
      assign(content, field.path, (field.mediaList || []).map(mediaUrl).filter(Boolean));
    } else if (Array.isArray(field.mediaList) && isMediaReference(contentAtPath(document.content, field.path))) {
      assign(content, field.path, []);
    } else if (hasContent(field.value)) assign(content, field.path, field.value);
  }
  return content;
};

/** Applies the un-published editor document directly inside Payload's preview iframe. */
export function usePayloadCmsPreview(onDocument: (sourceId: string, content: RecordValue, raw: RecordValue) => void) {
  const latest = useRef(onDocument);
  const mediaCache = useRef(new Map<string, Promise<unknown>>());
  useEffect(() => {
    latest.current = onDocument;
  }, [onDocument]);

  useEffect(() => {
    const origin = window.location.origin;
    const onMessage = (event: MessageEvent<PayloadMessage>) => {
      const document = event.data?.data;
      if (event.origin !== origin || event.data?.type !== "payload-live-preview" || event.data.collectionSlug !== "cms-documents" || !document) return;
      void resolveSelectedMedia(document, mediaCache.current).then((resolvedDocument) => {
        const sourceId = typeof resolvedDocument.sourceId === "string" ? resolvedDocument.sourceId : "";
        const content = previewContent(resolvedDocument);
        if (sourceId && content) latest.current(sourceId, content, resolvedDocument);
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
}