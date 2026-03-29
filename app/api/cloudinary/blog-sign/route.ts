// /app/api/cloudinary/blog-sign/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ENV } from "@/config/env";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: NextRequest) {
  try {
    // STEP 1: Resolve session properly
    const session = await auth();

    if (!session) {
      console.error("[BLOG_SIGN] Authentication failed: No active session");
      return NextResponse.json(
        { error: "Unauthorized: Authentication required" },
        { status: 401 },
      );
    }

    // STEP 2: Check authorization
    if (session.user.role !== "admin") {
      console.error(
        `[BLOG_SIGN] Authorization failed: User role is '${session.user.role}'`,
      );
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 },
      );
    }

    // STEP 3: Parse and validate request
    let payload: { public_id?: string; action?: string };
    try {
      payload = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { public_id, action } = payload;

    // STEP 4: Validate public_id
    if (!public_id || typeof public_id !== "string") {
      console.warn("[BLOG_SIGN] Missing or invalid public_id");
      return NextResponse.json(
        {
          error: "Invalid request: public_id is required and must be a string",
        },
        { status: 400 },
      );
    }

    // Whitelist check: alphanumeric, hyphens, underscores, forward slashes only
    if (!/^[a-zA-Z0-9/_-]+$/.test(public_id)) {
      console.warn(`[BLOG_SIGN] Invalid characters in public_id: ${public_id}`);
      return NextResponse.json(
        { error: "Invalid public_id: contains disallowed characters" },
        { status: 400 },
      );
    }

    // STEP 5: Validate action parameter
    if (action && !["delete", "update", "upload"].includes(action)) {
      console.warn(`[BLOG_SIGN] Invalid action: ${action}`);
      return NextResponse.json(
        { error: "Invalid action parameter" },
        { status: 400 },
      );
    }

    // STEP 6: Configure Cloudinary at RUNTIME (not module level)
    cloudinary.config({
      cloud_name: ENV.BLOG_CLOUDINAR_CLOUD_NAME,
      api_key: ENV.BLOG_CLOUDINAR_API_KEY,
      api_secret: ENV.BLOG_CLOUDINAR_API_SECRET,
    });

    // STEP 7: Verify configuration
    const config = cloudinary.config();
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error("[BLOG_SIGN] Cloudinary configuration incomplete", {
        has_cloud_name: !!config.cloud_name,
        has_api_key: !!config.api_key,
        has_api_secret: !!config.api_secret,
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // STEP 8: Generate signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign: Record<string, any> = {
      timestamp,
      public_id,
    };

    if (action === "delete") {
      paramsToSign.invalidate = true;
    } else {
      paramsToSign.overwrite = true;
      paramsToSign.invalidate = true;
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      ENV.BLOG_CLOUDINAR_API_SECRET,
    );

    return NextResponse.json(
      {
        signature,
        timestamp,
        cloudName: ENV.BLOG_CLOUDINAR_CLOUD_NAME,
        apiKey: ENV.BLOG_CLOUDINAR_API_KEY,
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    console.error("[BLOG_SIGN_ERROR]", {
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
