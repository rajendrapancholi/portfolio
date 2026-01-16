'use client';
import { useMotionValue, useMotionTemplate, motion } from 'framer-motion';
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
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        'p-0.5 bg-transparent aspect-square flex items-center justify-center w-full h-full relative',
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        className="group/card rounded-3xl w-full relative overflow-hidden bg-gray-900 border border-white/[0.1] flex items-center justify-center h-full transition-all duration-500 hover:border-blue-500/50"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          title={title}
          desc={desc}
        />

        {/* Phase Indicator (Hidden on Hover) */}
        <div className="relative z-10 flex items-center justify-center group-hover/card:opacity-0 transition-opacity duration-500">
          <div className="relative h-44 w-44 rounded-full flex items-center justify-center font-bold">
            <div
              className="absolute w-full h-full blur-xl rounded-full opacity-50"
              style={{
                background: 'linear-gradient(90deg, #4ade80 0%, #3b82f6 100%)',
              }}
            />
            <div className="absolute w-full h-full bg-zinc-950 rounded-full border border-white/10" />
            <span className="text-white text-4xl z-20 font-black tracking-tighter">
              {phase}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, desc, title }: any) {
  // Creating a vibrant radial gradient that follows the mouse
  let maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      {/* Background Glow */}
      <div className="absolute inset-0 rounded-3xl [mask-image:linear-gradient(white,transparent)]" />

      {/* Dynamic Hover Gradient Layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 opacity-0 group-hover/card:opacity-20 transition duration-500"
        style={style}
        {...({} as any)}
      />

      {/* Content Revealed on Hover */}
      <motion.div
        {...({} as any)}
        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 backdrop-blur-sm transition duration-500"
        style={style}
      >
        <div className="absolute inset-0 bg-zinc-950/80 p-6 flex flex-col justify-center items-center text-center">
          <span className="text-blue-500 text-3xl font-extrabold mb-4 tracking-tight">
            {title}
          </span>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-[80%]">
            {desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
