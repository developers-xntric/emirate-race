import { sanityClient } from "@/sanity/lib/client";
import type { ContactInput } from "@/lib/contact/validation";

type PartnerLead = {
  club: string;
  name: string;
  email: string;
  phone: string;
  members: string;
  villages: string[];
  note: string;
};

const vendorFieldNames = [
  "applicant_name", "position", "brand_name", "legal_company_name", "office_address",
  "mobile_number", "email_address", "website", "social_media", "trade_licence_number",
  "emirate_of_registration", "trn_vat_number", "products_menu_offered", "proposed_activation",
  "staff_on_site", "furniture_brought", "electrical_equipment", "delivery_vehicle_type",
  "vehicle_plate_no", "special_access_loading", "accessibility_other_needs",
  "short_brand_description", "promotional_offer", "decl_vendor_company", "decl_applicant_name",
  "decl_position", "decl_date", "decl_signature", "agree_terms",
] as const;

const asText = (value: unknown) => typeof value === "string" ? value : "";
const asTexts = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

export function saveContactLead({ name, email, phone, message, races }: ContactInput) {
  return sanityClient.create({ _type: "contactLead", name, email, phone, message, races });
}

export function savePressKitLead({ name, email, channelLink }: { name: string; email: string; channelLink: string }) {
  return sanityClient.create({ _type: "pressKitLead", name, email, channelLink });
}

export function saveVendorLead(input: Record<string, unknown>) {
  const fields = Object.fromEntries(vendorFieldNames.map((name) => [name, asText(input[name])]));
  return sanityClient.create({ _type: "vendorLead", ...fields, race_villages: asTexts(input.race_villages) });
}

export function saveCorporatePartnerLead({ club, name, email, phone, members, villages, note }: PartnerLead) {
  return sanityClient.create({ _type: "corporatePartnerLead", club, name, email, phone, members, villages, note });
}

export function saveCommunityPartnerLead({ club, name, email, phone, members, villages, note }: PartnerLead) {
  return sanityClient.create({ _type: "communityPartnerLead", club, name, email, phone, members, villages, note });
}