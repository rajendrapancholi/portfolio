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
import { usePathname } from 'next/navigation';
import { FcTemplate } from 'react-icons/fc';
import RajeBrandLogo from '../ui/RajeBrandLogo';
import ThemeButton from '../ui/ThemeButton';
import SearchBar from './SearchBar';
import AnimatedLink from './AnimatedLink';
import { useBlogs } from '@/lib/features/blog/hook';
import Loading from '../Loading';
import UserMenu from '../ui/UserMenu';
import { User } from '@/types';
import toast from 'react-hot-toast';
import { clearCredentials } from '@/lib/features/auth/authSlice';
import { logoutAction } from '@/app/actions/authActions';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/features/hooks';

const Navbar: React.FC = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const { loading, blogs, fetchBlogList } = useBlogs();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 150 && pathname.startsWith('/blogs/b/')) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  });

  const navigation = [
    { name: 'Home', href: '/', icon: <Home size={14} /> },
    { name: 'Tutorials', href: '/blogs', icon: <BookOpenTextIcon size={14} /> },
    { name: 'Projects', href: '/#projects', icon: <FcTemplate size={14} /> },
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
      toast.success('Signed out successfully', { id: toastId });
    } catch (error) {
      if (isRedirectError(error)) {
        toast.dismiss(toastId);
        throw error;
      }
      toast.error('Failed to sign out', { id: toastId });
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen && !blogs) {
      (async () => await fetchBlogList())();
    }
  }, [isMobileMenuOpen, blogs, fetchBlogList]);

  return (
    <motion.nav
      initial={false}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={{
        expanded: { height: 70 },
        collapsed: { height: 48 },
      }}
      transition={{ duration: 0.3 }}
      className="fixed inset-x-0 top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
    >
      <div className="relative mx-auto px-4 h-full">
        <div className="flex h-full items-center justify-between gap-3">
          {/* Mobile menu button */}
          <button
            className="sm:hidden text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Open sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(true);
            }}
          >
            <TextAlignJustify className="size-5" />
          </button>

          {/* Logo */}
          <div className="hidden md:block">
            <RajeBrandLogo logoType="mini" secondText="blog" />
          </div>

          {/* Center navigation */}
          <div className="max-sm:-translate-x-1 flex flex-1 justify-center">
            <div className="flex items-center space-x-1 rounded-full border border-border bg-muted/60 p-1">
              {updatedNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-3 py-1.5 rounded-full text-sm"
                >
                  {item.current && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full bg-primary"
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-1.5 ${
                      item.current
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="hidden sm:block">{item.name}</span>
                    <span className="sm:hidden">{item.icon}</span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Search (desktop) */}
            <motion.div
              layout
              variants={{
                expanded: { width: 220 },
                collapsed: { width: 44 },
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="hidden lg:flex items-center overflow-hidden lg:ml-2"
            >
              <Link
                href="/blogs/search"
                scroll={false}
                className="relative flex items-center w-full h-10 bg-muted/60 border border-border rounded-full px-3 hover:border-primary/50 transition-colors"
              >
                <Search size={18} className="text-muted-foreground shrink-0" />
                <motion.span
                  variants={{
                    expanded: { opacity: 1, x: 0 },
                    collapsed: { opacity: 0, scale: 0.5, display: 'none' },
                  }}
                  transition={{ duration: 0.2 }}
                  className="ml-2 text-sm text-muted-foreground whitespace-nowrap"
                >
                  Search...
                </motion.span>
                <motion.kbd
                  variants={{
                    expanded: { opacity: 1, scale: 1 },
                    collapsed: { opacity: 0, scale: 0.5, display: 'none' },
                  }}
                  transition={{ duration: 0.15 }}
                  className="ml-auto hidden md:inline-flex items-center gap-1 rounded-full border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground"
                >
                  Ctrl+K
                </motion.kbd>
              </Link>
            </motion.div>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeButton />
            <Link href="/blogs/subscribe">
              <button className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:brightness-110 transition-all active:scale-95 shadow-sm shadow-primary/20">
                Subscribe
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(false);
              }}
              className="fixed inset-0 min-h-screen z-45 bg-black/40 backdrop-blur-sm sm:hidden"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="fixed top-0 rounded-r-2xl h-screen left-0 z-50 w-72 bg-card px-4 py-6 border-r border-border shadow-xl sm:hidden flex flex-col"
            >
              {/* Header */}
              <div className="relative">
                <button
                  className="absolute top-0 -right-7 cursor-pointer"
                  aria-label="Close menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ArrowLeftCircleIcon className="text-primary size-8 bg-card rounded-full" />
                </button>

                <RajeBrandLogo logoType="mini" secondText="blog" />

                <nav className="mt-6 flex flex-col gap-1">
                  <div className="flex justify-between items-center w-full gap-2 mb-3">
                    <SearchBar />
                    <ThemeButton position="bottom" />
                  </div>
                  {updatedNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-2 rounded-xl text-base font-semibold transition-colors ${
                        item.current
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Recent posts */}
              <div className="flex-1 rounded-xl pt-3 overflow-x-hidden overflow-y-auto custom-scrollbar my-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  Recent Posts
                </p>
                <div className="flex flex-col gap-1.5">
                  {!loading ? (
                    blogs &&
                    blogs.map((blog) => (
                      <AnimatedLink
                        key={blog._id}
                        slug={blog.slug}
                        source={blog.source}
                        title={blog.title}
                      />
                    ))
                  ) : (
                    <Loading />
                  )}
                </div>
              </div>

              {/* Bottom */}
              <div className="pt-4 border-t border-border">
                {session?.user ? (
                  <div className="flex items-center gap-4">
                    <UserMenu user={session.user as User} popupPos="top-left" />
                    <button
                      onClick={handleLogout}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Exit
                    </button>
                  </div>
                ) : (
                  <Link href="/signin" className="block">
                    <button className="w-full text-sm font-semibold text-primary-foreground bg-primary px-6 py-2.5 rounded-xl shadow-sm shadow-primary/20 hover:brightness-110 transition-all active:scale-95">
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
