"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@/types";
import {
    HiOutlineSquares2X2,
    HiOutlineCog6Tooth,
    HiOutlinePencilSquare,
    HiOutlineRocketLaunch,
    HiOutlineArrowRightOnRectangle
} from "react-icons/hi2";

export default function UserMenu({ user }: { user: User; }) {
    const [open, setOpen] = useState(false);

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
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                className="relative flex items-center gap-2 text-sm font-semibold text-white bg-white/5 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition-all active:scale-95 shadow-xl z-[70]"
            >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user?.name.split(" ")[0]}
                <span className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    ▾
                </span>
            </button>

            {/* Overlay: Fixed pure CSS approach */}
            {open && (
                <div
                    className="fixed inset-0 z-[60] h-screen w-screen bg-transparent cursor-default"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Dropdown Menu: Using Tailwind Transitions instead of Framer Motion */}
            <div
                className={`
                    absolute top-14 right-0 z-[80] min-w-[220px] overflow-hidden rounded-2xl 
                    border border-white/10 bg-slate-900/95 backdrop-blur-xl 
                    shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                    transition-all duration-200 ease-out origin-top-right
                    ${open
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                `}
            >
                {/* User Header */}
                <div className="px-5 py-3 border-b border-white/5 bg-white/5">
                    <p className="text-sm font-bold text-white truncate mt-1">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                {/* Links */}
                <ul className="p-2">
                    {menuItems
                        .filter(item => !item.role || user?.isAdmin)
                        .map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    prefetch={false}
                                    onClick={() => setOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg 
                                        transition-all duration-150 hover:bg-white/10 group 
                                        ${item.color || "text-slate-300 hover:text-white"}
                                    `}
                                >
                                    <span className="text-lg opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
