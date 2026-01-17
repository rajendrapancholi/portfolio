import { ENV } from "@/config/env";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${ENV.BASE_URL}/sitemap.xml`,
  };
}
