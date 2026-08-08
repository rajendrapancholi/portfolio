'use client';

import dynamic from 'next/dynamic';

type HeadingProps = { text: string; id: string; level: number };

export default function TocSidebar({
  headings,
  bare = false,
}: {
  headings: HeadingProps[];
  bare?: boolean;
}) {
  const Toc = dynamic(() => import('./TOC'), { ssr: false });

  const body = (
    <>
      {!bare && (
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </h3>
      )}

      <div className={bare ? 'mb-4' : 'mb-4 flex-1 overflow-y-auto'}>
        <Toc toc={headings} />
      </div>
    </>
  );

  if (bare) return <div className="flex h-full flex-col">{body}</div>;

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-4">
        {body}
      </div>
    </div>
  );
}
