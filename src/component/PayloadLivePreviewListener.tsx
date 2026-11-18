"use client";

import { useEffect } from "react";

/** Announces iframe readiness; page-level hooks apply the editor's unsaved data immediately. */
export default function PayloadLivePreviewListener() {
  useEffect(() => {
    const origin = window.location.origin;
    window.parent?.postMessage({ type: "payload-live-preview", ready: true }, origin);
    return undefined;
  }, []);

  return null;
}