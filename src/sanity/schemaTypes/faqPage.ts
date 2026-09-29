import { defineField, defineType } from "sanity";
import { homeData } from "../../data/home-data";
import { arabicData } from "../../data/home-data/arabic-index";

const text = (name: string, title: string, type: "string" | "text" = "string") => [
  defineField({ name: `${name}En`, title: `English ${title}`, type, rows: type === "text" ? 4 : undefined }),
  defineField({ name: `${name}Ar`, title: `Arabic ${title}`, type, rows: type === "text" ? 4 : undefined }),
];

const englishQuestions = homeData.faq.columns.flat();
const arabicQuestions = arabicData.faq.columns.flat();
const initialQuestions = englishQuestions.map((item, index) => ({
  questionEn: item.question,
  answerEn: item.answer,
  questionAr: arabicQuestions[index]?.question || "",
  answerAr: arabicQuestions[index]?.answer || "",
}));

export const faqPageType = defineType({
  name: "faqPage",
  title: "FAQ page",
  type: "document",
  initialValue: {
    pageName: "FAQ page",
    hero: { titleEn: homeData.faq.title, titleAr: arabicData.faq.title },
    questions: initialQuestions,
  },
  fields: [
    defineField({ name: "pageName", title: "Page name", type: "string", readOnly: true, initialValue: "FAQ page" }),
    defineField({ name: "seo", title: "SEO metadata", type: "object", fields: [...text("title", "meta title"), ...text("description", "meta description", "text")] }),
    defineField({ name: "hero", title: "Hero", type: "object", fields: [
      defineField({ name: "sectionName", title: "Section name", type: "string", readOnly: true, initialValue: "Hero" }),
      ...text("title", "title"),
      defineField({ name: "image", title: "Hero image", type: "image", options: { hotspot: true } }),
    ] }),
    defineField({ name: "questions", title: "FAQ questions and answers", type: "array", of: [{ type: "object", fields: [
      ...text("question", "question"),
      ...text("answer", "answer", "text"),
    ] }] }),
  ],
});
