'use client';

import { motion, MotionProps } from 'motion/react';
import Link from 'next/link';
import { formatString } from '@/lib/utils/formatter';
import { usePathname } from 'next/navigation';

export default function AnimatedLink({
  slug,
  title,
  source,
}: {
  slug: string;
  title: string;
  source: string;
}) {
  const pathname = `/blogs/b/${source}/${slug}` === usePathname();
  const MotionDiv = motion.div as React.FC<
    MotionProps & React.HTMLAttributes<HTMLDivElement>
  >;
  return (
    <MotionDiv
      whileHover={{ x: 5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link
        href={`/blogs/b/${source}/${slug}`}
        className="flex flex-wrap items-center gap-2 lg:gap-4 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all group relative overflow-hidden"
      >
        <div
          className={`absolute inset-0 bg-linear-to-r from-primary/20 to-transparent group-hover:opacity-100 transition-opacity ${
            pathname ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <span className="font-medium tracking-wide text-wrap text-xs lg:text-sm relative z-10">
          {formatString(title, 50)}
        </span>

        <div
          className={`absolute right-3 ml-auto w-1.5 h-1.5 rounded-full bg-primary transition-opacity shadow-[0_0_8px_var(--color-primary)] ${
            pathname ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </Link>
    </MotionDiv>
  );
}
