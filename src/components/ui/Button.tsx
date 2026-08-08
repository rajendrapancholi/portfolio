'use client';
import React from 'react';
import { motion } from 'motion/react';

const Button = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
  btnType = 'button',
  disabled,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  btnType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  otherClasses?: string;
}) => {
  return (
    <motion.button
      onClick={handleClick}
      type={btnType}
      disabled={disabled}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="relative inline-flex h-12 min-w-fit md:w-56 overflow-hidden rounded-full p-[1.5px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary group disabled:opacity-50 disabled:pointer-events-none"
    >
      <span
        className="absolute inset-[-1000%] animate-spin-slow
        bg-[conic-gradient(from_90deg_at_50%_50%,var(--color-primary)_0%,var(--color-brand)_25%,var(--color-info)_50%,var(--color-primary)_75%,var(--color-primary)_100%)]
        opacity-70 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Soft outer glow */}
      <span className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

      <span
        className={`relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full
          bg-card/95 backdrop-blur-xl
          px-7 text-sm font-semibold text-foreground gap-2.5
          transition-all duration-300
          group-hover:bg-card
          ${otherClasses}`}
      >
        {position === 'left' && (
          <span className="transition-transform duration-300 group-hover:-translate-x-0.5 text-primary">
            {icon}
          </span>
        )}

        <span className="tracking-[0.12em] uppercase text-[11px] md:text-[12px] font-semibold">
          {title}
        </span>

        {position === 'right' && (
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 text-primary">
            {icon}
          </span>
        )}

        {/* Subtle top highlight — foreground-based so it reads correctly in both themes */}
        <span className="absolute inset-0 rounded-full bg-linear-to-b from-foreground/8 to-transparent pointer-events-none" />
      </span>
    </motion.button>
  );
};

export default Button;
