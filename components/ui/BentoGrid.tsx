'use client';
import { cn } from '@/lib/utils/cn';
import { BackgroundGradientAnimation } from './GradientBg';
import {
  GlowingStarsBackgroundCard,
} from './GlowingStars';
import Image from 'next/image';
import EmailCopySection from './EmailCopySelection';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  id,
  title,
  description,

  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  id: number;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const leftLists = ['ReactJS', 'NextJS', 'NodeJS', 'ExpressJS', 'MongoDB', 'MySQL', 'Git', 'Docker'];
  const rightLists = ['TypeScript', 'JavaScript', 'TailwindCSS', 'HTML & CSS', 'C/C++'];

  return (
    <div
      className={cn(
        'row-span-1 relative overflow-hidden rounded-3xl border border-white/10 group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4',
        className
      )}
      style={{
        background: 'rgb(4,7,29)',
        backgroundColor:
          'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
      }}
    >
      {id === 2 && (
        <div className="absolute h-full w-full flex justify-center">
          <GlowingStarsBackgroundCard />
        </div>
      )}
      {/* add img divs */}
      <div className={`${id === 6 && 'flex justify-center'} h-full`}>
        <div className="w-full h-full absolute">
          {img && (
            <Image
              src={img}
              alt={img}
              width={24}
              height={24}
              className={cn(imgClassName, 'object-cover object-center ')}
            />
          )}
        </div>
        <div
          className={`absolute right-0 -bottom-5 ${id === 5 && 'w-full opacity-80'
            } `}
        >
          {spareImg && (
            <Image
              src={spareImg}
              alt={spareImg}
              width={24}
              height={24}
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>
        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 top-0 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl" />
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            'group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10'
          )}
        >
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>
          <div
            className={`font-sans text-lg lg:text-3xl max-w-96 font-bold z-10`}
          >
            {title}
          </div>

          {/* Tech stack list div */}
          {id === 3 && (
            <div className="flex gap-1 lg:gap-3 w-fit absolute -right-3 lg:right-2 top-0 bottom-0 h-full overflow-hidden">
              {/* Left column - Scrolling Up */}
              <div className="flex flex-col gap-3 lg:gap-8 animate-scroll-up py-4 px-2">
                {[...leftLists, ...leftLists].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E] border border-white/10 min-w-30 lg:min-w-37.5 transition-all duration-300 hover:border-purple-500/50 hover:bg-[#161a3d]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Right column - Scrolling Down */}
              <div className="flex flex-col gap-3 lg:gap-8 animate-scroll-down py-4 px-2">
                {[...rightLists, ...rightLists].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 lg:opacity-100 rounded-lg text-center bg-[#10132E] border border-white/10 min-w-30 lg:min-w-37.5 transition-all duration-300 hover:border-purple-500/50 hover:bg-[#161a3d]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {id === 6 && (<EmailCopySection />
          )}
        </div>
      </div>
    </div>
  );
};
