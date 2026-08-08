import { workExperience } from '@/data';
import { MovingGrid } from './ui/MovingBorders';
import Image from 'next/image';

const Experience = () => {
  const col = workExperience.length;

  return (
    <section className="py-20 w-full">
      <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight">
        My <span className="text-primary">work experience</span>
      </h2>

      <div
        className={`w-full p-4 mt-14 ${
          col > 1
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'
            : 'flex'
        } justify-items-center`}
      >
        {workExperience.map((card) => (
          <MovingGrid
            key={card.id}
            ComponentName="span"
            duration={Math.floor(Math.random() * 10000) + 10000}
            borderRadius="1.75rem"
            style={{
              background: 'var(--color-card)',
              borderRadius: `calc(1.75rem * 0.96)`,
            }}
            className="flex-1 text-card-foreground border-border/80"
          >
            <div className="flex lg:flex-row flex-col lg:items-center p-4 py-6 md:p-5 lg:p-7 gap-3">
              <Image
                src={card.thumbnail}
                alt={card.title}
                width={80}
                height={80}
                className="lg:w-24 md:w-18 w-14 object-contain"
              />
              <div className="lg:ms-3">
                <h3 className="text-start text-lg md:text-xl font-bold tracking-tight">
                  {card.title}
                </h3>
                <p className="text-start text-muted-foreground mt-2 text-sm md:text-[0.95rem] leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
            </div>
          </MovingGrid>
        ))}
      </div>
    </section>
  );
};

export default Experience;
