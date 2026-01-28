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
import { NavbarCalendar } from '../ui/NavbarCalender';
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
            item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href),
    }));
    // Logout Handler
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
            (async () =>
                await fetchBlogList()
            )();
        }
    }, [isMobileMenuOpen, blogs]);
    return (
        <motion.nav
            initial={false}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={{
                expanded: { height: 70 },
                collapsed: { height: 48 },
            }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10"
        >
            <div className="relative mx-auto px-4 h-full">
                <div className="flex h-full items-center justify-between gap-3">

                    {/* Mobile menu button */}
                    <button
                        className="relative w-0 left-0 bottom-0 sm:hidden text-gray-600 dark:text-gray-300 duration-300 before:duration-300 before:delay-200 after:duration-400 after:delay-200 before:text-slate-900 dark:before:text-white  before:bg-gray-300 after:bg-gray-300 dark:before:bg-gray-600 dark:after:bg-gray-600 transition-colors before:translate-x-12 after:translate-x-2.5 tooltip-bottom tooltip " data-tip="Open sidebar"
                        onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(true); }}
                    >
                        <TextAlignJustify />
                    </button>

                    {/* Logo */}
                    <div className="hidden md:block">
                        <RajeBrandLogo logoType="mini" secondText="blog" />
                    </div>

                    {/* Center navigation */}
                    <div className="max-sm:-translate-x-1 flex flex-1 justify-center">
                        <div className="flex items-center space-x-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-1">
                            {updatedNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative px-3 py-1 rounded-full text-sm"
                                >
                                    {item.current && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-full bg-cyan-800"
                                        />
                                    )}
                                    <span
                                        className={`relative z-10 ${item.current
                                            ? 'text-white'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        <span className="hidden sm:block">{item.name}</span>
                                        <span className="sm:hidden">{item.icon}</span>
                                    </span>
                                </Link>
                            ))}
                            <NavbarCalendar />
                        </div>
                        {/* seachbar */}
                        <motion.div
                            layout
                            variants={{
                                expanded: { width: 220 },
                                collapsed: { width: 44 },
                            }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="hidden lg:flex items-center overflow-hidden"
                        >
                            <Link
                                href="/blogs/search"
                                scroll={false}
                                className="relative flex items-center w-full h-10 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 hover:border-cyan-800 dark:hover:border-gray-600 transition-colors"
                            >
                                {/* Icon */}
                                <Search className="size-4 text-gray-400 shrink-0" />

                                {/* Text */}
                                <motion.span
                                    variants={{
                                        expanded: { opacity: 1, x: 0 },
                                        collapsed: { opacity: 0, scale: 0.5, display: "none" },
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="ml-3 text-sm text-gray-500 whitespace-nowrap"
                                >
                                    Search...
                                </motion.span>

                                {/* KBD */}
                                <motion.kbd
                                    variants={{
                                        expanded: { opacity: 1, scale: 1 },
                                        collapsed: { opacity: 0, scale: 0.5, display: "none" },
                                    }}
                                    transition={{ duration: 0.15 }}
                                    className="ml-auto hidden md:inline-flex items-center gap-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-1.5 text-[10px] font-medium text-gray-400"
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
                            <button className="bg-cyan-800 text-white px-5 py-2 rounded-full text-sm font-bold">
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
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(false); }}
                            className="fixed inset-0 min-h-screen z-45 bg-black/30 backdrop-blur-sm sm:hidden"
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            className="fixed top-0 rounded-r-2xl h-screen left-0 z-50 w-72 bg-white dark:bg-gray-900 px-4 py-6 shadow-interactive-cyan sm:hidden flex flex-col"
                        >
                            {/* Header Section */}
                            <div className="relative">
                                <div className="absolute top-0 -right-7 cursor-pointer custom-tooltip" data-tip="Close"
                                    onClick={() => setIsMobileMenuOpen(false)}>
                                    <ArrowLeftCircleIcon className="dark:text-cyan-600 w-8 h-8 bg-white dark:bg-gray-900 rounded-full" />
                                </div>

                                <RajeBrandLogo logoType="mini" secondText="blog" />

                                <nav className="mt-6 flex flex-col gap-1">
                                    <div className='flex justify-between items-center w-full gap-2 mb-2'>
                                        <SearchBar />
                                        <ThemeButton position='bottom' />
                                    </div>
                                    {updatedNavigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`px-4 py-1 rounded-xl text-lg custom-tooltip tooltip-right font-semibold ${item.current ? 'bg-cyan-800 text-white' : 'text-gray-600 dark:text-gray-400'}`} data-tip={item.name}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                            {/* Middle Section */}
                            <div className="flex-1 rounded-xl pt-2 shadow-[inset_0px_2px_8px_rgba(0,255,255,0.25)] overflow-x-hidden overflow-y-auto custom-scrollbar my-2">
                                <p className="text-xs font-bold uppercase text-gray-400  mb-2">Recent Posts</p>
                                <div className="flex flex-col gap-2">
                                    {/* Map your blogs here */}
                                    {!loading ? blogs && blogs.map((blog) => (
                                        <AnimatedLink key={blog._id} slug={blog.slug} source={blog.source} title={blog.title} />
                                    )) : <Loading />}
                                </div>
                            </div>

                            {/* Bottom Section */}
                            <div className="h-0.5 w-px bg-white/20 mx-2" />
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                {/* {<Link href="/blogs/subscribe" className="w-full">
                                    <button className="w-full bg-cyan-800 text-white py-3 rounded-xl text-sm font-bold hover:bg-cyan-700 transition-colors">
                                        Subscribe
                                    </button>
                                </Link>
                                } */}
                                {session?.user ? (
                                    <div className="flex items-center gap-4">
                                        <UserMenu user={session.user as User} popupPos='top-left' />
                                        <button
                                            onClick={handleLogout}
                                            className="text-xs text-neutral-400 hover:text-red-400 transition-colors"
                                        >
                                            Exit
                                        </button>
                                    </div>
                                ) : (
                                    <Link href="/signin" className="relative group">
                                        <button className="text-sm font-semibold text-white bg-linear-to-br from-blue-600 to-indigo-700 px-6 py-2 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-500/40 transition-all active:scale-95">
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
