import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import { generateDynamicJsonLd } from "@/lib/seo/jsonld";
import { ENV } from "@/config/env";
import { baseMetadata } from "@/lib/seo/metadata";
import Script from "next/script";
import safeJSONStringify from "@/lib/utils/safeSanitize";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteUrl = ENV.BASE_URL ?? "https://rajendrapancholi.vercel.app";

  const jsonLd = generateDynamicJsonLd({
    type: "home",
    url: websiteUrl,
    logo: `${websiteUrl}/logo.png`,
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="jsonld-global"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJSONStringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <script
          id="jsonld-global"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJSONStringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
