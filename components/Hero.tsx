import React from 'react';
import { FaLocationArrow } from 'react-icons/fa6';
import Button from './ui/Button';
import { Spotlight } from './ui/Spotlights';
import { TextGenerateEffect } from './ui/TextGenerateEffect';

const Hero = () => {
  return (
    <div className="h-[80vh] overflow-x-clip p-6 w-full flex flex-col items-center justify-center gap-2 relative">
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
        dynamic web magic with next.js
      </h1>
      <TextGenerateEffect
        className="text-4xl text-center font-bold md:max-w-[70vw]"
        words="Turning your Dynamic data into Lightning-fast, SEO-friendly pages with NextJS."
      />
      <p className="text-md my-2">
        Hi, I&apos;m Rajendra, a Next.js Developer based in India
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
