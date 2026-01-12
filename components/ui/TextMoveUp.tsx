'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function TextMoveUp({ text }: { text: string[]; }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const drawTextToCanvas = (value: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${canvas.height * 0.6}px sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(value).width;
    ctx.fillText(value, (canvas.width - textWidth) / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const particles: any[] = [];

    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        const i = (y * canvas.width + x) * 4;
        if (imageData[i + 3] > 0) {
          particles.push({
            x,
            y,
            r: 1,
            color: `rgba(${imageData[i]}, ${imageData[i + 1]}, ${imageData[i + 2]}, ${imageData[i + 3]})`,
          });
        }
      }
    }

    particlesRef.current = particles;
  };

  const animateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setAnimating(true);

    const animate = () => {
      if (!canvasRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.x += Math.random() > 0.5 ? 1 : -1;
        p.y += Math.random() > 0.5 ? 1 : -1;
        p.r -= 0.02;

        if (p.r > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      });

      particlesRef.current = particlesRef.current.filter((p) => p.r > 0);

      if (particlesRef.current.length > 0) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimating(false);
      }
    };

    animate();
  };

  useEffect(() => {
    drawTextToCanvas(text[currentIndex]);

    timeoutRef.current = setTimeout(() => {
      animateParticles();
      setTimeout(() => {
        setCurrentIndex((i) => (i + 1) % text.length);
      }, 600);
    }, 3000);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, text]);

  return (
    <div className="relative h-[50px] w-full flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <AnimatePresence mode="wait">
        {!animating && (
          <motion.span
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <span className="text-blue-400 font-semibold relative z-10 text-center">

              {text[currentIndex]}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
