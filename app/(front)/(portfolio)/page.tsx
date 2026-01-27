import Approach from '@/components/Approach';
import Experience from '@/components/Experience';
import Grid from '@/components/Grid';
import Hero from '@/components/Hero';
import RecentProjects from '@/components/RecentProjects';
import { ENV } from '@/config/env';
import { generateDynamicJsonLd } from '@/lib/seo/jsonld';
import { baseMetadata } from '@/lib/seo/metadata';
import safeJSONStringify from '@/lib/utils/safeSanitize';
import { Metadata } from 'next';
import Script from 'next/script';

const baseUrl = ENV.BASE_URL ?? "https://rajendrapancholi.vercel.app";

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    absolute: "Rajendra Pancholi | Full Stack Developer"
  },
  description: 'Portfolio — building scalable web applications with Next.js, React, TypeScript',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: "Rajendra Pancholi | Full Stack Developer",
    description: 'Portfolio — building scalable web applications with Next.js, React, TypeScript',
    url: baseUrl,
    images: [{ url: '/og-home.png', width: 1200, height: 630, alt: "Rajendra Pancholi Portfolio" }],
  },
  twitter: {
    ...baseMetadata.twitter,
    title: "Rajendra Pancholi | Full Stack Developer",
    description: 'Portfolio — building scalable web applications with Next.js, React, TypeScript',
    images: ['/og-home.png'],
  },
};

export default async function Home() {
  const jsonLd = generateDynamicJsonLd({
    type: "home",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
  });
  return (
    <>
      <Script
        id="jsonld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJSONStringify(jsonLd, { decodeUri: true }),
        }}
      />
      <main className="container flex flex-col mx-auto items-center justify-center">
        <Hero />
        <Grid />
        <RecentProjects />
        <Experience />
        <Approach />
      </main>
    </>
  );
}
