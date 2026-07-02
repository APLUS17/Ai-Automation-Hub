import { useState, useEffect } from "react";
import { INDUSTRIES } from "./data/industries";
import { NicheCard } from "./components/NicheCard";
import { NicheWorkspace } from "./components/NicheWorkspace";
import { Search, Sun, Moon, Sparkles, Check, Workflow } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SEGMENTS = [
  "All",
  "Healthcare & Care",
  "Home Services",
  "Professional Services",
  "Education & Training",
  "Hospitality, Food & Venue",
  "Property, Facilities & Real Estate",
  "Industrial, Trades & Field Ops",
  "Retail & Consumer Services",
  "Community, Nonprofit & Faith",
  "Cross-Industry Infrastructure"
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>("#pick");
  const [selectedNicheId, setSelectedNicheId] = useState<string | null>(null);
  const [activeBuildIndex, setActiveBuildIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"workflow" | "n8n" | "roast" | "partners" | "outreach">("workflow");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSegment, setSelectedSegment] = useState<string>("All");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash || "#pick";
      const parts = hash.split("/");
      const route = parts[0];

      if (route === "#niche" && parts[1]) {
        const nicheId = parts[1];
        const buildIdx = parts[2] ? parseInt(parts[2], 10) : 0;
        const tabId = (parts[3] as "workflow" | "n8n" | "roast" | "partners" | "outreach") || "workflow";
        const exists = INDUSTRIES.some(ind => ind.id === nicheId);
        if (exists) {
          setCurrentRoute("#niche");
          setSelectedNicheId(nicheId);
          setActiveBuildIndex(buildIdx);
          setActiveTab(tabId);
          return;
        }
      }

      setCurrentRoute("#pick");
      setSelectedNicheId(null);
      setActiveBuildIndex(0);
      setActiveTab("workflow");
    };

    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const handleWorkspaceChange = (buildIdx: number, tabId: "workflow" | "n8n" | "roast" | "partners" | "outreach") => {
    if (selectedNicheId) {
      window.location.hash = `#niche/${selectedNicheId}/${buildIdx}/${tabId}`;
    }
  };

  const handleSelectNiche = (nicheId: string) => {
    window.location.hash = `#niche/${nicheId}/0/workflow`;
  };

  const handleBackToDirectory = () => {
    window.location.hash = "#pick";
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.className = "bg-[#050505] text-zinc-100 min-h-screen transition-colors duration-300";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.className = "bg-neutral-50 text-neutral-900 min-h-screen transition-colors duration-300";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const filteredIndustries = INDUSTRIES.filter(ind => {
    const nameMatches = ind.name.toLowerCase().includes(searchQuery.toLowerCase());
    const keywordMatches = ind.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    const searchMatches = searchQuery === "" || nameMatches || keywordMatches;
    const segmentMatches = selectedSegment === "All" || ind.segment === selectedSegment;
    return searchMatches && segmentMatches;
  });

  const getSegmentCount = (segment: string) => {
    return INDUSTRIES.filter(ind => {
      const nameMatches = ind.name.toLowerCase().includes(searchQuery.toLowerCase());
      const keywordMatches = ind.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase()));
      const searchMatches = searchQuery === "" || nameMatches || keywordMatches;
      const segmentMatches = segment === "All" || ind.segment === segment;
      return searchMatches && segmentMatches;
    }).length;
  };

  const activeIndustry = INDUSTRIES.find(ind => ind.id === selectedNicheId);

  return (
    <div className={`font-sans min-h-screen pb-16 transition-colors duration-300 bg-grid relative ${theme === "dark" ? "dark bg-[#050508] text-zinc-100" : "light bg-slate-50/50 text-neutral-900"}`}>
      {/* Dynamic light glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full pointer-events-none blur-3xl z-0" />
      <div className="absolute top-0 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-violet-500/5 rounded-full pointer-events-none blur-3xl z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6 pb-4">
        <header className="glass-card rounded-2xl px-6 py-4.5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl shadow-indigo-950/5 dark:shadow-black/20">
          <a
            href="#pick"
            onClick={(e) => { e.preventDefault(); handleBackToDirectory(); }}
            className="flex items-center gap-3 font-heading font-black text-lg tracking-tight hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl focus-visible:outline-none p-1"
          >
            <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/30 rounded-xl flex items-center justify-center shadow-inner">
              <Sparkles className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-left leading-none">
              <span className="text-slate-900 dark:text-white font-extrabold text-sm tracking-wider uppercase block font-heading">
                AI Automation Hub
              </span>
              <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block mt-1 uppercase tracking-widest font-mono">
                WAT Framework Operations
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3 md:gap-4 overflow-x-auto py-1 max-w-full scrollbar-hide">
            <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${currentRoute === "#pick" ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-500 dark:text-zinc-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-black transition-all ${
                currentRoute === "#pick"
                  ? "bg-indigo-600/15 dark:bg-indigo-500/10 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10"
                  : currentRoute === "#niche"
                    ? "bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 text-white dark:text-zinc-950"
                    : "border-neutral-300 dark:border-zinc-700"
              }`}>
                {currentRoute === "#niche" ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
              </div>
              <span className="font-heading tracking-wide">Pick Niche</span>
            </div>

            <div className="w-6 h-px bg-neutral-300 dark:bg-zinc-800 flex-shrink-0" />

            <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${currentRoute === "#niche" && activeTab === "roast" ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-500 dark:text-zinc-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-black transition-all ${
                currentRoute === "#niche" && activeTab === "roast"
                  ? "bg-indigo-600/15 dark:bg-indigo-500/10 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10"
                  : currentRoute === "#niche" && ["partners", "outreach"].includes(activeTab)
                    ? "bg-indigo-600 dark:bg-indigo-500 border-indigo-600 dark:border-indigo-500 text-white dark:text-zinc-950"
                    : "border-neutral-300 dark:border-zinc-700"
              }`}>
                {currentRoute === "#niche" && ["partners", "outreach"].includes(activeTab) ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
              </div>
              <span className="font-heading tracking-wide">Market Research</span>
            </div>

            <div className="w-6 h-px bg-neutral-300 dark:bg-zinc-800 flex-shrink-0" />

            <div className={`flex items-center gap-2 text-xs font-bold transition-colors ${currentRoute === "#niche" && activeTab === "outreach" ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-500 dark:text-zinc-400"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-black transition-all ${
                currentRoute === "#niche" && activeTab === "outreach"
                  ? "bg-indigo-600/15 dark:bg-indigo-500/10 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10"
                  : "border-neutral-300 dark:border-zinc-700"
              }`}>
                3
              </div>
              <span className="font-heading tracking-wide">Get Outreach</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* n8n Connected Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/10 rounded-xl shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Workflow className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">n8n Live</span>
            </div>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-neutral-200 hover:border-neutral-300 dark:border-zinc-800/80 dark:hover:border-zinc-700 flex items-center justify-center text-neutral-600 hover:text-neutral-900 dark:text-zinc-300 dark:hover:text-white transition-all cursor-pointer bg-white/40 dark:bg-zinc-900/40 shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none hover:scale-105 active:scale-95"
              aria-label="Toggle visual theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 mt-6">
        <AnimatePresence mode="wait">
          {currentRoute === "#pick" ? (
            <motion.section
              key="directory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <div className="text-center md:text-left mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-none font-heading uppercase">
                  Select <span className="text-indigo-600 dark:text-indigo-400 font-black tracking-wider text-xl md:text-2xl bg-indigo-600/10 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-600/15 dark:border-indigo-500/15 ml-1 inline-block">Target Industry</span>
                </h1>
                <p className="text-neutral-600 dark:text-zinc-400 font-medium text-xs md:text-sm mt-4 tracking-wide">
                  15 industries. 26 n8n workflow builds. Live market research and warm partner discovery powered by Gemini.
                </p>
              </div>

              <div className="relative group">
                <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5.5 h-5.5 text-neutral-400 dark:text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search industries by name or keywords (e.g., 'hvac', 'coaching', 'healthcare', 'chiro')..."
                  className="w-full pl-13 pr-5 py-4 bg-white/60 dark:bg-[#121214]/60 backdrop-blur-md border border-neutral-200 dark:border-zinc-800/80 hover:border-neutral-350 dark:hover:border-zinc-700 focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 dark:placeholder-zinc-500 outline-none text-sm md:text-base transition-all focus:ring-4 focus:ring-indigo-600/10 dark:focus:ring-indigo-500/10 focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-xl shadow-indigo-950/2 dark:shadow-black/10"
                />
              </div>

              <div className="flex flex-wrap gap-2 py-1 select-none">
                {SEGMENTS.map(seg => {
                  const isActive = selectedSegment === seg;
                  const count = getSegmentCount(seg);
                  if (count === 0 && !isActive && seg !== "All") return null;
                  return (
                    <button
                      key={seg}
                      onClick={() => setSelectedSegment(seg)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none hover:scale-102 active:scale-98 ${
                        isActive
                          ? "bg-indigo-600/15 dark:bg-indigo-500/10 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/5 font-extrabold"
                          : "bg-white/40 dark:bg-[#121214]/40 border-neutral-200 dark:border-zinc-800/80 text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800/80"
                      }`}
                    >
                      <span className="font-heading tracking-wide">{seg}</span>
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-indigo-600/25 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black rounded-lg">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredIndustries.map((ind) => (
                  <NicheCard
                    key={ind.id}
                    industry={ind}
                    onSelect={() => handleSelectNiche(ind.id)}
                  />
                ))}

                {filteredIndustries.length === 0 && (
                  <div className="col-span-full py-16 text-center text-neutral-600 dark:text-zinc-300 font-semibold flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 flex items-center justify-center">
                      <Search className="w-5 h-5 text-neutral-400 dark:text-zinc-500" />
                    </div>
                    <span>No industries found matching your search. Please adjust filters.</span>
                  </div>
                )}
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeIndustry ? (
                <NicheWorkspace
                  industry={activeIndustry}
                  activeBuildIndex={activeBuildIndex}
                  activeTab={activeTab}
                  onBack={handleBackToDirectory}
                  onChangeHash={handleWorkspaceChange}
                />
              ) : (
                <div className="py-16 text-center text-neutral-500">
                  Loading workspace assets...
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
