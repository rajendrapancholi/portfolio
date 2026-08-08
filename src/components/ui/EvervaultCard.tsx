'use client';
import { useMotionValue, useMotionTemplate, motion } from 'motion/react';
import React from 'react';
import { cn } from '@/lib/utils/cn';

export const EvervaultCard = ({
  phase,
  title,
  desc,
  className,
}: {
  phase?: string;
  title?: string;
  desc?: string;
  className?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
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
        className="group/card rounded-3xl w-full relative overflow-hidden bg-card border border-border/80 flex items-center justify-center h-full transition-all duration-500 hover:border-primary/40 hover:shadow-elevated"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          title={title}
          desc={desc}
        />

        <div className="relative z-10 flex items-center justify-center group-hover/card:opacity-0 transition-opacity duration-500">
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
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, desc, title }: any) {
  const maskImage = useMotionTemplate`radial-gradient(280px circle at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-3xl mask-[linear-gradient(white,transparent)]" />

      <motion.div
        className="absolute inset-0 bg-linear-to-br from-success via-brand to-primary opacity-0 group-hover/card:opacity-25 transition duration-500"
        style={style}
      />

      <motion.div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 backdrop-blur-[2px] transition duration-500"
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
