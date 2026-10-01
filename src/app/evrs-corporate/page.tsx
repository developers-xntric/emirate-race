import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVRS Corporate Partners",
  description: "Your team. Seven villages. One journey. Join the Emirates Villages Run Series 2026 as a corporate partner.",
};

export default function EvrsCorporatePage() {
  return (
    <main className="flex min-h-dvh w-full flex-1">
      <iframe src="/evrs-corporate/page.html" title="EVRS Corporate Partners" className="min-h-dvh w-full flex-1 border-0" />
    </main>
  );
}