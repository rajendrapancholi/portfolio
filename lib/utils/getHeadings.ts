export function getHeadings(content: string) {
  // Finds H1, H2, and H3
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const hashes = match[1]; // The #, ##, or ### part
    const text = match[2].trim(); // The actual heading text

    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    headings.push({
      text,
      id,
      level: hashes.length, // This will be 1, 2, or 3
    });
  }

  return headings;
}
