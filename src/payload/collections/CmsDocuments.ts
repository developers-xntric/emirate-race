import type { CollectionConfig, Field } from "payload";

type ContentEntry = {
  path?: string;
  label?: string;
  english?: string | null;
  arabic?: string | null;
  value?: string | null;
  media?: unknown;
  mediaList?: unknown[];
};

type ContentSection = {
  sectionName?: string;
  fields?: ContentEntry[];
  sourceOrder?: number;
};

const sectionName = (path?: string) => {
  const raw = (path?.split(".")[0] || "Page content").replace(/\[\d+\]/g, "");
  const names: Record<string, string> = { about: "About EVRS", hero: "Hero", seo: "SEO metadata", cta: "Call to action", gallery: "Gallery", rahhal: "Meet Rahhal", distances: "Race Distances", calendar: "Race Calendar", medal: "Medal and Legacy", more: "More Than a Running Series", built: "Built for Everyone", races: "The Seven Races", recognition: "Recognition and Legacy", questions: "Questions" };
  return names[raw] || raw.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
};

const hasContent = (value: unknown) => Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== "";
const visibleToEditors = (field: ContentEntry) => {
  const path = field.path || "";
  const segments = path.replace(/\[\d+\]/g, "").split(".");
  const rawValue = typeof field.value === "string" ? field.value : "";
  // Migration markers and raw Sanity references are implementation details.
  // Editors only see text, links, and actual Payload media controls.
  return Boolean(path)
    && !segments.some((segment) => segment.startsWith("_"))
    && !segments.includes("pageName")
    && !segments.includes("sectionName")
    // SEO is edited in the dedicated top-level group, never as a page section.
    && segments[0] !== "seo"
    && !String(field.label || "").startsWith("_")
    && !rawValue.startsWith("image@file://")
    && !rawValue.startsWith("file@file://");
};

const sectionPriority: Record<string, number> = {
  Hero: 0,
  "About EVRS": 10,
  "More Than a Running Series": 20,
  "Meet Rahhal": 30,
  "Race Distances": 40,
  "Race Calendar": 50,
  "Medal and Legacy": 60,
  "Recognition and Legacy": 70,
  Gallery: 80,
  Questions: 90,
  "Call to action": 100,
};

const sectionForPath = (path: string | undefined, content: Record<string, unknown> | undefined) => {
  const match = path?.match(/^sections\[(\d+)\]/);
  if (match && Array.isArray(content?.sections)) {
    const item = content.sections[Number(match[1])] as { sectionName?: unknown } | undefined;
    if (typeof item?.sectionName === "string" && item.sectionName) return item.sectionName;
  }
  const galleryMatch = path?.match(/^gallery\.items\[(\d+)\]\./);
  if (galleryMatch) {
    const item = (content?.gallery as { items?: Array<{ titleEn?: unknown; titleAr?: unknown }> } | undefined)?.items?.[Number(galleryMatch[1])];
    const title = typeof item?.titleEn === "string" ? item.titleEn : typeof item?.titleAr === "string" ? item.titleAr : `Race ${Number(galleryMatch[1]) + 1}`;
    return `Gallery — ${title}`;
  }
  return sectionName(path);
};

// The migration retains the source paths, so we can present each editor-facing
// section in a predictable, non-technical order without changing its data.
const editorFieldPriority = (field: ContentEntry) => {
  const reference = `${field.path || ""} ${field.label || ""}`.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

  if (field.media || (Array.isArray(field.mediaList) && field.mediaList.length > 0) || /\b(image|video|media|gallery|poster|asset|background|bg)\b/.test(reference)) return 50;
  if (/\b(cta|button|href|link|url|register|submit|apply)\b/.test(reference)) return 40;
  if (/\b(subheading|sub-heading|subtitle|eyebrow|overline|kicker|label)\b/.test(reference)) return 30;
  if (/\b(paragraph|description|body|copy|content|introduction|intro|text|summary)\b/.test(reference)) return 20;
  if (/\b(title|heading|headline|name)\b/.test(reference)) return 10;
  return 35;
};

