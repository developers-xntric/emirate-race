import type { CollectionConfig, Field } from "payload";

type SubmissionData = Record<string, unknown>;

const asText = (value: unknown) => typeof value === "string" ? value.trim() : "";
const asTextList = (value: unknown) => Array.isArray(value) ? value.map(asText).filter(Boolean) : [];
const firstText = (...values: unknown[]) => values.map(asText).find(Boolean) || "";

const summaryFor = (submission: SubmissionData) => ({
  leadName: firstText(submission.name, submission.applicant_name, submission.decl_applicant_name),
  email: firstText(submission.email, submission.email_address),
  phone: firstText(submission.phone, submission.mobile_number),
  organization: firstText(submission.brand_name, submission.legal_company_name, submission.club),
  raceInterest: [
    ...asTextList(submission.races),
    ...asTextList(submission.race_villages),
    ...asTextList(submission.villages),
  ].filter((value, index, values) => values.indexOf(value) === index).join(", "),
  message: firstText(submission.message, submission.note, submission.short_brand_description, submission.channelLink),
});

const summaryFields: Field[] = [
  { name: "leadName", label: "Name", type: "text", virtual: true, admin: { readOnly: true } },
  { name: "email", label: "Email", type: "email", virtual: true, admin: { readOnly: true } },
  { name: "phone", label: "Phone", type: "text", virtual: true, admin: { readOnly: true } },
  { name: "organization", label: "Organisation / brand / club", type: "text", virtual: true, admin: { readOnly: true } },
  { name: "raceInterest", label: "Selected races / villages", type: "text", virtual: true, admin: { readOnly: true } },
  { name: "message", label: "Message / notes / link", type: "textarea", virtual: true, admin: { readOnly: true } },
];

export const Submissions: CollectionConfig = {
  slug: "submissions",
  labels: { singular: "Form submission", plural: "Form submissions" },
  admin: {
    useAsTitle: "submissionType",
    group: "Form submissions",
    defaultColumns: ["submissionType", "leadName", "email", "phone", "organization", "updatedAt"],
  },
  access: { read: ({ req }) => Boolean(req.user) },
  hooks: {
    afterRead: [({ doc }) => {
      const summary = summaryFor((doc.submission || {}) as SubmissionData);
      Object.assign(doc, summary);
      return doc;
    }],
  },
  fields: [
    { name: "sourceId", type: "text", unique: true, index: true, admin: { hidden: true } },
    { name: "submissionType", label: "Submission type", type: "select", required: true, options: [
      { label: "Contact enquiry", value: "contactLead" },
      { label: "Press kit request", value: "pressKitLead" },
      { label: "Vendor application", value: "vendorLead" },
      { label: "Corporate partner enquiry", value: "corporatePartnerLead" },
      { label: "Community partner enquiry", value: "communityPartnerLead" },
    ], admin: { readOnly: true } },
    ...summaryFields,
    { name: "submission", type: "json", required: true, admin: { hidden: true } },
  ],
};