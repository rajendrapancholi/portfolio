'use client';
import { useMotionValue } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useMotionTemplate, motion } from 'framer-motion';
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
  const [description, setDescription] = useState('');
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        'p-0.5  bg-transparent aspect-square  flex items-center justify-center w-full h-full relative',
        className
      )}
    >
      <div
        onMouseMove={onMouseMove}
        className="group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
      >
        <CardPattern
          mouseX={mouseX}
          mouseY={mouseY}
          title={title}
          desc={desc}
        />
        <div className="group relative h-full w-full z-10 flex items-center justify-center">
          <div className="relative h-44 w-44  rounded-full flex items-center justify-center title-white font-bold title-4xl group-hover:hidden">
            <div
              className="absolute w-full h-full  blur-sm rounded-full"
              style={{
                background: 'rgb(4,7,29)',
                backgroundColor:
                  'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
                borderRadius: '100%',
              }}
            />
            <span className="dark:text-purple-100 text-4xl z-20">{phase}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CardPattern({ mouseX, mouseY, desc, title }: any) {
  let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div className="pointer-events-none">
      {/* <div className="absolute inset-0 rounded-2xl  [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-100" /> */}
      <div className="absolute inset-0 group-hover/card:opacity-100" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 opacity-0  group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
        style={style as any} // cast style
        {...({} as any)}
      />
      <motion.div
        className="absolute inset-0 opacity-0 mix-blend-overlay  group-hover/card:opacity-100"
        style={style as any} // cast style
        {...({} as any)}

      >
        <p className="absolute inset-x-0 text-2xl md:text-3xl dark:text-black h-full font-bold transition duration-500 p-3 flex flex-col justify-center items-center ">
          <span className="text-3xl font-extrabold mb-3">{title}</span>
          {desc}
        </p>
      </motion.div>
    </div>
  );
}
