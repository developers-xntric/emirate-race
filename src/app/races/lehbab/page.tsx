import type { Metadata } from "next";
import RacePage from "@/component/races/RacePage";
import { lehbab } from "@/data/races/lehbab";

export const metadata: Metadata = {
  title: "Lehbab Race | Emirates Villages Run Series 2026",
  description:
    "Run beyond the city in Lehbab, Dubai. Explore the family, community and competitive routes for race two of EVRS 2026.",
};
export default function LehbabPage() {
  return <RacePage race={lehbab} />;
}
