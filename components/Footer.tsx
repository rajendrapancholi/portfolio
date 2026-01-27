'use client';
import { useMotionValue, useMotionTemplate, motion } from 'motion/react';
import { FaLocationArrow } from 'react-icons/fa6';
import { socialMedia } from '@/data';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Footer = () => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  // Tracks mouse for the footer's background glow
  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  let currentYear = new Date().getFullYear();
  return (
    <footer
      className="w-full relative pt-24 pb-12 bg-slate-950 overflow-hidden group/footer border-white/10"
      id="contact"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Background Radial Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover/footer:opacity-100 transition duration-500"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              500px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="flex flex-col items-center relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl text-center font-extrabold lg:max-w-[55vw] leading-tight tracking-tight text-white">
          Full-stack engineering isn&apos;t just about code—it&apos;s the{' '}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-emerald-400 drop-shadow-sm">
            ENGINE
          </span>{' '}
          of digital innovation.
        </h1>
        <p className="text-slate-400 md:mt-8 my-6 text-center max-w-md md:text-lg">
          From real-time Socket systems to AI-powered interactions, let&apos;s build your next big project together in {currentYear}.
        </p>

        <a
          href="mailto:rpancholi522@gmail.com"
          className="group relative inline-flex h-12 active:scale-95 transition-all duration-200"
        >
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          <div className="relative overflow-hidden rounded-full p-[1.5px] w-full h-full">
            <span className="absolute inset-[-1000%] animate-[shimmer_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#06b6d4_0%,#3b82f6_50%,#06b6d4_100%)]" />
            <div className="relative h-full w-full flex items-center justify-center rounded-full bg-slate-950 px-7 py-1 backdrop-blur-3xl transition-colors duration-300 group-hover:bg-slate-900">
              <span className="text-sm font-medium text-white transition-colors group-hover:text-cyan-50">
                Get in Touch
              </span>
              <div className="relative ml-2 text-cyan-400 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:scale-110">
                <FaLocationArrow />
                <div className="absolute inset-0 bg-cyan-400 blur-sm opacity-0 group-hover:opacity-50 transition-opacity" />
              </div>
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>
          </div>
        </a>
      </div>

      <div className="flex mt-20 md:flex-row flex-col justify-between items-center gap-6 border-t border-white/10 px-10 pt-8 mx-4 md:mx-10 relative z-10">
        <div className="flex flex-col md:items-start items-center">
          <p className="md:text-base text-sm font-medium text-slate-300">
            &copy; {currentYear} Rajendra Pancholi
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
            Engineering Fast Experiences
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socialMedia.map((info) => (
            <Link
              key={info.id}
              href={info.link}
              target='_blank'
              className="w-12 h-12 flex justify-center items-center backdrop-blur-xl saturate-200 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-600/10 hover:border-blue-500/50 hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <Image
                src={info.img}
                alt={(info.id).toString()}
                width={22}
                height={22}
                className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all"
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
