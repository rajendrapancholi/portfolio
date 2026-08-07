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
  return (
    <Link
      href={item.path}
      className={`${item.slug === active ? 'active' : ''
        } flex justify-start gap-2 items-center`}
    >
      <span
        className={`border-none outline-none ${item.slug === active ? 'text-cyan-500' : ''
          } `}
      >
        {item.icon}
      </span>
      <span
        className={`${item.slug === active ? 'text-cyan-500' : ''} text-lg`}
      >
        {item.title}
      </span>
    </Link>
  );
};

export default AdminLink;
