import { ENV } from "@/config/env";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: ENV.BLOG_CLOUDINAR_CLOUD_NAME,
  api_key: ENV.BLOG_CLOUDINAR_API_KEY,
  api_secret: ENV.BLOG_CLOUDINAR_API_SECRET,
});

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "unauthorized" }, { status: 401 });
  }

  try {
    const { public_id, action } = await req.json();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign: any = { timestamp };

    if (public_id) {
      paramsToSign.public_id = public_id;

      if (action === "delete") {
        paramsToSign.invalidate = true;
      } else {
        paramsToSign.overwrite = true;
        paramsToSign.invalidate = true;
      }
    }
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      ENV.BLOG_CLOUDINAR_API_SECRET,
    );

    return Response.json({
      signature,
      timestamp,
      cloudName: ENV.BLOG_CLOUDINAR_CLOUD_NAME,
      apiKey: ENV.BLOG_CLOUDINAR_API_KEY,
    });
  } catch (error) {
    return Response.json(
      { message: "Error generating signature" },
      { status: 500 },
    );
  }
}) as any;
