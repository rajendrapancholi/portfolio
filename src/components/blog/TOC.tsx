'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export default function Toc({
  toc,
}: {
  toc: { id: string; text: string; level: number }[];
}) {
  const [active, setActive] = useState<string>('');
  const isClicking = useRef(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isClicking.current) return;

      const scrollPosition = window.scrollY + 120;

      const headingPositions = toc
        .map((item) => {
          const element = document.getElementById(item.id);
          if (element) {
            return { id: item.id, top: element.offsetTop };
          }
          return null;
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

      setActive((prev) => (currentId !== prev ? currentId : prev)); // ← functional update
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setActive(id);
    isClicking.current = true;

    const targetElement = document.getElementById(id);
    if (targetElement) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }

    setTimeout(() => (isClicking.current = false), 1000);
  };

  return (
    <nav
      aria-label="Article headings"
      ref={navRef}
      className="flex-1 overflow-y-auto flex flex-col gap-0.5 py-2 pr-2 max-h-[80vh]"
    >
      {toc.map((item, index) => {
        const isActive = active === item.id;
        return (
          <Link
            key={`${item.id}-${index}`}
            href={`#${item.id}`}
            onClick={(e) => handleLinkClick(e, item.id)}
            style={{ paddingLeft: `${item.level * 0.75 + 0.5}rem` }}
            className={`group relative block py-1.5 pr-2 text-[13px] font-medium leading-snug transition-all duration-200 ease-in-out rounded-md wrap-break-word
              ${
                isActive
                  ? 'text-primary translate-x-1 bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:translate-x-1 hover:bg-muted/50'
              }
            `}
          >
            <span>{item.text}</span>
          </Link>
        );
      })}
    </nav>
  );
}
