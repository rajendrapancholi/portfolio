'use client';

import { PanelRightClose, PanelRightOpen, List } from 'lucide-react';
import TocSidebar from './TOCSidebar';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';

type Heading = { id: string; text: string; level: number };

export default function CollapsibleToc({ headings }: { headings: Heading[] }) {
  const { pinned, isOpen, toggle, onMouseEnter, onMouseLeave } =
    useSidebarToggle('right-toc', true);

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
      sticky top-20 z-20 hidden h-[calc(100vh-5.5rem)] shrink-0
      border-l border-border/50
      transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
      xl:flex xl:flex-col
      ${isOpen ? 'w-72' : 'w-12'}
    `}
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
          text-[11px] font-semibold uppercase tracking-widest text-muted-foreground
          transition-opacity duration-200
          ${isOpen ? 'opacity-100' : 'sr-only opacity-0'}
        `}
        >
          On this page
        </span>

        <button
          onClick={toggle}
          className="flex size-7 shrink-0 items-center justify-center rounded-md
                   text-muted-foreground transition-colors
                   hover:bg-muted hover:text-foreground"
          title={pinned ? 'Collapse' : 'Pin open'}
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
        {/* Expanded panel */}
        <div
          className={`h-full transition-all duration-300 ${
            isOpen
              ? 'opacity-100 visible'
              : 'opacity-0 invisible pointer-events-none'
          }`}
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
          <List size={14} />
          <span
            className="text-[9px] font-bold uppercase tracking-[0.18em]"
            style={{ writingMode: 'vertical-rl' }}
          >
            Contents
          </span>
        </div>
      </div>
    </aside>
  );
}
