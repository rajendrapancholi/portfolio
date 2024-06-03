import React from 'react';

const Button = () => {
  return (
    <button className="relative inline-flex h-12 rounded-full overflow-hidden p-[1px] ">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="h-full w-full inline-flex backdrop-blur-3xl cursor-pointer rounded-full text-white bg-black justify-center items-center px-3 py-1 text-sm font-medium">
        Rajendra
      </span>
    </button>
  );
};

export default Button;
