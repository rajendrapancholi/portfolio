"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ImageModal() {
    const router = useRouter();
    const src = useSearchParams().get("src");

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                router.back();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [router]);

    if (!src) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={() => router.back()}
        >
            <img
                src={src}
                alt=""
                className="max-w-[90vw] max-h-[90vh] rounded-lg"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}

// 'use client';
// import { useRouter, useSearchParams } from 'next/navigation';

// export default function ImageModal() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const src = searchParams.get('src');

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-10" onClick={() => router.back()}>
//       <img src={src || ''} className="max-h-full max-w-full rounded-lg shadow-2xl object-contain animate-in zoom-in-95" />
//     </div>
//   );
// }
