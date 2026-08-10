export type BlogLeaf = {
  _id: string;
  slug: string;
  title: string;
  source: 'main' | 'git';
};

export type BlogTreeNode =
  | { type: 'file'; name: string; blog: BlogLeaf }
  | { type: 'dir'; name: string; blog?: BlogLeaf; children: BlogTreeNode[] };

export function buildBlogTree(blogs: BlogLeaf[]): BlogTreeNode[] {
  const root: BlogTreeNode[] = [];

  for (const blog of blogs) {
    const parts = blog.slug.split('/').filter(Boolean);
    let level = root;

    parts.forEach((part, idx) => {
      const isLeaf = idx === parts.length - 1;

      if (isLeaf) {
        level.push({ type: 'file', name: part, blog });
        return;
      }

      let dir = level.find(
        (n): n is Extract<BlogTreeNode, { type: 'dir' }> =>
          n.type === 'dir' && n.name === part,
      );

      if (!dir) {
        dir = { type: 'dir', name: part, children: [] };
        level.push(dir);
      }
      level = dir.children;
    });
  }

  return finalize(root);
}

// Merge a 'file' node and a 'dir' node that share the same name
// (e.g. devops.md + devops/) into a single dir node that carries both
// a link (blog) and children (dropdown).
function mergeSiblings(nodes: BlogTreeNode[]): BlogTreeNode[] {
  const dirs = new Map<string, Extract<BlogTreeNode, { type: 'dir' }>>();
  const result: BlogTreeNode[] = [];

  // pass 1: collect dirs by name
  for (const node of nodes) {
    if (node.type === 'dir') dirs.set(node.name, node);
  }

  // pass 2: fold matching files into their dir, keep everything else
  for (const node of nodes) {
    if (node.type === 'file' && dirs.has(node.name)) {
      dirs.get(node.name)!.blog = node.blog; // attach link to the dir row
      continue; // drop the standalone file node
    }
    if (node.type === 'dir') {
      result.push(node); // already added below via dirs, guard dup
    } else {
      result.push(node);
    }
  }

  // de-dupe: dirs were pushed once already in `result` loop above only if
  // encountered as 'dir' type — files that matched were skipped, so this is safe.
  return result;
}

function finalize(nodes: BlogTreeNode[]): BlogTreeNode[] {
  const merged = mergeSiblings(nodes);

  const dirs = merged
    .filter(
      (n): n is Extract<BlogTreeNode, { type: 'dir' }> => n.type === 'dir',
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = merged
    .filter((n) => n.type === 'file')
    .sort((a, b) => a.name.localeCompare(b.name));

  dirs.forEach((d) => (d.children = finalize(d.children)));

  return [...dirs, ...files];
}
