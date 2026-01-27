"use client";

export default function LoadingSidebar() {
    const skeletonItems = Array.from({ length: 6 });

    return (
        <div className="flex flex-col h-full">
            {/* "Related blogs" Title Skeleton */}
            <div className="mb-6 px-2">
                <div className="loading-md h-3 w-24" />
            </div>

            <div className="flex-1 space-y-2 px-0.5 lg:px-2">
                {skeletonItems.map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 lg:gap-4 px-2 py-3 rounded-2xl border border-transparent"
                    >
                        {/* Icon Placeholder (Circle/Square) */}
                        <div className="loading-md h-5 w-5 shrink-0 rounded-lg" />

                        {/* Text Label Placeholder */}
                        <div className="loading-md h-4 w-24 lg:w-32" />

                        {/* Optional: The Dot Placeholder at the end */}
                        <div className="ml-auto loading-md h-1.5 w-1.5 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
