'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import AnimatedLink from '@/components/blog/AnimatedLink';
import type { BlogTreeNode } from '@/lib/utils/buildBlogTree';

const INDENT = 16;
type DirNode = Extract<BlogTreeNode, { type: 'dir' }>;

const normalize = (p: string) => {
  try {
    p = decodeURIComponent(p);
  } catch {}
  return p.replace(/\/+$/, '').toLowerCase();
};

const blogPath = (b: { source: string; slug: string }) =>
  normalize(`/blogs/b/${b.source}/${b.slug}`);

function hasActiveDescendant(node: DirNode, current: string): boolean {
  if (node.blog) {
    const own = blogPath(node.blog);
    if (current === own || current.startsWith(own + '/')) return true;
  }
  return node.children.some((child) =>
    child.type === 'dir'
      ? hasActiveDescendant(child, current)
      : blogPath(child.blog) === current,
  );
}

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
  const pathname = usePathname();
  const current = normalize(pathname);
  const isParentActive = useMemo(
    () => hasActiveDescendant(node, current),
    [node, current],
  );
  const [open, setOpen] = useState(depth === 0 || isParentActive);
  const label = node.name.replace(/-/g, ' ');

  useEffect(() => {
    if (isParentActive) setOpen(true);
  }, [isParentActive]);

  return (
    <div>
      <div
        className={`flex items-center gap-1 rounded-md border-l-2 transition-colors hover:bg-muted/60 ${
          isParentActive
            ? 'border-primary/60 bg-primary/5'
            : 'border-transparent'
        }`}
        style={{ marginLeft: depth * INDENT }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`shrink-0 py-1 hover:text-foreground ${
            isParentActive ? 'text-primary' : 'text-muted-foreground'
          }`}
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
              isParentActive={isParentActive}
            />
          </div>
        ) : (
          <span
            onClick={() => setOpen((o) => !o)}
            className={`flex-1 cursor-pointer truncate py-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground ${
              isParentActive ? 'text-primary' : 'text-muted-foreground'
            }`}
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
