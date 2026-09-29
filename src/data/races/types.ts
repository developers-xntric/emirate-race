export type RaceRoute = {
  id: string;
  label: string;
  image: string;
  images?: string[];
  imageHeight: string;
  imageTop?: string;
  logoLeft: string;
  logoTop: string;
};
export type RacePageData = {
  name: string;
  heroTitle: string[];
  heroPosition: string;
  aboutAlt: string;
  registerUrl: string;
  date: string;
  introduction: string;
  paragraphs: string[];
  distances: { distance: string; title: string; description: string }[];
  assets: { hero: string; about: string; pattern: string; mark: string; location: string; routeLogo?: string };
  routes: RaceRoute[];
  routeCta: { eyebrow?: string; title: string; description: string; button: string };
  location: { name: string; address: string; query: string; mapQuery?: string; mapLabel?: string };
  journey: { title: string; description: string };
};
