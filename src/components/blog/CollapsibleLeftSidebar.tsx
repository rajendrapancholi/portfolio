'use client';

import { PanelLeftClose, PanelLeftOpen, BookOpen } from 'lucide-react';
import { useSidebarToggle } from '@/hooks/useSidebarToggle';

export default function CollapsibleLeftSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pinned, isOpen, toggle, onMouseEnter, onMouseLeave } =
    useSidebarToggle('left', true);

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        sticky top-14 z-20 hidden h-[calc(100vh-3.5rem)] shrink-0
        border-r border-border/50 bg-main-bg
        transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        md:flex md:flex-col
        ${isOpen ? 'w-60 lg:w-64' : 'w-12'}
      `}
    >
      {/* Header / toggle */}
      <div
        className={`
          flex shrink-0 items-center border-b border-border/40
          ${isOpen ? 'justify-between px-3 py-3' : 'justify-center py-3'}
        `}
      >
        {isOpen && (
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Recent
          </span>
        )}
        <button
          onClick={toggle}
          className="flex size-8 items-center justify-center rounded-lg
                     text-muted-foreground transition-colors
                     hover:bg-muted hover:text-foreground"
          title={pinned ? 'Collapse' : 'Pin open'}
        >
          {pinned ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
      </div>

      {/* Body */}
      <div className="relative flex-1 overflow-hidden">
        {/* Expanded content */}
        <div
          className={`
            h-full overflow-y-auto custom-scrollbar px-2 py-3
            transition-opacity duration-200
            ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}
          `}
        >
          {children}
        </div>

        {/* Collapsed strip */}
        <div
          className={`
            absolute inset-0 flex flex-col items-center gap-4 pt-4
            text-muted-foreground transition-opacity duration-200
            ${isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'}
          `}
        >
          <BookOpen size={16} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Blogs
          </span>
        </div>
      </div>
    </aside>
  );
}
