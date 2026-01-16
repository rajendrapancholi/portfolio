'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
}) => {
  return (
    <motion.button
      {...({} as any)}
      onClick={handleClick}
      // Micro-interactions: Button shrinks slightly when clicked, grows on hover
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-flex h-12 w-full md:w-60 overflow-hidden rounded-xl p-[1.5px] focus:outline-none group"
    >
      {/* 1. The "Aurora" Border: Slower, more vibrant gradient for a premium feel */}
      <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#4F46E5_0%,#06B6D4_25%,#10B981_50%,#06B6D4_75%,#4F46E5_100%)] opacity-80" />

      {/* 2. The Button Body: Using Glassmorphism */}
      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl
             bg-slate-950/95 backdrop-blur-3xl px-7 text-sm font-semibold text-white gap-3 
             transition-all duration-300 group-hover:bg-slate-900/90 ${otherClasses}`}
      >
        {/* Icon Animation: Icon moves slightly on hover */}
        {position === 'left' && (
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            {icon}
          </span>
        )}

        <span className="tracking-wider uppercase text-[12px] md:text-sm">
          {title}
        </span>

        {position === 'right' && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {icon}
          </span>
        )}

        {/* 3. The "Inner Shine": Adds a 3D glass effect at the top */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </span>
    </motion.button>
  );
};

export default Button;
