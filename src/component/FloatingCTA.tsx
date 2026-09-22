"use client";

import Button from "@/component/Button";
import { useHomeData } from "@/component/LanguageProvider";

export default function FloatingCTA() {
  const data = useHomeData();

  return (
    <div className="fixed top-1/2 z-[9999] -translate-y-1/2 -end-15.5 md:-end-17.5 rtl:-end-9 sm rotate-270">
      <Button href={data.register.href} tone="pink" className="rounded-none !py-4 !px-8">
        {data.register.label}
      </Button>
    </div>
  );
}