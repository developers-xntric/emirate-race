"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { homeData } from "@/data/home-data";
import { arabicData } from "@/data/home-data/arabic-index";
import { previewQuery } from "@/lib/payload/preview-client";
import { mergePayloadCmsPreview, usePayloadCmsPreview } from "@/component/usePayloadCmsPreview";

type Language = "en" | "ar";
type Cms = any;
const LanguageContext = createContext({ data: homeData as typeof homeData | typeof arabicData, language: "en" as Language, toggleLanguage: () => {} });
const value = (field: any, language: Language, fallback: string) =>
  typeof field === "string" ? field : field?.[language] ?? fallback;
const localized = (source: any, name: string, language: Language, fallback: string) =>
  value(source?.[`${name}${language === "en" ? "En" : "Ar"}`], language, fallback);

function applyHomeContent(base: any, cms: Cms, language: Language) {
  const home = cms?.home;
  if (!home) return base;
  const text = (section: any, name: string, fallback: string) => localized(section, name, language, fallback);
  const paragraphs = (section: any, fallback: string[]) => text(section, "paragraph", fallback.join("\n\n")).split("\n\n");
  return {
    ...base,
    metadata: home.seo ? { title: text(home.seo, "title", base.metadata.title), description: text(home.seo, "description", base.metadata.description) } : base.metadata,
    assets: { ...base.assets, ...(home.hero?.video ? { heroVideo: home.hero.video } : {}), ...(home.hero?.poster ? { heroPoster: home.hero.poster } : {}), ...(home.about?.video ? { aboutVideo: home.about.video } : {}), ...(home.about?.videoPoster ? { aboutPoster: home.about.videoPoster } : {}), ...(home.medal?.image ? { medalPattern: home.medal.image } : {}), ...(home.prizes?.image ? { prizeRahhal: home.prizes.image } : {}), ...(home.recognition?.videoA ? { recognitionRunA: home.recognition.videoA } : {}), ...(home.recognition?.videoB ? { recognitionRunB: home.recognition.videoB } : {}) },
    hero: home.hero ? { ...base.hero, title: text(home.hero, "title", base.hero.title.join("\n")).split("\n"), paragraphs: paragraphs(home.hero, base.hero.paragraphs), next: text(home.hero, "next", base.hero.next), dates: text(home.hero, "dates", base.hero.dates), cta: text(home.hero, "cta", base.hero.cta) } : base.hero,
    about: home.about ? { ...base.about, eyebrow: text(home.about, "eyebrow", base.about.eyebrow), title: text(home.about, "title", base.about.title), paragraphs: paragraphs(home.about, base.about.paragraphs), patronage: text(home.about, "patronage", base.about.patronage) } : base.about,
    rahhal: home.rahhal ? { ...base.rahhal, eyebrow: text(home.rahhal, "eyebrow", base.rahhal.eyebrow), title: text(home.rahhal, "title", base.rahhal.title), paragraphs: paragraphs(home.rahhal, base.rahhal.paragraphs), challenge: text(home.rahhal, "challenge", base.rahhal.challenge), invitation: text(home.rahhal, "invitation", base.rahhal.invitation), follow: text(home.rahhal, "follow", base.rahhal.follow), register: text(home.rahhal, "register", base.rahhal.register), traits: base.rahhal.traits.map((trait: any, index: number) => { const item = home.rahhal.items?.[index]; return item ? { ...trait, title: text(item, "title", trait.title), description: text(item, "paragraph", trait.description), video: item.video || trait.video } : trait; }) } : base.rahhal,
    distances: home.distances ? { ...base.distances, eyebrow: text(home.distances, "eyebrow", base.distances.eyebrow), title: text(home.distances, "title", base.distances.title), cards: base.distances.cards.map((card: any, index: number) => { const item = home.distances.items?.[index]; return item ? { ...card, title: text(item, "title", card.title), description: text(item, "paragraph", card.description), cta: text(item, "cta", card.cta), image: item.image || card.image } : card; }) } : base.distances,
    calendar: home.calendar ? { ...base.calendar, eyebrow: text(home.calendar, "eyebrow", base.calendar.eyebrow), title: text(home.calendar, "title", base.calendar.title), register: text(home.calendar, "register", base.calendar.register), details: text(home.calendar, "details", base.calendar.details), dayLabel: text(home.calendar, "dayLabel", base.calendar.dayLabel), raceLabel: text(home.calendar, "raceLabel", base.calendar.raceLabel), mapEyebrow: text(home.calendar, "mapEyebrow", base.calendar.mapEyebrow), mapTitle: text(home.calendar, "mapTitle", base.calendar.mapTitle), medalPieceLabel: text(home.calendar, "medalPieceLabel", base.calendar.medalPieceLabel), medalLabel: text(home.calendar, "medalLabel", base.calendar.medalLabel), medalAltLabel: text(home.calendar, "medalAltLabel", base.calendar.medalAltLabel), viewMedalLabel: text(home.calendar, "viewMedalLabel", base.calendar.viewMedalLabel), races: base.calendar.races.map((race: any, index: number) => { const item = home.calendar.items?.[index]; return item ? { ...race, village: text(item, "title", race.village), emirate: text(item, "paragraph", race.emirate), month: text(item, "cta", race.month), href: item.href || race.href, icon: item.icon || race.icon, medalImage: item.medalImage || race.medalImage } : race; }) } : base.calendar,
    medal: home.medal ? { ...base.medal, eyebrow: text(home.medal, "eyebrow", base.medal.eyebrow), title: text(home.medal, "title", base.medal.title), paragraphs: paragraphs(home.medal, base.medal.paragraphs), cta: text(home.medal, "cta", base.medal.cta) } : base.medal,
    sevenPieceMedal: home.sevenPieceMedal ? { ...base.sevenPieceMedal, eyebrow: text(home.sevenPieceMedal, "eyebrow", base.sevenPieceMedal.eyebrow), title: text(home.sevenPieceMedal, "title", base.sevenPieceMedal.title), description: text(home.sevenPieceMedal, "description", base.sevenPieceMedal.description), piecesCollected: text(home.sevenPieceMedal, "piecesCollected", base.sevenPieceMedal.piecesCollected), fullMedalUnlocked: text(home.sevenPieceMedal, "fullMedalUnlocked", base.sevenPieceMedal.fullMedalUnlocked), runWholeSeason: text(home.sevenPieceMedal, "runWholeSeason", base.sevenPieceMedal.runWholeSeason), collectingSeason: text(home.sevenPieceMedal, "collectingSeason", base.sevenPieceMedal.collectingSeason), reset: text(home.sevenPieceMedal, "reset", base.sevenPieceMedal.reset), medalMarkAlt: text(home.sevenPieceMedal, "medalMarkAlt", base.sevenPieceMedal.medalMarkAlt), piecesLabel: text(home.sevenPieceMedal, "piecesLabel", base.sevenPieceMedal.piecesLabel), pieceAltSuffix: text(home.sevenPieceMedal, "pieceAltSuffix", base.sevenPieceMedal.pieceAltSuffix), pieces: home.sevenPieceMedal.items?.map((item: any, index: number) => ({ ...base.sevenPieceMedal.pieces[index], name: text(item, "title", base.sevenPieceMedal.pieces[index]?.name || ""), image: item.image || base.sevenPieceMedal.pieces[index]?.image })) ?? base.sevenPieceMedal.pieces, completedImage: home.sevenPieceMedal.completedImage || base.sevenPieceMedal.completedImage, completedImageAlt: text(home.sevenPieceMedal, "completedImageAlt", base.sevenPieceMedal.completedImageAlt), unlocked: text(home.sevenPieceMedal, "unlocked", base.sevenPieceMedal.unlocked), completedTitle: text(home.sevenPieceMedal, "completedTitle", base.sevenPieceMedal.completedTitle), completedDescription: text(home.sevenPieceMedal, "completedDescription", base.sevenPieceMedal.completedDescription) } : base.sevenPieceMedal,
    prizes: home.prizes ? { ...base.prizes, title: text(home.prizes, "title", base.prizes.title), description: text(home.prizes, "paragraph", base.prizes.description), cta: text(home.prizes, "cta", base.prizes.cta) } : base.prizes,
    recognition: home.recognition ? { ...base.recognition, eyebrow: text(home.recognition, "eyebrow", base.recognition.eyebrow), title: text(home.recognition, "title", base.recognition.title), paragraphs: paragraphs(home.recognition, base.recognition.paragraphs), cta: text(home.recognition, "cta", base.recognition.cta) } : base.recognition,
    gallery: home.gallery ? { ...base.gallery, eyebrow: text(home.gallery, "eyebrow", base.gallery.eyebrow), title: text(home.gallery, "title", base.gallery.title), year2025: text(home.gallery, "year2025", base.gallery.year2025), year2026: text(home.gallery, "year2026", base.gallery.year2026), comingSoon: text(home.gallery, "comingSoon", base.gallery.comingSoon), races: base.gallery.races.map((race: any, index: number) => { const item = home.gallery.items?.[index]; return item ? { ...race, label: text(item, "title", race.label), link: item.href || race.link, images: item.images?.length ? item.images : race.images, images2026: item.images2026 ?? [], comingSoonImage: item.comingSoonImage || race.comingSoonImage } : race; }) } : base.gallery,
    faq: home.faq ? { ...base.faq, eyebrow: text(home.faq, "eyebrow", base.faq.eyebrow), title: text(home.faq, "title", base.faq.title), columns: home.faq.items?.length ? [home.faq.items.slice(0, 4).map((item: any, index: number) => ({ question: text(item, "title", base.faq.columns[0][index]?.question), answer: text(item, "paragraph", base.faq.columns[0][index]?.answer) })), home.faq.items.slice(4).map((item: any, index: number) => ({ question: text(item, "title", base.faq.columns[1][index]?.question), answer: text(item, "paragraph", base.faq.columns[1][index]?.answer) }))] : base.faq.columns } : base.faq,
    cta: home.cta ? { ...base.cta, title: text(home.cta, "title", base.cta.title), paragraphs: paragraphs(home.cta, base.cta.paragraphs), explore: text(home.cta, "explore", base.cta.explore) } : base.cta,
  };
}
function applySharedContent(base: any, cms: Cms, language: Language) {
  if (!cms) return base;
  const nav = cms.navbar;
  const footer = cms.footer;
  const navigation = nav?.navigation ?? [];
  return {
    ...base,
    brand: localized(nav, "brand", language, base.brand),
    register: nav?.registerEn || nav?.registerAr ? { label: localized(nav, "register", language, base.register.label), href: nav.registerHref || base.register.href } : base.register,
    ui: nav ? { ...base.ui, nav: { ...base.ui.nav, home: localized(navigation[0], "label", language, base.ui.nav.home), about: localized(navigation[1], "label", language, base.ui.nav.about), faqs: localized(navigation[3], "label", language, base.ui.nav.faqs), contact: localized(navigation[4], "label", language, base.ui.nav.contact), races: localized(navigation[2], "label", language, base.ui.nav.races) }, navRaces: nav.races?.map((race: any, i: number) => ({ label: localized(race, "label", language, base.ui.navRaces[i]?.label), href: race.href || base.ui.navRaces[i]?.href })) ?? base.ui.navRaces } : base.ui,
    assets: { ...base.assets, ...(nav?.logo ? { logo: nav.logo } : {}), ...(footer?.logo ? { footerLogo: footer.logo } : {}) },
    footer: footer ? { ...base.footer, ...(footer.preFooterLogo ? { preFooterLogo: footer.preFooterLogo } : {}), description: localized(footer, "description", language, base.footer.description), organizer: localized(footer, "organizer", language, base.footer.organizer), email: footer.email || base.footer.email, emailHref: footer.emailHref || `mailto:${footer.email || base.footer.email}`, quickLinks: localized(footer, "quickLinksTitle", language, base.footer.quickLinks), linksPrimary: footer.quickLinksPrimary?.map((link: any) => ({ label: localized(link, "label", language, ""), href: link.href, pressKit: link.isPressKit })) ?? undefined, linksRaces: footer.quickLinksRaces?.map((link: any) => ({ label: localized(link, "label", language, ""), href: link.href })) ?? undefined, socials: footer.socials ?? base.footer.socials, copyright: localized(footer, "copyright", language, base.footer.copyright), legal: footer.legal?.map((link: any, i: number) => localized(link, "label", language, base.footer.legal[i])) ?? base.footer.legal } : base.footer,
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const pathname = usePathname();
  const [cms, setCms] = useState<Cms>(null);
  usePayloadCmsPreview((sourceId, content) => {
    const key = sourceId === "home" ? "home" : sourceId === "navbar" ? "navbar" : sourceId === "footer" ? "footer" : null;
    if (key) setCms((current: Cms) => ({ ...(current || {}), [key]: mergePayloadCmsPreview(current?.[key], content) }));
  });
  const base = language === "ar" ? arabicData : homeData;
  const data = applyHomeContent(applySharedContent(base, cms, language), cms, language) as typeof homeData;
  useEffect(() => {
    fetch("/api/cms/site" + previewQuery(), { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
      .then((response) => {
        if (!response.ok) throw new Error(`CMS request failed (${response.status})`);
        return response.json();
      })
      .then(setCms)
      .catch((error) => console.error("Unable to load published CMS content:", error));
  }, []);
  useEffect(() => { try { if (localStorage.getItem("evrs-language") === "ar") queueMicrotask(() => setLanguage("ar")); } catch {} }, []);
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; if (pathname === "/") { document.title = data.metadata.title; document.querySelector('meta[name="description"]')?.setAttribute("content", data.metadata.description); } }, [language, data, pathname]);
  function toggleLanguage() { const next = language === "en" ? "ar" : "en"; setLanguage(next); try { localStorage.setItem("evrs-language", next); } catch {} }
  return <LanguageContext.Provider value={{ data: data as typeof homeData | typeof arabicData, language, toggleLanguage }}>{children}</LanguageContext.Provider>;
}
export const useHomeData = () => useContext(LanguageContext).data;
export const useLanguage = () => useContext(LanguageContext);
