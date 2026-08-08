'use client';
import { FaLocationArrow } from 'react-icons/fa6';
import { motion } from 'motion/react';
import Button from './ui/Button';
import { Spotlight } from './ui/Spotlights';
import { TextGenerateEffect } from './ui/TextGenerateEffect';
import { TextMoveUp } from './ui/TextMoveUp';
import Link from 'next/link';

const highlights = [
  'Modern UI with React & Next.js',
  'Performance optimized web apps',
  'SEO friendly architectures',
  'Clean, maintainable code',
  'Responsive, mobile-first design',
  'Production ready deployments',
];

const stack = ['Next.js', 'React Native', 'MongoDB', 'TypeScript', 'NextAuth'];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center gap-2 px-4 sm:px-6 py-16 text-foreground overflow-hidden">
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[28%] h-95 w-160 -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute right-[18%] bottom-[18%] h-60 w-[320px] rounded-full bg-brand/8 blur-[90px]" />
      </div>

      <Spotlight
        className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen w-screen"
        fill="white"
      />
      <Spotlight className="left-3/4 top-28 h-[90vh] w-[80vw]" fill="purple" />
      <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.09, delayChildren: 0.05 }}
        className="flex flex-col items-center w-full"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="uppercase tracking-[0.2em] text-[11px] sm:text-xs font-medium text-muted-foreground mb-3"
        >
          Building high-performance web experiences
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <TextGenerateEffect
            className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.15rem] text-center font-bold max-w-4xl leading-[1.15] tracking-tight"
            words="I design and develop fast, scalable, and user-focused web applications."
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-6 flex flex-col items-center text-center"
        >
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide">
            What I focus on
          </p>
          <TextMoveUp text={highlights} />
        </motion.div>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-base md:text-lg text-center text-muted-foreground max-w-2xl leading-relaxed"
        >
          Hi, I&apos;m Rajendra - a Full Stack Developer based in{' '}
          <span className="font-semibold text-foreground">Indore, India</span>,
          building production-grade apps with{' '}
          <span className="font-semibold text-foreground">
            Next.js &amp; TypeScript
          </span>
          .
        </motion.p>

        {/* Tech chips */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-2 mt-4 max-w-md"
        >
          {stack.map((tech) => (
            <span
              key={tech}
              className="font-mono text-xs px-3 py-1 rounded-full border border-border bg-card/50 backdrop-blur-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors duration-300"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <Link href="#about">
            <Button
              title="Show My Work"
              position="right"
              icon={<FaLocationArrow />}
            />
          </Link>
          <Link href="/blogs">
            <Button
              title="Read Blogs"
              position="right"
              icon={<FaLocationArrow />}
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-6 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-px bg-linear-to-b from-muted-foreground to-transparent"
        />
      </motion.div>
    </div>
  );
};

export default Hero;
