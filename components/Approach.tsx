import React from 'react';
import { EvervaultCard } from './ui/EvervaultCard';

export const phase = [
  {
    phase: 'Phase-1',
    title: 'Planning & Strategy',
    desc: "We'll collaborate to map out your website's goals, target audience, and key functionalities. We'll discuss things like site structure, navigation, and content requirements.",
  },
  {
    phase: 'Phase-2',
    title: 'Development & Progress Update',
    desc: 'Once we agree on the plan, I cue my lofi playlist and dive into coding. From initial sketches to polished code, I keep you updated every step of the way.',
  },
  {
    phase: 'Phase-3',
    title: 'Development & Launch',
    desc: "This is where the magic happens! Based on the approved design, I'll translate everything into functional code, building your website from the ground up.",
  },
];

const Approach = () => {
  return (
    <div className="py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-center">
        My <span className="text-blue-400">approach</span>
      </h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {phase.map(({ phase, title, desc }) => (
          <div
            key={phase}
            className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto relative h-[30rem] my-3 mt-9 rounded-2xl"
          >
            <EvervaultCard title={title} phase={phase} desc={desc} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Approach;
