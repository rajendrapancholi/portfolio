'use client';

import { FileCode, Terminal, Brackets } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const getLanguageIcon = (lang: string) => {
  switch (lang.toLowerCase()) {
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
      return <Brackets className="w-4 h-4 text-warning" />;
    case 'bash':
    case 'sh':
    case 'shell':
      return <Terminal className="w-4 h-4 text-success" />;
    default:
      return <FileCode className="w-4 h-4 text-primary" />;
  }
};

export const CodeBlock = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'text';

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <div className="relative group my-6 overflow-hidden rounded-md border border-border bg-card shadow-sm">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          {getLanguageIcon(lang)}
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {lang}
          </span>
        </div>
      </div>

      <CopyButton text={children} />

      <SyntaxHighlighter
        language={lang}
        style={isDark ? vscDarkPlus : oneLight}
        showLineNumbers={false}
        wrapLongLines={false}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        }}
        codeTagProps={{
          style: { fontFamily: 'inherit' },
        }}
        className="scrollbar-hide"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
