<<<<<<< HEAD
import { Metadata } from 'next';
import Blogs from './Blogs';
=======
import { createPageMetadata } from "@/lib/seo/metadata";
>>>>>>> development

export const metadata = createPageMetadata({
  title: "All Blogs",
  description: "Explore blogs, tutorials, and insights by Rajendra Pancholi.",
  canonical: "https://rajendrapancholi.vercel.app/blogs",
});

<<<<<<< HEAD
export default async function BlogsPage() {
  return (<>
    <Blogs />
  </>);
=======
export default function BlogPage() {
  return (
    <div>page</div>
  );
>>>>>>> development
}
