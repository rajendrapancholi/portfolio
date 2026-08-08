'use client';

export default function LoadingSidebar() {
  const skeletonItems = Array.from({ length: 6 });

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Title skeleton */}
      <div className="mb-6 px-2">
        <div className="loading-md h-3 w-20 rounded-md" />
      </div>

      <div className="flex-1 space-y-1.5 px-0.5">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Icon */}
            <div className="loading-md size-7 shrink-0 rounded-lg" />

            {/* Label */}
            <div className="loading-md h-4 flex-1 max-w-35 rounded-md" />

            {/* Subtle indicator */}
            <div className="ml-auto loading-md size-1.5 rounded-full opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
}
