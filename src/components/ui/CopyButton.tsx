'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion, AnimatePresence, MotionProps } from 'motion/react';

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const MotionSpan = motion.span as React.FC<
    MotionProps & React.HTMLAttributes<HTMLSpanElement>
  >;

  return (
    <button
      onClick={handleCopy}
      className={`absolute top-1 right-3 p-1.5 rounded-md transition-all duration-200 z-50 bg-card/80 text-muted-foreground border border-border shadow-sm backdrop-blur-md opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-foreground hover:scale-110 active:scale-100 cursor-pointer tooltip tooltip-left`}
      data-tip={copied ? 'Copied!' : 'Copy code'}
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
              <Check className="w-4 h-4 text-success" />
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
