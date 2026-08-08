'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

export default function ImageModal() {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => router.back()}
    >
      {/* Close button */}
      <button
        onClick={() => router.back()}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full
                   bg-white/10 text-white backdrop-blur-md transition-all
                   hover:bg-white/20 hover:scale-105"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      <img
        src={src}
        alt=""
        className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl
                   animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
