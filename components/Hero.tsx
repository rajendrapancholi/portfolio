'use client';
import React from 'react';
import { FaLocationArrow } from 'react-icons/fa6';
import Button from './ui/Button';
import { Spotlight } from './ui/Spotlights';
import { TextGenerateEffect } from './ui/TextGenerateEffect';
import { TextMoveUp } from './ui/TextMoveUp';

const Hero = () => {
  const highlights = [
    'Modern UI with React & Next.js.',
    'Performance-optimized web apps.',
    'SEO-friendly architectures.',
    'Clean, maintainable code.',
    'Responsive, mobile-first design.',
    'Production-ready deployments.',
  ];
  return (
    <div className="h-[80vh] relative overflow-x-clip p-6 w-full flex flex-col items-center justify-center gap-2">
      <div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen w-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>
      <h1 className="uppercase text-lg text-center mb-4">
        Building high-performance web experiences
      </h1>
      <TextGenerateEffect
        className="text-4xl text-center font-bold md:max-w-[70vw]"
        words="I design and develop fast, scalable, and user-focused web applications."
      />
      <div className="w-full my-4 flex flex-col items-center text-center">
        <div className="font-bold my-2 text-md md:text-xl">
          What I focus on
        </div>
        <span className='relative w-full flex justify-center'>
          <TextMoveUp text={highlights} />
        </span>
      </div>
      <p className="text-md my-2">
        Hi, I&apos;m Rajendra, a Full Stack Developer specializing in MERN STACK, based in India.
      </p>
      <a href="#about" className="my-2">
        <Button
          title="Show My Works"
          position="right"
          icon={<FaLocationArrow />}
        />
      </a>
    </div>
  );
};

export default Hero;
