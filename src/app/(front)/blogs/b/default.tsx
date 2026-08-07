"use client";

import { motion } from "motion/react";
import { BookOpen, Layers, Route, Zap } from "lucide-react";
import Link from "next/link";

const defaultDocs = [
    { name: "Getting Started", icon: <BookOpen size={16} /> },
    { name: "Project Structure", icon: <Layers size={16} /> },
    { name: "Routing Patterns", icon: <Route size={16} /> },
    { name: "Best Practices", icon: <Zap size={16} /> },
];

export default function LeftDefault() {
    return (
        <aside className="h-full flex flex-col gap-6">
            <div className="px-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Overview
                </h3>

                <nav className="space-y-1">
                    {defaultDocs.map((item, index) => (
                        <motion.div
                            key={item.name || index}
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link
                                href="#"
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors group"
                            >
                                <span className="text-slate-500 group-hover:text-cyan-500 transition-colors">
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        </motion.div>

                    ))}
                </nav>
            </div>

            {/* Helpful fallback hint */}
            <div className="mt-auto p-4 rounded-xl bg-slate-900/50 border border-white/5 text-[11px] text-slate-500">
                Showing default navigation. Use the search or breadcrumbs to find specific sub-sections.
            </div>
        </aside>
    );
}
