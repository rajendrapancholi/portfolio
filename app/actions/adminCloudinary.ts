"use server";

import { ENV } from "@/config/env";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// CRITICAL: DO NOT configure at module level
// cloudinary.config({ ... }); // REMOVED

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

export const handleCloudinaryAdminUpload = async (
  file: File,
  currentThumbnailUrl: string | null,
): Promise<string | null> => {
  try {
    // STEP 1: Validate session FIRST
    const session = await auth();
    if (!session) {
      console.error("[ADMIN_UPLOAD] Authentication failed: No active session");
      throw new Error("Unauthorized: No active session");
    }

    if (session.user.role !== "admin") {
      console.error(
        `[ADMIN_UPLOAD] Authorization failed: User role is '${session.user.role}', expected 'admin'`,
      );
      throw new Error("Unauthorized: Insufficient privileges");
    }

    // STEP 2: Configure Cloudinary at RUNTIME (not module load)
    cloudinary.config({
      cloud_name: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_SECRET,
    });

    // Verify configuration was applied
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error("[ADMIN_UPLOAD] Cloudinary config incomplete:", {
        has_cloud_name: !!config.cloud_name,
        has_api_key: !!config.api_key,
        has_api_secret: !!config.api_secret,
      });
      throw new Error("Cloudinary configuration failed: Missing credentials");
    }

    // STEP 3: Extract and validate public ID
    const oldPublicId = currentThumbnailUrl
      ? await getPublicIdFromUrl(currentThumbnailUrl)
      : null;

    // STEP 4: Generate signature with current timestamp
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
      ENV.CLOUDINARY_SECRET,
    );

    // STEP 5: Prepare FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY);

    if (oldPublicId) {
      formData.append("public_id", oldPublicId);
      formData.append("overwrite", "true");
      formData.append("invalidate", "true");
    }

    // STEP 6: Upload to Cloudinary with timeout
    const uploadUrl = `https://api.cloudinary.com/v1_1/${ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

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
      console.error("[ADMIN_UPLOAD] Cloudinary API Error:", {
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
    console.error("[ADMIN_UPLOAD_FAILED]", {
      error: errorMsg,
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
      env_check: {
        has_cloud_name: !!ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        has_api_key: !!ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        has_api_secret: !!ENV.CLOUDINARY_SECRET,
      },
    });
    return null;
  }
};

export const handleCloudinaryAdminDelete = async (
  url: string,
): Promise<boolean> => {
  try {
    // Extract public ID
    const publicId = await getPublicIdFromUrl(url);
    if (!publicId) {
      console.error("[ADMIN_DELETE] Invalid or empty public ID");
      return false;
    }

    // Configure at RUNTIME
    cloudinary.config({
      cloud_name: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_SECRET,
    });

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result !== "ok") {
      console.error("[ADMIN_DELETE] Destroy result not ok:", result.result);
      return false;
    }

    return true;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("[ADMIN_DELETE_FAILED]", {
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
    const resSign = await fetch("/api/cloudinary/project-sign", {
      method: "POST",
      body: JSON.stringify({ public_id: publicId, action: "delete" }),
    });

    if (!resSign.ok) {
      console.error("[ADMIN_DELETE_FETCH] Could not fetch delete signature");
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
    console.error("[ADMIN_DELETE_FETCH_FAILED]", err);
    return false;
  }
};

// "use server";

// import { ENV } from "@/config/env";
// import { auth } from "@/lib/auth";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//   api_secret: ENV.CLOUDINARY_SECRET,
// });

// /**
//  * Robust Public ID Extraction
//  * Extracts the full path (including folders) but excludes the version and extension.
//  */
// export const getPublicIdFromUrl = async (
//   url: string,
// ): Promise<string | null> => {
//   if (!url || !url.includes("upload/")) return null;

//   // Split by 'upload/' to isolate the path after the transformation/versioning
//   const afterUpload = url.split("upload/")[1];

//   // Remove the version segment (e.g., v12345678/) if it exists
//   const pathWithoutVersion = afterUpload.replace(/^v\d+\//, "");

//   // Remove the file extension at the end
//   return pathWithoutVersion.replace(/\.[^/.]+$/, "");
// };

// /**
//  * Handles the logic for uploading a new file or replacing an existing one.
//  * Returns the secure_url on success, or null on failure.
//  */
// export const handleCloudinaryAdminUpload = async (
//   file: File,
//   currentThumbnailUrl: string | null,
// ): Promise<string | null> => {
//   try {
//     // Security Check
//     const session = await auth();
//     if (!session || session.user.role !== "admin")
//       throw new Error("Unauthorized");

//     const oldPublicId = currentThumbnailUrl
//       ? await getPublicIdFromUrl(currentThumbnailUrl)
//       : null;

//     // Generate Signature locally (Replaces the need for the /api/project-sign fetch)
//     const timestamp = Math.round(new Date().getTime() / 1000);
//     const paramsToSign: any = {
//       timestamp,
//       ...(oldPublicId && {
//         public_id: oldPublicId,
//         overwrite: true,
//         invalidate: true,
//       }),
//     };

//     const signature = cloudinary.utils.api_sign_request(
//       paramsToSign,
//       ENV.CLOUDINARY_SECRET,
//     );

//     // Prepare FormData
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("signature", signature);
//     formData.append("timestamp", timestamp.toString());
//     formData.append("api_key", ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY);

//     if (oldPublicId) {
//       formData.append("public_id", oldPublicId);
//       formData.append("overwrite", "true");
//       formData.append("invalidate", "true");
//     }

//     // Post to Cloudinary (External URL fetch is always absolute, so it works on server)
//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
//       { method: "POST", body: formData },
//     );

//     const data = await res.json();
//     if (data.error) throw new Error(data.error.message);
//     return data.secure_url;
//   } catch (err) {
//     console.error("Cloudinary Upload Error:", err);
//     return null;
//   }
// };

// /**
//  * Handles the logic for deleting an image from Cloudinary.
//  * Returns true on success, false on failure.
//  */
// export const handleCloudinaryDeleteByFetch = async (
//   url: string,
// ): Promise<boolean> => {
//   const publicId = await getPublicIdFromUrl(url);
//   if (!publicId) return false;

//   try {
//     // 1. Fetch Signature for the destroy action
//     const resSign = await fetch("/api/cloudinary/project-sign", {
//       method: "POST",
//       body: JSON.stringify({ public_id: publicId, action: "delete" }),
//     });

//     if (!resSign.ok) throw new Error("Could not fetch delete signature");
//     const { signature, timestamp, cloudName, apiKey } = await resSign.json();

//     // 2. Prepare FormData for Destroy
//     const formData = new FormData();
//     formData.append("public_id", publicId);
//     formData.append("signature", signature);
//     formData.append("timestamp", timestamp);
//     formData.append("api_key", apiKey);
//     formData.append("invalidate", "true");

//     // 3. Post to Destroy endpoint
//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
//       { method: "POST", body: formData },
//     );

//     const data = await res.json();
//     return data.result === "ok";
//   } catch (err) {
//     console.error("Cloudinary Delete Error:", err);
//     return false;
//   }
// };

// export const handleCloudinaryAdminDelete = async (
//   url: string,
// ): Promise<boolean> => {
//   try {
//     const publicId = await getPublicIdFromUrl(url);
//     if (!publicId) {
//       console.error("Publicid require!");
//       return false;
//     }

//     // Use the SDK directly—no fetch or signatures needed on the server!
//     cloudinary.config({
//       cloud_name: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//       api_key: ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
//       api_secret: ENV.CLOUDINARY_SECRET,
//     });
//     const result = await cloudinary.uploader.destroy(publicId, {
//       invalidate: true,
//     });
//     return result.result === "ok";
//   } catch (err) {
//     console.error("Cloudinary Delete Error:", err);
//     return false;
//   }
// };
