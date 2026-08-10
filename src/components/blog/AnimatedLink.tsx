'use client';

import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useRef, useState } from 'react';
import Tooltip from '@/components/ui/Tooltip';

const MotionLink = motion(Link);

export default function AnimatedLink({
  slug,
  title,
  source,
}: {
  slug: string;
  title: string;
  source: string;
}) {
  const isActive = usePathname() === `/blogs/b/${source}/${slug}`;
  const reduceMotion = useReducedMotion();
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { scrollWidth, clientWidth } = entry.target;
        setIsTruncated(scrollWidth > clientWidth);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [title]);
  return (
    <Tooltip label={title} side="right" disabled={!isTruncated}>
      <MotionLink
        href={`/blogs/b/${source}/${slug}`}
        className="flex items-center gap-2 lg:gap-4 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors duration-200 relative isolate select-none"
        whileHover={reduceMotion ? undefined : { x: 3 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg bg-muted/70 -z-10"
          initial={false}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />

        <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none -z-10">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-primary/15 to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          />
        </div>

        <span
          ref={textRef}
          title={isTruncated ? title : undefined}
          className={`font-medium tracking-wide truncate text-xs lg:text-sm relative z-10 block min-w-0 flex-1 md:pointer-events-none ${isActive && 'text-primary'}`}
        >
          {title}
        </span>

        <motion.div
          className="absolute lg:-left-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] z-10"
          initial={false}
          animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        />
      </MotionLink>
    </Tooltip>
  );
}
