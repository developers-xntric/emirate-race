import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, "");
}
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
});
const image = async (path: string) => {
  const a = await client.assets.upload("image", readFileSync(`public${path}`), {
    filename: path.split("/").pop(),
  });
  return { _type: "image", asset: { _type: "reference", _ref: a._id } };
};
const both = (name: string, en: string, ar: string) => ({
  [`${name}En`]: en,
  [`${name}Ar`]: ar,
});
async function seed() {
  await client.createOrReplace({
    _id: "contact",
    _type: "contactPage",
    pageName: "Contact page",
    hero: {
      sectionName: "Contact Us",
      ...both("title", "Contact Us", "تواصل معنا"),
      image: await image("/contact/hero.png"),
    },
    contactDetails: {
      sectionName: "We're Here to Help",
      ...both("label", "Contact Us", "تواصل معنا"),
      ...both("title", "We're Here to Help", "نحن هنا لمساعدتك"),
      email: "info@emiratesvillages.ae",
      image: await image("/contact/rahhal2.png"),
    },
    form: {
      sectionName: "Contact form",
      ...both("greeting", "Hello! My name is", "مرحبًا! اسمي"),
      ...both(
        "afterName",
        "and I'd like to get in touch about the Emirates Villages Run Series. You can email me at",
        "وأرغب في التواصل بشأن سلسلة سباقات قرى الإمارات. يمكنك مراسلتي عبر البريد الإلكتروني",
      ),
      ...both("afterEmail", "or reach me on", "أو الاتصال بي على"),
      ...both("namePlaceholder", "your full name", "اسمك الكامل"),
      ...both("emailPlaceholder", "your@email.com", "بريدك الإلكتروني"),
      ...both("phonePlaceholder", "your phone number", "رقم الهاتف"),
      ...both("messagePlaceholder", "My message...", "رسالتك..."),
      ...both(
        "racesLabel",
        "Which race are you interested in?",
        "أي سباق تهتم به؟",
      ),
      ...both("send", "Send My Enquiry", "إرسال استفساري"),
      ...both("sending", "Sending...", "جارٍ الإرسال..."),
      raceOptions: [
        "Qidfa",
        "Al Lehbab",
        "Falaj Al Mualla",
        "Al Shuwaib",
        "Masfout",
        "Al Rams",
        "Wadi Al Helo",
        "Other",
      ].map((x, i) => ({
        _key: `race-${i}`,
        ...both(
          "label",
          x,
          [
            "قدفع",
            "الهباب",
            "فلج المعلا",
            "الشويب",
            "مصفوت",
            "الرمس",
            "وادي الحلو",
            "أخرى",
          ][i],
        ),
      })),
    },
  });
}
seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
