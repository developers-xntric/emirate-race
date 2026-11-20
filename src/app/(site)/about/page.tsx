import type { Metadata } from "next";
import AboutPage from "@/component/about/AboutPage";

export const metadata: Metadata = {
  title: "About EVRS | Emirates Villages Run Series 2026",
  description:
    "Seven races. One journey across the UAE. Discover the villages, race distances and community behind the Emirates Villages Run Series.",
};
export default function Page() {
  return <AboutPage />;
}
