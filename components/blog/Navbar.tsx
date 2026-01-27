'use client';

import React, { useState } from 'react';
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
    TextAlignJustify,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FcTemplate } from 'react-icons/fc';

import RajeBrandLogo from '../ui/RajeBrandLogo';
import ThemeButton from '../ui/ThemeButton';
import { NavbarCalendar } from '../ui/NavbarCalender';

const Navbar: React.FC = () => {
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

    return (
        <motion.nav
            initial={false}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            variants={{
                expanded: { height: 72 },
                collapsed: { height: 48 },
            }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10"
        >
            <div className="mx-auto px-4 h-full">
                <div className="flex h-full items-center justify-between gap-3">

                    {/* Mobile menu button */}
                    <button
                        className="fixed left-2 top-4 sm:hidden p-2 text-gray-600 dark:text-gray-300"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <TextAlignJustify />
                    </button>

                    {/* Logo */}
                    <div className="hidden xl:block">
                        <RajeBrandLogo logoType="mini" secondText="blog" />
                    </div>

                    {/* Center navigation */}
                    <div className="flex flex-1 justify-center">
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
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 h-screen z-45 bg-black/30 backdrop-blur-sm sm:hidden"
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            className="fixed top-0 rounded-r-2xl left-0 z-50 h-screen w-72 bg-white dark:bg-gray-900 p-6 shadow-interactive-cyan sm:hidden"
                        >
                            <ArrowLeftCircleIcon
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute top-8 right-4 cursor-pointer"
                            />

                            <RajeBrandLogo logoType="mini" secondText="blog" />

                            {/* Navigation */}
                            <nav className="mt-6 flex flex-col gap-2">
                                {updatedNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`px-4 py-3 rounded-xl text-lg ${item.current
                                            ? 'bg-cyan-800 text-white'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile actions */}
                            <div className="flex-1 flex flex-col h-3/5 justify-between border-t border-gray-200 dark:border-white/10 pt-4 space-y-4">
                                <div className='flex-center'>
                                    <NavbarCalendar />
                                </div>

                                <div className='flex justify-between items-center'>
                                    <Link href="/blogs/subscribe">
                                        <button className="px-2 bg-cyan-800 text-white py-3 rounded-xl text-sm font-bold">
                                            Subscribe
                                        </button>
                                    </Link>
                                    <ThemeButton />
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
