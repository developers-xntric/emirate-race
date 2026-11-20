import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EVRS Community Partners",
  description: "Your club. Seven villages. One journey. Join the Emirates Villages Run Series 2026 as a community partner.",
};

export default function EvrsCommunityPage() {
  return (
    <main className="flex min-h-dvh w-full flex-1">
      <iframe src="/evrs-community/page.html" title="EVRS Community Partners" className="min-h-dvh w-full flex-1 border-0" />
    </main>
  );
}