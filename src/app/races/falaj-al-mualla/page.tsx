import type { Metadata } from "next";
import RacePage from "@/component/races/RacePage";
import { falajAlMualla } from "@/data/races/falaj-al-mualla";
export const metadata: Metadata = {
  title: "Falaj Al Mualla Race | Emirates Villages Run Series 2026",
  description:
    "Explore the family, community and competitive routes for EVRS race four in Falaj Al Mualla, Umm Al Quwain.",
};
export default function FalajAlMuallaPage() {
  return <RacePage race={falajAlMualla} />;
}
