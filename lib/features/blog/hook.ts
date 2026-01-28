import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setBlog, setBlogList, setError, setLoading } from "./blogSlice";
import fetchAllBlogs from "@/lib/utils/fetchAllBlogs";
import { getBlogBySlug } from "@/app/actions/blog";
import { sanitizeSlug } from "@/lib/utils/safeSanitize";
import { Blog } from "@/lib/models/BlogModel";
import { getPostBySlug } from "@/app/actions/githubBlog";

/**
 * @description this is hooks to get blogs.
 * @example import { useEffect } from "react";
 import { useBlogs } from "@/store/useBlogs";
 import Link from "next/link";
 export default function BlogListPage() {
   const { blogs, loading, error, fetchBlogList } = useBlogs();
   useEffect(() => {
     // Only fetch if the list is empty to avoid redundant API calls
     if (!blogs) fetchBlogList();
   }, []);
   if (loading) return <div>Loading articles...</div>;
   if (error) return <div>Error: {error}</div>;
 */
export const useBlogs = () => {
  const dispatch = useAppDispatch();
  const { blogs, blog, loading, error } = useAppSelector(
    (state: RootState) => state.blog,
  );
  const fetchBlogList = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const blogs = await fetchAllBlogs();
      dispatch(setBlogList({ blogs: blogs }));
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to fetch blogs"));
    } finally {
      dispatch(setLoading(false));
    }
  };
  const fetchBlog = async (source: Blog["source"], slug: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      if (source === "git") {
        let {
          success,
          data: blog,
          error,
        } = await getPostBySlug(sanitizeSlug(slug));
        if (!success || !blog) {
          dispatch(setError(error || "Failed to fetch blog!"));
          throw new Error(error || "Failed to fetch blog!");
        }
        dispatch(setBlog({ blog: blog }));
      } else if (source === "main") {
        let {
          success,
          data: blog,
          error,
        } = await getBlogBySlug(sanitizeSlug(slug));
        if (!success || !blog) {
          dispatch(setError(error || "Failed to fetch blog!"));
          throw new Error(error || "Failed to fetch blog!");
        }
        dispatch(setBlog({ blog: blog }));
      } else {
      }
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to fetch blogs"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    blogs,
    blog,
    loading,
    error,
    fetchBlog,
    fetchBlogList,
  };
};

// /*
// "use client";
// import { useEffect } from "react";
// import { useBlogs } from "@/store/useBlogs";
// import { useParams } from "next/navigation";

// export default function BlogPostPage() {
//   const params = useParams();

//   useEffect(() => {
//     const { source, slug } = params;
//     // Cast source to "git" | "main" as required by your hook
//     if (slug && source) {
//       fetchBlog(source as "git" | "main", slug as string);
//     }
//   }, [params]);

//   if (loading) return <div>Loading content...</div>;
//   if (error) return <div>{error}</div>;
//   if (!blog) return <div>Post not found.</div>;

//   return (
//     <article className="prose lg:prose-xl mx-auto">
//       <h1>{blog.title}</h1>
//       {/* If your content is HTML/Markdown, render it accordingly */}
//       <div dangerouslySetInnerHTML={{ __html: blog.content }} />
//     </article>
//   );
// }
// "use client";
// import { useEffect } from "react";
// import { useBlogs } from "@/store/useBlogs";
// import Link from "next/link";

// export default function BlogListPage() {
//   const { blogs, loading, error, fetchBlogList } = useBlogs();

//   useEffect(() => {
//     // Only fetch if the list is empty to avoid redundant API calls
//     if (!blogs) fetchBlogList();
//   }, []);

//   if (loading) return <div>Loading articles...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="grid gap-4">
//       {blogs?.map((item) => (
//         <Link
//           key={item.slug}
//           href={`/blog/${item.source}/${item.slug}`}
//           className="p-4 border rounded hover:bg-gray-50"
//         >
//           <h2 className="text-xl font-bold">{item.title}</h2>
//           <p className="text-sm text-blue-600">Source: {item.source}</p>
//         </Link>
//       ))}
//     </div>
//   );
// }
