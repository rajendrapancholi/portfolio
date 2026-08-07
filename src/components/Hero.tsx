'use client';
import { FaLocationArrow } from 'react-icons/fa6';
import Button from './ui/Button';
import { Spotlight } from './ui/Spotlights';
import { TextGenerateEffect } from './ui/TextGenerateEffect';
import { TextMoveUp } from './ui/TextMoveUp';
import Link from 'next/link';

const Hero = () => {
  const highlights = [
    'Modern UI with React & Next.js.',
    'Performance optimized web apps.',
    'SEO friendly architectures.',
    'Clean, maintainable code.',
    'Responsive, mobile-first design.',
    'Production ready deployments.',
  ];
  return (
    <div className="min-h-screen p-6 w-full flex flex-col items-center justify-center gap-2">
      <Spotlight
        className=" -top-40 -left-10 md:-left-32 md:-top-20 h-screen w-screen"
        fill="white"
      />
      <Spotlight className="left-3/4 top-28 h-[90vh] w-[80vw]" fill="purple" />
      <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      <h1 className="uppercase text-lg md:text-2xl text-center mb-4">
        Building high-performance web experiences
      </h1>
      <TextGenerateEffect
        className="text-3xl md:text-5xl text-center font-bold md:max-w-[70vw]"
        words="I design and develop fast, scalable, and user-focused web applications."
      />
      <div className="w-full mt-4 flex flex-col items-center text-center">
        <div className="font-bold my-2 text-md md:text-xl">
          What I focus on
        </div>
        <span className='relative w-full flex justify-center'>
          <TextMoveUp text={highlights} />
        </span>
      </div>
      <p className="text-lg md:text-xl text-center">
        Hi, I&apos;m Rajendra, a Full Stack Developer specializing in MERN STACK, based in India.
      </p>
      <span className='pt-6 flex justify-between items-center gap-5'>

        <Link href="#about">
          <Button
            title="Show My Works"
            position="right"
            icon={<FaLocationArrow />}
          />
        </Link>
        <Link href="/blogs">
          <Button
            title="Read blogs"
            position="right"
            icon={<FaLocationArrow />}
          />
        </Link>
      </span>
    </div>
  );
};

export default Hero;
