'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string; };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('CRITICAL_SYSTEM_ERROR:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                            <svg xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">System Error</h1>
                    <p className="text-slate-400 text-sm mb-8">
                        A critical error occurred in the root layout. The application needs to restart.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => reset()}
                            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => window.location.href = '/'}
                            className="w-full bg-white/5 text-slate-300 font-medium py-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                        >
                            Go to Homepage
                        </button>
                    </div>

                    {error.digest && (
                        <p className="mt-6 text-[10px] text-slate-600 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
