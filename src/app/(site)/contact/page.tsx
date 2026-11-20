import type { Metadata } from "next";
import ContactPage from "@/component/contact/ContactPage";
export const metadata: Metadata = {
  title: "Contact Us | Emirates Villages Run Series 2026",
  description: "Contact the Emirates Villages Run Series team.",
};
export default function Page() {
  return <ContactPage />;
}
