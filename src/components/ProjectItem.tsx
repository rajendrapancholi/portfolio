'use client';
import Link from 'next/link';
import { FaLocationArrow, FaXmark } from 'react-icons/fa6';
import Image from 'next/image';
import { Project } from '@/lib/models/ProjectModel';
import Button from './ui/Button';
import { Meteors } from './ui/Meteors';
import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export default function ProjectItem({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 150,
    damping: 18,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <button className="absolute top-10 right-10 text-white text-3xl">
            <FaXmark />
          </button>
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl h-[80vh]"
          >
            <Image
              src={project.img}
              alt={project.title}
              fill
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      )}

      <motion.div
        key={project._id}
        className="w-full h-full flex justify-center items-center"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.65,
          delay: (index % 2) * 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformPerspective: 800 }}
          className="group h-full w-full relative"
        >
          <div className="absolute inset-0 h-full w-full bg-linear-to-r from-primary to-brand transform scale-[0.80] rounded-full blur-3xl opacity-60" />
          <div className="relative shadow-xl bg-card border border-border px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
            <div
              onClick={() => setIsOpen(true)}
              className="relative w-full h-48 sm:h-56 overflow-hidden rounded-xl mb-4 cursor-zoom-in"
            >
              <Image
                src={project.img}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
            </div>
            <h1 className="font-bold mt-2 text-xl text-card-foreground mb-4 relative z-50">
              {project.title}
            </h1>
            <p className="font-normal text-base text-muted-foreground mb-4 relative z-50">
              {project.des}
            </p>
            <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center gap-4 relative z-50">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-y-2 max-w-full">
                {project.iconLists.map((icon: any, i: number) => (
                  <div
                    key={i}
                    className="border border-border rounded-full bg-background w-8 h-8 lg:w-10 lg:h-10 flex justify-center items-center shrink-0 shadow-sm"
                    style={{ marginLeft: i === 0 ? 0 : '-0.5rem' }}
                  >
                    <Image
                      src={icon}
                      height={70}
                      width={70}
                      alt="tech icon"
                      className="bg-foreground/10 rounded-full p-0.5"
                    />
                  </div>
                ))}
              </div>

              <Link href={project.link} target="_blank" className="shrink-0">
                <Button
                  title="View live"
                  position="right"
                  icon={<FaLocationArrow />}
                />
              </Link>
            </div>

            <Meteors number={20} />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
