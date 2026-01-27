"use client";

import { motion, MotionProps } from "motion/react";
import Link from "next/link";
import { formatString } from "@/lib/utils/formatter";
import { usePathname } from "next/navigation";

export default function AnimatedLink({ slug, title, source }: { slug: string; title: string; source: string; }) {
    const pathname = `/blogs/b/${source}/${slug}` === usePathname();
    const MotionDiv = motion.div as React.FC<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    return (
        <MotionDiv
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Link
                href={`/blogs/b/${source}/${slug}`}
                className="flex flex-wrap items-center gap-2 lg:gap-4 px-3 py-2 rounded-md text-slate-700 hover:text-gray-900 hover:bg-white/3 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-all group relative overflow-hidden"
            >
                <div className={`absolute inset-0 bg-linear-to-r from-cyan-500/30 dark:from-cyan-500/10  to-transparent  group-hover:opacity-100 transition-opacity ${pathname ? 'opacity-100' : 'opacity-0'}`} />

                <span className="font-medium tracking-wide text-wrap text-xs lg:text-sm">
                    {formatString(title, 50)}
                </span>

                <div className={`absolute right-3 ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#06b6d4] ${pathname ? 'opacity-100' : 'opacity-0'}`} />
            </Link>
        </MotionDiv>
    );
}
