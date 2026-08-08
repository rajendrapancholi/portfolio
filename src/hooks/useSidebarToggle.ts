'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

export function useSidebarToggle(key: string, defaultOpen = true) {
  const [pinned, setPinned] = useState(defaultOpen);
  const [hovered, setHovered] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore preference
  useEffect(() => {
    const saved = localStorage.getItem(`sidebar-${key}`);
    if (saved !== null) setPinned(saved === 'true');
  }, [key]);

  // Persist preference
  useEffect(() => {
    localStorage.setItem(`sidebar-${key}`, String(pinned));
  }, [key, pinned]);

  const toggle = useCallback(() => {
    setPinned((p) => !p);
  }, []);

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
    }, 280);
  }, [pinned]);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const isOpen = pinned || hovered;

  return { pinned, isOpen, toggle, onMouseEnter, onMouseLeave };
}
