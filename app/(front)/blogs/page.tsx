import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "All Blogs",
  description: "Explore blogs, tutorials, and insights by Rajendra Pancholi.",
  canonical: "https://rajendrapancholi.vercel.app/blogs",
});

export default function BlogPage() {
  return (
    <div>page</div>
  );
}
