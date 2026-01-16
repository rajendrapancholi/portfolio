'use client';
import React, { JSX, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import UserMenu from './UserMenu';
import { User } from '@/types';

export const FloatingNavbar = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { data: session } = useSession();
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
      let direction = current - (scrollYProgress.getPrevious() ?? 0);
      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        key={"nav-bar"}
        {...({} as any)}
        initial={{ opacity: 0, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto z-[5000] px-4 py-2 items-center justify-center space-x-2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]",
          className
        )}
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={navItem.name}
            href={navItem.link}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative px-1 md:px-4 md:py-2 transition-colors duration-200"
          >
            {/* The Floating Pill Background */}
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  {...({} as any)}
                  key={"nav-menu"}
                  layoutId="nav-pill"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </AnimatePresence>

            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-base">{navItem.icon}</span>
              <span className="hidden sm:block text-sm font-medium text-neutral-300 hover:text-white">
                {navItem.name}
              </span>
            </div>
          </Link>
        ))}

        <div className="h-4 w-[1px] bg-white/20 mx-2" /> {/* Divider */}

        {session?.user ? (
          <div className="flex items-center gap-4">
            <UserMenu user={session.user as User} />
            <button
              onClick={() => signOut({ callbackUrl: '/signin' })}
              className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
            >
              Exit
            </button>
          </div>
        ) : (
          <Link href="/signin" className="relative group">
            <button className="text-sm font-semibold text-white bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-2 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-500/40 transition-all active:scale-95">
              Sign In
            </button>
          </Link>
        )}
      </motion.nav>
    </AnimatePresence>
  );
};
