'use client';
import { useMotionValue, useMotionTemplate, motion } from 'motion/react';
import React from 'react';
import { cn } from '@/lib/utils/cn';

export const EvervaultCard = ({
  phase,
  title,
  desc,
  className,
  isRevealed,
  onToggle,
}: {
  phase?: string;
  title?: string;
  desc?: string;
  className?: string;
  isRevealed: boolean;
  onToggle: () => void;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleTap(e: React.MouseEvent<HTMLDivElement>) {
    const { width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set(width / 2);
    mouseY.set(height / 2);
    onToggle();
  }

  return (
    <div
      className={cn(
        'p-px bg-transparent aspect-square flex items-center justify-center w-full h-full relative',
        className,
      )}
    >
      <div
        onMouseMove={onMouseMove}
        onClick={handleTap}
        role="button"
        tabIndex={0}
        aria-pressed={isRevealed}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          'group/card rounded-3xl w-full relative overflow-hidden bg-card border border-border/80 flex items-center justify-center h-full transition-all duration-500 cursor-pointer select-none',
          'hover:border-primary/40 hover:shadow-elevated focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
          isRevealed && 'border-primary/40 shadow-elevated',
        )}
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          title={title}
          desc={desc}
          isRevealed={isRevealed}
        />

        <div
          className={cn(
            'relative z-10 flex items-center justify-center transition-opacity duration-500',
            'group-hover/card:opacity-0',
            isRevealed && 'opacity-0',
          )}
        >
          <div className="relative h-40 w-40 md:h-44 md:w-44 rounded-full flex items-center justify-center font-bold">
            <div
              className="absolute w-full h-full blur-2xl rounded-full opacity-60"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-success) 0%, var(--color-info) 50%, var(--color-primary) 100%)',
              }}
            />
            <div className="absolute w-full h-full bg-background rounded-full border border-border shadow-inner" />
            <span className="text-foreground text-4xl md:text-5xl z-20 font-black tracking-tighter">
              {phase}
            </span>
          </div>
        </div>

        <span
          className={cn(
            'absolute bottom-3 right-3 z-20 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70 transition-opacity duration-300 sm:hidden',
            isRevealed ? 'opacity-0' : 'opacity-100',
          )}
        >
          Tap to view
        </span>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, desc, title, isRevealed }: any) {
  const maskImage = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-3xl mask-[linear-gradient(white,transparent)]" />

      <motion.div
        className={cn(
          'absolute inset-0 bg-linear-to-br from-success via-brand to-primary opacity-0 transition duration-500',
          'group-hover/card:opacity-25',
          isRevealed && 'opacity-25',
        )}
        style={style}
      />

      <motion.div
        className={cn(
          'absolute inset-0 opacity-0 backdrop-blur-[2px] transition duration-500',
          'group-hover/card:opacity-100',
          isRevealed && 'opacity-100',
        )}
        style={style}
      >
        <div className="absolute inset-0 bg-background/90 p-7 flex flex-col justify-center items-center text-center">
          <span className="text-primary text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
            {title}
          </span>
          <p className="text-muted-foreground text-sm md:text-[0.95rem] leading-relaxed max-w-[85%]">
            {desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
