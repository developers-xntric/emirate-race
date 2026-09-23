import type { Metadata } from "next";
import RacePage from "@/component/races/RacePage";
import { wadiAlHelo } from "@/data/races/wadi-al-helo";
export const metadata: Metadata = {
  title: "Wadi Al Hilo Race | Emirates Villages Run Series 2026",
  description:
    "Explore the 1.5km, 6.4km and 9.6km Wadi Al Hilo routes for race three of EVRS 2026 in Sharjah.",
};
export default function WadiAlHeloPage() {
  return <RacePage race={wadiAlHelo} />;
}
