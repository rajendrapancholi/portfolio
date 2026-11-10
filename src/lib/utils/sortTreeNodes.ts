import type { BlogTreeNode } from './buildBlogTree';

type DirNode = Extract<BlogTreeNode, { type: 'dir' }>;
type FileNode = Exclude<BlogTreeNode, DirNode>;
export type TreeBlog = FileNode['blog'];

/**
 * Used by SidebarTree for rendering and by flattenBlogTree for prev/next.
 */
export function sortTreeNodes(
  nodes: BlogTreeNode[],
  depth: number,
): BlogTreeNode[] {
  const dirs = nodes.filter((n): n is DirNode => n.type === 'dir');
  const files = nodes.filter((n): n is FileNode => n.type !== 'dir');

  if (depth > 0) {
    files.sort((a, b) =>
      (a.blog?.title || '').localeCompare(b.blog?.title || '', undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    );

    dirs.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      }),
    );
  }

  return [...dirs, ...files];
}

/**
 * Flattens the tree in exactly the order it is displayed in the sidebar
 * (folder's own page first, then its children).
 */
export function flattenBlogTree(nodes: BlogTreeNode[], depth = 0): TreeBlog[] {
  const result: TreeBlog[] = [];

  for (const node of sortTreeNodes(nodes, depth)) {
    if (node.type === 'dir') {
      if (node.blog) result.push(node.blog);
      result.push(...flattenBlogTree(node.children, depth + 1));
    } else {
      result.push(node.blog);
    }
  }

  return result;
}
