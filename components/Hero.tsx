import React from 'react';
import Button from './ui/Button';

const Hero = () => {
  return (
    <div className="h-[80vh] pt-4 p-6 w-full bg-black flex flex-col items-center gap-2">
      <h1 className="uppercase text-lg text-center mb-4">
        dynamic web magic with next.js
      </h1>
      <p className="text-2xl text-center font-bold">
        Transforming Concepts into Seamless Experiences
      </p>
      <p className="text-md">
        Hi, I&apos;m Rajendra, a Next.js Developer based in India
      </p>
      <Button />
    </div>
  );
};

export default Hero;
