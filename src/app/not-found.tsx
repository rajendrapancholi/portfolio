'use client';

import RajeBrandLogo from '@/components/ui/RajeBrandLogo';
import { ArrowLeft, HomeIcon, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground px-6 text-center transition-colors duration-cinema">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="z-10 flex flex-col items-center max-w-2xl">
        <div
          className="tooltip tooltip-top tooltip-info mb-12 scale-125 hover:scale-110 transition-transform duration-500 ease-out capitalize"
          data-tip="Return to home"
        >
          <RajeBrandLogo
            logoType="type1"
            firstText="Raje"
            secondText="Dev"
            title="System is offline"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic">
            Route <span className="text-primary">Not Found</span>
          </h1>

          <div className="flex items-center justify-center gap-2 text-muted-foreground font-mono text-sm">
            <Terminal size={16} className="text-primary" />
            <p className="animate-pulse">ERROR_0x404: RESOURCE_MISSING</p>
          </div>

          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto leading-relaxed mt-4">
            The system has encountered a logic gap. The requested path does not
            exist within the{' '}
            <span className="text-foreground font-semibold">RajeDev</span>{' '}
            ecosystem.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 mt-12 w-full sm:w-auto">
          <button
            onClick={() => router.back()}
            className="group relative flex items-center justify-center gap-3 bg-transparent text-foreground border border-border px-10 py-4 rounded-full hover:bg-neutral hover:text-neutral-foreground hover:border-neutral transition-all duration-cinema cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold tracking-wide">Back to Reality</span>
          </button>

          <Link
            href="/"
            className="group flex items-center justify-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold hover:opacity-90 hover:shadow-[0_0_24px_var(--ring)] transition-all duration-cinema"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Core System</span>
          </Link>
        </div>
      </div>

      {/* Subtle Interactive Detail */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 border-t border-border pt-4 w-64">
        <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase">
          © 2026 RajeDev Digital Operations
        </p>
      </div>
    </main>
  );
}
