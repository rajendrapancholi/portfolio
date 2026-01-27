"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Sidebar, SidebarBody, SidebarButton, SidebarLink } from "@/components/ui/Sidebar";
import { logoutAction } from "@/app/actions/authActions";
import { IconChevronRight } from "@tabler/icons-react";
import RajeBrandLogo from "../ui/RajeBrandLogo";
import { LogOutIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/features/hooks";
import { clearCredentials } from "@/lib/features/auth/authSlice";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import ThemeButton from "../ui/ThemeButton";

type MenuItem = {
    title: string;
    path: string;
    icon: React.ReactNode;
};

type MenuGroup = {
    title: string;
    list: MenuItem[];
};

export default function AdminSidebar({ menuItems }: { menuItems: MenuGroup[]; }) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const [pinned, setPinned] = useState(false);
    const [open, setOpen] = useState(false);

    const handleMouseEnter = () => {
        if (!pinned) setOpen(true);
    };

    const handleMouseLeave = () => {
        if (!pinned) setOpen(false);
    };

    const togglePinned = () => {
        setPinned(!pinned);
        setOpen(!pinned ? true : false);
    };
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
    return (
        <Sidebar open={open} setOpen={setOpen} animate={true}>
            {!pinned && <div className="md:w-20" />}
            <SidebarBody
                className={`z-50 rounded-r-2xl shadow-interactive-cyan justify-between min-h-screen md:gap-10 bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-r border-gray-100 dark:border-gray-800 transition-colors duration-300 ${pinned ? "relative" : "md:fixed"}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* PIN TOGGLE BUTTON */}
                <button
                    onClick={togglePinned}
                    className="absolute -right-3 top-1/2 md:top-10 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 text-gray-500 hover:scale-110 transition-all hover:border-indigo-500"
                >
                    <IconChevronRight
                        size={14}
                        className={`transition-transform duration-300 ${pinned ? "rotate-180" : ""} text-indigo-600 dark:text-indigo-400`}
                    />
                </button>

                <div className="flex flex-col overflow-x-hidden">
                    <Logo open={open} />
                    <div className={` flex-1 overflow-y-auto overflow-x-hidden ${open ? "custom-scrollbar" : "hide-scrollbar"}`}>
                        <div className="mt-8 flex flex-col gap-6">
                            {menuItems.map((group, idx) => (
                                <div key={idx} className="flex flex-col gap-2">
                                    <AnimatePresence mode="wait">
                                        {open && (
                                            <motion.p
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                className="px-4 text-[10px] tracking-widest font-bold uppercase text-gray-400 dark:text-gray-500"
                                            >
                                                {group.title}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex flex-col gap-1">
                                        {group.list.map((item) => {
                                            const isActive = pathname === item.path;
                                            return (
                                                <div key={item.path} className="px-2">
                                                    <SidebarLink
                                                        link={{
                                                            label: item.title,
                                                            href: item.path,
                                                            icon: (
                                                                <div className={`shrink-0 flex items-center justify-center transition-colors ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-gray-400"
                                                                    }`}>
                                                                    {item.icon}
                                                                </div>
                                                            ),
                                                        }}
                                                        className={`rounded-xl px-2 transition-all duration-200 ${isActive
                                                            ? "bg-indigo-100/50 dark:bg-gray-800/70 font-semibold text-gray-900 dark:text-white"
                                                            : "hover:bg-gray-100 dark:hover:bg-gray-800/40 text-gray-700 dark:text-gray-300"
                                                            }`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t w-full flex justify-between border-gray-100 dark:border-gray-800 md:pt-4 pb-2 px-2">
                    <button type="submit" className="w-full group">
                        <SidebarButton
                            btn={{
                                label: "Logout",
                                href: "",
                                icon: (
                                    <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                                        <LogOutIcon size={20} onClick={handleLogout} className="text-red-500 text-center" />
                                    </div>
                                ),
                            }}
                            className="flex items-center justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                        />
                    </button>
                    {open &&
                        <div className="w-full group">
                            <SidebarButton
                                btn={{
                                    label: '',
                                    href: '',
                                    icon: (
                                        <ThemeButton position="top" />
                                    ),
                                }}
                                className="flex-end -translate-x-2 "
                            />
                        </div>}
                </div>
            </SidebarBody>
        </Sidebar>
    );
}

const Logo = ({ open }: { open: boolean; }) => (
    <div className="flex flex-col w-full my-0.5 justify-end gap-y-1.5 border-b border-gray-600/50">
        <RajeBrandLogo logoType="mini" title="admin" path="/admin/dashboard" />
        <AnimatePresence>
            {open && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-bold text-xs text-gray-800 dark:text-white py-0.5 whitespace-nowrap"
                >
                    Admin Panel
                </motion.span>
            )}
        </AnimatePresence>
    </div>
);
