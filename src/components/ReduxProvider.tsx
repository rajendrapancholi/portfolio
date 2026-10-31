'use client';
import { clearCredentials, setSession } from '@/lib/features/auth/authSlice';
import { AppStore, makeStore } from '@/lib/features/store';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

function SessionSync({ store }: { store: AppStore }) {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'authenticated') store.dispatch(setSession(session));
    else if (status === 'unauthenticated') store.dispatch(clearCredentials());
  }, [session, status, store]);
  return null;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      <SessionSync store={storeRef.current} />
      {children}
    </Provider>
  );
}
