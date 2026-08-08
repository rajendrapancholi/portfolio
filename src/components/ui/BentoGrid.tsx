'use client';
import { cn } from '@/lib/utils/cn';
import { BackgroundGradientAnimation } from './GradientBg';
import { GlowingStarsBackgroundCard } from './GlowingStars';
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
        'grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-5 lg:gap-7 mx-auto',
        className,
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
  const leftLists = [
    'ReactJS',
    'NextJS',
    'NodeJS',
    'ExpressJS',
    'MongoDB',
    'MySQL',
    'Git',
    'Docker',
  ];
  const rightLists = [
    'TypeScript',
    'JavaScript',
    'TailwindCSS',
    'HTML & CSS',
    'C/C++',
  ];

  return (
    <div
      className={cn(
        'row-span-1 relative overflow-hidden rounded-3xl border border-border/80 group/bento hover:shadow-elevated transition-all duration-300 shadow-input dark:shadow-none justify-between flex flex-col space-y-4 bg-card text-card-foreground hover:border-primary/25',
        className,
      )}
    >
      {id === 2 && (
        <div className="absolute h-full w-full flex justify-center">
          <GlowingStarsBackgroundCard />
        </div>
      )}

      <div className={`${id === 6 && 'flex justify-center'} h-full`}>
        <div className="w-full h-full absolute">
          {img &&
            (img.endsWith('.svg') ? (
              <img
                src={img}
                alt={typeof title === 'string' ? title : 'grid item'}
                className={cn(
                  imgClassName,
                  'object-cover object-center w-full h-full',
                )}
              />
            ) : (
              <Image
                src={img}
                alt={typeof title === 'string' ? title : 'grid item'}
                width={500}
                height={500}
                className={cn(imgClassName, 'object-cover object-center')}
              />
            ))}
        </div>

        <div
          className={`absolute right-0 -bottom-5 ${
            id === 5 && 'w-full opacity-80'
          }`}
        >
          {spareImg && (
            <Image
              src={spareImg}
              alt="decorative"
              width={24}
              height={24}
              className="object-cover object-center w-full h-full"
            />
          )}
        </div>

        {id === 6 && (
          <BackgroundGradientAnimation>
            <div className="absolute z-50 top-0 inset-0 flex items-center justify-center text-main-text font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl" />
          </BackgroundGradientAnimation>
        )}

        <div
          className={cn(
            titleClassName,
            'group-hover/bento:translate-x-1.5 transition duration-300 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-8',
          )}
        >
          <div className="font-sans font-medium md:max-w-36 md:text-xs lg:text-sm text-sm text-muted-foreground z-10">
            {description}
          </div>
          <div className="font-sans text-lg lg:text-2xl xl:text-3xl max-w-96 font-bold z-10 text-foreground tracking-tight mt-1">
            {title}
          </div>

          {id === 3 && (
            <div className="flex gap-1.5 lg:gap-3 w-fit absolute -right-2 lg:right-1 top-0 bottom-0 h-full overflow-hidden">
              <div className="flex flex-col gap-2.5 lg:gap-6 animate-scroll-up py-4 px-1.5">
                {[...leftLists, ...leftLists].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="lg:py-3.5 lg:px-3 py-2 px-2.5 text-xs lg:text-sm opacity-60 lg:opacity-100 rounded-xl text-center bg-muted/80 border border-border min-w-30 lg:min-w-36 transition-all duration-300 hover:border-primary/40 hover:bg-secondary hover:opacity-100 text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 lg:gap-6 animate-scroll-down py-4 px-1.5">
                {[...rightLists, ...rightLists].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="lg:py-3.5 lg:px-3 py-2 px-2.5 text-xs lg:text-sm opacity-60 lg:opacity-100 rounded-xl text-center bg-muted/80 border border-border min-w-30 lg:min-w-36 transition-all duration-300 hover:border-primary/40 hover:bg-secondary hover:opacity-100 text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {id === 6 && <EmailCopySection />}
        </div>
      </div>
    </div>
  );
};
