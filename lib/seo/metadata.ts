import type { Metadata } from "next";
import { ENV } from "@/config/env";

const SITE_NAME = "Rajendra Pancholi";
const SITE_URL = ENV.BASE_URL ?? "https://rajendrapancholi.vercel.app";
const DEFAULT_OG_IMAGE = "/og-image.png";
const GOOGLE_VERIFICATION_SECRET =
  ENV.GOOGLE_VERIFICATION_SECRET ??
  "Ubx_dHCl8UMrbjf-w4ustA2yxrcRHcYKOzrS2Tc8a4E";

const curYr = new Date().getFullYear();
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
    "Pancholi",
    "Rajendra Pancholi Portfolio",
    "Rajendra Pancholi Developer",
    "RajPancholi",
    "Raj Pancholi",
    "Raje Pancholi",
    "RajendraPancholi",
    "rpancholi",
    "rajendra",
    "pancholi",
    "raje",
    "Rajep",
    "Rajepancholi",
    "Rajendra Pancholi Full Stack",
    `Senior Full Stack Engineer ${curYr}`,
    "Next.js Enterprise Architect",
    "React 19 Performance Specialist",
    "TypeScript Systems Design",
    "Full-Stack TypeScript Solutions",
    "Software Engineer Portfolio",
    "Next.js App Router Expert",
    "React Server Components (RSC)",
    "Tailwind CSS Specialist",
    "Node.js Backend Developer",
    "PostgreSQL & Prisma Architect",
    "Scalable SaaS Infrastructure",
    "Edge-First Frontend Architecture",
    "AI-Native Web Application Development",
    "Modern Web Stack (Next.js, TS, Tailwind)",
    "Hire Next.js Developer",
    "Freelance React Developer",
    "Full-Stack Developer for Hire",
    "Performance Optimization Consultant",
    "Web Application Security Specialist",
    "Custom Web Development Services",
    "Enterprise Frontend Consultant",
    `Full Stack Developer Roadmap ${curYr}`,
    "Next.js Performance Best Practices",
    "Advanced TypeScript Patterns",
    "Scalable React Architecture",
    "Web Development Learning Path",
    "Open Source Project Contributor",
    "Software Engineering Mentorship",
    "Building Production-Ready Next.js Apps",
    "Remote Full Stack Developer",
    "Indian Software Engineer Portfolio",
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
    `Senior Full Stack Engineer ${curYr}`,
    "Next.js Enterprise Architect",
    "React 19 Performance Specialist",
    "TypeScript Systems Design",
    "AI-Native Web Application Development",
    "Edge-First Frontend Architecture",
    "Full-Stack TypeScript Solutions",
    "Scalable SaaS Infrastructure",
    "React Server Components Expert",
    "Custom Next.js Development Services",
    "Hire React Developer for Enterprise Apps",
    "Performance Optimization Consultant",
    "Full-Stack Developer for Hire",
    "Web Application Security Specialist",
    "Rajendra Pancholi Coding Mentor",
    `Full Stack Developer Roadmap ${curYr}`,
    "Learn Next.js from Scratch",
    "React for Beginners Guide",
    "Best Projects for Developer Portfolios",
    `How to become a Software Engineer in ${curYr}`,
    "Junior Developer Career Advice",
    "Open Source for Students",
    "Web Development Learning Path",
    "Modern Tech Stack for Beginners",
    "Remote Full Stack Developer India",
    "MERN Stack Developer Rajendra Pancholi",
    "Senior React Developer for Hire",
    "Next.js Performance Specialist India",
    "Hire TypeScript Expert",
    "Freelance Web Developer Rajendra Pancholi",
    "Next.js 15 App Router Expert",
    "React Server Components Architecture",
    "Full Stack AI Application Developer",
    "Socket.io Real-time App Specialist",
    "PostgreSQL & Prisma Schema Design",
    "Responsive UI/UX with Tailwind CSS",
    "Scalable Frontend Architectures India",
    "Full Stack Roadmap by Rajendra Pancholi",
    "Next.js SEO Best Practices 2026",
    "Advanced React Design Patterns",
    "TypeScript Systems Design Guide",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  category: "Portfolio",

  icons: {
    icon: [
      { url: "/favicon.ico" }, // Standard favicon
      { url: "/favicon-32x32.png", type: "image/png" }, // Generic 32x32
    ],
    shortcut: ["/shortcut-icon.png"],
    apple: [
      { url: "/apple-touch-icon.png" }, // Apple devices (iPhone/iPad)
      { url: "/android-chrome-192x192.png", sizes: "72x72", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
    ],
  },

  // Reference the Web App Manifest (For Android & Chrome)
  manifest: `${SITE_URL}/manifest.json`,

  // Add verification codes
  verification: {
    google: GOOGLE_VERIFICATION_SECRET,
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
    other: {
      "github:card": "summary_large_image",
      "github:site": "https://github.com/rajendrapancholi",
      me: [
        "rpancholi522@gmail.com",
        "https://github.com/rajendrapancholi",
        "https://www.linkedin.com/in/rajendra-pancholi-11a3a5286/",
      ],
    },
  },
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
  isDynamic = false,
  category = "Computer Science",
}: {
  title: string;
  description: string;
  canonical: string | URL;
  image?: string | null;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  isDynamic?: boolean;
  category?: string;
}): Metadata {
  const absoluteCanonical = new URL(canonical.toString(), SITE_URL).toString();
  let absoluteImage: string;
  const safeImage = image ?? DEFAULT_OG_IMAGE;
  if (isDynamic) {
    const dynamicUrl = new URL("/api/og", SITE_URL);
    dynamicUrl.searchParams.set("title", title);
    dynamicUrl.searchParams.set("category", category);

    // Pass keywords as a comma-separated string for the tags section
    if (keywords && keywords.length > 0) {
      dynamicUrl.searchParams.set("tags", keywords.join(","));
    }

    absoluteImage = dynamicUrl.toString();
  } else {
    absoluteImage = safeImage.startsWith("http")
      ? safeImage
      : new URL(safeImage, SITE_URL).toString();
    console.log(" Debug Data: ", SITE_URL);
  }
  if (process.env.NODE_ENV === "development") {
    console.log("🚀 OG Image Path:", absoluteImage);
  }
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
      card: "summary_large_image",
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
