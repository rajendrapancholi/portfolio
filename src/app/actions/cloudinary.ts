'use server';

import { ENV } from '@/config/env';
import { requireAdminSession } from '@/lib/utils/requireAdmin';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl as getPublicIdFromUrlBase,
} from '@/lib/services/cloudinaryService';

const blogCloudinaryConfig = {
  cloudName: ENV.BLOG_CLOUDINAR_CLOUD_NAME,
  apiKey: ENV.BLOG_CLOUDINAR_API_KEY,
  apiSecret: ENV.BLOG_CLOUDINAR_API_SECRET,
};

export const getPublicIdFromUrl = async (url: string): Promise<string | null> =>
  getPublicIdFromUrlBase(url);

export const handleCloudinaryBlogUpload = async (
  file: File,
  currentThumbnailUrl: string | null,
): Promise<string | null> => {
  const { error } = await requireAdminSession();
  if (error) {
    console.error(`[BLOG_UPLOAD] ${error}`);
    return null;
  }

  return uploadToCloudinary(
    file,
    currentThumbnailUrl,
    blogCloudinaryConfig,
    'BLOG_UPLOAD',
  );
};

export const handleCloudinaryBlogDelete = async (
  url: string,
): Promise<boolean> =>
  deleteFromCloudinary(url, blogCloudinaryConfig, 'BLOG_DELETE');
