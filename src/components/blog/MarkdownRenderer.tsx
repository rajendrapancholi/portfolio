'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';

import { ENV } from '@/config/env';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import Mermaid from '../ui/Mermaid';

const RAW_URL_BASE = `https://raw.githubusercontent.com/${ENV.NEXT_PUBLIC_REPO_OWNER}/${ENV.NEXT_PUBLIC_REPO_NAME}/main`;

function getCodeString(nodeChildren: any[] = []): string {
  return nodeChildren
    .map((node) => {
      if (node.type === 'text') return node.value;
      if (node.children) return getCodeString(node.children);
      return '';
    })
    .join('');
}

const MarkdownComponents = {
  code: ({ inline, className, children, node, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match?.[1];
    const raw = node?.children
      ? getCodeString(node.children).replace(/\n$/, '')
      : String(children).replace(/\n$/, '');

    if (!inline && lang === 'mermaid') {
      return <Mermaid chart={raw} />;
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  a: ({ href, children, ...props }: any) => {
    if (!href) return <>{children}</>;
    const pathname = usePathname();
    if (href.startsWith('#')) {
      return (
        <Link href={`${pathname}${href}`} className="absolute left-0 w-full">
          {children}
        </Link>
      );
    }

    const isRelative =
      href.startsWith('./') ||
      (!href.startsWith('http') && href.endsWith('.md'));
    const isGitHubRaw = href.includes('raw.githubusercontent.com');

    if (isRelative || isGitHubRaw) {
      let cleanPath = href;
      if (isGitHubRaw) {
        const parts = href.split(/\/main\/|\/master\//);
        cleanPath = parts.length > 1 ? parts[1] : href;
      }
      const localHref = `/blogs/b/git/${cleanPath.replace(/^\.\//, '').replace('.md', '')}`;
      return (
        <Link
          href={localHref}
          className="text-primary hover:underline decoration-primary/30 underline-offset-4"
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
        className="text-primary hover:underline decoration-primary/30 underline-offset-4"
        {...props}
      >
        {children}
      </Link>
    );
  },

  img: ({ src, alt, ...props }: any) => {
    const imageSrc = typeof src === 'string' ? src : '';
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const openModal = (id: string) => {
      const dialog = document.getElementById(id) as HTMLDialogElement;
      dialog?.showModal();
    };

    const closeModal = (id: string) => {
      const dialog = document.getElementById(id) as HTMLDialogElement;
      dialog?.close();
    };

    const modalId = `modal-${imageSrc.split('/').pop()?.split('.')[0] || Math.random()}`;

    return (
      <>
        <span
          className="group block relative my-8 w-full max-w-3xl mx-auto overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 cursor-zoom-in"
          onClick={() => openModal(modalId)}
        >
          <span className="relative block overflow-hidden">
            <img
              {...props}
              src={imageSrc}
              alt={alt || ''}
              loading="lazy"
              className="w-full h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </span>

          {alt && (
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
              <span className="rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-center text-sm font-medium text-white shadow-lg backdrop-blur-md block">
                {alt}
              </span>
            </span>
          )}
        </span>
        {mounted &&
          createPortal(
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
                  aria-label="Close image preview"
                  className="absolute top-0.5 right-0.5 text-white/70 hover:text-white text-lg font-bold p-2 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModal(modalId);
                  }}
                >
                  <XCircle size={48} />
                </button>
              </span>
            </dialog>,
            document.body,
          )}
      </>
    );
  },
};

const MarkdownRenderer = ({ content }: { content: string }) => {
  const pathname = usePathname();
  const isGit = pathname.includes('/b/git');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  type ColorMode = 'light' | 'dark';
  useEffect(() => {
    setMounted(true);
  }, []);
  const currentTheme = (mounted ? resolvedTheme : 'light') as ColorMode;

  if (!mounted) {
    return <Loading />;
  }
  return (
    <div
      className="markdown-render-blue-topaz md:px-2 bg-main-bg"
      data-color-mode={currentTheme}
    >
      <MarkdownPreview
        components={MarkdownComponents}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        urlTransform={(uri) => {
          if (uri.startsWith('#') || uri.startsWith('http')) {
            return uri;
          }
          if (isGit && !uri.startsWith('http')) {
            const cleanUri = uri.replace(/^\.\//, '').replace(/^\//, '');
            return `${RAW_URL_BASE}/${cleanUri}`;
          }
          return uri;
        }}
        source={content}
      />
    </div>
  );
};

export default MarkdownRenderer;
