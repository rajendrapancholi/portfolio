import LoadingAbsoluteDots from "./LoadingAbsoluteDots";

export default function Loading() {
    // Generates 6 placeholder cards for the grid
    const skeletons = Array.from({ length: 6 });

    return (
        <section className="max-w-8xl relative mx-auto px-6">
            <div className="sticky top-2/5 ">
                <LoadingAbsoluteDots />
            </div>
            {/* Header Section Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div className="space-y-4">
                    {/* Main Title Placeholder */}
                    <div className="h-12 w-64 rounded-lg loading-md" />
                    {/* Subtitle Placeholder */}
                    <div className="h-6 min-w-96  rounded-md loading-md" />
                </div>
                {/* Decorative Blue Bar Placeholder */}
                <div className="h-1 w-24 bg-white/5 rounded-full hidden md:block mb-2" />
            </div>
            {/* Grid Layout Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {skeletons.map((_, i) => (
                    <div
                        key={i}
                        className="flex flex-col bg-[#111] rounded-2xl border border-white/5 overflow-hidden"
                    >
                        {/* Thumbnail Placeholder */}
                        <div className="h-64 w-full loading-md" />

                        {/* Content Container */}
                        <div className="p-8 flex flex-col space-y-5">
                            {/* Meta Info: Date and Author */}
                            <div className="flex items-center gap-3 my-1">
                                <div className="h-3 w-20 rounded loading-md" />
                                <div className="h-1 w-1 bg-white/10 rounded-full" />
                                <div className="h-3 w-24 rounded loading-md" />
                            </div>

                            {/* Title Placeholder */}
                            <div className="space-y-2">
                                <div className="h-7 w-full rounded-md loading-md" />
                                <div className="h-7 w-2/3 rounded-md loading-md" />
                            </div>

                            {/* Description Lines Placeholder */}
                            <div className="space-y-2">
                                <div className="h-4 w-full rounded loading-md" />
                                <div className="h-4 w-full rounded loading-md" />
                                <div className="h-4 w-4/5 rounded loading-md" />
                            </div>

                            {/* "Read Article" Link Placeholder */}
                            <div className="pt-2">
                                <div className="h-4 w-28 rounded bg-blue-500/10 loading-md" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
