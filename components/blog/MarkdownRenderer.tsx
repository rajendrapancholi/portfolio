"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";

import { ENV } from "@/config/env";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoCloseCircle } from "react-icons/io5";
import { XCircle } from "lucide-react";

const RAW_URL_BASE = `https://raw.githubusercontent.com/${ENV.NEXT_PUBLIC_REPO_OWNER}/${ENV.NEXT_PUBLIC_REPO_NAME}/main`;

const MarkdownComponents = {
  a: ({ href, children, ...props }: any) => {
    if (!href) return <>{children}</>;
    const pathname = usePathname();
    if (href.startsWith("#")) {
      return (
        <Link href={`${pathname}${href}`} className="absolute left-0 w-full">
          {children}
        </Link>
      );
    }

    const isRelative =
      href.startsWith("./") ||
      (!href.startsWith("http") && href.endsWith(".md"));
    const isGitHubRaw = href.includes("raw.githubusercontent.com");

    // 2. Handle Markdown/GitHub links
    if (isRelative || isGitHubRaw) {
      let cleanPath = href;
      if (isGitHubRaw) {
        const parts = href.split(/\/main\/|\/master\//);
        cleanPath = parts.length > 1 ? parts[1] : href;
      }
      const localHref = `/blogs/b/git/${cleanPath.replace(/^\.\//, "").replace(".md", "")}`;
      return (
        <Link
          href={localHref}
          className="text-cyan-500 hover:underline decoration-cyan-500/30 underline-offset-4"
        >
          {children}
        </Link>
      );
    }
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-500 hover:underline"
        {...props}
      >
        {children}
      </Link>
    );
  },
  img: ({ src, alt, ...props }: any) => {
    const imageSrc = typeof src === "string" ? src : "";

    const openModal = (id: string) => {
      const dialog = document.getElementById(id) as HTMLDialogElement;
      dialog?.showModal();
    };

    const closeModal = (id: string) => {
      const dialog = document.getElementById(id) as HTMLDialogElement;
      dialog?.close();
    };

    const modalId = `modal-${imageSrc.split("/").pop()?.split(".")[0] || Math.random()}`;

    return (
      <>
        <span
          className="group block **:block relative my-8 max-w-fit self-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:shadow-blue-400/5 cursor-zoom-in"
          onClick={() => openModal(modalId)}
        >
          <span className="relative overflow-hidden">
            <img
              {...props}
              src={imageSrc}
              alt={alt || ""}
              loading="lazy"
              className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </span>

          {alt && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[80%] translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-center text-sm font-medium text-white shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/40">
                {alt}
              </span>
            </span>
          )}
        </span>
        <dialog
          id={modalId}
          className="fixed inset-0 p-0 m-auto bg-transparent backdrop:bg-black/80 backdrop:backdrop-blur-sm open:flex items-center justify-center w-screen h-screen outline-none border-none overflow-visible group/modal"
          onClick={() => closeModal(modalId)}
        >
          <span className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageSrc}
              alt={alt}
              className="w-full h-[90vh] rounded-lg shadow-2xl object-contain cursor-zoom-out animate-in zoom-in-95 duration-200"
            />
            <button
              className="absolute top-0.5 right-0.5 text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white text-lg font-bold p-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                closeModal(modalId);
              }}
            >
              <XCircle size={48} />
            </button>
          </span>
        </dialog>
      </>
    );
  },
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  const pathname = usePathname();
  const isGit = pathname.includes("/b/git");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  type ColorMode = "light" | "dark";
  useEffect(() => {
    setMounted(true);
  }, []);
  const currentTheme = (mounted ? resolvedTheme : "light") as ColorMode;

  if (!mounted) {
    return <Loading />;
  }
  return (
    <div
      className="markdown-render-blue-topaz md:px-2 bg-canvas"
      data-color-mode={currentTheme}
    >
      <MarkdownPreview
        components={MarkdownComponents}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        urlTransform={(uri) => {
          if (uri.startsWith("#") || uri.startsWith("http")) {
            return uri;
          }
          if (isGit && !uri.startsWith("http")) {
            return `${RAW_URL_BASE}/${uri.replace(/^\.\//, "")}`;
          }
          return uri;
        }}
        source={content}
      />
    </div>
  );
};

export default MarkdownRenderer;
