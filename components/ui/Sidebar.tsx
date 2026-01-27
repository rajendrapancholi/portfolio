"use client";

import { cn } from "@/lib/utils/cn";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";

interface Links {
    label: string;
    href: string;
    icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
    undefined
);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    const [openState, setOpenState] = useState(true);

    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props as React.ComponentProps<"div">)} />
        </>
    );
};

export const DesktopSidebar = ({
    className,
    children,
    onMouseEnter,
    onMouseLeave,
    ...props
}: React.ComponentProps<typeof motion.div>) => {
    const { open, animate } = useSidebar();
    return (
        <motion.div
            className={cn(
                "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 shrink-0",
                className
            )}
            animate={{
                width: animate ? (open ? "300px" : "80px") : "300px",
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...props}
        >
            {children}
        </motion.div>
    );
};


export const SidebarLink = ({
    link,
    className,
    ...props
}: {
    link: Links;
    className?: string;
}) => {
    const { open, animate } = useSidebar();
    return (
        <Link
            href={link.href}
            className={cn(
                "flex items-center justify-start gap-2 group/sidebar py-2 text-gray-700 dark:text-gray-300",
                className
            )}
            {...props}
        >
            <div className="shrink-0 flex items-center justify-center">
                {link.icon}
            </div>

            <motion.span
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0 m-0"
            >
                {link.label}
            </motion.span>
        </Link>
    );
};

export const SidebarButton = ({
    btn,
    className,
    ...props
}: {
    btn: Links;
    className?: string;
}) => {
    const { open, animate } = useSidebar();
    return (
        <div
            className={cn(
                "gap-2 group/sidebar py-2 text-gray-700 dark:text-gray-300",
                className
            )}
            {...props}
        >
            <div className="shrink-0 flex items-center justify-center">
                {btn.icon}
            </div>
            {btn.label !== '' &&
                <motion.span
                    animate={{
                        display: animate ? (open ? "inline-block" : "none") : "inline-block",
                        opacity: animate ? (open ? 1 : 0) : 1,
                    }}
                    className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0 m-0"
                >
                    {btn.label}
                </motion.span>
            }
        </div>
    );
};


export const MobileSidebar = ({ className, children }: any) => {
    const { open, setOpen } = useSidebar();

    return (
        <div className="md:hidden h-screen fixed z-50 top-0 bottom-0">
            {/* Top mobile bar */}
            <div className="absolute px-2 flex items-center justify-between top-4 left-2 z-40">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-7 hidden rounded bg-indigo-600" />
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="text-gray-800 dark:text-gray-200 shadow-2xl btn btn-ghost btn-xs"
                >
                    <IconMenu2 />
                </button>
            </div>

            {/* Drawer */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 260 }}
                            className={cn(
                                "fixed inset-y-0 max-md:h-screen left-0 w-64 bg-white dark:bg-gray-950 z-60 flex flex-col shadow-2xl",
                                className
                            )}
                        >
                            <div className="fixed right-0 top-0 flex justify-end p-4">
                                <button onClick={() => setOpen(false)}>
                                    <IconX className="text-gray-800 dark:text-gray-200" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-2">
                                {children}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};



