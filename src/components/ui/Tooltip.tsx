'use client';

import { useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

type Side = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  label: string;
  side?: Side;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function Tooltip({
  label,
  side = 'right',
  disabled = false,
  children,
}: TooltipProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const isTouchRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const gap = 10;

  const show = useCallback(() => {
    if (disabled || isTouchRef.current || !anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();

    const map: Record<Side, { top: number; left: number }> = {
      right: { top: rect.top + rect.height / 2, left: rect.right + gap },
      left: { top: rect.top + rect.height / 2, left: rect.left - gap },
      bottom: { top: rect.bottom + gap, left: rect.left + rect.width / 2 },
      top: { top: rect.top - gap, left: rect.left + rect.width / 2 },
    };

    setCoords(map[side]);
    setVisible(true);
  }, [disabled, side]);

  const hide = useCallback(() => {
    setVisible(false);
    isTouchRef.current = false;
  }, []);

  const handleTouchStart = useCallback(() => {
    isTouchRef.current = true;
  }, []);

  const transform: Record<Side, string> = {
    right: 'translateY(-50%)',
    left: 'translate(-100%, -50%)',
    bottom: 'translateX(-50%)',
    top: 'translate(-50%, -100%)',
  };

  const portalTarget =
    typeof document !== 'undefined'
      ? document.getElementById('tooltip-root')
      : null;

  return (
    <span
      ref={anchorRef}
      className="block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onTouchStart={handleTouchStart}
    >
      {children}

      {visible &&
        !disabled &&
        portalTarget &&
        createPortal(
          <span
            role="tooltip"
            style={{
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              transform: transform[side],
              zIndex: 9999,
              background: 'var(--tooltip-bg)',
              color: 'var(--tooltip-fg)',
              fontSize: '0.7rem',
              fontWeight: 500,
              padding: '0.35rem 0.65rem',
              borderRadius: '0.45rem',
              whiteSpace: 'normal',
              width: 'max-content',
              maxWidth: 'calc(100vw - 32px)',
              wordBreak: 'break-word',
              border: '1px solid var(--tooltip-border)',
              boxShadow:
                '0 4px 12px -2px rgb(0 0 0 / 0.25), 0 2px 4px -1px rgb(0 0 0 / 0.1)',
              pointerEvents: 'none',
            }}
          >
            {label}
          </span>,
          portalTarget,
        )}
    </span>
  );
}
