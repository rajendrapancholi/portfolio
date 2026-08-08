'use client';

import ModalWrapper from '@/components/ui/ModalWrapper';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SubscribeModal() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500); // Simulate API
  };

  return (
    <ModalWrapper>
      <div className="p-8 sm:p-10 text-center">
        {status === 'success' ? (
          <div className="py-8 animate-in zoom-in-95 duration-300">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-success/15">
              <CheckCircle2 className="size-9 text-success" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome to the inner circle!
            </h2>
            <p className="mt-3 text-muted-foreground">
              Check your inbox for the first tutorial.
            </p>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
              <Mail className="size-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">Stay Updated</h2>
            <p className="mt-2 mb-8 text-muted-foreground">
              Get the latest Next.js and Obsidian workflows delivered weekly.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-base-200/50 px-4 py-3.5 text-sm
                           outline-none transition-all
                           placeholder:text-muted-foreground
                           focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary w-full py-3.5 text-sm font-semibold disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Joining...
                  </span>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </ModalWrapper>
  );
}
