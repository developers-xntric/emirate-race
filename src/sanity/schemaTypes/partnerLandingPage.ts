import { defineField, defineType } from "sanity";

const copy = (name: string, title: string, type: "string" | "text" = "string") =>
  defineField({ name, title, type, rows: type === "text" ? 4 : undefined });

type SectionOptions = { primaryButton?: "link" | "action"; secondaryButton?: "link"; image?: boolean };
const section = (name: string, title: string, options: SectionOptions = {}) => defineField({
  name, title, type: "object", fields: [
    defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: title }),
    copy("eyebrow", "Eyebrow / badge"), copy("title", "Heading", "text"), copy("body", "Paragraph", "text"),
    ...(options.primaryButton ? [copy("cta", "Primary button text"), ...(options.primaryButton === "link" ? [copy("ctaHref", "Primary button link")] : [])] : []),
    ...(options.secondaryButton ? [copy("secondaryCta", "Secondary button text"), copy("secondaryCtaHref", "Secondary button link")] : []),
    ...(options.image ? [defineField({ name: "image", title: "Section image", type: "image", options: { hotspot: true }, fields: [copy("alt", "Image alt text")] })] : []),
  ],
});

const navbar = defineField({ name: "navbar", title: "Navbar", type: "object", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "Navbar" }),
  defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true }, fields: [copy("alt", "Logo alt text")] }), copy("logoHref", "Logo link"),
  defineField({ name: "links", title: "Navigation links", type: "array", of: [{ type: "object", fields: [copy("label", "Link label"), copy("href", "Link")] }], validation: (Rule) => Rule.max(6) }),
  copy("cta", "CTA button text"), copy("ctaLong", "CTA button expanded text"), copy("ctaHref", "CTA button link"),
] });

const invitation = defineField({ name: "invitation", title: "Invitation", type: "object", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "Invitation" }),
  copy("eyebrow", "Eyebrow / badge"), copy("title", "Heading", "text"), copy("body", "Paragraph", "text"), copy("scrollCue", "Scroll prompt"),
  defineField({ name: "image", title: "Reveal background image", type: "image", options: { hotspot: true }, fields: [copy("alt", "Image alt text")] }),
  copy("statementEyebrow", "Large statement eyebrow"), copy("statementLine1", "Large statement — line 1"), copy("statementLine2", "Large statement — line 2"), copy("statementLine3", "Large statement — line 3 (teal)"),
] });

const season = defineField({ name: "season", title: "Season", type: "object", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "Season" }),
  copy("eyebrow", "Eyebrow / badge"), copy("title", "Heading", "text"), copy("body", "Paragraph", "text"),
  copy("raceLabel", "Race card label"), copy("medalLabel", "Flip-card medal label"),
  defineField({ name: "endCard", title: "Final card after race seven", type: "object", fields: [copy("title", "Heading"), copy("body", "Paragraph", "text"), copy("cta", "Button text"), copy("ctaHref", "Button link")] }),
  defineField({ name: "races", title: "Race cards", type: "array", validation: (Rule) => Rule.max(7), of: [{ type: "object", fields: [
    copy("key", "Race key"), copy("name", "Village name"), copy("emirate", "Emirate"), defineField({ name: "date", title: "Race date", type: "date" }),
    copy("meaning", "Medal description"), copy("color", "Card colour"), defineField({ name: "icon", title: "Front-card race icon", type: "image", options: { hotspot: true }, fields: [copy("alt", "Image alt text")] }), defineField({ name: "image", title: "Flip-card medal image", type: "image", options: { hotspot: true }, fields: [copy("alt", "Image alt text")] }),
  ] }] }),
] });

const raceDay = defineField({ name: "raceDay", title: "Race day", type: "object", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "Race day" }),
  copy("eyebrow", "Eyebrow / badge"), copy("title", "Heading", "text"), copy("body", "Paragraph", "text"),
  defineField({ name: "image", title: "Default race-day character image", type: "image", options: { hotspot: true }, fields: [copy("alt", "Image alt text")] }),
  defineField({ name: "distances", title: "Distance tabs", type: "array", validation: (Rule) => Rule.max(3), of: [{ type: "object", fields: [
    defineField({ name: "distance", title: "Distance (KM)", type: "number" }), copy("tabLabel", "Tab label"), copy("tabCaption", "Tab caption"),
    copy("tagline", "Stage tagline"), copy("description", "Stage description"), copy("laps", "Laps text"),
    defineField({ name: "image", title: "Distance character image", type: "image", options: { hotspot: true }, fields: [copy("alt", "Image alt text")] }),
  ] }] }),
] });

