"use client";

import { usePathname } from "next/navigation";
import Button from "@/component/Button";
import { useHomeData } from "@/component/LanguageProvider";

export default function FloatingCTA() {
  const data = useHomeData();
  const pathname = usePathname();

  if (pathname.startsWith("/studio")) return null;

  return (
    <div className="fixed top-1/2 z-[9999] -translate-y-1/2 -end-15.5 md:-end-15.2 2xl:-end-17.5 rtl:-end-11 2xl:rtl:-end-12 sm rotate-270">
      <Button href={data.register.href} tone="pink" className="rounded-none !py-4 !px-8">
        {data.register.label}
      </Button>
    </div>
  );
}