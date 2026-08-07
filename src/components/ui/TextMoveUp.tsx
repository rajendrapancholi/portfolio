'use client';

import { AnimatePresence, motion, MotionProps } from 'motion/react';
import { useEffect, useRef, useState, useCallback } from 'react';

const MotionSpan = motion.span as React.FC<
  MotionProps & React.HTMLAttributes<HTMLSpanElement>
>;

export function TextMoveUp({ text }: { text: string[]; }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const frameRef = useRef<number | null>(null);

  const drawTextToCanvas = useCallback((value: string) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const parentWidth = canvas.parentElement.offsetWidth;
    const parentHeight = canvas.parentElement.offsetHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = parentWidth * dpr;
    canvas.height = parentHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${parentWidth}px`;
    canvas.style.height = `${parentHeight}px`;

    ctx.clearRect(0, 0, parentWidth, parentHeight);

    const isMobile = parentWidth < 640;
    const fontSize = isMobile ? 30 : 56;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    // Wrap text logic
    const words = value.split(' ');
    let line = '';
    const lines = [];
    const maxWidth = parentWidth * 0.9;
    const lineHeight = fontSize * 1.2;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    let startY = parentHeight / 2 - (lines.length * lineHeight) / 2 + lineHeight / 2;
    lines.forEach((l) => {
      ctx.fillText(l.trim(), parentWidth / 2, startY);
      startY += lineHeight;
    });

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const particles: any[] = [];
    const step = isMobile ? 4 : 2; // Mobile par performance boost

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const i = (y * canvas.width + x) * 4;
        if (imageData[i + 3] > 128) {
          particles.push({
            x: x / dpr,
            y: y / dpr,
            originX: x / dpr,
            originY: y / dpr,
            r: isMobile ? 0.8 : 1,
            color: `rgba(255, 255, 255, ${imageData[i + 3] / 255})`,
          });
        }
      }
    }
    particlesRef.current = particles;
  }, []);

  const animateParticles = () => {
    if (particlesRef.current.length === 0) return;

    setAnimating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      let activeParticles = false;
      particlesRef.current.forEach((p) => {
        if (p.r > 0) {
          p.x += (Math.random() - 0.5) * 3;
          p.y += (Math.random() - 0.5) * 3;
          p.r -= 0.015; // Animation speed adjust

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          activeParticles = true;
        }
      });

      if (activeParticles) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimating(false);
        particlesRef.current = []; // Clear array properly
      }
    };
    animate();
  };

  useEffect(() => {
    drawTextToCanvas(text[currentIndex]);

    const animationTimeout = setTimeout(() => {
      animateParticles();

      const nextIndexTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % text.length);
      }, 800);

      return () => clearTimeout(nextIndexTimeout);
    }, 3000);

    const handleResize = () => drawTextToCanvas(text[currentIndex]);
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(animationTimeout);
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [currentIndex, text, drawTextToCanvas]);

  return (
    <div className="relative min-h-25 w-full flex items-center justify-center px-4 ">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20"
      />
      <AnimatePresence mode="wait">
        {!animating && (
          <MotionSpan
            key={currentIndex}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 text-center font-bold text-white text-3xl sm:text-5xl md:text-6xl max-w-full"
          >
            {/* {text[currentIndex]} */}
          </MotionSpan>
        )}
      </AnimatePresence>
    </div >
  );
}
