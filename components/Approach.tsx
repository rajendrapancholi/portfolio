import React from 'react';
import { EvervaultCard } from './ui/EvervaultCard';
import { phases } from '@/data';

const Approach = () => {
  return (
    <div className="py-20 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center">
        My <span className="text-blue-400">approach</span>
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {phases.map(({ phase, title, desc }) => (
          <div
            key={phase}
            className="flex flex-col items-start md:max-w-sm w-full mx-auto relative h-[30rem] my-3 mt-9 rounded-2xl"
          >
            <EvervaultCard title={title} phase={phase} desc={desc} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Approach;
