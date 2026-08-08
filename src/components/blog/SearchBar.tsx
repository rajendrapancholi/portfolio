'use client';
import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function SearchBar() {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Link
      className="relative group tooltip"
      data-tip="Search posts"
      href="/blogs/search"
      scroll={false}
    >
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
        <Search className="size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>

      <input
        ref={searchInputRef}
        type="search"
        id="searchdoc"
        placeholder="Search documentation..."
        className="w-full sm:w-64 h-10 pl-10 pr-14 rounded-xl
          bg-muted/60 border border-border
          text-foreground placeholder:text-muted-foreground
          focus:border-primary focus:ring-2 focus:ring-primary/20
          transition-all sm:focus:w-80 outline-none
          max-sm:placeholder:text-[10px]"
      />

      <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none">
        <kbd className="kbd kbd-sm bg-background border-border text-[10px] text-muted-foreground">
          Ctrl+K
        </kbd>
      </div>
    </Link>
  );
}
