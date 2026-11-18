import { createHmac, timingSafeEqual } from "node:crypto";

const key = () => process.env.PAYLOAD_SECRET || "development-preview-key";

export const previewSignature = (path: string) => createHmac("sha256", key()).update(path).digest("hex");

export const isValidPreview = (path: string, token: string | null | undefined) => {
  if (!token) return false;
  const expected = previewSignature(path);
  return token.length === expected.length && timingSafeEqual(Buffer.from(token), Buffer.from(expected));
};