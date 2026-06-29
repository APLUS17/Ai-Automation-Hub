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
      className="group bg-white dark:bg-[#121214] border border-neutral-200 dark:border-zinc-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col gap-5 cursor-pointer text-left shadow-sm hover:shadow-indigo-500/5 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center bg-neutral-100 dark:bg-zinc-900/50 rounded-xl border border-neutral-200 dark:border-zinc-700/60 group-hover:border-indigo-500/30 group-hover:bg-neutral-50 dark:group-hover:bg-zinc-900 transition-all">
          <IndustryIcon id={industry.id} className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div>
          <h3 className="font-sans font-bold text-lg text-neutral-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight leading-tight">
            {industry.name}
          </h3>
          <span className="text-[10px] text-neutral-500 dark:text-zinc-400 font-extrabold tracking-widest uppercase mt-1 inline-block">
            {industry.segment}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 flex-grow">
        {industry.keywords.slice(0, 3).map((kw) => (
          <span
            key={kw}
            className="text-xs px-2.5 py-1 rounded-md bg-neutral-50 dark:bg-zinc-900/40 text-neutral-700 dark:text-zinc-200 border border-neutral-200 dark:border-zinc-700/60"
          >
            {kw}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-zinc-700/80 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        <span className="flex items-center gap-1.5 text-xs tracking-wider uppercase font-bold text-neutral-500 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <Layers className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
          {industry.builds.length} {industry.builds.length === 1 ? "build" : "builds"}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-xs tracking-wider uppercase font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            Explore
          </span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
