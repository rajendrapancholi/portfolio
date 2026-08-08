import React from 'react';
import { EvervaultCard } from './ui/EvervaultCard';
import { phases } from '@/data';

const Approach = () => {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-center tracking-tight">
        My <span className="text-primary">approach</span>
      </h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {phases.map(({ phase, title, desc }) => (
          <div
            key={phase}
            className="flex flex-col items-start w-full max-w-sm mx-auto relative h-112 my-2"
          >
            <EvervaultCard title={title} phase={phase} desc={desc} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Approach;
