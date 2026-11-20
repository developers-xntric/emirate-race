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
const tokens = (path: string) => path.split(".").flatMap((part) => {
  const result: (string | number)[] = [];
  part.replace(/([^\[\]]+)|\[(\d+)\]/g, (_match, key, index) => { result.push(index === undefined ? key : Number(index)); return ""; });
  return result;
});
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
    } else if (hasContent(field.mediaList)) {
      assign(content, field.path, (field.mediaList || []).map(mediaUrl).filter(Boolean));
    } else if (hasContent(field.value)) assign(content, field.path, field.value);
  }
  return content;
};

/** Applies the un-published editor document directly inside Payload's preview iframe. */
export function usePayloadCmsPreview(onDocument: (sourceId: string, content: RecordValue, raw: RecordValue) => void) {
  const latest = useRef(onDocument);
  useEffect(() => {
    latest.current = onDocument;
  }, [onDocument]);

  useEffect(() => {
    const origin = window.location.origin;
    const onMessage = (event: MessageEvent<PayloadMessage>) => {
      const document = event.data?.data;
      if (event.origin !== origin || event.data?.type !== "payload-live-preview" || event.data.collectionSlug !== "cms-documents" || !document) return;
      const sourceId = typeof document.sourceId === "string" ? document.sourceId : "";
      const content = previewContent(document);
      if (sourceId && content) latest.current(sourceId, content, document);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
}