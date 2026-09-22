import type { Metadata } from "next";
import PartnersPage from "@/component/PartnersPage";

export const metadata: Metadata = {
  title: "Partners & Sponsors | Emirates Villages Run Series 2026",
  description:
    "Meet the partners and sponsors supporting the Emirates Villages Run Series across the UAE.",
};

export default function Page() {
  return <PartnersPage />;
}
