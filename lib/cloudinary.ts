"use server";

import { ENV } from "@/config/env";
import { v2 as cloudinary } from "cloudinary";
import { headers } from "next/headers";
import { auth } from "./auth";

cloudinary.config({
  cloud_name: ENV.BLOG_CLOUDINAR_CLOUD_NAME,
  api_key: ENV.BLOG_CLOUDINAR_API_KEY,
  api_secret: ENV.BLOG_CLOUDINAR_API_SECRET,
});
/**
 * Robust Public ID Extraction
 * Extracts the full path (including folders) but excludes the version and extension.
 */
export const getPublicIdFromUrl = async (
  url: string,
): Promise<string | null> => {
  if (!url || !url.includes("upload/")) return null;

  // Split by 'upload/' to isolate the path after the transformation/versioning
  const afterUpload = url.split("upload/")[1];

  // Remove the version segment (e.g., v12345678/) if it exists
  const pathWithoutVersion = afterUpload.replace(/^v\d+\//, "");

  // Remove the file extension at the end
  return pathWithoutVersion.replace(/\.[^/.]+$/, "");
};

/**
 * Handles the logic for uploading a new file or replacing an existing one.
 * Returns the secure_url on success, or null on failure.
 */
export const handleCloudinaryUpload = async (
  file: File,
  currentThumbnailUrl: string | null,
): Promise<string | null> => {
  try {
    // Security Check
    const session = await auth();
    if (!session || session.user.role !== "admin")
      throw new Error("Unauthorized");

    const oldPublicId = currentThumbnailUrl
      ? await getPublicIdFromUrl(currentThumbnailUrl)
      : null;

    // Generate Signature locally (Replaces the need for the /api/blog-sign fetch)
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign: any = {
      timestamp,
      ...(oldPublicId && {
        public_id: oldPublicId,
        overwrite: true,
        invalidate: true,
      }),
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      ENV.BLOG_CLOUDINAR_API_SECRET,
    );

    // Prepare FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", ENV.BLOG_CLOUDINAR_API_KEY);

    if (oldPublicId) {
      formData.append("public_id", oldPublicId);
      formData.append("overwrite", "true");
      formData.append("invalidate", "true");
    }

    // 4. Post to Cloudinary (External URL fetch is always absolute, so it works on server)
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${ENV.BLOG_CLOUDINAR_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );

    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    return null;
  }
};

/**
 * Handles the logic for deleting an image from Cloudinary.
 * Returns true on success, false on failure.
 */
export const handleCloudinaryDeleteByFetch = async (
  url: string,
): Promise<boolean> => {
  const publicId = await getPublicIdFromUrl(url);
  if (!publicId) return false;

  try {
    // 1. Fetch Signature for the destroy action
    const resSign = await fetch("/api/cloudinary/blog-sign", {
      method: "POST",
      body: JSON.stringify({ public_id: publicId, action: "delete" }),
    });

    if (!resSign.ok) throw new Error("Could not fetch delete signature");
    const { signature, timestamp, cloudName, apiKey } = await resSign.json();

    // 2. Prepare FormData for Destroy
    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("api_key", apiKey);
    formData.append("invalidate", "true");

    // 3. Post to Destroy endpoint
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: "POST", body: formData },
    );

    const data = await res.json();
    return data.result === "ok";
  } catch (err) {
    console.error("Cloudinary Delete Error:", err);
    return false;
  }
};

// used in server actions
export const handleCloudinaryDelete = async (url: string): Promise<boolean> => {
  try {
    const publicId = await getPublicIdFromUrl(url); // Use your existing helper
    if (!publicId) return false;

    // Use the SDK directly—no fetch or signatures needed on the server!
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    return result.result === "ok";
  } catch (err) {
    console.error("Cloudinary Delete Error:", err);
    return false;
  }
};
