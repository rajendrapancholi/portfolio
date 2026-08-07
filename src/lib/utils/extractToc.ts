import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export function extractToc(markdown: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(markdown);
  const toc: TocItem[] = [];

  visit(tree, "heading", (node: any) => {
    const text = node.children
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.value)
      .join("");

    const id = text.toLowerCase().replace(/[^\w]+/g, "-");

    toc.push({
      id,
      text,
      level: node.depth,
    });
  });

  return toc;
}
