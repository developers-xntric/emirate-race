"use client";

import { useRowLabel } from "@payloadcms/ui";

export default function CmsContentRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string; path?: string }>();
  const fallback = data.path?.split(".").at(-1)?.replace(/([a-z])([A-Z])/g, "$1 $2");
  return <span>{data.label || fallback || `Content ${String((rowNumber || 0) + 1).padStart(2, "0")}`}</span>;
}