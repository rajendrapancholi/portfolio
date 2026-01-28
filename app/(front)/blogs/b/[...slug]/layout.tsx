
export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="min-h-screen w-full flex-1 flex flex-col bg-[#f5f6f8] text-slate-800 dark:bg-slate-950 dark:text-slate-200 *:border-slate-800/50">
            <div className="flex pt-4 flex-1 mx-auto w-full">
                <main className="py-3  md:py-2 w-full scroll-smooth">
                    {children}
                </main>
            </div >
        </div>
    );
}
