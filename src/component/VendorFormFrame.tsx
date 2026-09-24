"use client";

import { useRef, useState } from "react";

const initialHeight = 2400;

export default function VendorFormFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(initialHeight);

  function updateHeight() {
    const document = frameRef.current?.contentDocument;
    if (!document) return;

    const nextHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
    setHeight(nextHeight);
  }

  return (
    <iframe
      ref={frameRef}
      src="/vendor-form-2026.html"
      title="EVRS 2026 Vendor Booking Form"
      onLoad={updateHeight}
      style={{ height }}
      className="block w-full border-0 bg-white"
    />
  );
}