const numbers = defineField({ name: "numbers", title: "EVRS in numbers", type: "object", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "EVRS in numbers" }),
  copy("eyebrow", "Eyebrow / badge"), copy("title", "Heading", "text"),
  copy("body", "Paragraph", "text"),
  defineField({ name: "cards", title: "Number cards", type: "array", validation: (Rule) => Rule.max(4), of: [{ type: "object", fields: [copy("value", "Number shown"), copy("unit", "Unit text"), copy("label", "Card label"), defineField({ name: "countTo", title: "Animation number", type: "number" }), copy("format", "Number format (K, M, comma, plain)"), defineField({ name: "dots", title: "Dot count", type: "number" })] }] }),
] });

const partnership = defineField({ name: "partnership", title: "Partnership", type: "object", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "Partnership" }),
  copy("eyebrow", "Eyebrow / badge"), copy("title", "Heading", "text"),
  copy("body", "Paragraph", "text"), copy("footer", "Footer text"),
  copy("leftTitle", "Left card title"), defineField({ name: "leftItems", title: "Left card steps", type: "array", validation: (Rule) => Rule.max(4), of: [{ type: "object", fields: [copy("title", "Step title"), copy("description", "Step description", "text"), defineField({ name: "channels", title: "Channel labels", type: "array", of: [{ type: "string" }] })] }] }),
  copy("rightTitle", "Right card title"), defineField({ name: "rightItems", title: "Right card steps", type: "array", validation: (Rule) => Rule.max(4), of: [{ type: "object", fields: [copy("text", "Step text", "text"), copy("subtext", "Step small text", "text")] }] }),
] });
const moment = defineField({ name: "moment", title: "Community / team moment", type: "object", fields: [
  defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "Community / team moment" }),
  copy("eyebrow", "Eyebrow / badge"), copy("title", "Heading", "text"), copy("body", "Paragraph", "text"),
  defineField({ name: "image", title: "Peek character image", type: "image", options: { hotspot: true } }),
  defineField({ name: "pileImages", title: "Draggable photo cards", type: "array", validation: (Rule) => Rule.max(7), of: [{ type: "object", fields: [defineField({ name: "image", title: "Photo", type: "image", options: { hotspot: true } }), copy("caption", "Caption"), copy("color", "Card colour"), defineField({ name: "wide", title: "Wide card", type: "boolean" })] }] }),
] });
export const partnerLandingPageType = defineType({ name: "partnerLandingPage", title: "Partner landing page", type: "document", fields: [
  defineField({ name: "pageName", title: "Page name", type: "string", readOnly: true }),
  defineField({ name: "seo", title: "SEO metadata", type: "object", fields: [copy("title", "Meta title"), copy("description", "Meta description", "text")] }),
  navbar, section("hero", "Hero", { primaryButton: "link", secondaryButton: "link", image: true }), invitation, season, raceDay,
  section("medal", "Seven-piece medal", { primaryButton: "action", image: true }), numbers, partnership,
  moment, defineField({ name: "join", title: "Partner enquiry form", type: "object", fields: [ defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "Partner enquiry form" }), copy("eyebrow", "Eyebrow / badge"), copy("title", "Heading", "text"), copy("body", "Paragraph", "text"), defineField({ name: "image", title: "Section image", type: "image", options: { hotspot: true } }), defineField({ name: "form", title: "Form fields and messages", type: "object", fields: [copy("title", "Form title"), copy("organisationLabel", "Organisation / club label"), copy("nameLabel", "Contact name label"), copy("emailLabel", "Email label"), copy("phoneLabel", "Phone label"), copy("phonePlaceholder", "Phone placeholder"), copy("sizeLabel", "Members label"), copy("villagesLabel", "Villages label"), defineField({ name: "raceOptions", title: "Race / village options", type: "array", of: [{ type: "string" }], validation: (Rule) => Rule.max(7) }), copy("noteLabel", "Notes label"), copy("submitLabel", "Submit button text"), copy("finePrint", "Fine print", "text"), copy("successTitle", "Success title"), copy("successMessage", "Success message", "text")] }) ] }),
] });