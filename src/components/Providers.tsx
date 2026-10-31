import { SessionProvider } from 'next-auth/react';
import ClientProviders from './ClientProvider';
import StoreProvider from './ReduxProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>
        <ClientProviders>{children}</ClientProviders>
      </StoreProvider>
    </SessionProvider>
  );
}
