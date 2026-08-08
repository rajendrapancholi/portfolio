'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const constraintsRef = useRef(null);
  const isDragging = useRef(false);

  const scalePoint = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleAction = () => {
    if (!isDragging.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div
        ref={constraintsRef}
        className="fixed inset-0 pointer-events-none z-50"
      />

      <AnimatePresence>
        {isVisible && (
          <motion.button
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onDragStart={() => (isDragging.current = true)}
            onDragEnd={() => {
              setTimeout(() => {
                isDragging.current = false;
              }, 100);
            }}
            onClick={handleAction}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center
                       size-14 rounded-full
                       bg-card/80 backdrop-blur-xl
                       border border-border
                       text-foreground
                       shadow-lg shadow-primary/10
                       hover:border-primary/40 hover:shadow-primary/20
                       overflow-visible transition-colors duration-300
                       touch-none cursor-grab active:cursor-grabbing"
            aria-label="Scroll to top"
          >
            {/* Progress ring */}
            <svg
              className="absolute inset-0 size-full -rotate-90 pointer-events-none"
              viewBox="0 0 100 100"
            >
              {/* Track */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                className="stroke-muted-foreground/20"
                strokeWidth="5"
              />
              {/* Progress */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                className="stroke-primary"
                strokeWidth="5"
                strokeLinecap="round"
                style={{ pathLength: scalePoint }}
              />
            </svg>

            <ArrowUp
              size={22}
              className="relative z-10 pointer-events-none text-primary"
              strokeWidth={2.5}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
