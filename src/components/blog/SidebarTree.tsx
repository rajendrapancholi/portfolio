'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import AnimatedLink from '@/components/blog/AnimatedLink';
import type { BlogTreeNode } from '@/lib/utils/buildBlogTree';

const INDENT = 16;
export default function SidebarTree({
  nodes,
  depth = 0,
}: {
  nodes: BlogTreeNode[];
  depth?: number;
}) {
  return (
    <div className="space-y-0.5">
      {nodes.map((node) =>
        node.type === 'dir' ? (
          <SidebarFolder key={node.name} node={node} depth={depth} />
        ) : (
          <div key={node.blog._id} style={{ marginLeft: depth * INDENT + 4 }}>
            <AnimatedLink
              slug={node.blog.slug}
              title={node.blog.title}
              source={node.blog.source}
            />
          </div>
        ),
      )}
    </div>
  );
}

function SidebarFolder({
  node,
  depth,
}: {
  node: Extract<BlogTreeNode, { type: 'dir' }>;
  depth: number;
}) {
  const [open, setOpen] = useState(depth === 0);
  const label = node.name.replace(/-/g, ' ');

  return (
    <div>
      <div
        className="flex items-center gap-1 rounded-md hover:bg-muted/60 transition-colors"
        style={{ marginLeft: depth * INDENT }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 py-1 text-muted-foreground hover:text-foreground"
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          <ChevronRight
            size={14}
            className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          />
        </button>

        {node.blog ? (
          <div className="min-w-0 flex-1">
            <AnimatedLink
              slug={node.blog.slug}
              title={node.blog.title}
              source={node.blog.source}
            />
          </div>
        ) : (
          <span
            onClick={() => setOpen((o) => !o)}
            className="flex-1 cursor-pointer truncate py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            {label}
          </span>
        )}
      </div>

      {open && (
        <div className="mt-0.5">
          <SidebarTree nodes={node.children} depth={depth + 1} />
        </div>
      )}
    </div>
  );
}
