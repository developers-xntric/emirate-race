import { getPayload } from "payload";
import config from "../payload.config";
import { termsRules } from "../src/data/terms-and-conditions";

const fields = [
  { path: "title", label: "Page title", english: "Terms and Conditions", arabic: "" },
  { path: "rules", label: "Terms and conditions content", english: termsRules, arabic: "" },
];

async function main() {
  const payload = await getPayload({ config });
  const data = {
    adminTitle: "Terms and Conditions",
    sourceId: "terms-and-conditions",
    documentType: "termsPage" as const,
    pageName: "Terms and Conditions",
    seo: {
      titleEn: "Terms and Conditions | Emirates Villages Run Series 2026",
      titleAr: "",
      descriptionEn: "Terms and Conditions for Emirates Villages Run Series 2026.",
      descriptionAr: "",
    },
    content: { titleEn: "Terms and Conditions", titleAr: "", rulesEn: termsRules, rulesAr: "" },
    contentSections: [{ sectionName: "Terms and Conditions", fields }],
    contentFields: [],
  };
  const found = await payload.find({ collection: "cms-documents", where: { sourceId: { equals: "terms-and-conditions" } }, limit: 1, overrideAccess: true });
  if (found.docs[0]) await payload.update({ collection: "cms-documents", id: found.docs[0].id, data, overrideAccess: true });
  else await payload.create({ collection: "cms-documents", data, overrideAccess: true });
  console.log("Terms and Conditions is available in Payload Pages & global content.");
}

void main().catch((error) => { console.error(error); process.exitCode = 1; });