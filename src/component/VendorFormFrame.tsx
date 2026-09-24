"use client";

import { useEffect, useRef, useState } from "react";

const initialHeight = 2400;

export default function VendorFormFrame() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState(initialHeight);

  function updateHeight() {
    const document = frameRef.current?.contentDocument;
    if (!document) return;

    const nextHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
    setHeight((currentHeight) =>
      currentHeight === nextHeight ? currentHeight : nextHeight,
    );
  }

  function observeHeight() {
    const document = frameRef.current?.contentDocument;
    if (!document) return;

    observerRef.current?.disconnect();
    observerRef.current = new ResizeObserver(updateHeight);
    observerRef.current.observe(document.body);
    observerRef.current.observe(document.documentElement);
    updateHeight();
  }

  useEffect(() => {
    function receiveHeight(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== frameRef.current?.contentWindow ||
        !event.data ||
        event.data.type !== "vendor-form-height" ||
        typeof event.data.height !== "number"
      ) {
        return;
      }

      setHeight(Math.ceil(event.data.height));
    }

    window.addEventListener("message", receiveHeight);
    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("message", receiveHeight);
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      src="/vendor-form-2026.html"
      title="EVRS 2026 Vendor Booking Form"
      onLoad={observeHeight}
      style={{ height }}
      className="block w-full border-0 bg-white"
    />
  );
}
