import type { Metadata } from "next";
import RacePage from "@/component/races/RacePage";
import { alRams } from "@/data/races/al-rams";
export const metadata: Metadata = {
  title: "Al Rams Race | Emirates Villages Run Series 2026",
  description:
    "Explore the family, community and competitive routes for EVRS race six in Al Rams, Ras Al Khaimah.",
};
export default function AlRamsPage() {
  return <RacePage race={alRams} />;
}
