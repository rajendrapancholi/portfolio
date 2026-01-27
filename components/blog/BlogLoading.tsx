"use client";

import LoadingAbsoluteDots from "./LoadingAbsoluteDots";

export default function LoadingBlog() {
    return (
        <div className="mx-auto flex w-screen lg:w-full redborder xl:flex-row gap-2 relative px-4 **:rounded-md">
            {/* Center Content Column */}
            <article className="flex-1 w-xl lg:w-4xl md:w-xl ">
                {/* Floating Progress Indicator Placeholder */}
                <div className="sticky top-1/2 -ml-12">
                    <LoadingAbsoluteDots />
                </div>

                {/* Header Skeleton */}
                <header className="mb-10">
                    {/* Badge Skeleton */}
                    <div className="mb-4 w-fit px-2 py-1 rounded bg-slate-200 dark:bg-slate-800/50">
                        <div className="loading-md h-3 w-40" />
                    </div>

                    {/* Title Skeletons */}
                    <div className="flex flex-col gap-3 mb-6">
                        <div className="loading-md h-10 w-full" />
                        <div className="loading-md h-10 w-3/4" />
                    </div>

                    {/* Decorative Gradient Bar Placeholder */}
                    <div className="h-1 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </header>

                {/* Content Area (Markdown Simulation) */}
                <div className="flex flex-col gap-5">
                    <div className="loading-md h-4 w-full" />
                    <div className="loading-md h-4 w-full" />
                    <div className="loading-md h-4 w-[90%]" />

                    {/* Image/Code Block Skeleton */}
                    <div className="loading-md h-72 w-full my-8 rounded-2xl" />

                    <div className="loading-md h-4 w-full" />
                    <div className="loading-md h-4 w-[85%]" />
                    <div className="loading-md h-4 w-full" />
                </div>

                {/* Footer Skeleton */}
                <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/60 py-16">
                    <div className="flex flex-col gap-12">

                        {/* Like Button Skeleton */}
                        <div className="flex justify-center">
                            <div className="loading-md h-12 w-48 rounded-full" />
                        </div>

                        {/* Navigation: Previous/Next Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="loading-md h-32 w-full rounded-2xl" />
                            <div className="loading-md h-32 w-full rounded-2xl shadow-sm" />
                        </div>

                        {/* Utility Layer Skeleton */}
                        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800/40 gap-6">
                            <div className="loading-md h-5 w-32" />
                            <div className="loading-md h-10 w-40 rounded-lg" />
                        </div>

                        {/* Feedback Area Placeholder */}
                        <div className="loading-md h-40 w-full rounded-2xl" />
                    </div>
                </footer>
            </article>

            {/* Right Sidebar Placeholder (Hidden on mobile) */}
            <aside className="hidden xl:block w-64 shrink-0">
                <div className="sticky top-24 space-y-4">
                    <div className="loading-md h-6 w-32 mb-6" />
                    <div className="loading-md h-4 w-full" />
                    <div className="loading-md h-4 w-5/6" />
                    <div className="loading-md h-4 w-full" />
                    <div className="loading-md h-4 w-4/6" />
                </div>
            </aside>
        </div>
    );
}
