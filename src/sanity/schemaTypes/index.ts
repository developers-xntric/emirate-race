import { contactPageType } from "./contactPage";
import { homePageType } from "./homePage";
import { aboutPageType } from "./aboutPage";
import { defineArrayMember, defineField, defineType } from "sanity";

const image = (name = "image", title = "Image") => defineField({
  name, title, type: "image", options: { hotspot: true }, hidden: ({ parent }) => !parent?.[name],
  fields: [defineField({ name: "altEn", title: "English alt text", type: "string" }), defineField({ name: "altAr", title: "Arabic alt text", type: "string" })],
});
const bilingual = (name: string, title: string, type: "string" | "text" = "string") => [
  defineField({ name: `${name}En`, title: `English ${title}`, type, rows: type === "text" ? 4 : undefined, hidden: ({ parent }) => name === "cta" && !parent?.ctaEn && !parent?.ctaAr }),
  defineField({ name: `${name}Ar`, title: `Arabic ${title}`, type, rows: type === "text" ? 4 : undefined, hidden: ({ parent }) => name === "cta" && !parent?.ctaEn && !parent?.ctaAr }),
];
const raceDayField = (name: string, title: string) => [
  defineField({ name: `${name}En`, title: `English ${title}`, type: "string", hidden: ({ parent }) => parent?.sectionName !== "About the Race" }),
  defineField({ name: `${name}Ar`, title: `Arabic ${title}`, type: "string", hidden: ({ parent }) => parent?.sectionName !== "About the Race" }),
];
const sectionLabelField = () => [
  defineField({ name: "eyebrowEn", title: "English section label", type: "string", hidden: ({ parent }) => !["About the Race", "Distances", "Race Maps", "Route map CTA"].includes(parent?.sectionName) }),
  defineField({ name: "eyebrowAr", title: "Arabic section label", type: "string", hidden: ({ parent }) => !["About the Race", "Distances", "Race Maps", "Route map CTA"].includes(parent?.sectionName) }),
];
const link = defineArrayMember({ type: "object", fields: [
  ...bilingual("label", "label"),
  defineField({ name: "href", title: "Link", type: "string" }), defineField({ name: "isPressKit", title: "Opens the Press Kit modal", type: "boolean" }),
] });
const section = defineArrayMember({ type: "object", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", validation: (Rule) => Rule.required() }),
  ...sectionLabelField(),
  ...bilingual("title", "title"),
  ...bilingual("paragraph", "paragraph", "text"),
  ...raceDayField("raceDayInformation", "Race Day Information"),
  ...raceDayField("dateLabel", "Date label"),
  ...raceDayField("dateValue", "Date value"),
  ...raceDayField("arrivalTimeLabel", "Arrival Time label"),
  ...raceDayField("arrivalTimeValue", "Arrival Time value"),
  ...raceDayField("raceStartLabel", "Race Start label"),
  ...raceDayField("raceStartValue", "Race Start value"),

  ...bilingual("cta", "CTA / button text"),
  defineField({ name: "ctaHref", title: "CTA / button link", type: "string", hidden: ({ parent }) => !parent?.ctaHref }),
  image(),
  defineField({ name: "images", title: "Additional existing images", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true } })], hidden: ({ parent }) => !parent?.images?.length }),
  defineField({ name: "items", title: "Existing cards, tabs, or fields", type: "array", hidden: ({ parent }) => !parent?.items?.length, of: [defineArrayMember({ type: "object", fields: [
    defineField({ name: "itemName", title: "Item name", type: "string", readOnly: true }),
  ...bilingual("title", "title"),
    ...bilingual("paragraph", "paragraph", "text"),

    ...bilingual("cta", "CTA / button text"),
    defineField({ name: "ctaHref", title: "CTA / button link", type: "string", hidden: ({ parent }) => !parent?.ctaHref }),
    image(),
    defineField({ name: "images", title: "Images", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true } })], hidden: ({ parent }) => !parent?.images?.length }),
  ] })] }),
] });

export const navbarType = defineType({ name: "navbar", title: "Navbar", type: "document", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", initialValue: "Navbar", readOnly: true }), image("logo", "Logo"),
  ...bilingual("brand", "brand"), defineField({ name: "navigation", title: "Navigation links", type: "array", of: [link] }),
  defineField({ name: "races", title: "Races dropdown", type: "array", of: [link] }), ...bilingual("register", "register CTA"), defineField({ name: "registerHref", title: "Register CTA link", type: "string" }),
] });
export const footerType = defineType({ name: "footer", title: "Footer", type: "document", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", initialValue: "Footer", readOnly: true }), image("logo", "Footer logo"),
  ...bilingual("description", "description", "text"), ...bilingual("organizer", "organizer"), ...bilingual("quickLinksTitle", "quick links title"),
  defineField({ name: "email", title: "Email", type: "string" }), defineField({ name: "emailHref", title: "Email link", type: "string" }),
  defineField({ name: "quickLinksPrimary", title: "Quick links â€” first column", type: "array", of: [link] }), defineField({ name: "quickLinksRaces", title: "Quick links â€” race pages column", type: "array", of: [link] }), defineField({ name: "socials", title: "Social links", type: "array", of: [defineArrayMember({ type: "object", fields: [defineField({ name: "label", title: "Platform", type: "string" }), defineField({ name: "href", title: "Link", type: "url" })] })] }),
  ...bilingual("copyright", "copyright"), defineField({ name: "legal", title: "Legal links", type: "array", of: [link] }),
] });
export const pageType = defineType({ name: "page", title: "Page", type: "document", fields: [
  defineField({ name: "pageName", title: "Page name", type: "string", validation: (Rule) => Rule.required() }), defineField({ name: "slug", title: "Path", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "sections", title: "Sections", type: "array", of: [section] }),
] });
export const raceType = defineType({ name: "racePage", title: "Race page", type: "document", fields: [
  defineField({ name: "pageName", title: "Race name", type: "string", validation: (Rule) => Rule.required() }), defineField({ name: "slug", title: "Path segment", type: "string", validation: (Rule) => Rule.required() }),
  defineField({ name: "sections", title: "Race sections", type: "array", of: [section], description: "Use the same section order for each race. Qidfa's 10KM route-map item retains its two images; all other route-map items have one." }),
] });
export const schema = { types: [navbarType, footerType, pageType, raceType, homePageType, aboutPageType, contactPageType] };
