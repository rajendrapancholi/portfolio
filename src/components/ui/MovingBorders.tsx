'use client';
import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { cn } from '@/lib/utils/cn';

export function MovingGrid({
  borderRadius = '1.75rem',
  children,
  ComponentName,
  as: Component = ComponentName ? ComponentName : 'button',
  containerClassName,
  borderClassName,
  duration,
  className,
  style,
  ...otherProps
}: {
  borderRadius?: string;
  ComponentName: 'div' | 'span' | 'button' | 'a';
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  return (
    <Component
      className={cn(
        'bg-transparent relative text-xl p-px overflow-hidden group/moving-border',
        'block w-full h-full',
        containerClassName,
      )}
      style={{ borderRadius, ...style }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              'h-24 w-24 opacity-90 bg-[radial-gradient(var(--color-primary)_0%,transparent_70%)] blur-[2px]',
              borderClassName,
            )}
          />
        </MovingBorder>
      </div>

      <div
        className={cn(
          'relative bg-card/90 border border-border backdrop-blur-xl text-foreground flex items-center justify-center w-full h-full text-sm antialiased transition-colors duration-300 group-hover/moving-border:border-primary/30',
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x,
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y,
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'inline-block',
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
