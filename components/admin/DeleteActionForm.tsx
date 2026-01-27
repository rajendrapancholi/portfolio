"use client";

import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { deleteBlog } from "@/app/actions/blog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AlertCircle, ArchiveX, Loader2, Trash2 } from "lucide-react";

export default function DeleteActionForm({ id, setIsOpen = () => { } }: { id: string; setIsOpen?: Dispatch<SetStateAction<boolean>>; }) {
    const [isPending, startTransition] = useTransition();
    const [isDeleted, setIsDeleted] = useState(false);
    const router = useRouter();
    const handleDelete = () => {
        const toastId = toast.loading("Deleting...");

        startTransition(async () => {
            try {
                const { success, message, error } = await deleteBlog(id);
                if (!success) {
                    toast.error(error || "Failed to delete!", { id: toastId });
                    return;
                }
                toast.success(message || "Blog successfully deleted!", { id: toastId });
                setIsDeleted(true);
                router.refresh();
            } catch (err) {
                setIsDeleted(false);
                toast.error("A network error occurred", { id: toastId });
            } finally {
                setTimeout(() => {
                    setIsOpen(false);
                    setIsDeleted(true);
                }, 4000);
            }

        });
    };

    return (
        <>
            <div className="p-8 sm:p-10">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 animate-pulse">
                        {isDeleted ? <ArchiveX className="size-10 text-red-600 dark:text-red-500" /> :
                            <Trash2 className="size-10 text-red-600 dark:text-red-500" />
                        }

                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {isDeleted ? 'Blog Deleted!' : 'Delete Blog?'}
                    </h2>

                    <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        You are about to delete <span className="font-semibold text-slate-900 dark:text-slate-200">ID: {id}</span>.
                        This will remove all associated assets and metrics.
                        <span className="block font-medium text-red-500 mt-1">This action is irreversible.</span>
                    </p>
                </div>

                {/* Warning Box */}
                <div className="mt-8 flex items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-900/10 p-4 border border-amber-200/50 dark:border-amber-800/30 cursor-help">
                    <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-400">
                        Deleting this blog will also break any active shared links or social media previews associated with this URL.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row">
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={() => setIsOpen(false)}
                        className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-50"
                    >
                        Cencel
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className={`flex-[1.5] relative overflow-hidden group rounded-2xl bg-red-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-70 ${isPending ? 'cursor-wait' : isDeleted ? 'cursor-not-allowed' : 'cursor-pointer'} `}
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
        </>
    );
}
