"use client";

import React, { useEffect } from "react";
import { Toaster, toast, ToastBar, ToastPosition } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { X } from "lucide-react";

// Tailwind-compatible style objects
const lightStyles = {
    background: "white",
    color: "black",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    padding: "0.75rem",
};

const darkStyles = {
    background: "#1f2937",
    color: "white",
    border: "1px solid #374151",
    borderRadius: "0.5rem",
    padding: "0.75rem",
};

const successLight = { background: "#d1fae5", color: "#065f46" };
const successDark = { background: "#064e3b", color: "#a7f3d0" };

const errorLight = { background: "#fee2e2", color: "#991b1b" };
const errorDark = { background: "#7f1d1d", color: "#fecaca" };

const loadingLight = { background: "#e0f2fe", color: "#0c4a6e" };
const loadingDark = { background: "#1e40af", color: "#93c5fd" };

type Props = {
    position?: ToastPosition;
    children?: React.ReactNode;
};

const ToastProvider: React.FC<Props> = ({ position = 'top-right', children }) => {
    const pathname = usePathname();
    const { theme } = useTheme();

    useEffect(() => {
        toast.dismiss();
    }, [pathname]);
    return (
        <>
            {children}
            <Toaster
                position={position || "top-right"}
                reverseOrder={false}
                toastOptions={{
                    className: "text-sm",
                    duration: 4000,
                    style: theme === "dark" ? darkStyles : lightStyles,
                    success: {
                        style: theme === "dark" ? successDark : successLight,
                        duration: 3000,
                    },
                    error: {
                        style: theme === "dark" ? errorDark : errorLight,
                        duration: 7000,
                    },
                    loading: {
                        style: theme === "dark" ? loadingDark : loadingLight,
                        duration: 4000,
                    },
                }}
            >
                {(t) => (
                    <ToastBar toast={t}>
                        {({ icon, message }) => (
                            <div
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    {icon}
                                    {message}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toast.dismiss(t.id);
                                    }}
                                    className="ml-2 font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <X />
                                </button>
                            </div>
                        )}
                    </ToastBar>
                )}
            </Toaster>
        </>
    );
};

export default ToastProvider;