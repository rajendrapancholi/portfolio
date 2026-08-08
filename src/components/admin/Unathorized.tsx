'use client';

import { ShieldAlert, Home, MoveLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RajeBrandLogo from '@/components/ui/RajeBrandLogo';

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning/10 blur-[120px]" />

      {/* Brand */}
      <div className="mb-12 opacity-80">
        <RajeBrandLogo
          path="/"
          firstText="Raje"
          secondText="P"
          title="Security protocol active..."
        />
      </div>

      {/* Card */}
      <div className="card-glass w-full max-w-md space-y-6 rounded-3xl p-8 shadow-2xl">
        <div className="space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-warning">
            <Lock size={12} />
            Access Denied
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Restricted <span className="text-warning">Sector</span>
          </h1>

          {/* Alert box */}
          <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/50 p-4 text-left">
            <ShieldAlert size={18} className="mt-0.5 shrink-0 text-warning" />
            <div>
              <p className="mb-1 text-sm font-semibold">
                Admin Privileges Required
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your current synchronization level does not have clearance for
                this terminal. Please contact the administrator.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="btn btn-outline flex-1 gap-2 rounded-xl py-3 group"
          >
            <MoveLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Previous Station
          </button>

          <Link
            href="/"
            className="btn btn-primary flex-1 gap-2 rounded-xl py-3 font-semibold"
          >
            <Home size={18} />
            Return to Dashboard
          </Link>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
        Unauthorized attempt logged • {new Date().getFullYear()}
      </p>
    </div>
  );
}
