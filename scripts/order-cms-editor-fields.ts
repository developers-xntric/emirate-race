import { getPayload } from "payload";
import config from "../payload.config";

type ContentEntry = {
  path?: string;
  label?: string;
  media?: unknown;
  mediaList?: unknown[];
  [key: string]: unknown;
};

type ContentSection = {
  fields?: ContentEntry[];
  [key: string]: unknown;
};

const priority = (field: ContentEntry) => {
  const reference = `${field.path || ""} ${field.label || ""}`.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  if (field.media || field.mediaList || /\b(image|video|media|gallery|poster|asset|background|bg)\b/.test(reference)) return 50;
  if (/\b(cta|button|href|link|url|register|submit|apply)\b/.test(reference)) return 40;
  if (/\b(subheading|sub-heading|subtitle|eyebrow|overline|kicker|label)\b/.test(reference)) return 30;
  if (/\b(paragraph|description|body|copy|content|introduction|intro|text|summary)\b/.test(reference)) return 20;
  if (/\b(title|heading|headline|name)\b/.test(reference)) return 10;
  return 35;
};

const parentPath = (path?: string) => path?.replace(/\.[^.]+$/, "") || "";

const orderFields = (fields: ContentEntry[] = []) => {
  const parents = new Map<string, number>();
  return fields
    .map((field, index) => {
      const parent = parentPath(field.path);
      if (!parents.has(parent)) parents.set(parent, parents.size);
      return { field, index, parent, fieldPriority: priority(field) };
    })
    .sort((left, right) => {
      const parentDifference = (parents.get(left.parent) || 0) - (parents.get(right.parent) || 0);
      return parentDifference || left.fieldPriority - right.fieldPriority || left.index - right.index;
    })
    .map(({ field }) => field);
};

async function main() {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: "cms-documents", depth: 0, limit: 1000, overrideAccess: true, context: { skipCmsEditorFieldOrdering: true } });

  let updated = 0;
  for (const document of result.docs) {
    const currentSections = (document.contentSections || []) as ContentSection[];
    const orderedSections = currentSections.map((section) => ({ ...section, fields: orderFields(section.fields) }));

    if (JSON.stringify(currentSections) === JSON.stringify(orderedSections)) continue;
    await payload.update({ collection: "cms-documents", id: document.id, data: { contentSections: orderedSections }, overrideAccess: true });
    updated += 1;
  }

  console.log(`Ordered editor fields in ${updated} CMS document(s).`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});