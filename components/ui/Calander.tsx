"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button, buttonVariants } from "./ButtonCmp";
import { motion, AnimatePresence } from "framer-motion";

export interface CalendarProps {
    className?: string;
    showOutsideDays?: boolean;
    onDateSelect?: (date: Date) => void;
    initialDate?: Date;
}

export function Calendar({
    className,
    showOutsideDays = true,
    onDateSelect,
    initialDate = new Date(),
}: CalendarProps) {
    const [viewDate, setViewDate] = React.useState(initialDate);
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(initialDate);
    const [direction, setDirection] = React.useState(0);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // --- Native Calendar Logic ---
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // 1. Prev Month Days (Outside)
    const prevMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => {
        const day = daysInPrevMonth - firstDayOfMonth + i + 1;
        return { day, month: month - 1, isOutside: true };
    });

    // 2. Current Month Days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        month: month,
        isOutside: false,
    }));

    // 3. Next Month Days (Outside) - padding to 42 cells (6 rows)
    const totalCells = 42;
    const nextMonthDays = Array.from(
        { length: totalCells - (prevMonthDays.length + currentMonthDays.length) },
        (_, i) => ({ day: i + 1, month: month + 1, isOutside: true })
    );

    const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

    const handleMonthChange = (offset: number) => {
        setDirection(offset);
        setViewDate(new Date(year, month + offset, 1));
    };

    const isToday = (d: number, m: number) => {
        const today = new Date();
        return today.getDate() === d && today.getMonth() === m && today.getFullYear() === year;
    };

    const isSelected = (d: number, m: number) => {
        return selectedDate?.getDate() === d && selectedDate?.getMonth() === m && selectedDate?.getFullYear() === year;
    };
    const [mounted, setMounted] = React.useState<boolean>(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const today = new Date().toLocaleTimeString('en-IN', {
        timeStyle: "short",
        hour12: false,
    });
    return (
        <div
            className={cn(
                "p-3 w-fit bg-background border border-border rounded-xl shadow-sm",
                "[--cell-size:36px] [--cell-radius:8px]",
                className
            )}
        >
            {/* Nav Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={() => handleMonthChange(-1)}
                >
                    <ChevronLeftIcon className="size-4" />
                </Button>

                <div className="text-sm font-medium select-none">
                    {viewDate.toLocaleString("default", { month: "long", year: "numeric" })}
                    {" "}{mounted ? today : null}
                </div>

                <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={() => handleMonthChange(1)}
                >
                    <ChevronRightIcon className="size-4" />
                </Button>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="text-center text-[11px] font-medium text-muted-foreground uppercase py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid with Framer Motion Animation */}
            <div className="relative overflow-hidden w-[calc(var(--cell-size)*7+24px)] min-h-[calc(var(--cell-size)*6)]">
                <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                    <motion.div
                        key={`${month}-${year}`}
                        custom={direction}
                        initial={{ x: direction > 0 ? 30 : -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction > 0 ? -30 : 30, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="grid grid-cols-7 gap-1"
                    >
                        {allDays.map((item, idx) => {
                            const hidden = item.isOutside && !showOutsideDays;
                            const active = isSelected(item.day, item.month);
                            const today = isToday(item.day, item.month);

                            if (hidden) return <div key={idx} className="size-(--cell-size)" />;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        const newDate = new Date(year, item.month, item.day);
                                        setSelectedDate(newDate);
                                        if (onDateSelect) onDateSelect(newDate);
                                    }}
                                    className={cn(
                                        buttonVariants({ variant: active ? "default" : "ghost" }),
                                        "size-(--cell-size) p-0 text-sm font-normal rounded-(--cell-radius) relative",
                                        item.isOutside && "text-muted-foreground/50",
                                        today && !active && "text-indigo-500 font-bold bg-indigo-500/10 hover:bg-indigo-500/20"
                                    )}
                                >
                                    {item.day}
                                    {today && (
                                        <motion.div
                                            layoutId="today-indicator"
                                            className="absolute bottom-1 size-1 rounded-full bg-current"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
