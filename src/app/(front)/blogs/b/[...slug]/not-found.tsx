'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoveLeft, BookOpen, Home, Terminal } from 'lucide-react';
import RajeBrandLogo from '@/components/ui/RajeBrandLogo';

export default function BlogNotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center text-center px-4 transition-colors duration-500 bg-main-bg overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute -z-10 h-100 w-100 rounded-full bg-primary/10 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute -z-10 h-75 w-75 rounded-full bg-primary/5 blur-[100px] top-1/4 right-1/4" />

      {/* Brand Logo */}
      <div className="mb-12 scale-110 md:scale-125 hover:scale-110 transition-transform duration-500 ease-out cursor-default">
        <RajeBrandLogo
          logoType="type1"
          firstText="Raje"
          secondText="Blog"
          title="Tracing digital footprints..."
        />
      </div>

      {/* Content Card */}
      <div className="max-w-md w-full space-y-6 p-8 rounded-3xl border border-border bg-card/90 backdrop-blur-2xl shadow-2xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <Terminal size={12} />
            Status: 404 Blog Not Found
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Lost in the <span className="text-primary">Archives</span>
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            The blog post you are seeking has drifted out of reach. It may have
            been moved to a new directory or permanently deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/blogs"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <BookOpen size={18} />
            Explore Articles
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all active:scale-95"
            >
              <MoveLeft size={16} />
              Go Back
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all active:scale-95"
            >
              <Home size={16} />
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Tag */}
      <div className="absolute bottom-8">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em]">
          Rajendra Pancholi
        </p>
      </div>
    </div>
  );
}
