"use client";

import { useLayoutEffect, useRef } from "react";
import { Button, useLivePreviewContext } from "@payloadcms/ui";

/** Keeps the editor's existing preview URL mounted while Payload refreshes draft data. */
export default function CmsPreviewToggle() {
  const { isLivePreviewing, setIsLivePreviewing, setURL, url } = useLivePreviewContext();
  const lastUsableURL = useRef<string | undefined>(undefined);

  useLayoutEffect(() => {
    if (typeof url === "string" && url) {
      lastUsableURL.current = url;
      return;
    }
    // A collection-level URL function is recalculated during autosave. Preserve
    // the last valid URL so the right-side iframe never unmounts between edits.
    if (lastUsableURL.current) setURL(lastUsableURL.current);
  }, [setURL, url]);

  return (
    <Button
      buttonStyle={isLivePreviewing ? "secondary" : "primary"}
      onClick={() => setIsLivePreviewing(!isLivePreviewing)}
      size="small"
      type="button"
      tooltip="Open or close the always-available draft preview"
    >
      {isLivePreviewing ? "Close preview" : "Open preview"}
    </Button>
  );
}