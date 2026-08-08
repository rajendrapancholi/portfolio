'use client';

import { Dispatch, SetStateAction, useState, useTransition } from 'react';
import { deleteBlog } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { AlertCircle, ArchiveX, Loader2, Trash2 } from 'lucide-react';

export default function DeleteActionForm({
  id,
  setIsOpen = () => {},
}: {
  id: string;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPending, startTransition] = useTransition();
  const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    const toastId = toast.loading('Deleting...');

    startTransition(async () => {
      try {
        const { success, message, error } = await deleteBlog(id);

        if (!success) {
          toast.error(error || 'Failed to delete!', { id: toastId });
          return;
        }

        toast.success(message || 'Blog successfully deleted!', { id: toastId });
        setIsDeleted(true);
        router.refresh();
      } catch (err) {
        setIsDeleted(false);
        toast.error('A network error occurred', { id: toastId });
      } finally {
        setTimeout(() => {
          setIsOpen(false);
          setIsDeleted(true);
        }, 4000);
      }
    });
  };

  return (
    <div className="p-8 sm:p-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-6 flex size-20 items-center justify-center rounded-2xl transition-colors ${
            isDeleted ? 'bg-destructive/15' : 'bg-destructive/10 animate-pulse'
          }`}
        >
          {isDeleted ? (
            <ArchiveX className="size-10 text-destructive" />
          ) : (
            <Trash2 className="size-10 text-destructive" />
          )}
        </div>

        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {isDeleted ? 'Blog Deleted!' : 'Delete Blog?'}
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
          You are about to delete{' '}
          <span className="font-semibold text-foreground">ID: {id}</span>. This
          will remove all associated assets and metrics.
          <span className="mt-1.5 block font-medium text-destructive">
            This action is irreversible.
          </span>
        </p>
      </div>

      {/* Warning Box */}
      <div className="mt-8 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" />
        <p className="text-sm text-warning-foreground/90 dark:text-warning">
          Deleting this blog will also break any active shared links or social
          media previews associated with this URL.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          disabled={isPending || isDeleted}
          onClick={() => setIsOpen(false)}
          className="btn btn-outline flex-1 rounded-2xl py-3.5 text-sm font-semibold disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending || isDeleted}
          className="btn btn-danger flex-[1.5] rounded-2xl py-3.5 text-sm font-semibold disabled:opacity-70"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Removing...
            </span>
          ) : isDeleted ? (
            'Deleted'
          ) : (
            'Confirm Permanent Delete'
          )}
        </button>
      </div>
    </div>
  );
}
