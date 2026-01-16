import { workExperience } from '@/data';
import { MovingGrid } from './ui/MovingBorders';
import Image from 'next/image';

const Experience = () => {
  const col = workExperience.length;
  return (
    <div className="py-20 w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-center">
        My <span className="text-blue-300">work experience</span>
      </h1>

      <div className={`w-full p-4 mt-12 ${col > 1 ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10" : "flex"} justify-items-center`}>
        {workExperience.map((card) => (
          <MovingGrid
            key={card.id}
            ComponentName="span"
            duration={Math.floor(Math.random() * 10000) + 10000}
            borderRadius="1.75rem"
            style={{
              background: 'rgb(4,7,29)',
              backgroundColor:
                'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
              borderRadius: `calc(1.75rem* 0.96)`,
            }}
            className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
          >
            <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
              <Image
                src={card.thumbnail}
                alt={card.thumbnail}
                width={24}
                height={24}
                className="lg:w-32 md:w-20 w-16"
              />
              <div className="lg:ms-5">
                <h1 className="text-start text-xl md:text-2xl font-bold">
                  {card.title}
                </h1>
                <p className="text-start text-white-100 mt-3 font-semibold">
                  {card.desc}
                </p>
              </div>
            </div>
          </MovingGrid>
        ))}
      </div>
    </div>
  );
};

export default Experience;
