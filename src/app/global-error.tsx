'use client';

import { useEffect } from 'react';
import './globals.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('CRITICAL_SYSTEM_ERROR:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground min-h-screen flex items-center justify-center p-4 transition-colors duration-cinema">
        <div className="max-w-md w-full bg-card text-card-foreground border border-border rounded-3xl p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-destructive/15 border border-destructive/20 rounded-full flex items-center justify-center text-destructive">
              <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2 text-card-foreground">
            System Error
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            A critical error occurred in the root layout. The application needs
            to restart.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-all duration-cinema active:scale-95 shadow-md cursor-pointer"
            >
              Try Again
            </button>

            <button
              onClick={() => (window.location.href = '/')}
              className="w-full bg-muted/60 text-foreground font-medium py-3 rounded-xl border border-border hover:bg-muted transition-all duration-cinema cursor-pointer"
            >
              Go to Homepage
            </button>
          </div>

          {error.digest && (
            <p className="mt-6 text-[10px] text-muted-foreground font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
