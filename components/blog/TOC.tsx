"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Toc({ toc }: { toc: { id: string; text: string; level: number; }[]; }) {
    const [active, setActive] = useState<string>("");
    const isClicking = useRef(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (isClicking.current) return;

            // 1. Get current scroll position with a small offset (e.g., 100px for a navbar)
            const scrollPosition = window.scrollY + 120;

            // 2. Map all headings to their vertical positions
            const headingPositions = toc
                .map((item) => {
                    const element = document.getElementById(item.id);
                    if (element) {
                        return { id: item.id, top: element.offsetTop };
                    }
                    return null;
                })
                .filter((item): item is { id: string; top: number; } => item !== null);

            // 3. Find the heading that is closest to the top but NOT below the scroll position
            // We want the LAST heading that has passed the scroll line
            let currentId = "";
            for (let i = 0; i < headingPositions.length; i++) {
                if (scrollPosition >= headingPositions[i].top) {
                    currentId = headingPositions[i].id;
                } else {
                    // Since we've reached a heading that is still below our scroll line, 
                    // the previous one was our active one.
                    break;
                }
            }

            if (currentId !== active) {
                setActive(currentId);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [toc, active]); // Added active to dependencies for precise updates




    // Handle smooth scrolling and manual state override
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        setActive(id);
        isClicking.current = true;

        const targetElement = document.getElementById(id);
        if (targetElement) {
            const offset = 100; // Adjust based on your header height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = targetElement.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }

        // Allow observer to take over again after scroll finishes
        setTimeout(() => (isClicking.current = false), 1000);
    };

    return (
        <nav aria-label="Article headings"
            ref={navRef}
            className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 py-2 pr-2 max-h-[80vh]"
        >
            {toc.map((item, index) => {
                const isActive = active === item.id;
                return (
                    <Link
                        key={`${item.id}-${index}`}
                        href={`#${item.id}`}
                        onClick={(e) => handleLinkClick(e, item.id)}
                        style={{ paddingLeft: `${(item.level * 0.75) + 1}rem` }}
                        className={`
                            group relative flex items-center py-0.5 pr-3 text-[13px] font-medium 
                            transition-all duration-200 ease-in-out
                            ${isActive ? "text-cyan-400 translate-x-1" : "text-slate-500 hover:text-slate-200 hover:translate-x-1"}
                        `}
                    >
                        <span>{item.text}</span>
                    </Link>
                );
            })}
        </nav>
    );
}