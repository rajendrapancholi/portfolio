'use client';

import { deleteBlog } from '@/app/actions/blog';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import toast from 'react-hot-toast';

interface Blog {
  _id: string;
  title: string;
}

export default function DeleteBlogClient({
  blog,
  slug,
}: {
  blog: Blog;
  slug: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    const toastId = toast.loading('Deleting...');

    startTransition(async () => {
      try {
        const { success, message, error } = await deleteBlog(blog._id);

        if (!success) {
          toast.error(error || 'Failed to delete', { id: toastId });
          return;
        }

        toast.success(message || 'Blog successfully deleted!', { id: toastId });
        router.push('/admin/blogs');
        router.refresh();
      } catch {
        toast.error('A network error occurred', { id: toastId });
      }
    });
  };

  return (
    <div className="mx-auto mt-16 max-w-xl px-4 sm:px-0">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-border px-6 py-5 sm:px-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10">
            <Trash2 className="size-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Delete Blog Post?
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              This action cannot be undone
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6 sm:px-8">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-foreground">
              &ldquo;{blog.title}&rdquo;
            </span>
            ? This will permanently remove the post and all associated data from
            the server.
          </p>

          {/* Warning */}
          <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" />
            <p className="text-sm text-warning-foreground/90 dark:text-warning">
              Shared links and social media previews for this post will stop
              working after deletion.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/30 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
          <Link
            href={`/admin/blogs/${slug}`}
            className="btn btn-outline rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            Cancel
          </Link>

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="btn btn-danger rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-70"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Removing...
              </span>
            ) : (
              'Confirm Permanent Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
