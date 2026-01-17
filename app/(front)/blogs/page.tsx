import { Metadata } from 'next';

export const metadata = createPageMetadata({
  title: "All Blogs",
  description: "Explore blogs, tutorials, and insights by Rajendra Pancholi.",
  canonical: "https://rajendrapancholi.vercel.app/blogs",
});

export default async function page() {
  return <div>page</div>;
}
