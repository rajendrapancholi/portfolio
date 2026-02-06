import { createPageMetadata } from "@/lib/seo/metadata";
import Blogs from "../../../components/blog/Blogs";
import { getBlogList } from "@/app/actions/blog";
import { Blog } from "@/lib/models/BlogModel";
import Script from "next/script";
import { generateDynamicJsonLd } from "@/lib/seo/jsonld";
import { allBlogKeywords } from "@/lib/seo/keywords";
import { ENV } from "@/config/env";
import safeJSONStringify from "@/lib/utils/safeSanitize";
import { getPostList } from "@/app/actions/githubBlog";

const baseUrl = ENV.BASE_URL ?? "https://rajendrapancholi.vercel.app";
export const metadata = createPageMetadata({
  title: "Blogs",
  description: "Explore blogs, tutorials, and insights by Rajendra Pancholi.",
  canonical: "https://rajendrapancholi.vercel.app/blogs",
  keywords: allBlogKeywords,
});

export default async function BlogPage() {
  const { success: sdb, data: BlogFmMain, error: sde } = await getBlogList();
  const { success, data: BlogFmGit, error } = await getPostList();

  if ((!success && !sdb) || !Array.isArray(BlogFmGit)) {
    throw new Error(error || sde || "Failed to fetch blogs");
  }

  const jsonLd = generateDynamicJsonLd({
    type: "blog",
    title: "Rajendra Pancholi Coding Mentor",
    url: baseUrl,
    description: `Helping students master the ${new Date().getFullYear} Full-Stack Roadmap. Expert in Next.js, React, and AI Integration. I turn CS students into hired engineers through hands-on portfolio building and open-source contribution.`,
    author: "Rajendra Pancholi",
    logo: `${baseUrl}/logo.png`,
    image: "/default-blog-thumb-webp",
  });
  return (
    <>
      <Script
        id="blogs-id"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJSONStringify(jsonLd, { decodeUri: true }),
        }}
      />
      <Blogs blogFmM={BlogFmMain as Blog[]} blogFmG={BlogFmGit as Blog[]} />
    </>
  );
}
