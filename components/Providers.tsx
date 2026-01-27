import { SessionProvider } from 'next-auth/react';
import ClientProviders from './ClientProvider';
import { auth } from '@/lib/auth';
import StoreProvider from './ReduxProvider';
import SessionWatcher from './auth/SessionWatcher';

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <StoreProvider session={session}>
        <SessionWatcher>
          <ClientProviders>
            {children}
          </ClientProviders>
        </SessionWatcher>
      </StoreProvider>
    </SessionProvider>
  );
}
