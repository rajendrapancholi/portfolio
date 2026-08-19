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

      setActive((prev) => (currentId !== prev ? currentId : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  // Auto-scroll TOC to active heading
  useEffect(() => {
    if (navRef.current && active) {
      const activeElement = navRef.current.querySelector(
        `a[href="#${active}"]`,
      );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [active]);

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
            className={`relative block py-1.5 md:py-1 pr-2 text-[11px] font-medium leading-snug rounded-md
            ${
              isActive
                ? 'text-primary bg-primary/10 whitespace-normal'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }
          `}
          >
            <span
              className={`overflow-hidden text-ellipsis block hover:whitespace-normal ${isActive ? 'whitespace-normal' : 'whitespace-nowrap'}`}
            >
              {item.text}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
