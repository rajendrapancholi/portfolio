'use client';
import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'motion/react';
import { cn } from '@/lib/utils/cn';

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(' ');

  useEffect(() => {
    animate(
      'span',
      { opacity: 1 },
      {
        duration: 1.6,
        delay: stagger(0.12),
      },
    );
  }, [animate, words]);

  return (
    <div className={cn('font-bold', className)}>
      <div className="my-3">
        <div className="leading-snug tracking-tight">
          <motion.div ref={scope}>
            {wordsArray.map((word, idx) => (
              <motion.span
                key={word + idx}
                className={`opacity-0 ${
                  idx > 5 ? 'text-primary' : 'text-foreground'
                }`}
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
