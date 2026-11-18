import { loadEnvConfig } from "@next/env";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import type { PayloadRequest } from "payload";

loadEnvConfig(process.cwd());

export const cloudinaryEnabled = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET,
);

if (cloudinaryEnabled) {
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
}

type CloudinaryFile = NonNullable<PayloadRequest["file"]>;
export type CloudinaryResourceType = "image" | "video" | "raw";

export const resourceTypeFor = (mimeType = ""): CloudinaryResourceType => mimeType.startsWith("video/") ? "video" : mimeType.startsWith("image/") ? "image" : "raw";

const safePublicId = (filename: string) => {
  const stem = filename.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-+|-+$/g, "");
  return `${stem || "media"}-${Date.now()}`;
};

export const cloudinaryDeliveryURL = (publicId?: string, resourceType?: CloudinaryResourceType) => {
  if (!cloudinaryEnabled || !publicId || !resourceType) return undefined;
  const base = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${publicId}`;
  return resourceType === "image" ? base.replace("/image/upload/", "/image/upload/f_auto,q_auto/") : base;
};
const deliveryUrl = (secureUrl: string, resourceType: CloudinaryResourceType) => {
  // Leave the original intact in Cloudinary. These delivery-only parameters let
  // Cloudinary select an efficient browser format and quality for images.
  return resourceType === "image" ? secureUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/") : secureUrl;
};

export async function uploadToCloudinary(file: CloudinaryFile) {
  if (!cloudinaryEnabled) return null;
  const resourceType = resourceTypeFor(file.mimetype);
  const originalBuffer = file.data as Buffer | undefined;
  // Cloudinary Free accepts assets up to 10 MB. Keep source exports intact and
  // optimize only oversized raster images for hosted delivery.
  const optimizedBuffer = resourceType === "image" && originalBuffer && originalBuffer.length > 9_000_000
    ? await sharp(originalBuffer).rotate().resize({ width: 3200, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer()
    : originalBuffer;
  const source = optimizedBuffer ? Readable.from([optimizedBuffer]) : file.tempFilePath ? createReadStream(file.tempFilePath) : Readable.from([file.data]);
  return new Promise<{ publicId: string; resourceType: CloudinaryResourceType; secureUrl: string }>((resolve, reject) => {
    const callback = (error: Error | undefined, result?: { public_id: string; secure_url: string }) => {
      if (error || !result) return reject(error || new Error("Cloudinary did not return an upload result."));
      resolve({ publicId: result.public_id, resourceType, secureUrl: deliveryUrl(result.secure_url, resourceType) });
    };
    const options = { folder: "evrs", public_id: safePublicId(file.name), resource_type: resourceType, overwrite: false } as const;
    const fileSize = Number(optimizedBuffer?.length ?? originalBuffer?.length ?? (file as { size?: number; filesize?: number }).size ?? (file as { filesize?: number }).filesize ?? 0);
    const destination = resourceType === "video" || fileSize > 10_000_000
      ? cloudinary.uploader.upload_chunked_stream({ ...options, chunk_size: 6_000_000 }, callback)
      : cloudinary.uploader.upload_stream(options, callback);
    source.on("error", reject).pipe(destination);
  });
}

export async function removeFromCloudinary(publicId?: string, resourceType?: CloudinaryResourceType) {
  if (!cloudinaryEnabled || !publicId || !resourceType) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
}