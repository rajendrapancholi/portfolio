// /app/api/cloudinary/project-sign/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/utils/requireAdmin';
import { ENV } from '@/config/env';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: NextRequest) {
  try {
    const { error } = await requireAdminSession();
    if (error) {
      console.error(`[PROJECT_SIGN] ${error}`);
      const status = error.startsWith('Unauthorized') ? 401 : 403;
      return NextResponse.json({ error }, { status });
    }

    // Configure Cloudinary at RUNTIME (not module level)
    cloudinary.config({
      cloud_name: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_SECRET,
    });

    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error('[PROJECT_SIGN] Cloudinary configuration incomplete', {
        has_cloud_name: !!config.cloud_name,
        has_api_key: !!config.api_key,
        has_api_secret: !!config.api_secret,
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 },
      );
    }

    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      ENV.CLOUDINARY_SECRET,
    );

    return NextResponse.json(
      {
        signature,
        timestamp,
        cloudName: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    console.error('[PROJECT_SIGN_ERROR]', {
      error: errorMsg,
      stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 },
    );
  }
}
