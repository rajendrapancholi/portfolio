'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type Navbar from '@/components/blog/Navbar';
const NavbarClientOnly = dynamic(() => import('@/components/blog/Navbar'), {
  ssr: false,
});

export default function BlogNavbarClient(props: ComponentProps<typeof Navbar>) {
  return <NavbarClientOnly {...props} />;
}
