import React from "react";
import { Industry } from "../types";
import { ArrowRight, Layers } from "lucide-react";
import { IndustryIcon } from "./IndustryIcon";

interface NicheCardProps {
  industry: Industry;
  onSelect: () => void;
}

export const NicheCard: React.FC<NicheCardProps> = ({ industry, onSelect }) => {
  return (
    <div
      id={`niche-card-${industry.id}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Select ${industry.name} niche, which has ${industry.builds.length} automation ${industry.builds.length === 1 ? "build" : "builds"}`}
      className="group glass-card hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col gap-5 cursor-pointer text-left shadow-md hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/2 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center bg-indigo-500/8 dark:bg-zinc-900/60 rounded-2xl border border-neutral-200/70 dark:border-zinc-800/80 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/12 transition-all duration-300 shadow-inner">
          <IndustryIcon id={industry.id} className="w-6.5 h-6.5 text-indigo-650 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-350" />
        </div>
        <div>
          <h3 className="font-heading font-extrabold text-lg text-neutral-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight leading-snug">
            {industry.name}
          </h3>
          <span className="text-[9px] text-indigo-605 dark:text-indigo-400 font-black tracking-widest uppercase mt-1 inline-block font-mono">
            {industry.segment}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 flex-grow">
        {industry.keywords.slice(0, 3).map((kw) => (
          <span
            key={kw}
            className="text-xs px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-zinc-900/60 text-neutral-700 dark:text-zinc-300 border border-neutral-200/70 dark:border-zinc-800/60 font-medium"
          >
            {kw}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-neutral-200/80 dark:border-zinc-800/60 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        <span className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-black text-neutral-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors font-mono">
          <Layers className="w-4 h-4 text-neutral-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          {industry.builds.length} {industry.builds.length === 1 ? "build" : "builds"}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] tracking-widest uppercase font-black opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 font-mono">
            Explore
          </span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};
