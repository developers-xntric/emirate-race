import { defineField, defineType } from "sanity";

const text = (name: string, title: string) =>
  defineField({ name, title, type: "string", readOnly: true });

const longText = (name: string, title: string) =>
  defineField({ name, title, type: "text", rows: 4, readOnly: true });

const strings = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [{ type: "string" }], readOnly: true });

const preview = (title: string, subtitle: string) => ({
  select: { title, subtitle },
});

export const contactLeadType = defineType({
  name: "contactLead",
  title: "Contact enquiries",
  type: "document",
  fields: [
    text("name", "Name"),
    text("email", "Email"),
    text("phone", "Phone"),
    longText("message", "Message"),
    strings("races", "Races"),
  ],
  preview: preview("name", "email"),
});

export const pressKitLeadType = defineType({
  name: "pressKitLead",
  title: "Press Kit Downloads",
  type: "document",
  fields: [text("name", "Name"), text("email", "Email"), text("channelLink", "Channel Link")],
  preview: preview("name", "email"),
});

const vendorFields = [
  text("applicant_name", "Applicant Name"),
  text("position", "Position"),
  text("brand_name", "Brand Name"),
  text("legal_company_name", "Legal Company / Trade Licence Name"),
  text("office_address", "Office / Branch Address"),
  text("mobile_number", "Mobile Number"),
  text("email_address", "Email Address"),
  text("website", "Website"),
  text("social_media", "Instagram / Social Media"),
  text("trade_licence_number", "Trade Licence Number"),
  text("emirate_of_registration", "Emirate of Registration"),
  text("trn_vat_number", "TRN / VAT Number"),
  strings("race_villages", "Race Villages"),
  longText("products_menu_offered", "Products Offered"),
  longText("proposed_activation", "Proposed Activation / Display"),
  text("staff_on_site", "Staff on Site"),
  text("furniture_brought", "Furniture Brought"),
  text("electrical_equipment", "Electrical Equipment"),
  text("delivery_vehicle_type", "Delivery / Vehicle Type"),
  text("vehicle_plate_no", "Vehicle Plate No."),
  longText("special_access_loading", "Special Access / Loading Requirement"),
  longText("accessibility_other_needs", "Accessibility / Other Operational Needs"),
  longText("short_brand_description", "Short Brand Description"),
  text("promotional_offer", "Promotional Offer"),
  text("decl_vendor_company", "Vendor / Company"),
  text("decl_applicant_name", "Applicant Name"),
  text("decl_position", "Position"),
  text("decl_date", "Date"),
  text("decl_signature", "Applicant Signature"),
  text("agree_terms", "Terms Agreement"),
];

export const vendorLeadType = defineType({
  name: "vendorLead",
  title: "Vendor bookings",
  type: "document",
  fields: vendorFields,
  preview: preview("brand_name", "email_address"),
});

const partnerFields = [
  text("club", "Club / Organisation"),
  text("name", "Name"),
  text("email", "Email"),
  text("phone", "Phone"),
  text("members", "Members"),
  strings("villages", "Villages"),
  longText("note", "Note"),
];

export const corporatePartnerLeadType = defineType({
  name: "corporatePartnerLead",
  title: "Corporate partner enquiries",
  type: "document",
  fields: partnerFields,
  preview: preview("club", "email"),
});

export const communityPartnerLeadType = defineType({
  name: "communityPartnerLead",
  title: "Community partner enquiries",
  type: "document",
  fields: partnerFields,
  preview: preview("club", "email"),
});