"use server";

import { ENV } from "@/config/env";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "../../lib/auth";

export const getPublicIdFromUrl = async (
  url: string,
): Promise<string | null> => {
  if (!url || !url.includes("upload/")) return null;

  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("cloudinary.com")) return null;

    const pathname = urlObj.pathname;
    const match = pathname.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);

    if (!match) return null;

    const publicId = match[1];

    // Whitelist validation: alphanumeric, hyphens, underscores, slashes only
    if (!/^[a-zA-Z0-9/_-]+$/.test(publicId)) {
      console.warn(`Invalid public ID format: ${publicId}`);
      return null;
    }

    return publicId;
  } catch (err) {
    console.error("Error parsing URL for public ID:", err);
    return null;
  }
};

export const handleCloudinaryBlogUpload = async (
  file: File,
  currentThumbnailUrl: string | null,
): Promise<string | null> => {
  try {
    // Validate session FIRST
    const session = await auth();
    if (!session) {
      console.error("[BLOG_UPLOAD] Authentication failed: No active session");
      throw new Error("Unauthorized: No active session");
    }

    if (session.user.role !== "admin") {
      console.error(
        `[BLOG_UPLOAD] Authorization failed: User role is '${session.user.role}', expected 'admin'`,
      );
      throw new Error("Unauthorized: Insufficient privileges");
    }

    // Configure Cloudinary at RUNTIME (not module load)
    cloudinary.config({
      cloud_name: ENV.BLOG_CLOUDINAR_CLOUD_NAME,
      api_key: ENV.BLOG_CLOUDINAR_API_KEY,
      api_secret: ENV.BLOG_CLOUDINAR_API_SECRET,
    });

    // Verify configuration was applied
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error("[BLOG_UPLOAD] Cloudinary config incomplete:", {
        has_cloud_name: !!config.cloud_name,
        has_api_key: !!config.api_key,
        has_api_secret: !!config.api_secret,
      });
      throw new Error("Cloudinary configuration failed: Missing credentials");
    }

    // Extract and validate public ID
    const oldPublicId = currentThumbnailUrl
      ? await getPublicIdFromUrl(currentThumbnailUrl)
      : null;

    // Generate signature with current timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign: any = {
      timestamp,
    };

    if (oldPublicId) {
      paramsToSign.public_id = oldPublicId;
      paramsToSign.overwrite = true;
      paramsToSign.invalidate = true;
    }

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

    // Upload to Cloudinary with timeout
    const uploadUrl = `https://api.cloudinary.com/v1_1/${ENV.BLOG_CLOUDINAR_CLOUD_NAME}/image/upload`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();

    if (!res.ok || data.error) {
      const errorMsg = data.error?.message || `HTTP ${res.status}`;
      console.error("[BLOG_UPLOAD] Cloudinary API Error:", {
        status: res.status,
        error: errorMsg,
      });
      throw new Error(`Cloudinary API Error: ${errorMsg}`);
    }

    if (!data.secure_url) {
      throw new Error("Cloudinary response missing secure_url");
    }

    return data.secure_url;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[BLOG_UPLOAD_FAILED]", {
      error: errorMsg,
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      env_check: {
        has_cloud_name: !!ENV.BLOG_CLOUDINAR_CLOUD_NAME,
        has_api_key: !!ENV.BLOG_CLOUDINAR_API_KEY,
        has_api_secret: !!ENV.BLOG_CLOUDINAR_API_SECRET,
      },
    });
    return null;
  }
};

export const handleCloudinaryBlogDelete = async (
  url: string,
): Promise<boolean> => {
  try {
    // Extract public ID
    const publicId = await getPublicIdFromUrl(url);
    if (!publicId) {
      console.error("[BLOG_DELETE] Invalid or empty public ID");
      return false;
    }

    // Configure at RUNTIME
    cloudinary.config({
      cloud_name: ENV.BLOG_CLOUDINAR_CLOUD_NAME,
      api_key: ENV.BLOG_CLOUDINAR_API_KEY,
      api_secret: ENV.BLOG_CLOUDINAR_API_SECRET,
    });

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result !== "ok") {
      console.error("[BLOG_DELETE] Destroy result not ok:", result.result);
      return false;
    }

    return true;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[BLOG_DELETE_FAILED]", {
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
    return false;
  }
};

// Legacy: Fetch-based signature endpoint (kept for backwards compatibility if needed)
export const handleCloudinaryDeleteByFetch = async (
  url: string,
): Promise<boolean> => {
  const publicId = await getPublicIdFromUrl(url);
  if (!publicId) return false;

  try {
    const resSign = await fetch("/api/cloudinary/blog-sign", {
      method: "POST",
      body: JSON.stringify({ public_id: publicId, action: "delete" }),
    });

    if (!resSign.ok) {
      console.error("[BLOG_DELETE_FETCH] Could not fetch delete signature");
      return false;
    }

    const { signature, timestamp, cloudName, apiKey } = await resSign.json();

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("api_key", apiKey);
    formData.append("invalidate", "true");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: "POST", body: formData },
    );

    const data = await res.json();
    return data.result === "ok";
  } catch (err) {
    console.error("[BLOG_DELETE_FETCH_FAILED]", err);
    return false;
  }
};
