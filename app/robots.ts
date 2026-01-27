import { ENV } from "@/config/env";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/*", "/private"],
      },
    ],
    sitemap: `${ENV.BASE_URL}/sitemap.xml`,
  };
}
