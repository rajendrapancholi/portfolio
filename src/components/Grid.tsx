'use client';
import { gridItems } from '@/data';
import { BentoGrid, BentoGridItem } from './ui/BentoGrid';
import { motion } from 'motion/react';
import { revealItemVariants } from './ui/Reveal';

const Grid = () => {
  return (
    <section id="about" className="px-2 md:px-4 w-full">
      <BentoGrid className="w-full">
        {gridItems.map((item, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealItemVariants}
            transition={{ delay: (i % 3) * 0.08 }}
            className={`h-full ${item.className ?? ''}`}
          >
            <BentoGridItem
              id={item.id}
              title={item.title}
              description={item.description}
              img={item.img}
              imgClassName={item.imgClassName}
              titleClassName={item.titleClassName}
              spareImg={item.spareImg}
              className="h-full"
            />
          </motion.div>
        ))}
      </BentoGrid>
    </section>
  );
};

export default Grid;
