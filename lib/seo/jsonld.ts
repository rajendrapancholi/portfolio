export type PageType = "home" | "project" | "person" | "blog" | "saas";

export interface DynamicJsonLdProps {
  sameAs?: string[];
  type: PageType;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  techStack?: string[];
  accentColor?: string;
  logo?: string;
  price?: string;
  priceCurrency?: string;
}

export function generateDynamicJsonLd(props: DynamicJsonLdProps) {
  const baseUrl = props.url;

  switch (props.type) {
    case "home":
      return [
        {
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Rajendra Pancholi",
          url: baseUrl,
          jobTitle: "Full Stack Developer",
          sameAs: [
            "https://github.com/rajendrapancholi",
            "https://www.linkedin.com/in/rajendra-pancholi-11a3a5286",
            "https://rajendrapancholi.vercel.app/",
            "https://rajebookbary.vercel.app/",
            "https://luminous-taffy-8c74c7.netlify.app/",
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "RajeNeurTech",
          url: baseUrl,
          logo: props.logo ?? `${baseUrl}/logo.png`,
          sameAs: [
            "https://twitter.com/rajendrapancholi",
            "https://www.linkedin.com/company/rajendrapancholi",
            "https://github.com/rajendrapancholi",
          ],
          description:
            "Portfolio of Rajendra Pancholi, Full Stack Developer specializing in React, Next.js, TypeScript, and scalable web applications.",
        },
      ];

    case "project":
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: props.title,
        description: props.description,
        url: baseUrl,
        image: props.image,
        creator: {
          "@type": "Person",
          name: props.author ?? "Rajendra Pancholi",
        },
        keywords: props.techStack,
      };

    case "person":
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: props.title,
        url: baseUrl,
        image: props.image,
        sameAs: props.sameAs ?? [],
        creator: {
          "@type": "Person",
          name: props.author ?? "Rajendra Pancholi",
        },
        keywords: props.techStack,
      };

    case "blog":
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: props.title,
        description: props.description,
        image: props.image,
        author: {
          "@type": "Person",
          name: props.author ?? "Rajendra Pancholi",
        },
        publisher: {
          "@type": "Person",
          name: props.author ?? "Rajendra Pancholi",
        },
        datePublished: props.publishedAt,
        dateModified: props.updatedAt ?? props.publishedAt,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": baseUrl,
        },
      };

    case "saas":
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: props.title,
        description: props.description,
        url: baseUrl,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        logo: props.logo ?? `${baseUrl}/company-logo.png`,
        offers: props.price
          ? {
              "@type": "Offer",
              price: props.price,
              priceCurrency: props.priceCurrency ?? "USD",
            }
          : undefined,
      };

    default:
      return {};
  }
}
