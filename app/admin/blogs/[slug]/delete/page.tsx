'use client';
import { deleteBlog, getBlogBySlug } from "@/app/actions/blog";
import { Loader2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";


type Params = Promise<{ slug: string; }>;

export default async function DeleteBlogPage({ params }: { params: Params; }) {
    const { slug } = await params;

    const { success, data: blog, error } = await getBlogBySlug(slug);
    if (!success || error) throw (error || "Failed fetch blog!");

    if (!blog) notFound();

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        const toastId = toast.loading("Deleting...");

        startTransition(async () => {
            try {
                const { success, message, error } = await deleteBlog(blog._id);
                if (!success) {
                    toast.error(error || "Failed to delete", { id: toastId });
                    return;
                }
                toast.success(message || "Blog successfully deleted!", { id: toastId });
                router.back();
                router.refresh();
            } catch (err) {
                toast.error("A network error occurred", { id: toastId });
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto mt-20 p-8 border border-red-100 rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Delete Blog Post?</h1>
            </div>

            <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">"{blog.title}"</span>?
                This action cannot be undone and will permanently remove the post from our servers.
            </p>

            <div className="flex justify-end gap-3">
                <a href={`/admin/blogs/${slug}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    Cancel
                </a>

                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex-[1.5] relative overflow-hidden group rounded-2xl bg-red-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center justify-center gap-2">
                        {isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Removing...</span>
                            </>
                        ) : (
                            <span>Confirm Permanent Delete</span>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}
