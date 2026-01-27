"use client";
import { useState } from "react";
import dynamic from 'next/dynamic';

type HeadingProps = {
    text: string;
    id: string;
    level: number;
};

interface SidebarProps {
    headings: HeadingProps[];
}

export default function TocSidebar({ headings }: SidebarProps) {

    const Toc = dynamic(() => import('./TOC'), { ssr: false });
    const [email, setEmail] = useState("");
    const [showVerifyModal, setShowVerifyModal] = useState(false);

    const handleSubscribe = () => {
        if (!email) return alert("Enter your email");
        setShowVerifyModal(true);
    };
    return (
        <>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex flex-col h-full overflow-hidden">
                    {/* TOC Container */}
                    <div className="p-6 flex-1 flex flex-col min-h-0  bg-white/50 border-slate-200 dark:bg-slate-900/50 dark:border-slate-800  rounded-2xl border transition-colors duration-300">

                        <h3 className="text-xs font-semibold uppercase tracking-wider my-2 shrink-0 text-slate-900 dark:text-white">
                            On this page
                        </h3>
                        <Toc toc={headings} />
                    </div>
                    <div className="mt-8 shrink-0 p-6 rounded-2xl border transition-all duration-300 g-linear-to-br from-cyan-50 to-blue-50 border-cyan-200 dark:from-cyan-900/20 dark:to-blue-900/20 dark:border-cyan-500/20">

                        <h4 className="text-sm font-bold mb-2 text-slate-900 dark:text-white">
                            Subscribe to our newsletter
                        </h4>

                        <p className="text-xs mb-4 text-slate-600 dark:text-slate-400">
                            Stay updated on new releases.
                        </p>

                        <input
                            type="email"
                            placeholder="email@example.com"
                            className="w-full rounded-lg px-3 py-2 text-xs mb-2 outline-none border transition-all bg-white  border-slate-200 text-slate-900 focus:border-cyan-500 dark:bg-slate-950 dark:border-slate-700 dark:text-white dark:focus:border-cyan-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button
                            onClick={handleSubscribe}
                            className="w-full text-xs font-bold py-2 rounded-lg transition-colors bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500">
                            Subscribe
                        </button>
                    </div>
                </div>

                {showVerifyModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-sm w-full">
                            <h4 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-200">Verify your email</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">A verification link will be sent to <strong>{email}</strong>.</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowVerifyModal(false)}
                                    className="px-4 py-2 bg-gray-300 dark:bg-slate-700 rounded-lg text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { alert("Verification sent!"); setShowVerifyModal(false); setEmail(""); }}
                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}
