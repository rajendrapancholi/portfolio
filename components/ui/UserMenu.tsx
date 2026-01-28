"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "@/types";
import {
    HiOutlineSquares2X2,
    HiOutlineCog6Tooth,
    HiOutlinePencilSquare,
    HiOutlineRocketLaunch,
    HiOutlineArrowRightOnRectangle
} from "react-icons/hi2";;
import { IoCreateOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { logoutAction } from "@/app/actions/authActions";
import { clearCredentials } from "@/lib/features/auth/authSlice";
import { useAppDispatch } from "@/lib/features/hooks";

export default function UserMenu({ user, popupPos = "bottom" }: { user: User; popupPos?: "top" | "left" | "bottom" | "right" | "bottom-right" | "bottom-left" | "top-right" | "top-left"; }) {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: <HiOutlineSquares2X2 />, role: "admin" },
        { name: "Create Blog", href: "/admin/blogs/create", icon: <IoCreateOutline />, role: "admin" },
        { name: "Settings", href: "/settings", icon: <HiOutlineCog6Tooth /> },
        { name: "Editor", href: "/editor", icon: <HiOutlinePencilSquare /> },
        { name: "Projects", href: "/projects", icon: <HiOutlineRocketLaunch /> },

    ];
    // Logout Handler
    const handleLogout = async () => {
        setOpen(false);
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

    const positionClasses = {
        "bottom": "top-full mt-2 right-0 origin-top-right",
        "top": "bottom-full mb-2 right-0 origin-bottom-right",
        "left": "right-full mr-2 top-0 origin-top-right",
        "right": "left-full ml-2 top-0 origin-top-left",
        "bottom-right": "top-full mt-2 right-0 origin-top-right",
        "bottom-left": "top-full mt-2 left-0 origin-top-left",
        "top-right": "bottom-full mb-2 right-0 origin-bottom-right",
        "top-left": "bottom-full mb-2 left-0 origin-bottom-left",
    };
    const translateClasses = {
        "bottom": open ? "translate-y-0" : "-translate-y-2",
        "top": open ? "translate-y-0" : "translate-y-2",
        "left": open ? "translate-x-0" : "translate-x-2",
        "right": open ? "translate-x-0" : "-translate-x-2",
        "bottom-right": open ? "translate-y-0" : "-translate-y-2",
        "bottom-left": open ? "translate-y-0" : "-translate-y-2",
        "top-right": open ? "translate-y-0" : "translate-y-2",
        "top-left": open ? "translate-y-0" : "translate-y-2",
    };

    return (
        <div className="relative inline-block">
            {/* Trigger Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                }}
                className="relative flex items-center gap-2 text-sm font-semibold 
                   text-slate-700 dark:text-slate-200 
                   bg-white dark:bg-white/5 
                   border border-slate-200 dark:border-white/10 
                   px-4 py-2 rounded-xl 
                   hover:bg-slate-50 dark:hover:bg-white/10 
                   transition-all active:scale-95 shadow-sm dark:shadow-xl z-70"
            >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {user?.name.split(" ")[0]}
                <span className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    ▾
                </span>
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-60 h-screen w-screen bg-transparent cursor-default"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Dropdown Menu */}
            <div
                className={`
            absolute z-80 min-w-52 overflow-hidden rounded-2xl 
            border border-slate-200 dark:border-white/10 
            bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl 
            shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            transition-all duration-200 ease-out
            ${positionClasses[popupPos] || positionClasses.bottom}
            ${translateClasses[popupPos] || translateClasses.bottom}
            ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
        `}
            >
                {/* User Header */}
                <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
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
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg 
                                       transition-all duration-150 
                                       text-slate-600 dark:text-slate-300 
                                       hover:bg-slate-100 dark:hover:bg-white/10 
                                       hover:text-slate-900 dark:hover:text-white group"
                                >
                                    <span className="text-lg opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    <li>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg 
                               transition-all duration-150 
                               text-red-500 dark:text-red-400 
                               hover:bg-red-50 dark:hover:bg-red-500/10 group"
                        >
                            <span className="text-lg opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                                <HiOutlineArrowRightOnRectangle />
                            </span>
                            Sign out
                        </button>
                    </li>
                </ul>
            </div>
        </div>

    );
}
