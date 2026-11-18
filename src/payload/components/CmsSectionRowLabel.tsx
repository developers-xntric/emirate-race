"use client";

import { useRowLabel } from "@payloadcms/ui";

export default function CmsSectionRowLabel() {
  const { data, rowNumber } = useRowLabel<{ sectionName?: string }>();
  return <span>{data.sectionName || `Section ${String((rowNumber || 0) + 1).padStart(2, "0")}`}</span>;
}