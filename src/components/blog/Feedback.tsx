"use client";

import { useState } from "react";
import { DislikeIcon, HateIcon, LoveIcon, OkayIcon } from "./Icon";
import toast from "react-hot-toast";

export default function Feedback() {
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    { label: "Hate it", emoji: <HateIcon />, id: "hate" },
    { label: "Not great", emoji: <DislikeIcon />, id: "poor" },
    { label: "It's okay", emoji: <OkayIcon />, id: "okay" },
    { label: "Love it!", emoji: <LoveIcon />, id: "love" },
  ];

  return (
    <div className="flex justify-center my-8">
      <div
        className="flex items-center gap-4 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300"
        style={{ borderRadius: "30px", height: "48px" }}
      >
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
          Was this helpful?
        </p>

        <div className="flex items-center gap-1">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelected(option.id); toast.custom((t) => (
                  <div
                    className={`${t.visible ? 'animate-in fade-in zoom-in-95' : 'animate-out fade-out zoom-out-95'
                      } max-w-sm w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 p-4`}
                  >
                    <div className="flex-1 w-0 flex items-center">
                      {/* Animated Icon Container */}
                      <div className="shrink-0 flex items-center justify-center size-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                        <span className="text-xl animate-bounce">🚀</span>
                      </div>

                      <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Feedback Received!
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Your input helps us improve. Thanks for being part of the community!
                        </p>
                      </div>
                    </div>

                    {/* Dismiss Button */}
                    <div className="ml-4 shrink-0 flex border-l border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => toast.remove(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-xs font-bold text-blue-600 hover:text-blue-500 focus:outline-none cursor-pointer"
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                ), { duration: 4000 });
              }}
              aria-label={option.label}
              aria-checked={selected === option.id}
              className={`
                flex items-center justify-center size-8 rounded-full transition-all duration-200 text-lg
                hover:bg-blue-100 dark:hover:bg-blue-900/30
                
              `}
            >
              <span className={selected === option.id ? "backdrop-grayscale-75 scale-150 transition-all text-blue-500" : "grayscale opacity-70 hover:opacity-100 hover:grayscale-0 cursor-pointer"}>
                {option.emoji}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
