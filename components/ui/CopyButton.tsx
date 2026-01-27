"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence, MotionProps } from "motion/react";

export const CopyButton = ({ text }: { text: string; }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const MotionSpan = motion.span as React.FC<MotionProps & React.HTMLAttributes<HTMLSpanElement>>;

    return (
        <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-2 rounded-lg transition-all duration-200 z-50 bg-white/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border dark:border-slate-700 shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-slate-800 dark:hover:text-slate-200 hover:scale-110 active:scale-100 cursor-pointer tooltip tooltip-left`}
            data-tip={copied ? "Copied!" : "Copy code"}
        >
            <div className="relative w-4 h-4 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {copied ? (
                        <MotionSpan
                            key="check"
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="absolute"
                        >
                            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </MotionSpan>
                    ) : (
                        <MotionSpan
                            key="copy"
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="absolute"
                        >
                            <Copy className="w-4 h-4" />
                        </MotionSpan>
                    )}
                </AnimatePresence>
            </div>
        </button>
    );
};
