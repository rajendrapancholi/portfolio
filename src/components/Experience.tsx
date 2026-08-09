'use client';
import { workExperience } from '@/data';
import { MovingGrid } from './ui/MovingBorders';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Reveal, staggerContainer } from './ui/Reveal';

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const Experience = () => {
  return (
    <section className="mt-20 px-2 md:px-4 w-full">
      <Reveal>
        <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight">
          My <span className="text-primary">work experience</span>
        </h2>
      </Reveal>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full mx-auto mt-10 [&>*:last-child:nth-child(odd)]:sm:col-span-2"
      >
        {workExperience.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-full h-full"
          >
            <MovingGrid
              ComponentName="div"
              duration={Math.floor(Math.random() * 4000) + 6000}
              borderRadius="1.75rem"
              containerClassName="w-full h-full"
              style={{ background: 'var(--color-card)' }}
              className="text-card-foreground border-border/80 shadow-soft hover:shadow-elevated transition-shadow duration-300"
            >
              <div className="flex flex-col p-6 md:p-7 gap-4 w-full h-full">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -3 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="shrink-0 rounded-full ring-1 ring-primary/15 ring-offset-2 ring-offset-card"
                  >
                    <Image
                      src={card.thumbnail}
                      alt={card.title}
                      width={64}
                      height={64}
                      className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-sm rounded-full"
                    />
                  </motion.div>
                  <h3 className="text-start text-lg md:text-xl font-bold tracking-tight leading-snug">
                    {card.title}
                  </h3>
                </div>

                <p className="text-start text-muted-foreground text-sm md:text-[0.95rem] leading-relaxed font-medium max-w-2xl">
                  {card.desc}
                </p>
              </div>
            </MovingGrid>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Experience;
