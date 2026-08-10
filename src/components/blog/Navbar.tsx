'use client';

import React, { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeftCircleIcon,
  BookOpenTextIcon,
  Home,
  Search,
  TextAlignJustify,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FcTemplate } from 'react-icons/fc';
import RajeBrandLogo from '../ui/RajeBrandLogo';
import ThemeButton from '../ui/ThemeButton';
import SearchBar from './SearchBar';
import UserMenu from '../ui/UserMenu';
import { User } from '@/types';
import toast from 'react-hot-toast';
import { clearCredentials } from '@/lib/features/auth/authSlice';
import { logoutAction } from '@/app/actions/authActions';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useSession } from 'next-auth/react';
import SidebarTree from './SidebarTree';
import type { BlogTreeNode } from '@/lib/utils/buildBlogTree';
import { useAppDispatch } from '@/lib/features/hooks';

interface NavbarProps {
  tree: BlogTreeNode[];
}

const Navbar: React.FC<NavbarProps> = ({ tree }) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useEffect(() => {
    const height = isCollapsed ? '48px' : '70px';
    document.documentElement.style.setProperty('--navbar-height', height);
  }, [isCollapsed]);

  useEffect(() => {
    document.documentElement.style.setProperty('--navbar-height', '70px');
  }, []);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!pathname.startsWith('/blogs/b/')) {
      setIsCollapsed(false);
      return;
    }
    if (latest > 180) {
      setIsCollapsed(true);
    } else if (latest < 80) {
      setIsCollapsed(false);
    }
  });

  const navigation = [
    { name: 'Home', href: '/', icon: <Home size={15} strokeWidth={2} /> },
    {
      name: 'Tutorials',
      href: '/blogs',
      icon: <BookOpenTextIcon size={15} strokeWidth={2} />,
    },
    {
      name: 'Projects',
      href: '/#projects',
      icon: <FcTemplate size={15} />,
    },
  ];

  const updatedNavigation = navigation.map((item) => ({
    ...item,
    current:
      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  }));

  const handleLogout = async () => {
    const toastId = toast.loading('Signing out...');
    try {
      dispatch(clearCredentials());
      await logoutAction();
      router.refresh();
      toast.success('Signed out successfully', { id: toastId });
    } catch (error) {
      if (isRedirectError(error)) {
        toast.dismiss(toastId);
        throw error;
      }
      toast.error('Failed to sign out', { id: toastId });
    }
  };

  return (
    <motion.nav
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={{
        expanded: { height: 70 },
        collapsed: { height: 48 },
      }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-card/75 backdrop-blur-xl backdrop-saturate-150"
      style={
        {
          '--navbar-height': isCollapsed ? '48px' : '70px',
        } as React.CSSProperties
      }
    >
      {/* subtle top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent" />

      <div className="relative h-full">
        <div className="flex h-full items-center justify-between gap-3">
          {/* Mobile menu button */}
          <button
            className="absolute flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
            aria-label="Open menu"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(true);
            }}
          >
            <TextAlignJustify className="size-5" strokeWidth={2} />
          </button>

          {/* Logo */}
          <div className="hidden shrink-0 md:block">
            <RajeBrandLogo logoType="mini" secondText="blog" />
          </div>

          {/* Center: Nav + Search */}
          <div className="flex flex-1 items-center justify-center gap-2">
            {/* Pill navigation */}
            <div className="flex items-center gap-0.5 rounded-full border border-border/70 bg-muted/50 p-1 shadow-sm shadow-black/5 dark:shadow-black/20">
              {updatedNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
                >
                  {item.current && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full bg-primary shadow-sm shadow-primary/25"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-1.5 ${
                      item.current
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="hidden sm:inline">{item.name}</span>
                    <span className="sm:hidden">{item.icon}</span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Desktop search */}
            <motion.div
              layout
              variants={{
                expanded: { width: 210 },
                collapsed: { width: 40 },
              }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="hidden overflow-hidden lg:flex lg:items-center"
            >
              <Link
                href="/blogs/search"
                scroll={false}
                className="group relative flex h-9 w-full items-center gap-2.5 rounded-full border border-border/70 bg-muted/50 px-3 transition-all hover:border-primary/40 hover:bg-muted/80"
              >
                <Search
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                />
                <motion.span
                  variants={{
                    expanded: { opacity: 1, x: 0 },
                    collapsed: { opacity: 0, scale: 0.9, display: 'none' },
                  }}
                  transition={{ duration: 0.2 }}
                  className="truncate text-sm text-muted-foreground"
                >
                  Search tutorials...
                </motion.span>
                <motion.kbd
                  variants={{
                    expanded: { opacity: 1, scale: 1 },
                    collapsed: { opacity: 0, scale: 0.85, display: 'none' },
                  }}
                  transition={{ duration: 0.15 }}
                  className="ml-auto hidden items-center rounded-md border border-border/80 bg-background/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground md:inline-flex"
                >
                  ⌘K
                </motion.kbd>
              </Link>
            </motion.div>
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2.5 md:flex mr-2">
            <ThemeButton />
            {session?.user ? (
              <UserMenu user={session.user as User} />
            ) : (
              <Link href="/blogs/subscribe">
                <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.97]">
                  Subscribe
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(false);
              }}
              className="fixed inset-0 z-40 min-h-screen bg-black/50 backdrop-blur-sm sm:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="fixed left-0 top-0 z-50 flex h-screen w-[min(18rem,85vw)] flex-col border-r border-border bg-card px-2 py-5 shadow-2xl sm:hidden"
            >
              {/* Header */}
              <div className="relative mb-5">
                <button
                  className="absolute -right-6 top-0 flex size-8 items-center justify-center rounded-full bg-card text-primary shadow-md ring-1 ring-border"
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ArrowLeftCircleIcon className="size-7" strokeWidth={1.75} />
                </button>
                <RajeBrandLogo logoType="mini" secondText="blog" />
              </div>

              {/* Search + Theme */}
              <div className="mb-4 flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <SearchBar />
                </div>
                <ThemeButton position="bottom" />
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1">
                {updatedNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] font-medium transition-colors ${
                      item.current
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className="opacity-90">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Recent posts */}
              <div className="my-4 py-2 flex-1 overflow-y-auto overflow-x-hidden rounded-md border border-primary/15">
                <p className="mb-2.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Posts
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex-1">
                    <SidebarTree nodes={tree} />
                  </div>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="border-t border-border pt-4">
                {session?.user ? (
                  <div className="flex items-center justify-between gap-3">
                    <UserMenu user={session.user as User} popupPos="top-left" />
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link href="/signin" className="block">
                    <button className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]">
                      Subscribe
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
