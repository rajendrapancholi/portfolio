'use client';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useEffect, useCallback, Dispatch, SetStateAction } from 'react';

type ModalType = 'delete' | 'success' | 'info' | 'warning';

interface ModalWrapperProps {
    children: React.ReactNode;
    type?: ModalType;
    /** If true, uses router.back() (Intercepted Route). If false, uses setIsOpen. */
    isInterceptedRoute?: boolean;
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function ModalWrapper({
    children,
    type = 'info',
    isInterceptedRoute = true,
    setIsOpen = () => { }
}: ModalWrapperProps) {
    const router = useRouter();

    const onDismiss = useCallback(() => {
        if (isInterceptedRoute) {
            router.back();
        } else {
            setIsOpen(false);
        }
    }, [isInterceptedRoute, router, setIsOpen]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onDismiss();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onDismiss]);

    const typeStyles = {
        delete: "from-red-500 via-orange-500 to-red-600",
        success: "from-emerald-400 via-teal-500 to-cyan-600",
        warning: "from-amber-400 via-orange-500 to-yellow-600",
        info: "from-blue-500 via-indigo-500 to-violet-600",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop: Prevents clicks from leaking to background */}
            <div
                className="fixed inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onDismiss}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div
                className="relative w-full max-w-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-4xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden  animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
                /* Important: Prevents onDismiss from firing when clicking inside the modal */
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Interactive Close Button */}
                <button
                    onClick={onDismiss}
                    className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-slate-200/50 dark:bg-slate-800/50  text-slate-600 dark:text-slate-400 hover:scale-110 active:scale-95 hover:bg-red-500 hover:text-white dark:hover:bg-red-500/80 dark:hover:text-white transition-all duration-200 group"
                >
                    <X className="size-5" />
                    <span className="sr-only">Close modal</span>
                </button>

                {/* Subtle Decorative Header Gradient */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${typeStyles[type]} opacity-80`} />

                {/* Content Area */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
