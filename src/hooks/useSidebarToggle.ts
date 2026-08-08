'use client';
import { useState, useCallback, useEffect, useRef } from 'react';

export function useSidebarToggle(key: string, defaultOpen = false) {
  const [pinned, setPinned] = useState(defaultOpen);
  const [hovered, setHovered] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`sidebar-${key}`);
    if (saved !== null) setPinned(saved === 'true');
  }, [key]);

  useEffect(() => {
    localStorage.setItem(`sidebar-${key}`, String(pinned));
  }, [key, pinned]);

  const toggle = useCallback(() => setPinned((p) => !p), []);

  const onMouseEnter = useCallback(() => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
    setHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (pinned) return;

    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setHovered(false);
    }, 300); // 180 → 300
  }, [pinned]);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const isOpen = pinned || hovered;

  return { pinned, isOpen, toggle, onMouseEnter, onMouseLeave };
}
