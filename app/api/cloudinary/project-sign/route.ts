// /app/api/cloudinary/project-sign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ENV } from "@/config/env";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: NextRequest) {
  try {
    // STEP 1: Resolve session properly
    const session = await auth();

    if (!session) {
      console.error("[PROJECT_SIGN] Authentication failed: No active session");
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 },
      );
    }

    // STEP 2: Check authorization
    if (session.user.role !== "admin") {
      console.error(
        `[PROJECT_SIGN] Authorization failed: User role is '${session.user.role}'`,
      );
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    // STEP 3: Configure Cloudinary at RUNTIME (not module level)
    cloudinary.config({
      cloud_name: ENV.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: ENV.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_SECRET,
    });

    // STEP 4: Verify configuration
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error("[PROJECT_SIGN] Cloudinary configuration incomplete", {
        has_cloud_name: !!config.cloud_name,
        has_api_key: !!config.api_key,
        has_api_secret: !!config.api_secret,
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // STEP 5: Generate signature
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

    console.error("[PROJECT_SIGN_ERROR]", {
      error: errorMsg,
      stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 },
    );
  }
}
