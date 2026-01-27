'use client';

import { useGetSessionQuery } from "@/lib/features/auth/authApi";

export default function SessionWatcher({ children }: { children: React.ReactNode; }) {
    useGetSessionQuery(undefined, { pollingInterval: 300000 });
    return <>{children}</>;
}
