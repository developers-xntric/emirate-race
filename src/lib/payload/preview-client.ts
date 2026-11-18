"use client";

export const previewQuery = () => {
  if (typeof window === "undefined") return "";
  const token = new URLSearchParams(window.location.search).get("preview");
  if (!token) return "";
  const params = new URLSearchParams({ preview: token, path: window.location.pathname });
  return `?${params.toString()}`;
};