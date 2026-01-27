"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoveLeft, BookOpen, Home, Terminal } from 'lucide-react';
import RajeBrandLogo from '@/components/ui/RajeBrandLogo';

export default function BlogNotFound() {
    const router = useRouter();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center text-center px-4 transition-colors duration-500 bg-slate-50 dark:bg-[#050505] overflow-hidden">

            {/* Ambient Background Glows */}
            <div className="absolute -z-10 h-100 w-100 rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute -z-10 h-75 w-75 rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[100px] top-1/4 right-1/4" />

            {/* 1. Brand Logo Section */}
            <div className="mb-12 scale-110 md:scale-125 hover:scale-110 transition-transform duration-500 ease-out cursor-default">
                <RajeBrandLogo
                    logoType='type1'
                    firstText='Raje'
                    secondText='Blog'
                    title='Tracing digital footprints...'
                />
            </div>

            {/* 2. Interactive Content Card */}
            <div className="max-w-md w-full space-y-6 p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl shadow-2xl dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">

                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-blue-400">
                        <Terminal size={12} />
                        Status: 404 Blog Not Found
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Lost in the <span className="text-blue-600 dark:text-blue-400">Archives</span>
                    </h1>

                    <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed">
                        The blog post you are seeking has drifted out of reach. It may have been moved to a new directory or permanently deleted.
                    </p>
                </div>

                {/* 3. Action Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                    <Link
                        href="/blogs"
                        className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-slate-200 dark:shadow-none"
                    >
                        <BookOpen size={18} />
                        Explore Articles
                    </Link>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                        >
                            <MoveLeft size={16} />
                            Go Back
                        </button>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
                        >
                            <Home size={16} />
                            Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="absolute bottom-8 animate-pulse">
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
                    Rajendra pancholi
                </p>
            </div>
        </div>
    );
}
