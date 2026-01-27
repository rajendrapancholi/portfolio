"use client";

import { ShieldAlert, Home, MoveLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RajeBrandLogo from '@/components/ui/RajeBrandLogo';

export default function Unauthorized() {
    const router = useRouter();

    return (
        <div className="relative flex h-screen flex-col items-center justify-center text-center px-4 transition-colors duration-500 bg-transparent overflow-hidden">
            <div className="absolute -z-10 h-80 w-80 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

            <div className="mb-12 opacity-80 cursor-default">
                <RajeBrandLogo path='/' firstText='Raje' secondText='P' title='Security protocol active...' />
            </div>

            <div className="max-w-md w-full space-y-6 p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl shadow-2xl">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-[10px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
                        <Lock size={12} />
                        Access Denied
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Restricted <span className="text-amber-600 dark:text-amber-500">Sector</span>
                    </h1>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-left border border-slate-200/50 dark:border-white/5">
                        <ShieldAlert size={18} className="text-amber-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-slate-900 dark:text-white text-sm font-semibold mb-1">
                                Admin Privileges Required
                            </p>
                            <p className="text-slate-600 dark:text-white/60 text-xs leading-relaxed">
                                Your current synchronization level does not have clearance for this terminal. Please contact the administrator.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all group"
                    >
                        <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Previous Station
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg"
                    >
                        <Home size={18} />
                        Return to Dashboard
                    </Link>

                </div>
            </div>
            <p className="mt-8 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">
                Unauthorized attempt logged • {new Date().getFullYear()}
            </p>
        </div>
    );
}
