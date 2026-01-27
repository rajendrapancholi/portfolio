'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeButton = ({ position = "left" }: { position?: "top" | "right" | "bottom" | "left"; }) => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="btn btn-ghost btn-circle btn-sm size-8" />;
    }

    const isDark = resolvedTheme === "dark";
    const positionT = `tooltip-${position}`;
    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`btn btn-ghost btn-circle btn-xs md:btn-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300 relative flex flex-col items-center capitalize custom-tooltip ${positionT}`}
            data-tip={isDark ? "switch to light mode" : "switch to dark mode"}
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Sun className="size-5 text-yellow-500 animate-in zoom-in duration-300" />
            ) : (
                <Moon className="size-5 text-[#007acc] animate-in zoom-in duration-300" />
            )}
        </button>
    );
};

export default ThemeButton;
