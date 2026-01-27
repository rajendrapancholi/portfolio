import LeftSidebar from "../LeftSidebar";

export default function BLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex items-start">
                <aside className="hidden md:sticky top-14 lg:block h-[calc(100vh-64px)] md:w-44 lg:w-64 flex-none overflow-y-auto border-r border-slate-400/90 dark:border-slate-800/50 custom-scrollbar px-1.5 py-2 pt-4">
                    <LeftSidebar />
                </aside>
                <div className="flex-1 mx-auto w-full py-2 md:pt-3 min-w-0 bg-[#f5f6f8] text-slate-800 dark:bg-slate-950 dark:text-slate-200">
                    {children}
                </div>
            </div>
        </>
    );
}
