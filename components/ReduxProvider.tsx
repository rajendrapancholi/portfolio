'use client';
import { setSession } from '@/lib/features/auth/authSlice';
import { AppStore, makeStore } from '@/lib/features/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';


export default function StoreProvider({
  session,
  children
}: {
  session: any;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Initialize store
    storeRef.current = makeStore();
    // Seed with session data from server
    if (session) {
      storeRef.current.dispatch(setSession(session));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
