'use client';

import {
  PanelRightClose,
  PanelRightOpen,
  List,
  X,
  ListIcon,
} from 'lucide-react';
import TocSidebar from './TOCSidebar';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingToc } from '../Loading';

type Heading = { id: string; text: string; level: number };

export default function CollapsibleToc({ headings }: { headings: Heading[] }) {
  const { pinned, isOpen, toggle, onMouseEnter, onMouseLeave } =
    useSidebarToggle('right-toc', true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasHeadings = headings && headings.length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingToc />;
  return (
    <>
      {/* Desktop (xl+) */}
      <div
        className={`${pinned ? 'absolute' : 'w-12 h-screen sticky top-0 bottom-0 right-0'}`}
      />
      <aside
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`z-30 hidden h-[calc(100vh-3.5rem)] shrink-0 border-l rounded-tl-md rouunted-bl-md border-border/60 bg-main-bg shadow-xl transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] xl:flex xl:flex-col ${isOpen ? 'w-72' : 'w-12'} ${pinned ? 'sticky top-14' : 'fixed top-14 right-0'}`}
      >
        {/* Header */}
        <div
          className={`
          flex shrink-0 items-center border-b border-border/40
          ${isOpen ? 'justify-between px-3 py-3' : 'justify-center py-3'}
        `}
        >
          <span
            className={`
            text-xs font-semibold uppercase tracking-widest text-muted-foreground
            transition-opacity duration-200
            ${isOpen ? 'opacity-100' : 'sr-only opacity-0'}
          `}
          >
            On this page
          </span>

          <button
            onClick={toggle}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground tooltip tooltip-left"
            data-tip={pinned ? 'Collapse sidebar' : 'Pin sidebar open'}
          >
            {pinned ? (
              <PanelRightClose size={15} />
            ) : (
              <PanelRightOpen size={15} />
            )}
          </button>
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-hidden">
          {/* Expanded */}
          <div
            className={`
            h-full transition-all duration-300
            ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
          `}
          >
            <TocSidebar headings={headings} bare />
          </div>

          {/* Collapsed strip */}
          <div
            className={`
            absolute inset-0 flex flex-col items-center gap-3 pt-3
            text-muted-foreground transition-opacity duration-150
            ${isOpen ? 'pointer-events-none opacity-0' : 'opacity-100 delay-100'}
          `}
          >
            <List size={14} className="opacity-70" />
            <span
              className="text-[9px] font-bold uppercase tracking-[0.18em] opacity-80"
              style={{ writingMode: 'vertical-rl' }}
            >
              Contents
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile / tablet (<xl) FAB */}
      {hasHeadings && (
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open table of contents"
          className="fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full bg-primary/80 text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95 xl:hidden"
        >
          <ListIcon size={20} strokeWidth={2.25} />
        </button>
      )}
      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[75vh] flex-col rounded-t-2xl border-t border-border bg-card px-4 pb-6 pt-4 shadow-2xl xl:hidden"
            >
              {/* Grab handle */}
              <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-border" />

              {/* Header */}
              <div className="mb-3 flex shrink-0 items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  On this page
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close table of contents"
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>

              <div
                className="min-h-0 flex-1 overflow-y-auto"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest('a')) setMobileOpen(false);
                }}
              >
                <TocSidebar headings={headings} bare />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
