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

const baseUrl = ENV.BASE_URL ?? 'https://rajendrapancholi.vercel.app';

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    absolute: 'Rajendra Pancholi | Full Stack Developer',
  },
  description:
    'Portfolio - building scalable web applications with Next.js, React, TypeScript',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Rajendra Pancholi | Full Stack Developer',
    description:
      'Portfolio - building scalable web applications with Next.js, React, TypeScript',
    url: baseUrl,
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Rajendra Pancholi Portfolio',
      },
    ],
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'Rajendra Pancholi | Full Stack Developer',
    description:
      'Portfolio - building scalable web applications with Next.js, React, TypeScript',
    images: ['/og-home.png'],
  },
};

export default async function Home() {
  const jsonLd = generateDynamicJsonLd({
    type: 'home',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
  });

  return (
    <>
      {/* Screen-reader only intro */}
      <section className="sr-only">
        Hi, I&apos;m Rajendra Pancholi, a Full Stack Developer. I work with
        Next.js and React to build things people actually use. Handle everything
        from frontend to backend—databases, APIs, and I deploy with Docker and
        manage infrastructure. Basically, I ship complete products.
      </section>

      <Script
        id="jsonld-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJSONStringify(jsonLd, { decodeUri: true }),
        }}
      />

      <main className="relative w-full">
        {/* Subtle background accent */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <Hero />
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          <Grid />
          <RecentProjects />
          <Experience />
          <Approach />
        </div>
      </main>
    </>
  );
}
