'use client';

import { FileCode, Terminal, Brackets } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

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
  const lang = match ? match[1] : 'code';

  return (
    <div className="relative group my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          {getLanguageIcon(lang)}
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {lang}
          </span>
        </div>
        <CopyButton text={children} />
      </div>
      <div className="overflow-x-auto p-4 text-sm font-mono text-foreground">
        <pre className="scrollbar-hide">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};
