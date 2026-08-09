'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import { EvervaultCard } from './ui/EvervaultCard';
import { phases } from '@/data';
import { Reveal } from './ui/Reveal';

const Approach = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="mt-20 px-2 md:px-4 w-full">
      <Reveal>
        <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight">
          My <span className="text-primary">approach</span>
        </h2>
      </Reveal>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } },
        }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
      >
        {phases.map(({ phase, title, desc }, i) => (
          <motion.div
            key={phase}
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.9, rotate: -2 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="flex flex-col items-start w-full max-w-sm mx-auto relative h-112 my-2"
          >
            <EvervaultCard
              title={title}
              phase={phase}
              desc={desc}
              isRevealed={activeIndex === i}
              onToggle={() => setActiveIndex((prev) => (prev === i ? null : i))}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Approach;