const fieldParentPath = (path?: string) => path?.replace(/\.[^.]+$/, "") || "";

const orderSectionFields = (fields: ContentEntry[]) => {
  const parents = new Map<string, number>();
  return fields
    .map((field, index) => {
      const parent = fieldParentPath(field.path);
      if (!parents.has(parent)) parents.set(parent, parents.size);
      return { field, index, parent, priority: editorFieldPriority(field) };
    })
    .sort((left, right) => {
      const parentDifference = (parents.get(left.parent) || 0) - (parents.get(right.parent) || 0);
      return parentDifference || left.priority - right.priority || left.index - right.index;
    })
    .map(({ field }) => field);
};

// Payload renders each selected upload using the Media ID as its React key.
// Preserve gallery order while removing accidental duplicate media references.
const mediaKey = (media: unknown) => {
  if (media && typeof media === "object") {
    const value = media as { id?: unknown; value?: unknown };
    if (value.id !== undefined) return `id:${String(value.id)}`;
    if (value.value !== undefined) return `value:${String(value.value)}`;
  }
  return `${typeof media}:${String(media)}`;
};

const uniqueMediaList = (media: unknown[] = []) => {
  const keys = new Set<string>();
  return media.filter((item) => {
    const key = mediaKey(item);
    if (keys.has(key)) return false;
    keys.add(key);
    return true;
  });
};
const galleryImagePath = /^gallery\.items\[(\d+)\]\.(images|images2026)\[(\d+)\]$/;
const galleryImageListPath = /^gallery\.items\[(\d+)\]\.(images|images2026)$/;

const normalizeGalleryMediaFields = (fields: ContentEntry[], content?: Record<string, unknown>) => {
  const mediaLists = new Map<string, ContentEntry>();
  for (const field of fields) {
    const indexed = field.path?.match(galleryImagePath);
    const existing = field.path?.match(galleryImageListPath);
    const path = indexed ? `gallery.items[${indexed[1]}].${indexed[2]}` : existing ? field.path! : undefined;
    if (!path) continue;
    const type = (indexed?.[2] || existing?.[2]) as "images" | "images2026";
    const list = mediaLists.get(path) || { path, label: type === "images2026" ? "2026 gallery images" : "2025 gallery images", mediaList: [] };
    // A previous backfill may have left an empty duplicate row. Never let it replace a populated gallery list.
    if (Array.isArray(field.mediaList) && field.mediaList.length > 0) list.mediaList = uniqueMediaList(field.mediaList);
    else if (field.media) list.mediaList = uniqueMediaList([...(list.mediaList || []), field.media]);
    mediaLists.set(path, list);
  }

  const races = (content?.gallery as { items?: unknown[] } | undefined)?.items || [];
  for (let index = 0; index < races.length; index += 1) {
    for (const type of ["images", "images2026"] as const) {
      const path = `gallery.items[${index}].${type}`;
      if (!mediaLists.has(path)) mediaLists.set(path, { path, label: type === "images2026" ? "2026 gallery images" : "2025 gallery images", mediaList: [] });
    }
  }

  const emitted = new Set<string>();
  const normalized = fields.flatMap((field) => {
    const indexed = field.path?.match(galleryImagePath);
    const existing = field.path?.match(galleryImageListPath);
    const path = indexed ? `gallery.items[${indexed[1]}].${indexed[2]}` : existing ? field.path! : undefined;
    if (!path) return [field];
    const list = mediaLists.get(path);
    if (!list || emitted.has(path)) return [];
    emitted.add(path);
    return [list];
  });
  for (const [path, field] of mediaLists) if (!emitted.has(path)) normalized.push(field);
  return normalized;
};

// Data written during an interrupted older backfill can contain repeated field
// rows. For the editor, retain the one carrying real content so each race is
// represented once and its selected gallery images remain visible.
const contentScore = (field: ContentEntry) =>
  (Array.isArray(field.mediaList) ? field.mediaList.length + 1 : 0)
  + (field.media ? 1 : 0)
  + (hasContent(field.english) ? 1 : 0)
  + (hasContent(field.arabic) ? 1 : 0)
  + (hasContent(field.value) ? 1 : 0);

