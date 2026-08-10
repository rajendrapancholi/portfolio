export function getHeadings(content: string) {
  const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const withoutFences = withoutFrontmatter.replace(
    /^(```|~~~)[\s\S]*?^\1/gm,
    '',
  );
  const withoutInlineCode = withoutFences.replace(/`[^`\n]+`/g, '');
  const headingRegex = /^ {0,3}(#{1,3})\s+(.+?)\s*$/gm;
  const headings: { text: string; id: string; level: number }[] = [];
  const seenIds = new Map<string, number>();
  let match;
  while ((match = headingRegex.exec(withoutInlineCode)) !== null) {
    const hashes = match[1];
    let text = match[2];
    text = text.replace(/\s+#+\s*$/, '').trim();
    text = text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1');
    let id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    if (seenIds.has(id)) {
      const count = seenIds.get(id)! + 1;
      seenIds.set(id, count);
      id = `${id}-${count}`;
    } else {
      seenIds.set(id, 0);
    }
    headings.push({
      text,
      id,
      level: hashes.length,
    });
  }

  return headings;
}
