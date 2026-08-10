'use client';

import { useEffect, useState, memo, useCallback, useRef, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { getDownloadFilename, getLanguageIcon } from './LangIcons';
import { WrapText, Download, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Tooltip from '../ui/Tooltip';
import { HiNumberedList } from 'react-icons/hi2';

interface HighlighterCoreProps {
  lang: string;
  isDark: boolean;
  showLineNumbers: boolean;
  wrapLongLines: boolean;
  children: string;
}

const HighlighterCore = memo(function HighlighterCore({
  lang,
  isDark,
  showLineNumbers,
  wrapLongLines,
  children,
}: HighlighterCoreProps) {
  return (
    <SyntaxHighlighter
      language={lang}
      style={isDark ? vscDarkPlus : oneLight}
      showLineNumbers={showLineNumbers}
      wrapLongLines={wrapLongLines}
      customStyle={{
        margin: 0,
        padding: '0.5rem 0.5rem 0.5rem 1rem',
        background: 'transparent',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
      }}
      codeTagProps={{
        style: { fontFamily: 'inherit' },
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
});

export const CodeBlock = ({
  children,
  lang,
}: {
  children: string;
  lang: string;
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [wrapLongLines, setWrapLongLines] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    setIsMobile(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const handleDownload = useCallback(() => {
    const filename = getDownloadFilename(lang);
    const blob = new Blob([children], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [children, lang]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  }, [children]);

  const toggleLineNumbers = useCallback(
    () => setShowLineNumbers((v) => !v),
    [],
  );

  const toggleWrapLines = useCallback(() => setWrapLongLines((v) => !v), []);

  const lineNumbersLabel = useMemo(
    () => (showLineNumbers ? 'Hide line numbers' : 'Show line numbers'),
    [showLineNumbers],
  );

  const wrapLinesLabel = useMemo(
    () => (wrapLongLines ? 'Disable wrap' : 'Wrap long lines'),
    [wrapLongLines],
  );

  const copyLabel = useMemo(() => (copied ? 'Copied!' : 'Copy code'), [copied]);

  return (
    <div className="relative group my-6 rounded-md border border-border bg-card shadow-sm">
      <div
        className={cn(
          'sticky top-0 z-15',
          'flex items-center justify-between px-4 py-0.5',
          'bg-muted/80 backdrop-blur-md border-b border-border',
          'select-none rounded-t-md',
        )}
      >
        {/* Left: language (always visible) */}
        <div className="flex items-center gap-2">
          {getLanguageIcon(lang)}
          <span className="text-xs text-muted-foreground uppercase tracking-wider leading-none">
            {lang}
          </span>
        </div>

        {/* Right: actions */}
        <div
          className={cn(
            'flex items-center gap-1 transition-opacity duration-200',
            isMobile
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto',
          )}
        >
          <Tooltip label={lineNumbersLabel} side="top" disabled={isMobile}>
            <button
              title={isMobile ? lineNumbersLabel : undefined}
              onClick={toggleLineNumbers}
              className={cn(
                'p-1 rounded-md transition-colors duration-200 border text-muted-foreground/80 cursor-pointer',
                'hover:bg-accent/50 active:bg-accent/70',
                showLineNumbers
                  ? 'bg-accent text-foreground border-border'
                  : 'bg-transparent border-transparent',
              )}
            >
              <HiNumberedList className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip label={wrapLinesLabel} side="top" disabled={isMobile}>
            <button
              title={isMobile ? wrapLinesLabel : undefined}
              onClick={toggleWrapLines}
              className={cn(
                'p-1 rounded-md transition-colors duration-200 border text-muted-foreground/80 cursor-pointer',
                'hover:bg-accent/50 active:bg-accent/70',
                wrapLongLines
                  ? 'bg-accent text-foreground border-border'
                  : 'bg-transparent border-transparent',
              )}
            >
              <WrapText className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip label="Download code" side="top" disabled={isMobile}>
            <button
              title={isMobile ? 'Download code' : undefined}
              onClick={handleDownload}
              className="p-1 rounded-md transition-colors duration-200 border text-muted-foreground/80 cursor-pointer bg-transparent border-transparent hover:text-foreground hover:bg-accent/50 active:bg-accent/70"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip label={copyLabel} side="top" disabled={isMobile}>
            <button
              title={isMobile ? copyLabel : undefined}
              onClick={handleCopy}
              className="p-1 rounded-md transition-colors duration-200 bg-transparent border border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent/70 cursor-pointer"
            >
              <div className="relative w-3.5 h-3.5 flex items-center justify-center overflow-hidden">
                <Check
                  className={cn(
                    'w-3.5 h-3.5 text-success absolute transition-all duration-300 ease-out',
                    copied
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 pointer-events-none',
                  )}
                />
                <Copy
                  className={cn(
                    'w-3.5 h-3.5 absolute transition-all duration-300 ease-out',
                    copied
                      ? 'opacity-0 -translate-y-2 pointer-events-none'
                      : 'opacity-100 translate-y-0',
                  )}
                />
              </div>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="max-h-80 overflow-scroll">
        <HighlighterCore
          lang={lang}
          isDark={isDark}
          showLineNumbers={showLineNumbers}
          wrapLongLines={wrapLongLines}
        >
          {children}
        </HighlighterCore>
      </div>
    </div>
  );
};
