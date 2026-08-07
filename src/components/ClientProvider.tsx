'use client';

import { SWRConfig } from 'swr';
import { ThemeProvider } from './ThemeProvider';
import toast from 'react-hot-toast';
import ToastProvider from './ui/ToastProvider';
import TopLoaderProvider from './TopLoaderProvider';
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          toast.error(error.message);
        },
        fetcher: async (resource, init) => {
          const res = await fetch(resource, init);
          if (!res.ok) {
            throw new Error('An error occurred while fetching the data.');
          }
          return res.json();
        },
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TopLoaderProvider />
        <ToastProvider position='top-center' />
        {children}
      </ThemeProvider>
    </SWRConfig>
  );
}