const deduplicateEditorFields = (fields: ContentEntry[]) => {
  const unique = new Map<string, ContentEntry>();
  for (const field of fields) {
    const key = field.path || `__untitled_${unique.size}`;
    const current = unique.get(key);
    if (!current || contentScore(field) > contentScore(current)) unique.set(key, field);
  }
  return [...unique.values()];
};
const groupContentFields = (fields: ContentEntry[] = [], content?: Record<string, unknown>): ContentSection[] => {
  const sections = new Map<string, ContentSection>();
  for (const field of deduplicateEditorFields(normalizeGalleryMediaFields(fields, content)).filter(visibleToEditors)) {
    const name = sectionForPath(field.path, content);
    const section = sections.get(name) || { sectionName: name, fields: [], sourceOrder: sections.size };
    section.fields?.push(field);
    sections.set(name, section);
  }
  return [...sections.values()].map((section) => ({
    ...section,
    fields: orderSectionFields(section.fields || []),
  })).sort((left, right) => {
    const leftPriority = sectionPriority[left.sectionName || ""] ?? 1000 + (left.sourceOrder || 0);
    const rightPriority = sectionPriority[right.sectionName || ""] ?? 1000 + (right.sourceOrder || 0);
    return leftPriority - rightPriority;
  });
};

const whenPresent = (key: keyof ContentEntry) => (_data: unknown, siblingData: ContentEntry) => hasContent(siblingData?.[key]);
const pathParts = (path = "") => path.match(/[^.[\]]+/g) || [];
const contentAtPath = (content: unknown, path: string | undefined) => pathParts(path).reduce<unknown>((value, part) => {
  if (Array.isArray(value)) return value[Number(part)];
  return value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined;
}, content);
const isMediaReference = (value: unknown): boolean =>
  Array.isArray(value)
    ? value.some(isMediaReference)
    : Boolean(value && typeof value === "object" && typeof (value as Record<string, unknown>)._payloadMediaSourceId === "string");

// Only actual media rows get this control. It remains visible after removal
// because the original content still identifies the path as media.
const hasMediaControl = (data: unknown, siblingData: ContentEntry) =>
  hasContent(siblingData?.media)
  || isMediaReference(contentAtPath((data as { content?: unknown } | undefined)?.content, siblingData?.path));
// Direct uploads are deliberately limited to the two Home Gallery year fields.
// Other content entries retain their existing single-media selector.
const isHomeGalleryImageList = (_data: unknown, siblingData: ContentEntry) =>
  Array.isArray(siblingData?.mediaList) && /^gallery\.items\[\d+\]\.(images|images2026)$/.test(siblingData.path || "");

const contentEntryFields = (): Field[] => [
  { name: "path", type: "text", admin: { hidden: true } },
  { name: "label", type: "text", admin: { hidden: true } },
  { name: "english", label: "English", type: "textarea", admin: { condition: whenPresent("english") } },
  { name: "arabic", label: "Arabic", type: "textarea", admin: { condition: (_data, siblingData: ContentEntry) => hasContent(siblingData?.english) || hasContent(siblingData?.arabic) } },
  { name: "value", label: "Value", type: "textarea", admin: { condition: whenPresent("value") } },
  {
    name: "media", label: "Shared media", type: "upload", relationTo: "media", displayPreview: true,
    admin: {
      condition: hasMediaControl,
    },
  },
  {
    name: "mediaList", label: "Gallery images — upload or select", type: "upload", relationTo: "media", hasMany: true, displayPreview: true,
    admin: {
      condition: isHomeGalleryImageList,
      description: "Upload images directly here or select existing Media items. Drag to set their gallery order.",
    },
  },
];

