"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/types";
import {
    HiOutlineSquares2X2,
    HiOutlineCog6Tooth,
    HiOutlinePencilSquare,
    HiOutlineRocketLaunch,
    HiOutlineArrowRightOnRectangle
} from "react-icons/hi2";

type Props = {
    user: User;
};

export default function UserMenu({ user }: Props) {
    const [open, setOpen] = useState(false);
    let uid = useId();

    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: <HiOutlineSquares2X2 />, role: "admin" },
        { name: "Settings", href: "/settings", icon: <HiOutlineCog6Tooth /> },
        { name: "Editor", href: "/editor", icon: <HiOutlinePencilSquare /> },
        { name: "Projects", href: "/projects", icon: <HiOutlineRocketLaunch /> },
        { name: "Sign out", href: "/api/auth/signout", icon: <HiOutlineArrowRightOnRectangle />, color: "text-red-400" },
    ];

    return (
        <div className="relative">
            {/* Trigger Button */}
            <motion.button
                key={"user-btn"}
                {...({} as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setOpen(true); }}
                className="relative flex items-center gap-2 text-sm font-semibold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all shadow-xl"
            >
                <h1 className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user?.name.split(" ")[0]}
                <span className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    ▾
                </span>
            </motion.button>

            <AnimatePresence mode="wait">
                {open && (
                    <motion.div key="user-menu-container" initial={false}>
                        {/* Overlay to close */}

                        <div
                            className="fixed inset-0 z-50 h-screen w-screen bg-transparent"
                            onClick={() => setOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            key="user-menu-dropdown"
                            animate={{
                                opacity: !open ? 1 : 0,
                                scale: !open ? 1 : 0.95,
                                y: !open ? 0 : -10,
                            }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute top-14 right-0 z-50 min-w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                            {...({} as any)}
                        >
                            {/* User Header */}
                            <div className="px-5 py-2 border-b border-white/5 bg-white/5" key={user?._id}>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Signed in as</p>
                                <p className="text-sm font-bold text-white truncate mt-0.5">{user?.name}</p>
                                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                            </div>

                            {/* Links */}
                            <ul className="p-2">
                                {menuItems
                                    .filter(item => !item.role || user?.isAdmin).map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                onClick={() => setOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/5 group ${item.color || "text-slate-300 hover:text-white"}`}
                                            >
                                                <span className="text-lg opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                    {item.icon}
                                                </span>
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
