import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * Extracts the Cloudinary public_id from a secure_url.
 * Shared by both the blog and admin (project) upload flows.
 */
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes('upload/')) return null;

  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('cloudinary.com')) return null;

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
    console.error('Error parsing URL for public ID:', err);
    return null;
  }
}

function configure(config: CloudinaryConfig) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });

  const applied = cloudinary.config();
  if (!applied.cloud_name || !applied.api_key || !applied.api_secret) {
    throw new Error('Cloudinary configuration failed: Missing credentials');
  }
}

/**
 * Uploads a file to Cloudinary, optionally overwriting the asset at
 * `currentUrl`'s public_id so the old image is replaced in place.
 * Returns the new secure_url, or null on failure.
 */
export async function uploadToCloudinary(
  file: File,
  currentUrl: string | null,
  config: CloudinaryConfig,
  logTag: string,
): Promise<string | null> {
  try {
    configure(config);

    const oldPublicId = currentUrl ? getPublicIdFromUrl(currentUrl) : null;

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign: Record<string, any> = { timestamp };
    if (oldPublicId) {
      paramsToSign.public_id = oldPublicId;
      paramsToSign.overwrite = true;
      paramsToSign.invalidate = true;
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      config.apiSecret,
    );

    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signature);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', config.apiKey);
    if (oldPublicId) {
      formData.append('public_id', oldPublicId);
      formData.append('overwrite', 'true');
      formData.append('invalidate', 'true');
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    let res: Response;
    try {
      res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await res.json();

    if (!res.ok || data.error) {
      const errorMsg = data.error?.message || `HTTP ${res.status}`;
      console.error(`[${logTag}] Cloudinary API Error:`, {
        status: res.status,
        error: errorMsg,
      });
      throw new Error(`Cloudinary API Error: ${errorMsg}`);
    }

    if (!data.secure_url) {
      throw new Error('Cloudinary response missing secure_url');
    }

    return data.secure_url;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[${logTag}_FAILED]`, {
      error: errorMsg,
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return null;
  }
}

/**
 * Deletes an asset from Cloudinary by its secure_url. Returns true on
 * success, false otherwise.
 */
export async function deleteFromCloudinary(
  url: string,
  config: CloudinaryConfig,
  logTag: string,
): Promise<boolean> {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (!publicId) {
      console.error(`[${logTag}] Invalid or empty public ID`);
      return false;
    }

    configure(config);

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    if (result.result !== 'ok') {
      console.error(`[${logTag}] Destroy result not ok:`, result.result);
      return false;
    }

    return true;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[${logTag}_FAILED]`, {
      error: errorMsg,
      timestamp: new Date().toISOString(),
    });
    return false;
  }
}
