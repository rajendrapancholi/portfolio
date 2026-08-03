'use client';

import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

export default function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const id = useId().replace(/:/g, '');

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    const mermaidTheme = resolvedTheme === 'dark' ? 'dark' : 'default';

    mermaid.initialize({
      startOnLoad: false,
      theme: mermaidTheme,
      securityLevel: 'loose',
    });

    mermaid
      .render(`mermaid-${id}`, chart)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((err) => {
        console.error('Mermaid render error:', err);
        if (!cancelled) setSvg(`<pre>${err.message}</pre>`);
      });

    return () => {
      cancelled = true;
    };
  }, [chart, id, resolvedTheme]);

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
