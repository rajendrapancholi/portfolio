"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon } from "lucide-react";
import { Button } from "./ButtonCmp";
import { Calendar } from "./Calander";

export function NavbarCalendar() {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            {/* The Trigger Button in the Navbar */}
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="gap-2 flex-center text-gray-600 dark:text-gray-300 custom-tooltip" data-tip="Open calender"
            >
                <CalendarIcon className="size-5" />
                <span className="hidden md:inline">Calender</span>
            </Button>

            {/* The Animated Popover Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed max-sm:left-0 sm:absolute sm:mt-2 sm:right-2 z-100 shadow-2xl shadow-black/20"
                    >
                        {/* We use our pure custom Calendar here */}
                        <Calendar
                            className="bg-white dark:bg-gray-950 rounded-2xl border-gray-200 dark:border-white/10"
                            onDateSelect={(date) => {
                                setIsOpen(false);
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
