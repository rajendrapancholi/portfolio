'use client';

import React, { useState } from 'react';
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from 'framer-motion';
import Link from 'next/link';
import { ArrowLeftCircleIcon, Bell, BookOpenTextIcon, Home, Search, TextAlignJustify, X } from 'lucide-react';

import RajeBrandLogo from '../ui/RajeBrandLogo';
import ThemeButton from '../ui/ThemeButton';
import { usePathname } from 'next/navigation';
import { NavbarCalendar } from '../ui/NavbarCalender';
import { FcTemplate } from 'react-icons/fc';

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { scrollY } = useScroll();
    const pathname = usePathname();

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const prev = scrollY.getPrevious() ?? 0;
        if ((latest > prev && latest > 150) && pathname.startsWith('/blogs/b/')) {
            setIsCollapsed(true);
        } else {
            setIsCollapsed(false);
        }
    });

    const navigation = [
        { name: 'Home', href: '/', icon: <Home size={14} />, current: true },
        { name: 'Tutorials', href: '/blogs', icon: <BookOpenTextIcon size={14} />, current: false },
        { name: 'Projects', href: '/#projects', icon: < FcTemplate size={14} />, current: false }
    ];

    const updatedNavigation = navigation.map((item) => ({
        ...item,
        current: item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
    }));

    return (
        <motion.nav
            initial={false}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={{
                expanded: { height: 72 },
                collapsed: {
                    height: 46,
                    paddingTop: 2,
                    paddingBottom: 1,
                    backgroundColor: 'transparent',
                },
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 pt-0.5 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10"
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex h-full items-center gap-4">
                    {/* Mobile Toggle & Logo Group */}
                    <div className={`sm:hidden flex z-51 items-center gap-4 `}>
                        <button
                            className="sm:hidden p-2 text-gray-600 dark:text-gray-300"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <TextAlignJustify />
                        </button>
                    </div>
                    {/* Logo */}
                    <motion.div
                        layout
                        variants={{
                            expanded: {
                                opacity: 1,
                                width: 'auto',
                                scale: 1,
                                pointerEvents: 'auto',
                            },
                            collapsed: {
                                opacity: 0,
                                width: 0,
                                scale: 0.9,
                                pointerEvents: 'none',
                            },
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className='hidden md:block'>
                            <RajeBrandLogo logoType="type3" secondText="blog" />
                        </div>
                        <div className=' md:hidden'>
                            <RajeBrandLogo logoType="mini" secondText="blog" />
                        </div>
                    </motion.div>

                    {/* Center Tabs */}
                    <div className="flex-1 flex-center gap-0.5 sm:gap-2 md:gap-4">
                        <motion.div
                            layout
                            transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}
                            className="flex justify-center items-center md:my-2"
                        >
                            <motion.div
                                layout
                                className="flex-center space-x-1 p-0.5 py-0 sm:p-1 sm:py-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5"
                            >
                                {updatedNavigation.map((item, idx) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className="relative px-1 py-0.5 sm:px-3 sm:py-1 text-sm sm:font-medium rounded-xs sm:rounded-full transition-colors"
                                    >
                                        {item.current && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-md bg-cyan-800 sm:rounded-full"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span
                                            className={`relative z-10 ${item.current
                                                ? 'text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            <p className='hidden sm:block'>{item.name}</p>
                                            <p className='sm:hidden'>{item.icon}</p>
                                        </span>
                                    </Link>
                                ))}
                                <div className="relative flex-center text-sm font-medium rounded-full transition-colors">
                                    <NavbarCalendar />
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Search (single morphing component) */}
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
                    {/* Actions */}
                    <motion.div
                        layout
                        variants={{
                            expanded: {
                                opacity: 1,
                                width: 180,
                                scale: 1,
                                pointerEvents: 'auto',
                            },
                            collapsed: {
                                opacity: 0,
                                width: 0,
                                scale: 0.9,
                                pointerEvents: 'none',
                            },
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden flex items-center space-x-3"
                    >
                        <ThemeButton />
                        <Link href="/blogs/subscribe" className="hidden md:block">
                            <button className="bg-cyan-800 text-white px-5 py-2 rounded-full text-sm font-bold">
                                Subscribe
                            </button>
                        </Link>
                    </motion.div>


                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <div
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 h-screen z-55 backdrop-blur-sm sm:hidden"
                        />
                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 rdb left-0 h-screen z-55 w-70 bg-white dark:bg-gray-900 p-6 shadow-xl sm:hidden"
                        >
                            <ArrowLeftCircleIcon onClick={() => setIsMobileMenuOpen(false)} className="absolute right-2" />
                            <div className="flex flex-col gap-6">
                                <RajeBrandLogo logoType="mini" secondText="blog" />
                                <div className="flex flex-col gap-2">
                                    {updatedNavigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`px-4 py-3 rounded-xl text-lg font-medium ${item.current
                                                ? 'bg-cyan-800 text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="pt-6 overflow-y-auto h-fit border-t border-gray-100 dark:border-white/10">
                                    <NavbarCalendar /> Calender
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
