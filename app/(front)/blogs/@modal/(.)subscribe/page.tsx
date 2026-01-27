'use client';
import ModalWrapper from "@/components/ui/ModalWrapper";
import { Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SubscribeModal() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => setStatus('success'), 1500); // Simulate API
    };

    return (
        <ModalWrapper>
            <div className="p-8 text-center">
                {status === 'success' ? (
                    <div className="py-6 animate-in zoom-in">
                        <CheckCircle2 className="size-16 text-cyan-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Welcome to the inner circle!</h2>
                        <p className="text-slate-500 mt-2">Check your inbox for the first tutorial.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mail className="size-8 text-[#007acc] dark:text-[#4fa6ff]" />
                        </div>
                        <h2 className="text-2xl font-bold">Stay Updated</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">
                            Get the latest Next.js 16 and Obsidian workflows delivered weekly.
                        </p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                required
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-[#007acc] outline-none transition-all"
                            />
                            <button
                                disabled={status === 'loading'}
                                className="w-full py-3 bg-[#007acc] hover:bg-[#005f9e] text-white font-bold rounded-xl transition-all disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Joining...' : 'Subscribe Now'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </ModalWrapper>
    );
}
