'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

function ImageModalContent() {
  const router = useRouter();
  const src = useSearchParams().get('src');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-cinema"
      onClick={() => router.back()}
    >
      {/* Close button */}
      <button
        onClick={() => router.back()}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-popover/85 text-popover-foreground border border-border backdrop-blur-md shadow-lg transition-all duration-cinema hover:bg-muted hover:scale-105 cursor-pointer"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      <img
        src={src}
        alt="Enlarged preview"
        className="max-h-[90vh] max-w-[92vw] rounded-2xl border border-border/50 bg-card object-contain shadow-2xl animate-in zoom-in-95 duration-cinema"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function ImageModal() {
  return (
    <Suspense fallback={null}>
      <ImageModalContent />
    </Suspense>
  );
}
