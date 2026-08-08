'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const AUTOPLAY_MS = 3200;

export function TextMoveUp({ text }: { text: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (paused) return;
    startRef.current = Date.now();
    const id = setTimeout(() => {
      setIndex((prev) => (prev + 1) % text.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, text.length]);

  const current = text[index];
  const words = current.split(' ');

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center gap-5 px-4 py-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <motion.div
        layout
        transition={{ layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
        className="relative flex items-center justify-center w-full max-w-3xl"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, filter: 'blur(8px)', y: 8 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, filter: 'blur(0px)', y: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, filter: 'blur(8px)', y: -8 }
            }
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center font-bold text-foreground text-2xl sm:text-4xl md:text-5xl tracking-tight py-2"
          >
            {words.map((word, i) => (
              <motion.span
                key={`${index}-${i}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: prefersReducedMotion ? 0 : i * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={
                  i === words.length - 1
                    ? 'bg-clip-text text-transparent bg-linear-to-r from-primary to-brand'
                    : ''
                }
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
