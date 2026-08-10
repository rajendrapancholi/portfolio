'use client';

'use client';

export function LoadingToc() {
  const items = [
    { width: 'w-11/12', indent: 0 },
    { width: 'w-4/5', indent: 0 },
    { width: 'w-3/5', indent: 1 },
    { width: 'w-4/5', indent: 1 },
    { width: 'w-3/5', indent: 1 },
    { width: 'w-2/3', indent: 0 },
  ];

  return (
    <>
      {/* Spacer matching CollapsibleToc's reserved layout width */}
      <div className="w-12 h-screen sticky top-0 bottom-0 right-0" />

      <aside className="z-30 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 border-l rounded-tl-md border-border/60 bg-main-bg shadow-xl sticky top-14 xl:flex xl:flex-col animate-fade-in">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-3 py-3">
          <div className="loading-md h-3 w-20 rounded-md" />
          <div className="loading-md size-7 shrink-0 rounded-md" />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden px-3 py-3">
          <div className="flex flex-col gap-2.5">
            {items.map((item, i) => (
              <div
                key={i}
                className={`loading-md h-3 rounded-md ${item.width} opacity-0 animate-fade-in-up`}
                style={{
                  marginLeft: `${item.indent * 0.9}rem`,
                  animationDelay: `${i * 60}ms`,
                  animationFillMode: 'both',
                }}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export const Loading = () => {
  return (
    <div className="flex gap-8 w-full">
      <div className="w-full min-w-0 mx-auto px-2 py-4 animate-fade-in">
        {/* Title */}
        <div className="loading-md h-9 w-4/5 rounded-lg mb-3" />
        <div className="loading-md h-9 w-2/5 rounded-lg mb-8" />

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-10">
          <div className="loading-md w-9 h-9 rounded-full shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="loading-md h-3 w-32 rounded-md" />
            <div className="loading-md h-2.5 w-20 rounded-md" />
          </div>
        </div>

        {/* Paragraph block 1 */}
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="loading-md h-4 w-full rounded-md" />
          <div className="loading-md h-4 w-full rounded-md" />
          <div className="loading-md h-4 w-11/12 rounded-md" />
          <div className="loading-md h-4 w-3/5 rounded-md" />
        </div>

        {/* Heading */}
        <div className="loading-md h-6 w-2/5 rounded-lg mt-10 mb-4" />

        {/* Paragraph block 2 */}
        <div className="flex flex-col gap-2.5 mb-6">
          <div className="loading-md h-4 w-full rounded-md" />
          <div className="loading-md h-4 w-10/12 rounded-md" />
        </div>

        {/* Image placeholder */}
        <div className="loading-md w-full h-64 rounded-xl my-8 border border-border" />

        {/* Code block */}
        <div className="rounded-xl border border-border bg-code-bg p-4 my-8 flex flex-col gap-2.5">
          <div className="loading-md h-3.5 w-2/5 rounded" />
          <div className="loading-md h-3.5 w-4/5 rounded" />
          <div className="loading-md h-3.5 w-3/5 rounded" />
          <div className="loading-md h-3.5 w-1/2 rounded" />
        </div>

        {/* Paragraph block 3 */}
        <div className="flex flex-col gap-2.5">
          <div className="loading-md h-4 w-full rounded-md" />
          <div className="loading-md h-4 w-full rounded-md" />
          <div className="loading-md h-4 w-2/3 rounded-md" />
        </div>
      </div>
    </div>
  );
};
