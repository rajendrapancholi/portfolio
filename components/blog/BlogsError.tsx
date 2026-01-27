"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCcw, WifiOff, Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import RajeBrandLogo from '@/components/ui/RajeBrandLogo';

export default function BlogsError({
    error,
    reset,
}: {
    error: Error & { digest?: string; };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="relative flex min-h-[90vh] flex-col items-center justify-center text-center px-4 transition-colors duration-500 bg-transparent overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -z-10 h-80 w-80 rounded-full bg-red-500/5 dark:bg-red-500/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <div className="mb-12 opacity-80 cursor-default">
                <RajeBrandLogo path='/' logoType='type1' firstText='Raje' secondText='Blog' title='System synchronization failed...' />
            </div>

            <div className="max-w-md w-full space-y-6 p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl shadow-2xl">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-[10px] font-mono uppercase tracking-widest text-red-600 dark:text-red-400">
                        <WifiOff size={12} />
                        Fetch Error
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Feed <span className="text-red-600 dark:text-red-500">Interrupted</span>
                    </h1>
                    <div className="cursor-help flex items-start gap-3 p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-left">
                        <AlertCircle size={16} className="text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-slate-600 dark:text-white/60 text-xs leading-relaxed font-mono">
                            {error.message || "An unexpected error occurred while fetching blogs."}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg"
                    >
                        <RefreshCcw size={18} />
                        Retry Connection
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                        >
                            Go Back
                        </button>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                        >
                            <Home size={16} />
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
