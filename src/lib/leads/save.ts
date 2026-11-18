import { getPayload } from "payload";
import config from "../../../payload.config";
import type { ContactInput } from "@/lib/contact/validation";

type PartnerLead = { club: string; name: string; email: string; phone: string; members: string; villages: string[]; note: string };
const vendorFieldNames = ["applicant_name", "position", "brand_name", "legal_company_name", "office_address", "mobile_number", "email_address", "website", "social_media", "trade_licence_number", "emirate_of_registration", "trn_vat_number", "products_menu_offered", "proposed_activation", "staff_on_site", "furniture_brought", "electrical_equipment", "delivery_vehicle_type", "vehicle_plate_no", "special_access_loading", "accessibility_other_needs", "short_brand_description", "promotional_offer", "decl_vendor_company", "decl_applicant_name", "decl_position", "decl_date", "decl_signature", "agree_terms"] as const;
const asText = (value: unknown) => typeof value === "string" ? value : "";
const asTexts = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
async function save(submissionType: string, submission: Record<string, unknown>) {
  const payload = await getPayload({ config });
  return payload.create({ collection: "submissions", data: { sourceId: "runtime-" + crypto.randomUUID(), submissionType, submission }, overrideAccess: true });
}
export const saveContactLead = ({ name, email, phone, message, races }: ContactInput) => save("contactLead", { name, email, phone, message, races });
export const savePressKitLead = ({ name, email, channelLink }: { name: string; email: string; channelLink: string }) => save("pressKitLead", { name, email, channelLink });
export const saveVendorLead = (input: Record<string, unknown>) => save("vendorLead", { ...Object.fromEntries(vendorFieldNames.map((name) => [name, asText(input[name])])), race_villages: asTexts(input.race_villages) });
export const saveCorporatePartnerLead = ({ club, name, email, phone, members, villages, note }: PartnerLead) => save("corporatePartnerLead", { club, name, email, phone, members, villages, note });
export const saveCommunityPartnerLead = ({ club, name, email, phone, members, villages, note }: PartnerLead) => save("communityPartnerLead", { club, name, email, phone, members, villages, note });
