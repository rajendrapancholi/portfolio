'use client';

import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { useTheme } from 'next-themes';
import { useEffect, useState, useMemo, memo } from 'react';
import Loading from '@/components/Loading';
import { ENV } from '@/config/env';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ImageOff, XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CodeBlock } from './CodeBlock';
import dynamic from 'next/dynamic';

const Mermaid = dynamic(() => import('../ui/Mermaid'), {
  ssr: false,
  loading: () => (
    <div className="h-32 w-full animate-pulse rounded-lg bg-muted my-4" />
  ),
});

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

const MarkdownCode = memo(function MarkdownCode({
  className,
  children,
  node,
  ...props
}: any) {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match?.[1];

  const rawText = node?.children
    ? getCodeString(node.children).replace(/\n$/, '')
    : String(children).replace(/\n$/, '');

  const isInline = !className && !rawText.includes('\n');

  if (isInline) {
    return <code {...props}>{children}</code>;
  }

  if (lang === 'mermaid') {
    return <Mermaid chart={rawText} />;
  }

  return <CodeBlock lang={lang || 'text'}>{rawText}</CodeBlock>;
});

const MarkdownLink = memo(function MarkdownLink({
  href,
  children,
  pathname,
  ...props
}: any) {
  if (!href) return <>{children}</>;

  // Anchor links
  if (href.startsWith('#')) {
    return (
      <Link href={`${pathname}${href}`} className="">
        {children}
      </Link>
    );
  }

  const isRelative =
    href.startsWith('./') || (!href.startsWith('http') && href.endsWith('.md'));
  const isGitHubRaw = href.includes('raw.githubusercontent.com');

  if (isRelative || isGitHubRaw) {
    let cleanPath = href;
    if (isGitHubRaw) {
      const parts = href.split(/\/main\/|\/master\//);
      cleanPath = parts.length > 1 ? parts[1] : href;
    }

    const localHref = `/blogs/b/git/${cleanPath
      .replace(/^\.\//, '')
      .replace('.md', '')}`;

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
});

const MarkdownImage = memo(function MarkdownImage({ src, alt, ...props }: any) {
  const imageSrc = typeof src === 'string' ? src : '';
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  );
  if (!imageSrc) return null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalId = useMemo(
    () => `modal-${imageSrc.split('/').pop()?.split('.')[0] || Math.random()}`,
    [imageSrc],
  );

  const openModal = () => {
    if (status !== 'loaded') return; // don't open a modal on a broken/unloaded image
    const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const closeModal = () => {
    const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
    dialog?.close();
  };

  if (status === 'error') {
    return (
      <span className="my-8 flex w-full max-w-3xl mx-auto flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 py-10 text-muted-foreground">
        <ImageOff size={28} strokeWidth={1.5} />
        <span className="text-sm">{alt || 'Image failed to load'}</span>
      </span>
    );
  }

  return (
    <>
      <span
        className={`group block relative my-8 w-full max-w-3xl mx-auto overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition-all duration-300 ${
          status === 'loaded'
            ? 'cursor-zoom-in hover:shadow-xl hover:shadow-primary/10'
            : 'cursor-default'
        }`}
        onClick={openModal}
      >
        {/* Skeleton shown until the real image has decoded */}
        {status === 'loading' && (
          <span className="absolute inset-0 block animate-pulse bg-muted" />
        )}

        <span className="relative block overflow-hidden">
          <img
            {...props}
            src={imageSrc}
            alt={alt || ''}
            loading="lazy"
            decoding="async"
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
            className={`w-full h-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.03] ${
              status === 'loaded' ? 'opacity-100' : 'opacity-0'
            }`}
          />
          <span className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </span>

        {alt && status === 'loaded' && (
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-center text-sm font-medium text-white shadow-lg backdrop-blur-md block">
              {alt}
            </span>
          </span>
        )}
      </span>

      {mounted &&
        status === 'loaded' &&
        createPortal(
          <dialog
            id={modalId}
            aria-label={alt || 'Image preview'}
            className="fixed inset-0 p-0 m-auto bg-transparent backdrop:bg-black/80 backdrop:backdrop-blur-sm open:flex items-center justify-center w-screen h-screen outline-none border-none overflow-visible"
            onClick={closeModal}
          >
            <span className="relative w-full h-full flex items-center justify-center">
              <img
                src={imageSrc}
                alt={alt}
                onClick={(e) => e.stopPropagation()} // clicking the image itself shouldn't close it
                className="w-full h-[90vh] rounded-lg shadow-2xl object-contain cursor-default animate-in zoom-in-95 duration-200"
              />
              <button
                aria-label="Close image preview"
                className="absolute top-0.5 right-0.5 text-white/70 hover:text-white p-2 cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
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
});

/* Main component */

const MarkdownRenderer = ({ content }: { content: string }) => {
  const pathname = usePathname();
  const isGit = pathname.includes('/b/git');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const components = useMemo(() => {
    const createHeadingComponent = (Tag: 'h1' | 'h2' | 'h3') => {
      return ({ id, children, ...props }: any) => {
        if (id) {
          return (
            <Tag
              id={id}
              {...props}
              className="group flex items-center gap-2 scroll-mt-20"
            >
              {children}
              <Link
                href={`${pathname}#${id}`}
                className="opacity-0 group-hover:opacity-100 transition-opacity font-extrabold text-muted-foreground hover:text-primary no-underline hover:underline ml-0.5 select-none"
                aria-label={`Link to ${id}`}
              >
                #
              </Link>
            </Tag>
          );
        }
        return <Tag {...props}>{children}</Tag>;
      };
    };

    return {
      code: MarkdownCode,
      pre: ({ children }: any) => <>{children}</>,
      img: MarkdownImage,
      a: (props: any) => {
        const isHeadingAnchor =
          props.href?.startsWith('#') && props.className?.includes('anchor');
        if (isHeadingAnchor) {
          return null;
        }
        return <MarkdownLink {...props} pathname={pathname} />;
      },
      h1: createHeadingComponent('h1'),
      h2: createHeadingComponent('h2'),
      h3: createHeadingComponent('h3'),
    };
  }, [pathname]);

  if (!mounted) {
    return <Loading />;
  }

  const currentTheme = (
    mounted && resolvedTheme === 'dark' ? 'dark' : 'light'
  ) as 'light' | 'dark';

  return (
    <div
      className="markdown-render bg-main-bg"
      data-color-mode={currentTheme}
      style={{ opacity: mounted ? 1 : 0.92, transition: 'opacity 150ms ease' }}
    >
      <MarkdownPreview
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        prefixCls=""
        wrapperElement={{
          'data-color-mode': undefined,
        }}
        urlTransform={(uri) => {
          if (uri.startsWith('#') || uri.startsWith('http')) return uri;

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
