'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

type Meteor = {
  left: string;
  delay: string;
  duration: string;
};

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: number }).map(() => ({
      left: Math.floor(Math.random() * 800 - 400) + 'px',
      delay: Math.random() * (0.8 - 0.2) + 0.2 + 's',
      duration: Math.floor(Math.random() * (10 - 2) + 2) + 's',
    }));

    setMeteors(generated);
  }, [number]);

  return (
    <>
      {meteors.map((m, idx) => (
        <span
          key={`meteor-${idx}`}
          className={cn(
            'animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]',
            "before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
            className
          )}
          style={{
            top: 0,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </>
  );
};
