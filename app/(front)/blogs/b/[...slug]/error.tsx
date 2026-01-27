"use client";
import BlogsError from '@/components/blog/BlogsError';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string; };
    reset: () => void;
}) {
    return <BlogsError error={error} reset={reset} />;
}