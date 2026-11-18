import path from "node:path";
import type { CollectionConfig } from "payload";
import { cloudinaryDeliveryURL, cloudinaryEnabled, removeFromCloudinary, type CloudinaryResourceType, uploadToCloudinary } from "../cloudinary";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    group: "Administration",
    defaultColumns: ["filename", "mimeType", "updatedAt"],
    description: "Images and videos used across the site. Select one item to use the same media in English and Arabic.",
  },
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(process.cwd(), "media"),
    disableLocalStorage: cloudinaryEnabled,
    mimeTypes: ["image/*", "video/*", "application/pdf", "application/zip"],
  },
  hooks: {
    beforeChange: [async ({ data, originalDoc, req }) => {
      if (!cloudinaryEnabled || !req.file || req.context.skipCloudinaryUpload) return data;
      const uploaded = await uploadToCloudinary(req.file);
      if (!uploaded) return data;
      const previousPublicId = originalDoc?.cloudinaryPublicId as string | undefined;
      const previousResourceType = originalDoc?.cloudinaryResourceType as CloudinaryResourceType | undefined;
      if (previousPublicId && previousPublicId !== uploaded.publicId) {
        req.context.cloudinaryAssetToDelete = { publicId: previousPublicId, resourceType: previousResourceType };
      }
      return { ...data, url: uploaded.secureUrl, cloudinaryPublicId: uploaded.publicId, cloudinaryResourceType: uploaded.resourceType };
    }],
    afterChange: [async ({ doc, req }) => {
      const previous = req.context.cloudinaryAssetToDelete as { publicId?: string; resourceType?: CloudinaryResourceType } | undefined;
      await removeFromCloudinary(previous?.publicId, previous?.resourceType);
      return doc;
    }],
    afterRead: [({ doc }) => {
      const url = cloudinaryDeliveryURL(doc.cloudinaryPublicId as string | undefined, doc.cloudinaryResourceType as CloudinaryResourceType | undefined);
      if (url) {
        doc.url = url;
        if ((doc.mimeType as string | undefined)?.startsWith("image/")) doc.thumbnailURL = url;
      }
      return doc;
    }],    afterDelete: [async ({ doc }) => {
      await removeFromCloudinary(doc.cloudinaryPublicId as string | undefined, doc.cloudinaryResourceType as CloudinaryResourceType | undefined);
      return doc;
    }],
  },  fields: [
    { name: "sourceId", label: "Original Sanity asset ID", type: "text", unique: true, index: true, admin: { readOnly: true } },
    { name: "altEn", label: "English alt text", type: "text" },
    { name: "altAr", label: "Arabic alt text", type: "text" },
    { name: "originalFilename", label: "Original file name", type: "text", admin: { readOnly: true } },
    { name: "cloudinaryPublicId", type: "text", admin: { hidden: true, readOnly: true } },
    { name: "cloudinaryResourceType", type: "text", admin: { hidden: true, readOnly: true } },
  ],
};