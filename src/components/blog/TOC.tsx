'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type TocItem = { id: string; text: string; level: number };
type TocNode = TocItem & { children: TocNode[] };

function buildTree(toc: TocItem[]): TocNode[] {
  const root: TocNode = { id: '', text: '', level: -Infinity, children: [] };
  const stack: TocNode[] = [root];

  toc.forEach((item) => {
    const node: TocNode = { ...item, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  });

  return root.children;
}

const containsActive = (node: TocNode, active: string): boolean =>
  node.id === active || node.children.some((c) => containsActive(c, active));

function TocGroup({
  nodes,
  active,
  onLinkClick,
}: {
  nodes: TocNode[];
  active: string;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const activeIdx = nodes.findIndex((n) => containsActive(n, active));

  return (
    <ul className="toc-list">
      {nodes.map((node, i) => {
        const isLast = i === nodes.length - 1;
        const isActive = node.id === active;

        const itemClass = [
          'toc-item',
          isLast && 'is-last',
          node.level === 1 && 'is-root',
          i === activeIdx && 'on-path',
          activeIdx !== -1 && i < activeIdx && 'line-active',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <li key={node.id} className={itemClass}>
            <div className="toc-row">
              <Link
                href={`#${node.id}`}
                onClick={(e) => onLinkClick(e, node.id)}
                className={`toc-link ${isActive ? 'is-active' : ''}`}
              >
                <span>{node.text}</span>
              </Link>
            </div>

            {node.children.length > 0 && (
              <div className="toc-children">
                <TocGroup
                  nodes={node.children}
                  active={active}
                  onLinkClick={onLinkClick}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Toc({ toc }: { toc: TocItem[] }) {
  const [active, setActive] = useState<string>('');
  const isClicking = useRef(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isClicking.current) return;

      const scrollPosition = window.scrollY + 120;

      const headingPositions = toc
        .map((item) => {
          const element = document.getElementById(item.id);
          return element ? { id: item.id, top: element.offsetTop } : null;
        })
        .filter((item): item is { id: string; top: number } => item !== null);

      let currentId = '';
      for (let i = 0; i < headingPositions.length; i++) {
        if (scrollPosition >= headingPositions[i].top) {
          currentId = headingPositions[i].id;
        } else {
          break;
        }
      }

      setActive((prev) => (currentId !== prev ? currentId : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  useEffect(() => {
    if (navRef.current && active) {
      const el = navRef.current.querySelector(`a[href="#${active}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [active]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setActive(id);
    isClicking.current = true;

    const target = document.getElementById(id);
    if (target) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = target.getBoundingClientRect().top;
      window.scrollTo({
        top: elementRect - bodyRect - offset,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      isClicking.current = false;
    }, 1000);
  };

  const tree = buildTree(toc);

  return (
    <nav aria-label="Article headings" ref={navRef} className="toc">
      <TocGroup nodes={tree} active={active} onLinkClick={handleLinkClick} />
    </nav>
  );
}
