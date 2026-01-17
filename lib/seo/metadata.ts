import type { Metadata } from "next";
import { ENV } from "@/config/env";

const SITE_NAME = "Rajendra Pancholi";
const SITE_URL = ENV.BASE_URL ?? "https://rajendrapancholi.vercel.app";
const DEFAULT_OG_IMAGE = "/og-image.png";

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Title handling
  title: {
    default: `${SITE_NAME} | Full Stack Developer`,
    template: `%s | ${SITE_NAME}`,
  },

  description:
    "Rajendra Pancholi — Full Stack Developer specializing in Next.js, React, TypeScript, scalable web applications and open-source projects.",

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    title: `${SITE_NAME} | Portfolio`,
    description:
      "Explore projects, skills, experience and writings of Rajendra Pancholi — Full Stack Developer (React • Next.js • TypeScript)",
    url: SITE_URL,
    siteName: `${SITE_NAME} Portfolio`,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Portfolio Preview`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Portfolio`,
    description:
      "Projects, experience, blogs and skills — Full Stack Developer (Next.js • React • TypeScript)",
    creator: "@rajendrapancholi",
    site: "@rajendrapancholi",
    images: [DEFAULT_OG_IMAGE],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  keywords: [
    "Rajendra Pancholi",
    "Full Stack Developer",
    "Portfolio",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "JavaScript",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "Web Applications",
    "Personal Portfolio",
    "Open Source Projects",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  category: "Portfolio",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",

  // Add verification codes
  // verification: {
  //   google: 'your-google-site-verification-code',
  //   // yandex, bing, etc.
  // },
};

/**
 * Helper to create page-specific metadata while inheriting globals
 * Use this in most page.tsx files or generateMetadata functions
 *
 * @example
 * export const metadata = createPageMetadata({
 *   title: 'Blogs',
 *   description: 'Articles about Next.js, TypeScript and frontend architecture',
 *   canonical: '/blogs',
 *   image: '/og-blogs.png',
 *   type: 'website',
 * });
 */
export function createPageMetadata({
  title,
  description,
  canonical,
  image = DEFAULT_OG_IMAGE,
  keywords,
  type = "website",
  noindex = false,
}: {
  title: string;
  description: string;
  canonical: string | URL;
  image?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  noindex?: boolean;
}): Metadata {
  const absoluteCanonical = new URL(canonical.toString(), SITE_URL).toString();
  const absoluteImage = image.startsWith("http")
    ? image
    : new URL(image, SITE_URL).toString();

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: absoluteCanonical,
    },

    openGraph: {
      ...baseMetadata.openGraph,
      title,
      description,
      url: absoluteCanonical,
      type,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      ...baseMetadata.twitter,
      title,
      description,
      images: [absoluteImage],
    },

    keywords: keywords ?? baseMetadata.keywords,

    ...(noindex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
