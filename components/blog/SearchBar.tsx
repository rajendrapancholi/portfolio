"use client";
import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="size-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>

            <input
                ref={searchInputRef}
                type="search"
                id="searchdoc"
                placeholder="Search documentation..."
                className="input input-sm input-bordered bg-slate-900/50 border-slate-800 
                   focus:border-cyan-500 w-64 pl-10 pr-12 h-10 rounded-xl 
                   transition-all focus:w-80 outline-none focus:ring-0"
            />

            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <kbd className="kbd kbd-sm bg-slate-800 border-slate-700 text-[10px] text-slate-500">
                    Ctrl+K
                </kbd>
            </div>
        </div>
    );
}
