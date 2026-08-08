'use server';

import { ENV } from '@/config/env';
import { requireAdminSession } from '@/lib/utils/requireAdmin';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl as getPublicIdFromUrlBase,
} from '@/lib/services/cloudinaryService';

const projectCloudinaryConfig = {
  cloudName: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  apiSecret: ENV.CLOUDINARY_SECRET,
};

export const getPublicIdFromUrl = async (url: string): Promise<string | null> =>
  getPublicIdFromUrlBase(url);

export const handleCloudinaryAdminUpload = async (
  file: File,
  currentThumbnailUrl: string | null,
): Promise<string | null> => {
  const { error } = await requireAdminSession();
  if (error) {
    console.error(`[ADMIN_UPLOAD] ${error}`);
    return null;
  }

  return uploadToCloudinary(
    file,
    currentThumbnailUrl,
    projectCloudinaryConfig,
    'ADMIN_UPLOAD',
  );
};

export const handleCloudinaryAdminDelete = async (
  url: string,
): Promise<boolean> =>
  deleteFromCloudinary(url, projectCloudinaryConfig, 'ADMIN_DELETE');
