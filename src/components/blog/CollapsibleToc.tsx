'use client';

import { PanelRightClose, PanelRightOpen, List } from 'lucide-react';
import TocSidebar from './TOCSidebar';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';

type Heading = { id: string; text: string; level: number };

export default function CollapsibleToc({ headings }: { headings: Heading[] }) {
  const { pinned, isOpen, toggle, onMouseEnter, onMouseLeave } =
    useSidebarToggle('right-toc', true);

  return (
    <>
      <div
        className={`${pinned ? 'absolute' : 'w-12 h-screen sticky top-0 bottom-0 right-0'}`}
      />
      <aside
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={` z-30 hidden h-[calc(100vh-3.5rem)] shrink-0 border-l rounded-tr-md rouunted-br-md border-border/50 bg-main-bg shadow-xl transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] xl:flex xl:flex-col ${isOpen ? 'w-72' : 'w-12'} ${pinned ? 'sticky top-14' : 'fixed top-14 right-0'}`}
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
    </>
  );
}
