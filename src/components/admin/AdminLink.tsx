'use client';

import Link from 'next/link';
import { JSX } from 'react';

const AdminLink = ({
  item,
  active,
}: {
  item: {
    title: string;
    slug: string;
    path: string;
    icon: JSX.Element;
  };
  active: string;
}) => {
  const isActive = item.slug === active;

  return (
    <Link
      href={item.path}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
        ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
        }`}
    >
      <span
        className={`flex size-8 items-center justify-center rounded-lg transition-colors
          ${
            isActive
              ? 'bg-primary/15 text-primary'
              : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
          }`}
      >
        {item.icon}
      </span>

      <span className={isActive ? 'font-semibold' : ''}>{item.title}</span>
    </Link>
  );
};

export default AdminLink;