const contentSections: Field = {
  name: "contentSections", label: "Page sections", type: "array",
  labels: { singular: "Section", plural: "Sections" },
  admin: {
    description: "Edit only the values that exist in each section. English is always immediately followed by Arabic; media is shared.",
    initCollapsed: false,
    isSortable: false,
    components: { RowLabel: "@/payload/components/CmsSectionRowLabel" },
  },
  fields: [
    { name: "sectionName", label: "Section name", type: "text", admin: { readOnly: true } },
    {
      name: "fields", label: "", type: "array",
      labels: { singular: "Content", plural: "Content" },
      admin: { initCollapsed: false, isSortable: false, components: { RowLabel: "@/payload/components/CmsContentRowLabel" } },
      fields: contentEntryFields(),
    },
  ],
};

const legacyContentFields: Field = {
  name: "contentFields", type: "array", admin: { hidden: true }, fields: contentEntryFields(),
};

const seo: Field = {
  name: "seo", label: "SEO", type: "group",
  admin: { condition: (data) => data?.documentType !== "navbar" && data?.documentType !== "footer" },
  fields: [
    { name: "titleEn", label: "English meta title", type: "text" },
    { name: "titleAr", label: "Arabic meta title", type: "text" },
    { name: "descriptionEn", label: "English meta description", type: "textarea" },
    { name: "descriptionAr", label: "Arabic meta description", type: "textarea" },
  ],
};

export const CmsDocuments: CollectionConfig = {
  slug: "cms-documents",
  labels: { singular: "Page / global content", plural: "Pages & global content" },
  admin: {
    useAsTitle: "adminTitle", group: "Site Content",
    components: { edit: { beforeDocumentControls: ["@/payload/components/CmsPreviewToggle"] } },
    defaultColumns: ["adminTitle", "documentType", "slug", "updatedAt"],
    livePreview: {
      openByDefault: true,
      url: ({ data, req }) => {
        const slug = typeof data?.slug === "string" ? data.slug : "";
        const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const requestOrigin = host ? `${protocol}://${host}` : "http://localhost:3000";
        const origin = process.env.NEXT_PUBLIC_SERVER_URL || requestOrigin;
        const preview = (path: string) => `${origin}/api/preview?secret=${encodeURIComponent(process.env.PAYLOAD_PREVIEW_SECRET || "")}&path=${encodeURIComponent(path)}`;
        if (data?.documentType === "homePage") return preview("/");
        if (data?.documentType === "aboutPage") return preview("/about");
        if (data?.documentType === "contactPage") return preview("/contact");
        if (data?.documentType === "faqPage") return preview("/faqs");
        if (data?.documentType === "termsPage") return preview("/terms-and-conditions");
        if (data?.documentType === "racePage") return preview("/races/" + slug);
        const routes: Record<string, string> = {
          "vendor-form-2026": "/vendor-form-2026",
          "evrs-corporate": "/evrs-corporate",
          "evrs-community": "/evrs-community",
        };
        const path = typeof data?.sourceId === "string" ? routes[data.sourceId] : undefined;
        return preview(path || "/");
      },
    },
  },
  versions: { drafts: { autosave: true } },
  access: { read: () => true },
  hooks: {
    afterRead: [({ doc, context }) => {
      if (context?.skipCmsEditorFieldOrdering) return doc;
      const sectionFields = (doc.contentSections as ContentSection[] | undefined)?.flatMap((section) => section.fields || []) || [];
      const fields = sectionFields.length ? sectionFields : (doc.contentFields as ContentEntry[] | undefined) || [];
      doc.contentSections = groupContentFields(fields, doc.content as Record<string, unknown> | undefined);
      return doc;
    }],
  },
  fields: [
    { name: "adminTitle", label: "Page", type: "text", required: true },
    { name: "sourceId", type: "text", required: true, unique: true, index: true, admin: { hidden: true } },
    { name: "documentType", type: "select", required: true, options: ["navbar", "footer", "homePage", "aboutPage", "contactPage", "faqPage", "partnerLandingPage", "vendorFormPage", "racePage", "termsPage"], admin: { hidden: true } },
    { name: "slug", type: "text", index: true, admin: { hidden: true } },
    { name: "pageName", type: "text", admin: { hidden: true } },
    seo, contentSections, legacyContentFields,
    { name: "content", type: "json", required: true, admin: { hidden: true } },
  ],
};