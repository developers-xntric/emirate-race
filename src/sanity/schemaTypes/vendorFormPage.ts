import { defineField, defineType } from "sanity";

const field = (name: string, title: string) => defineField({ name, title, type: "string" });

export const vendorFormPageType = defineType({
  name: "vendorFormPage",
  title: "Vendor booking form",
  type: "document",
  fields: [
    defineField({ name: "pageName", title: "Page name", type: "string", readOnly: true, initialValue: "EVRS 2026 Vendor booking form" }),
    defineField({ name: "seo", title: "SEO metadata", type: "object", fields: [field("title", "Meta title"), defineField({ name: "description", title: "Meta description", type: "text", rows: 3 })] }),
    defineField({ name: "logo", title: "Header logo", type: "image", options: { hotspot: true }, fields: [field("alt", "Alt text")] }),
    defineField({ name: "translations", title: "English and Arabic form copy", description: "Bank labels and values appear together in the Commercial & Payment sequence.", type: "array", of: [{ type: "object", fields: [
      field("key", "Content key"), field("label", "Field shown in Studio"),
      defineField({ name: "valueEn", title: "English", type: "text", rows: 3 }),
      defineField({ name: "valueAr", title: "Arabic", type: "text", rows: 3 }),
    ] }] }),
  ],
});