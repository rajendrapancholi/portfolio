'use client';

import ModalWrapper from '@/components/ui/ModalWrapper';
import { Search, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Blog } from '@/lib/models/BlogModel';
import { useRouter } from 'next/navigation';
import fetchAllBlogs from '@/lib/utils/fetchAllBlogs';

export default function SearchModal() {
  const [query, setQuery] = useState('');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredResults = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(query.toLowerCase()),
  );

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelection = (source: string, slug: string) => {
    router.back();
    setTimeout(() => {
      router.push(`/blogs/b/${source}/${slug}`);
    }, 50);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onDismiss();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : prev,
        );
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }
      if (e.key === 'Enter' && filteredResults[activeIndex]) {
        const selected = filteredResults[activeIndex];
        handleSelection(selected.source, selected.slug);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredResults, activeIndex, onDismiss]);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAllBlogs();
        if (isMounted && response.length > 0) {
          setBlogs(response);
        }
      } catch (error) {
        if (isMounted) console.error('Search fetch error:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ModalWrapper>
      <div className="flex h-[32rem] flex-col">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          {isLoading ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : (
            <Search className="size-5 text-muted-foreground" />
          )}
          <input
            ref={searchInputRef}
            autoFocus
            placeholder="Search tutorials, code, workflows..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="kbd kbd-sm hidden sm:inline-flex">ESC</kbd>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm">Loading index...</p>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-1">
              {filteredResults.map((blog, index) => {
                const isActive = index === activeIndex;
                return (
                  <Link
                    key={blog._id}
                    href={`/blogs/b/${blog.source}/${blog.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelection(blog.source, blog.slug);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-3 transition-all ${
                      isActive
                        ? 'bg-primary/10 ring-1 ring-primary/25'
                        : 'hover:bg-muted/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        }`}
                      >
                        <FileText className="size-4" />
                      </div>
                      <div>
                        <div
                          className={`font-medium ${
                            isActive
                              ? 'text-primary'
                              : 'group-hover:text-primary'
                          }`}
                        >
                          {blog.title}
                        </div>
                      </div>
                    </div>

                    <ArrowRight
                      className={`size-4 transition-all ${
                        isActive
                          ? 'translate-x-0 opacity-100 text-primary'
                          : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-primary'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
              <Search className="size-8 opacity-40" />
              <p className="text-sm">
                {query
                  ? `No results for "${query}"`
                  : 'Start typing to search...'}
              </p>
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-5 border-t border-border bg-muted/40 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <kbd className="kbd kbd-xs">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="kbd kbd-xs">ENTER</kbd>
            select
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="kbd kbd-xs">ESC</kbd>
            close
          </span>
          <span className="ml-auto tabular-nums">
            {filteredResults.length} result
            {filteredResults.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </ModalWrapper>
  );
}
