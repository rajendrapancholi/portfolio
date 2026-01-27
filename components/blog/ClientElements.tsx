"use client";
import dynamic from 'next/dynamic';

const ScrollToTop = dynamic(() => import("@/components/ui/ScrollToTop"), {
    ssr: false
});
export default function ClientSideElements({ }) {
    return (
        <ScrollToTop />
    );
}
