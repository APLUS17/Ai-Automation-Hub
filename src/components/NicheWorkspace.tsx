import React, { useState } from "react";
import { Industry } from "../types";
import {
  computeScores,
  getFindingsMarket,
  getFindingsDifferentiation,
  getFindingsExecution,
  getValueLadder
} from "../utils/scoring";
import {
  ArrowLeft,
  ListOrdered,
  Workflow,
  Flame,
  Handshake,
  Send,
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ShieldCheck,
  Cpu,
  DollarSign,
  Info,
  X,
  Sparkles,
  Loader2,
  MessageSquare,
  Search,
  MapPin,
  ExternalLink,
  Globe,
  ChevronRight,
  Circle,
  Bot,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { IndustryIcon } from "./IndustryIcon";

type TabId = "workflow" | "n8n" | "roast" | "partners" | "outreach";

interface NicheWorkspaceProps {
  industry: Industry;
  activeBuildIndex: number;
  activeTab: TabId;
  onBack: () => void;
  onChangeHash: (buildIdx: number, tabId: TabId) => void;
}

// Map n8n node type to a short display label
function nodeTypeLabel(type: string): string {
  const map: Record<string, string> = {
    "n8n-nodes-base.gmailTrigger": "Gmail Trigger",
    "n8n-nodes-base.gmail": "Gmail",
    "n8n-nodes-base.googleSheetsTrigger": "Sheets Trigger",
    "n8n-nodes-base.googleSheets": "Google Sheets",
    "n8n-nodes-base.googleDocs": "Google Docs",
    "n8n-nodes-base.scheduleTrigger": "Schedule",
    "n8n-nodes-base.webhook": "Webhook",
    "n8n-nodes-base.httpRequest": "HTTP Request",
    "n8n-nodes-base.code": "Code (JS)",
    "n8n-nodes-base.if": "IF Branch",
    "n8n-nodes-base.set": "Set Data",
    "n8n-nodes-base.wait": "Wait",
    "n8n-nodes-base.splitInBatches": "Split Batches",
    "n8n-nodes-base.merge": "Merge",
    "n8n-nodes-base.slack": "Slack",
    "n8n-nodes-base.twilio": "Twilio SMS",
    "n8n-nodes-base.airtable": "Airtable",
    "n8n-nodes-base.custom": "Custom Node",
    "@n8n/n8n-nodes-langchain.lmChatOpenAi": "LLM (OpenRouter)",
  };
  return map[type] || type.split(".").pop() || type;
}

function nodeTypeColor(type: string): string {
  if (type.includes("gmail") || type.includes("Gmail")) return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/40";
  if (type.includes("sheets") || type.includes("Sheets") || type.includes("docs") || type.includes("Docs")) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40";
  if (type.includes("schedule") || type.includes("Schedule")) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40";
  if (type.includes("webhook") || type.includes("Webhook")) return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/40";
  if (type.includes("httpRequest") || type.includes("http")) return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/40";
  if (type.includes("if") || type.includes("code") || type.includes("set") || type.includes("split")) return "bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700";
  if (type.includes("twilio") || type.includes("slack")) return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800/40";
  if (type.includes("airtable")) return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800/40";
  return "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700";
}

export const NicheWorkspace: React.FC<NicheWorkspaceProps> = ({
  industry,
  activeBuildIndex,
  activeTab,
  onBack,
  onChangeHash
}) => {
  const build = industry.builds[activeBuildIndex] || industry.builds[0];
  const scores = computeScores(industry, build);

  // Market Research states
  const [marketQuery, setMarketQuery] = useState("");
  const [isSearchingMarket, setIsSearchingMarket] = useState(false);
  const [marketResearchResult, setMarketResearchResult] = useState("");
  const [marketGroundingMetadata, setMarketGroundingMetadata] = useState<any>(null);
  const [marketSearchError, setMarketSearchError] = useState("");

  // Warm Partners states
  const [locationName, setLocationName] = useState("Cincinnati, OH");
  const [activePartnerIndex, setActivePartnerIndex] = useState<number | null>(null);
  const [isSearchingMaps, setIsSearchingMaps] = useState(false);
  const [mapsGroundingResults, setMapsGroundingResults] = useState<Record<number, { text: string; links: any[] }>>({});
  const [mapsSearchError, setMapsSearchError] = useState("");

  // n8n Build tab states
  const [testPlanChecked, setTestPlanChecked] = useState<Record<number, boolean>>({});
  const [aiTasksExpanded, setAiTasksExpanded] = useState(true);

  // Roast card collapse states
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({
    market: false, diff: false, exec: false, monetization: false
  });

  // Outreach states
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    operating: false, noSystem: false, personalized: false, decisionMaker: false, reminderSet: false
  });

  // AI Assistant states
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [nuanceInput, setNuanceInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "model"; text: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleMarketResearchSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = marketQuery.trim();
    if (!trimmed) return;
    setIsSearchingMarket(true);
    setMarketSearchError("");
    setMarketResearchResult("");
    setMarketGroundingMetadata(null);
    try {
      const response = await fetch("/api/market-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, industry: industry.segment, nicheName: industry.name })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to search market research.");
      }
      const data = await response.json();
      setMarketResearchResult(data.text);
      setMarketGroundingMetadata(data.groundingMetadata);
    } catch (err: any) {
      setMarketSearchError(err.message || "Failed to conduct market research.");
    } finally {
      setIsSearchingMarket(false);
    }
  };

  const handleMapsGrounding = async (partnerName: string, idx: number) => {
    setIsSearchingMaps(true);
    setMapsSearchError("");
    setActivePartnerIndex(idx);
    try {
      const response = await fetch("/api/maps-grounding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerType: partnerName, locationName, lat: null, lng: null })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch partner recommendations.");
      }
      const data = await response.json();
      const chunks = data.groundingMetadata?.groundingChunks || [];
      const links = chunks.map((chunk: any) => {
        if (chunk.maps) return { uri: chunk.maps.uri, title: chunk.maps.title || "View on Google Maps" };
        if (chunk.web) return { uri: chunk.web.uri, title: chunk.web.title || "Web Link" };
        return null;
      }).filter(Boolean);
      setMapsGroundingResults(prev => ({ ...prev, [idx]: { text: data.text, links } }));
    } catch (err: any) {
      setMapsSearchError(err.message || "Failed to ground partners using Google Maps.");
    } finally {
      setIsSearchingMaps(false);
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = nuanceInput.trim();
    if (!trimmedInput || isGenerating) return;
    const updatedHistory = [...chatHistory, { role: "user" as const, text: trimmedInput }];
    setChatHistory(updatedHistory);
    setNuanceInput("");
    setIsGenerating(true);
    setAiError(null);
    try {
      const response = await fetch("/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: industry.segment,
          nicheName: industry.name,
          buildLabel: build.label,
          steps: build.steps,
          nuance: trimmedInput,
          history: chatHistory
        })
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to customize strategy.");
      }
      const data = await response.json();
      setChatHistory(prev => [...prev, { role: "model", text: data.text }]);
    } catch (err: any) {
      setAiError(err.message || "Failed to customize workflow.");
      setChatHistory(updatedHistory.slice(0, -1));
      setNuanceInput(trimmedInput);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleCollapsed = (key: string) => setCollapsedCards(prev => ({ ...prev, [key]: !prev[key] }));

  const handleCopy = (textId: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedScript(textId);
      setTimeout(() => setCopiedScript(null), 2000);
    });
  };

  // Parse test plan steps from multiline string
  const testPlanSteps = build.testPlan
    ? build.testPlan.split("\n").filter(line => line.trim().match(/^\d+\./))
    : [];

  // Outreach script strings
  const firstNodeName = build.nodes[0]?.name || "";
  const lastNodeName = build.nodes[build.nodes.length - 1]?.name || "";

  const problemText = firstNodeName
    .replace(/^Webhook Trigger.*$/i, `monitoring incoming ${industry.name.toLowerCase()} requests`)
    .replace(/^Schedule Trigger.*$/i, `scheduling ${industry.name.toLowerCase()} tasks`)
    .replace(/^Gmail Trigger.*$/i, "processing incoming emails");

  const outcomeText = lastNodeName
    .replace(/^Google Sheets.*$/i, "syncing data to your tracking sheet")
    .replace(/^Gmail.*$/i, "sending a personalized follow-up email")
    .replace(/^Twilio.*$/i, "delivering an instant SMS notification")
    .replace(/^Slack.*$/i, "notifying your team via Slack");

  const emailSubject = `Question about automation for ${industry.name}`;

  const scriptAContent = `Subject: ${emailSubject}

Hi [First Name],

I was looking at how [Business Name] handles ${problemText.toLowerCase()}.

Most ${industry.name.toLowerCase()} businesses lose time and revenue because this process is done manually. I built a workflow called "${build.label}" that automates the entire sequence through to ${outcomeText.toLowerCase()} — without adding tasks to your team.

This typically improves turnaround speed by 15–30%. Do you have 10 minutes this week for a quick screen-share?

Best,
[Your Name]`;

  const scriptBContent = `Hi [First Name], noticed you run [Business Name].

Most ${industry.name.toLowerCase()} firms lose consistent revenue because they're manually ${problemText.toLowerCase()}.

I built an automated system specifically for this — it handles everything through ${outcomeText.toLowerCase()} to capture more opportunities. Would you be open to a 2-minute video on how it works?`;

  const scriptCContent = `"Hi, it's [Your Name]. I built an automated system for ${industry.name.toLowerCase()} businesses focused on ${build.label.toLowerCase()}. It helps save your team hours each week. Do you have 10 minutes for a quick call this week?"`;

  // Verdict badge
  let verdictLabel = "Pivot";
  let verdictClass = "bg-red-500/15 text-red-600 border-red-500/20 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30";
  let progressClass = "bg-red-500";
  if (scores.overall >= 32) {
    verdictLabel = "Ship It";
    verdictClass = "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30";
    progressClass = "bg-emerald-500";
  } else if (scores.overall >= 22) {
    verdictLabel = "Needs Work";
    verdictClass = "bg-amber-500/15 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30";
    progressClass = "bg-amber-500";
  }

  const tabs = [
    { id: "workflow" as TabId, label: "Workflow Steps", icon: ListOrdered },
    { id: "n8n" as TabId, label: "n8n Build", icon: Workflow },
    { id: "roast" as TabId, label: "Market Research", icon: Search },
    { id: "partners" as TabId, label: "Warm Partners", icon: Handshake },
    { id: "outreach" as TabId, label: "Outreach Kit", icon: Send },
  ];

  const mdComponents = {
    p: ({ node, ...props }: any) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
    h1: ({ node, ...props }: any) => <h1 className="text-sm font-black mt-4 mb-2 text-neutral-950 dark:text-white tracking-tight" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-xs font-black mt-3 mb-1.5 text-neutral-900 dark:text-zinc-100 uppercase tracking-wider" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-xs font-bold mt-2.5 mb-1 text-neutral-850 dark:text-zinc-200" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-neutral-700 dark:text-zinc-300" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-neutral-700 dark:text-zinc-300" {...props} />,
    li: ({ node, ...props }: any) => <li className="text-xs md:text-sm leading-relaxed" {...props} />,
    code: ({ node, children, ...props }: any) => (
      <code className="bg-neutral-200 dark:bg-black/50 text-indigo-600 dark:text-indigo-300 px-1 py-0.5 rounded font-mono text-xs">{children}</code>
    ),
    pre: ({ node, ...props }: any) => <pre className="bg-neutral-100 dark:bg-black/40 p-3 rounded-lg overflow-x-auto font-mono text-xs mb-3 border border-neutral-200 dark:border-zinc-800" {...props} />
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="glass-card rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-indigo-950/2 dark:shadow-black/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center bg-indigo-50/5 dark:bg-zinc-900/60 rounded-2xl border border-neutral-200/50 dark:border-zinc-800/80 shadow-inner">
            <IndustryIcon id={industry.id} className="w-6.5 h-6.5 text-indigo-650 dark:text-indigo-400" />
          </div>
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-heading font-extrabold text-neutral-900 dark:text-white tracking-tight leading-none uppercase">
              {industry.name}
            </h2>
            <p className="text-[9px] text-indigo-605 dark:text-indigo-400 font-black tracking-widest uppercase mt-1.5 font-mono">
              {industry.segment}
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="btn-secondary self-start md:self-auto flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none hover:scale-103 active:scale-97 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-heading font-bold">Back to Directory</span>
        </button>
      </div>

      {/* Build Switcher */}
      {industry.builds.length > 1 && (
        <div className="bg-neutral-100/50 dark:bg-zinc-950/50 p-1.5 rounded-2xl border border-neutral-200/60 dark:border-zinc-800/80 flex flex-col md:flex-row gap-1.5 shadow-inner">
          {industry.builds.map((b, idx) => (
            <button
              key={idx}
              onClick={() => onChangeHash(idx, activeTab)}
              className={`flex-1 text-center py-2.5 px-4 text-xs md:text-sm font-bold rounded-xl transition-all truncate cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none hover:scale-101 active:scale-99 ${
                idx === activeBuildIndex
                  ? "bg-white border border-neutral-200 text-indigo-650 shadow-md dark:bg-zinc-900/60 dark:border-zinc-850 dark:text-indigo-400 font-extrabold"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-zinc-405 dark:hover:text-white"
              }`}
            >
              <span className="font-heading">Build {idx + 1}: {b.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tab Nav */}
      <nav className="flex border-b border-neutral-200/80 dark:border-zinc-805 gap-1.5 md:gap-3 overflow-x-auto scrollbar-hide select-none pt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeHash(activeBuildIndex, tab.id)}
              className={`flex items-center gap-2 pb-3.5 pt-1.5 text-xs md:text-sm font-bold relative whitespace-nowrap transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-xl px-2.5 md:px-4 hover:scale-102 active:scale-98 ${
                isActive
                  ? "text-indigo-655 dark:text-indigo-400"
                  : "text-neutral-500 hover:text-neutral-950 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-heading tracking-wide">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-600 dark:bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/20"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      <div className="min-h-[300px]">

        {/* ── WORKFLOW STEPS TAB ── */}
        {activeTab === "workflow" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 shadow-xl shadow-indigo-950/2 dark:shadow-black/10"
          >
            <div className="mb-6">
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/10">
                Plain-Language Sequence
              </span>
              <h3 className="text-base md:text-lg font-heading font-black text-slate-900 dark:text-white mt-3.5">
                {build.label}
              </h3>
              <p className="text-xs text-neutral-505 dark:text-zinc-405 mt-1.5 tracking-wide">
                What this workflow does, step by step — no jargon.
              </p>
            </div>
            <ol className="flex flex-col gap-4">
              {build.steps.map((step, idx) => (
                <li key={idx} className="flex gap-4.5 items-start p-4.5 bg-white/40 dark:bg-zinc-900/30 hover:bg-white/80 dark:hover:bg-zinc-900/60 border border-neutral-200/50 dark:border-zinc-800/60 transition-all rounded-2xl shadow-sm hover:shadow-md">
                  <span className="text-xs font-black text-indigo-605 bg-indigo-50/60 dark:text-indigo-400 dark:bg-indigo-950/40 w-7.5 h-7.5 flex items-center justify-center rounded-xl flex-shrink-0 border border-indigo-200/40 dark:border-indigo-500/15 font-mono shadow-inner">
                    {idx + 1}
                  </span>
                  <span className="text-neutral-750 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-medium text-left pt-0.5">
                    {step.t}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>
        )}

        {/* ── N8N BUILD TAB ── */}
        {activeTab === "n8n" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Pipeline Header */}
            <div className="glass-card rounded-2xl p-5 md:p-6 shadow-xl shadow-indigo-950/2 dark:shadow-black/10">
              <div className="mb-4">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1.5 rounded-xl border border-indigo-500/10 font-mono">
                  n8n Node Pipeline
                </span>
                <h3 className="text-base md:text-lg font-heading font-black text-slate-900 dark:text-white mt-3.5">
                  {build.label}
                </h3>
              </div>

              {/* Visual pipeline flow */}
              <div className="overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-start gap-0 min-w-max py-2 px-1">
                  {build.nodes.map((node, idx) => (
                    <div key={idx} className="flex items-center gap-0">
                      <div className="flex flex-col items-center gap-2">
                        {/* Node number badge */}
                        <span className="text-[9px] font-black text-neutral-450 dark:text-zinc-500 font-mono">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        {/* Node box */}
                        <div className="w-32 bg-white/50 dark:bg-zinc-900/60 border border-neutral-200/80 dark:border-zinc-800 rounded-2xl p-3 flex flex-col gap-2 shadow-sm hover:border-indigo-400/60 dark:hover:border-indigo-500/50 hover:shadow-md transition-all duration-300 group/node">
                          <div className="w-full flex items-center justify-center">
                            <Circle className="w-2.5 h-2.5 text-indigo-500 fill-indigo-500 group-hover/node:scale-125 transition-transform" />
                          </div>
                          <p className="text-[10.5px] font-bold text-neutral-805 dark:text-zinc-205 text-center leading-tight line-clamp-2 min-h-[28px] flex items-center justify-center font-heading">
                            {node.name}
                          </p>
                          <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-xl border text-center leading-none font-mono ${nodeTypeColor(node.type)}`}>
                            {nodeTypeLabel(node.type)}
                          </span>
                        </div>
                      </div>
                      {/* Arrow connector */}
                      {idx < build.nodes.length - 1 && (
                        <div className="flex items-center self-center mt-6 select-none">
                          <div className="w-5 h-px bg-neutral-300 dark:bg-zinc-700" />
                          <ChevronRight className="w-3.5 h-3.5 text-neutral-450 dark:text-zinc-650 -ml-1.5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Numbered node list */}
            <div className="glass-card rounded-2xl p-5 md:p-6 shadow-xl shadow-indigo-950/2 dark:shadow-black/10">
              <h4 className="text-[10.5px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-400 mb-4 font-mono">
                Node Sequence — {build.nodes.length} Nodes
              </h4>
              <ol className="flex flex-col gap-2.5">
                {build.nodes.map((node, idx) => (
                  <li key={idx} className="flex items-center gap-3.5 p-3.5 bg-white/40 dark:bg-zinc-900/30 border border-neutral-200/50 dark:border-zinc-800/60 rounded-2xl shadow-sm">
                    <span className="text-xs font-black text-indigo-605 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/40 w-6.5 h-6.5 flex items-center justify-center rounded-xl flex-shrink-0 border border-indigo-200/40 dark:border-indigo-500/15 tabular-nums font-mono shadow-inner">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-neutral-805 dark:text-zinc-200 flex-1 text-left font-heading">
                      {node.name}
                    </span>
                    <span className={`text-[9px] font-black tracking-wider uppercase px-2.5 py-1.5 rounded-xl border flex-shrink-0 font-mono ${nodeTypeColor(node.type)}`}>
                      {nodeTypeLabel(node.type)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* AI Tasks */}
            {build.aiTasks && build.aiTasks !== "None specified." && (
              <div className="glass-card rounded-2xl shadow-xl shadow-indigo-950/2 dark:shadow-black/10 overflow-hidden">
                <button
                  onClick={() => setAiTasksExpanded(p => !p)}
                  className="w-full p-5 flex items-center justify-between cursor-pointer hover:bg-white/40 dark:hover:bg-zinc-900/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center shadow-inner">
                      <Bot className="w-4.5 h-4.5 text-indigo-650 dark:text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 dark:text-zinc-400 block font-mono">Claude AI Tasks</span>
                      <span className="text-xs font-bold text-neutral-850 dark:text-zinc-250 font-heading">Steps where Claude does the heavy lifting</span>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-250 ${aiTasksExpanded ? "" : "-rotate-90"}`} />
                </button>
                <AnimatePresence initial={false}>
                  {aiTasksExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-neutral-200/60 dark:border-zinc-800"
                    >
                      <div className="p-5 bg-indigo-50/20 dark:bg-indigo-950/5 flex flex-col gap-3">
                        {build.aiTasks.split("\n").filter(l => l.trim()).map((line, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-neutral-700 dark:text-zinc-300 leading-relaxed font-medium">
                              {line.replace(/^-\s*/, "")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Test Plan Checklist */}
            {testPlanSteps.length > 0 && (
              <div className="glass-card rounded-2xl p-5 md:p-6 shadow-xl shadow-indigo-950/2 dark:shadow-black/10">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center shadow-inner">
                    <ClipboardList className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 dark:text-zinc-400 block font-mono">Test Plan</span>
                    <span className="text-xs font-bold text-neutral-850 dark:text-zinc-250 font-heading">
                      {Object.values(testPlanChecked).filter(Boolean).length}/{testPlanSteps.length} steps verified
                    </span>
                  </div>
                  {Object.values(testPlanChecked).filter(Boolean).length === testPlanSteps.length && testPlanSteps.length > 0 && (
                    <span className="ml-auto text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-550/30 rounded-xl font-mono shadow-sm">
                      ✓ All Verified
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-100 dark:bg-zinc-900/60 h-1.5 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(Object.values(testPlanChecked).filter(Boolean).length / testPlanSteps.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <ol className="flex flex-col gap-2.5">
                  {testPlanSteps.map((step, idx) => {
                    const checked = testPlanChecked[idx] || false;
                    const cleanStep = step.replace(/^\d+\.\s*/, "");
                    return (
                      <li
                        key={idx}
                        onClick={() => setTestPlanChecked(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all hover:bg-neutral-50/50 dark:hover:bg-zinc-900/30"
                        style={{ borderColor: checked ? "rgb(16 185 129 / 0.3)" : undefined }}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 mt-0.5 transition-all ${
                          checked
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-white dark:bg-zinc-950 border-neutral-300 dark:border-zinc-655"
                        }`}>
                          {checked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                        </div>
                        <span className={`text-sm leading-relaxed transition-all text-left ${
                          checked
                            ? "text-neutral-400 line-through dark:text-zinc-500 font-medium"
                            : "text-neutral-700 dark:text-zinc-300 font-medium"
                        }`}>
                          {cleanStep}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </motion.div>
        )}

        {/* ── MARKET RESEARCH TAB ── */}
        {activeTab === "roast" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            {/* Live Search */}
            <div className="glass-card rounded-2xl p-5 md:p-6 shadow-xl shadow-indigo-950/2 dark:shadow-black/10 text-left flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-inner">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-black text-slate-900 dark:text-white">Real-Time Market Research Explorer</h3>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1 font-medium">
                    Query live Google Search indices for up-to-the-minute data on {industry.name}.
                  </p>
                </div>
              </div>
              <form onSubmit={handleMarketResearchSearch} className="flex gap-2 flex-col sm:flex-row mt-1">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    value={marketQuery}
                    onChange={(e) => setMarketQuery(e.target.value)}
                    placeholder={`e.g., Market size for ${industry.name} automation in 2026...`}
                    className="w-full pl-10 pr-4 py-3 bg-white/40 dark:bg-zinc-950/40 border border-neutral-250 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-550/10 focus:border-indigo-500 text-neutral-905 dark:text-white placeholder-neutral-400 dark:placeholder-zinc-500 transition-all font-medium"
                  />
                  <Search className="w-4 h-4 text-neutral-400 dark:text-zinc-500 absolute left-3.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingMarket || !marketQuery.trim()}
                  className="px-5 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-indigo-500/10 transition-all cursor-pointer active:scale-97"
                >
                  {isSearchingMarket ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Researching...</span></> : <span>Explore Market</span>}
                </button>
              </form>
              <AnimatePresence>
                {isSearchingMarket && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-neutral-50/40 dark:bg-zinc-900/30 border border-neutral-200/50 dark:border-zinc-800/60 rounded-xl p-5 flex items-center gap-3"
                  >
                    <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin flex-shrink-0" />
                    <span className="text-xs md:text-sm font-semibold text-neutral-600 dark:text-zinc-300 animate-pulse">Analyzing real-time search data...</span>
                  </motion.div>
                )}
                {marketSearchError && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 font-semibold"
                  >
                    {marketSearchError}
                  </motion.div>
                )}
                {marketResearchResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/40 dark:bg-zinc-900/20 border border-neutral-200/50 dark:border-zinc-800/80 rounded-xl p-5 flex flex-col gap-4 text-xs md:text-sm shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-zinc-800/80 pb-2.5">
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest font-mono">Distilled Research Briefing</span>
                      <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-black uppercase tracking-widest font-mono">Grounded Live</span>
                    </div>
                    <div className="text-neutral-850 dark:text-zinc-300 leading-relaxed space-y-3 prose dark:prose-invert max-w-none">
                      <ReactMarkdown components={mdComponents}>{marketResearchResult}</ReactMarkdown>
                    </div>
                    {marketGroundingMetadata?.groundingChunks?.length > 0 && (
                      <div className="border-t border-neutral-200/60 dark:border-zinc-800/80 pt-3.5 mt-2 flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase text-neutral-400 dark:text-zinc-555 tracking-wider block font-mono">Verified Sources:</span>
                        <div className="flex flex-wrap gap-2">
                          {marketGroundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                            const link = chunk.web || chunk.maps;
                            if (!link?.uri) return null;
                            return (
                              <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200/60 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/60 text-xs text-neutral-750 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-semibold shadow-sm hover:scale-102"
                              >
                                <Globe className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500" />
                                <span className="max-w-[180px] truncate">{link.title || "View Source"}</span>
                                <ExternalLink className="w-3 h-3 text-neutral-400" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scoring Cards */}
            <div className="flex flex-col gap-4">
              {[
                { key: "market", icon: Flame, label: "Market Demand", sub: "Indicators of industry pain and buyer interest", score: scores.demand, findings: getFindingsMarket(industry, build) },
                { key: "diff", icon: ShieldCheck, label: "Build Defensibility", sub: "What prevents simple replication by competitors", score: scores.moat, findings: getFindingsDifferentiation(build, scores) },
                { key: "exec", icon: Cpu, label: "Complexity & Timeline", sub: "Technical hurdles and typical development speed", score: 10 - scores.difficulty, findings: getFindingsExecution(build, scores) },
              ].map(({ key, icon: Icon, label, sub, score, findings }) => (
                <div key={key} className="glass-card rounded-2xl overflow-hidden shadow-md">
                  <div onClick={() => toggleCollapsed(key)} className="p-4 md:p-5 flex justify-between items-center cursor-pointer select-none bg-white/10 dark:bg-zinc-900/20 hover:bg-white/30 dark:hover:bg-zinc-900/40 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50/50 dark:bg-zinc-900/50 flex items-center justify-center border border-neutral-200/40 dark:border-zinc-800/80">
                        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 dark:text-zinc-400 font-mono">{label}</span>
                        <span className="text-xs md:text-sm font-bold text-neutral-800 dark:text-zinc-200 tracking-tight font-heading">{sub}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-black text-neutral-800 dark:text-zinc-250 flex items-baseline gap-0.5 font-mono">
                        <span className="text-base font-extrabold">{score}</span><span>/10</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-neutral-500 dark:text-zinc-400 transition-transform duration-200 ${collapsedCards[key] ? "-rotate-90" : ""}`} />
                    </div>
                  </div>
                  <AnimatePresence initial={false}>
                    {!collapsedCards[key] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="border-t border-neutral-200/60 dark:border-zinc-800/80">
                        <div className="p-5 text-left bg-white/30 dark:bg-zinc-950/10">
                          <ul className="flex flex-col gap-3">
                            {findings.map((f, i) => (
                              <li key={i} className="text-sm text-neutral-750 dark:text-zinc-300 leading-relaxed pl-5 relative before:content-['•'] before:absolute before:left-1 before:text-indigo-600 dark:before:text-indigo-400 before:font-bold" dangerouslySetInnerHTML={{ __html: f }} />
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Monetization Card */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-md">
                <div onClick={() => toggleCollapsed("monetization")} className="p-4 md:p-5 flex justify-between items-center cursor-pointer select-none bg-white/10 dark:bg-zinc-900/20 hover:bg-white/30 dark:hover:bg-zinc-900/40 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50/50 dark:bg-zinc-900/50 flex items-center justify-center border border-neutral-200/40 dark:border-zinc-800/80">
                      <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] uppercase font-black tracking-widest text-neutral-500 dark:text-zinc-400 font-mono font-bold">Monetization Model</span>
                      <span className="text-xs md:text-sm font-bold text-neutral-800 dark:text-zinc-200 tracking-tight font-heading">Value ladder pricing structure for agencies</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-black text-neutral-800 dark:text-zinc-250 flex items-baseline gap-0.5 font-mono">
                      <span className="text-base font-extrabold">{scores.revenue}</span><span>/10</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-neutral-500 dark:text-zinc-400 transition-transform duration-200 ${collapsedCards.monetization ? "-rotate-90" : ""}`} />
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {!collapsedCards.monetization && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="border-t border-neutral-200/60 dark:border-zinc-800/80">
                      <div className="p-5 bg-white/20 dark:bg-zinc-950/15">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getValueLadder(industry).map((tier, idx) => (
                            <div key={idx} className="bg-white/40 dark:bg-[#151518]/60 p-4 border border-neutral-200/50 dark:border-zinc-800/80 rounded-2xl flex flex-col gap-1.5 text-left shadow-sm">
                              <span className="text-[9px] font-black uppercase text-indigo-605 dark:text-indigo-400 tracking-widest font-mono">{tier.tier}</span>
                              <h4 className="text-sm font-bold text-neutral-850 dark:text-zinc-200 tracking-tight font-heading">{tier.label}</h4>
                              <p className="text-xs text-neutral-600 dark:text-zinc-350 leading-relaxed mt-0.5">{tier.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Overall Score */}
            <div className="glass-card rounded-2xl p-5 md:p-6 flex flex-col gap-4 shadow-md text-left">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-neutral-500 dark:text-zinc-450 tracking-widest font-mono">Overall Profitability Score</span>
                  <div className="text-3xl font-black text-neutral-900 dark:text-zinc-200 flex items-baseline gap-1 mt-2.5 font-mono">
                    <span className="text-4xl font-extrabold">{scores.overall}</span><span className="text-sm text-neutral-500 dark:text-zinc-500 font-bold">/40</span>
                  </div>
                </div>
                <div className={`text-[10px] font-black tracking-widest px-4 py-2 border rounded-xl uppercase font-mono shadow-sm ${verdictClass}`}>{verdictLabel}</div>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-zinc-950 h-3 rounded-full overflow-hidden mt-1 shadow-inner">
                <motion.div className={`h-full rounded-full ${progressClass}`} initial={{ width: 0 }} animate={{ width: `${(scores.overall / 40) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
              </div>
              <p className="text-xs text-neutral-505 dark:text-zinc-505 leading-relaxed flex items-start gap-2.5 pt-1.5">
                <Info className="w-4 h-4 text-neutral-400 dark:text-zinc-550 flex-shrink-0 mt-0.5" />
                <span>Calculated based on market size, typical margins, execution ease, and AI differentiation viability for <strong>{industry.name}</strong>.</span>
              </p>
            </div>
          </motion.div>
        )}

        {/* ── WARM PARTNERS TAB ── */}
        {activeTab === "partners" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 shadow-xl shadow-indigo-950/2 dark:shadow-black/10 text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-205 dark:border-zinc-800/80 pb-5 mb-5">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/10 font-mono">Leverage Network</span>
                <h3 className="text-base md:text-lg font-heading font-black text-slate-900 dark:text-white mt-3.5">Warm Referral Partnerships</h3>
                <p className="text-xs text-neutral-505 dark:text-zinc-405 mt-1.5 leading-relaxed">
                  Co-promote with complementary local service providers. Find real businesses nearby using Google Maps grounding.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="relative group">
                  <span className="absolute left-3 top-2.5 text-[9px] font-black uppercase text-neutral-400 dark:text-zinc-500 font-mono">Area:</span>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g., Cincinnati, OH"
                    className="pl-13 pr-3 py-2 text-xs bg-white/40 dark:bg-zinc-950/40 border border-neutral-250 dark:border-zinc-800 rounded-xl font-bold text-neutral-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-52 font-heading"
                  />
                </div>
              </div>
            </div>
            <ul className="flex flex-col gap-4">
              {industry.partners.map((partner, idx) => {
                const searchResult = mapsGroundingResults[idx];
                const isThisSearching = isSearchingMaps && activePartnerIndex === idx;
                return (
                  <li key={idx} className="flex flex-col p-5 bg-white/40 dark:bg-zinc-900/20 border border-neutral-200/50 dark:border-zinc-800/60 rounded-2xl gap-4 transition-all hover:bg-white/80 dark:hover:bg-zinc-900/40 shadow-sm hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9.5 h-9.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5 shadow-inner">
                          <CheckCircle className="w-5.5 h-5.5" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-heading font-extrabold text-sm md:text-base text-neutral-800 dark:text-zinc-200">{partner}</h4>
                          <p className="text-xs text-neutral-505 dark:text-zinc-400 mt-1.5 leading-relaxed">Co-promotion strategy: build a co-branded process blueprint and offer to audit their clients' systems.</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMapsGrounding(partner, idx)}
                        disabled={isSearchingMaps}
                        className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-white/60 dark:bg-zinc-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer disabled:opacity-50 select-none flex-shrink-0 active:scale-97"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="font-heading">Find Local Partners</span>
                      </button>
                    </div>
                    <AnimatePresence>
                      {isThisSearching && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-neutral-200/50 dark:border-zinc-800/80 pt-4 flex items-center gap-3">
                          <Loader2 className="w-4 h-4 text-indigo-650 dark:text-indigo-400 animate-spin flex-shrink-0" />
                          <span className="text-xs font-semibold text-neutral-600 dark:text-zinc-300 animate-pulse">Searching Google Maps for "{partner}" near {locationName}...</span>
                        </motion.div>
                      )}
                      {mapsSearchError && activePartnerIndex === idx && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-red-500/10 pt-4 text-xs text-red-650 dark:text-red-400 font-semibold">
                          {mapsSearchError}
                        </motion.div>
                      )}
                      {searchResult && !isThisSearching && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t border-neutral-200 dark:border-zinc-800 pt-4 flex flex-col gap-3.5 text-xs md:text-sm">
                          <div className="flex items-center justify-between border-b border-dashed border-neutral-200 dark:border-zinc-800 pb-2">
                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Real Local Partners (Google Maps Grounded)</span>
                            <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-mono">near {locationName}</span>
                          </div>
                          <div className="text-neutral-700 dark:text-zinc-300 leading-relaxed bg-white dark:bg-zinc-950/40 border border-neutral-200 dark:border-zinc-800 p-4 rounded-xl prose dark:prose-invert max-w-none">
                            <ReactMarkdown components={mdComponents}>{searchResult.text}</ReactMarkdown>
                          </div>
                          {searchResult.links?.length > 0 && (
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] font-black uppercase text-neutral-400 dark:text-zinc-500 tracking-wider">View on Google Maps:</span>
                              <div className="flex flex-wrap gap-2">
                                {searchResult.links.map((link: any, i: number) => (
                                  <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-neutral-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                                  >
                                    <MapPin className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                                    <span className="max-w-[200px] truncate">{link.title || `Partner ${i + 1}`}</span>
                                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}

        {/* ── OUTREACH KIT TAB ── */}
        {activeTab === "outreach" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 text-left">
            {[
              { id: "scriptA", label: "Script A", title: "Cold Outreach Email Draft", content: scriptAContent, render: (
                <div className="bg-neutral-100/50 dark:bg-zinc-950/50 p-4.5 border border-neutral-200/50 dark:border-zinc-800/80 rounded-2xl font-mono text-xs text-neutral-805 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                  <div className="border-b border-neutral-250 dark:border-zinc-800/80 pb-2.5 mb-2.5 text-neutral-600 dark:text-zinc-400 font-sans font-bold">
                    <span className="text-neutral-500 dark:text-zinc-500 font-mono text-[10px] tracking-wider uppercase mr-1">Subject:</span> {emailSubject}
                  </div>
                  <p>Hi <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-lg border border-indigo-200/20">[First Name]</span>,</p>
                  <p className="mt-2.5">I was looking at how <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-lg border border-indigo-200/20">[Business Name]</span> handles {problemText.toLowerCase()}.</p>
                  <p className="mt-2.5">Most {industry.name.toLowerCase()} businesses lose time and revenue because this process is done manually. I built a workflow called <strong>&quot;{build.label}&quot;</strong> that automates the entire sequence through to {outcomeText.toLowerCase()} — without adding tasks to your team.</p>
                  <p className="mt-2.5">This typically improves turnaround speed by 15–30%. Do you have 10 minutes this week for a quick screen-share?</p>
                  <p className="mt-2.5">Best,<br /><span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-lg border border-indigo-200/20">[Your Name]</span></p>
                </div>
              )},
              { id: "scriptB", label: "Script B", title: "LinkedIn Connection Note", content: scriptBContent, render: (
                <div className="bg-neutral-100/50 dark:bg-zinc-950/50 p-4.5 border border-neutral-200/50 dark:border-zinc-800/80 rounded-2xl font-mono text-xs text-neutral-805 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                  Hi <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-lg border border-indigo-200/20">[First Name]</span>, noticed you run <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-lg border border-indigo-200/20">[Business Name]</span>.<br /><br />
                  Most {industry.name.toLowerCase()} firms lose consistent revenue because they&apos;re manually {problemText.toLowerCase()}.<br /><br />
                  I built an automated system that handles this, specifically by {outcomeText.toLowerCase()} to capture more opportunities faster. Would you be open to a 2-minute video on how it works?
                </div>
              )},
              { id: "scriptC", label: "Script C", title: "Voicemail Script / SMS Note", content: scriptCContent, render: (
                <div className="bg-neutral-100/50 dark:bg-zinc-950/50 p-4.5 border border-neutral-200/50 dark:border-zinc-800/80 rounded-2xl font-mono text-xs text-neutral-805 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-semibold italic shadow-inner">
                  &quot;Hi, it&apos;s <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-lg border border-indigo-200/20">[Your Name]</span>. I built an automated system for <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-655 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded-lg border border-indigo-200/20">[Business Name]</span> focused on {build.label.toLowerCase()}. It saves your team hours each week. Do you have 10 minutes for a quick call this week?&quot;
                </div>
              )},
            ].map((script) => (
              <div key={script.id} className="glass-card rounded-2xl p-5 shadow-xl shadow-indigo-950/2 dark:shadow-black/10 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-neutral-200/60 dark:border-zinc-800/80 pb-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-indigo-605 dark:text-indigo-400 tracking-widest font-mono">{script.label}</span>
                    <h4 className="text-sm font-bold text-neutral-805 dark:text-zinc-200 tracking-tight font-heading">{script.title}</h4>
                  </div>
                  <button
                    onClick={() => handleCopy(script.id, script.content)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border bg-white/60 dark:bg-zinc-950/60 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all cursor-pointer hover:scale-102 active:scale-97 select-none ${
                      copiedScript === script.id ? "border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/5 shadow-md shadow-indigo-500/5" : "border-neutral-200/60 dark:border-zinc-800/80 text-neutral-700 dark:text-zinc-300"
                    }`}
                  >
                    {copiedScript === script.id ? <><Check className="w-3.5 h-3.5" /><span>Copied</span></> : <><Copy className="w-3.5 h-3.5" /><span>Copy Script</span></>}
                  </button>
                </div>
                {script.render}
              </div>
            ))}

            {/* Pre-Send Checklist */}
            <div className="glass-card rounded-2xl p-5 shadow-xl shadow-indigo-950/2 dark:shadow-black/10 flex flex-col gap-4">
              <div className="border-b border-neutral-200/60 dark:border-zinc-800/80 pb-3">
                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-650 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1.5 rounded-xl border border-indigo-500/10 font-mono">Verify Leads</span>
                <h3 className="text-sm font-bold text-neutral-805 dark:text-zinc-200 tracking-tight font-heading mt-3.5">Pre-Send Quality Checklist</h3>
                <p className="text-xs text-neutral-500 dark:text-zinc-405 mt-1 leading-relaxed">Verify these criteria before reaching out to optimize warm conversion rates.</p>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { key: "operating", label: "Confirm the target business is active and operational." },
                  { key: "noSystem", label: "Check if they already use a modern automation tool." },
                  { key: "personalized", label: "Replace all bracketed variables with real prospect info." },
                  { key: "decisionMaker", label: "Find the key decision maker's name via LinkedIn." },
                  { key: "reminderSet", label: "Schedule a follow-up task 3 business days after sending." }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3.5 cursor-pointer select-none group">
                    <input type="checkbox" checked={checklist[item.key]} onChange={() => setChecklist(prev => ({ ...prev, [item.key]: !prev[item.key] }))} className="hidden" />
                    <div className={`w-5.5 h-5.5 rounded-xl flex items-center justify-center border transition-all duration-200 ${
                      checklist[item.key] 
                        ? "bg-indigo-600 dark:bg-indigo-500 border-indigo-605 dark:border-indigo-505 text-white shadow-md shadow-indigo-500/10" 
                        : "bg-white/40 border-neutral-250 group-hover:border-indigo-500/40 dark:bg-zinc-950/40 dark:border-zinc-700 dark:group-hover:border-zinc-500"
                    }`}>
                      {checklist[item.key] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className={`text-sm transition-all text-left ${
                      checklist[item.key] 
                        ? "text-neutral-400 line-through dark:text-zinc-500 font-medium" 
                        : "text-neutral-705 group-hover:text-neutral-950 dark:text-zinc-200 dark:group-hover:text-white font-medium"
                    }`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-zinc-800/80 flex justify-between items-center gap-4 flex-col sm:flex-row">
        <button onClick={onBack} className="btn-secondary w-full sm:w-auto text-center hover:scale-102 active:scale-98 transition-all font-heading">Back to Directory</button>
        {activeTab === "workflow" && (
          <button onClick={() => onChangeHash(activeBuildIndex, "n8n")} className="btn-primary w-full sm:w-auto text-center cursor-pointer hover:scale-102 active:scale-98 transition-all font-heading shadow-indigo-500/15">
            <span>View n8n Build</span><Workflow className="w-4 h-4" />
          </button>
        )}
        {activeTab === "n8n" && (
          <button onClick={() => onChangeHash(activeBuildIndex, "roast")} className="btn-primary w-full sm:w-auto text-center cursor-pointer hover:scale-102 active:scale-98 transition-all font-heading shadow-indigo-500/15">
            <span>Explore Market Research</span><Search className="w-4 h-4" />
          </button>
        )}
        {activeTab === "roast" && (
          <button onClick={() => onChangeHash(activeBuildIndex, "partners")} className="btn-primary w-full sm:w-auto text-center cursor-pointer hover:scale-102 active:scale-98 transition-all font-heading shadow-indigo-500/15">
            <span>Find Warm Partners</span><Handshake className="w-4 h-4" />
          </button>
        )}
        {activeTab === "partners" && (
          <button onClick={() => onChangeHash(activeBuildIndex, "outreach")} className="btn-primary w-full sm:w-auto text-center cursor-pointer hover:scale-102 active:scale-98 transition-all font-heading shadow-indigo-500/15">
            <span>Access Outreach Kit</span><Send className="w-4 h-4" />
          </button>
        )}
        {activeTab === "outreach" && (
          <button onClick={onBack} className="btn-primary w-full sm:w-auto text-center cursor-pointer hover:scale-102 active:scale-98 transition-all font-heading shadow-indigo-500/15">
            <span>Finish & Select Another Niche</span>
          </button>
        )}
      </div>

      {/* Floating AI Advisor */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-550 text-white rounded-full px-5 py-4 shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 font-bold border border-indigo-400/25 cursor-pointer font-heading"
        >
          <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
          <span className="text-xs tracking-wider uppercase font-extrabold">Ask Advisor AI</span>
        </button>
      </div>

      {/* AI Assistant Slide-Over */}
      <AnimatePresence>
        {isAssistantOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAssistantOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer" />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg md:max-w-xl bg-white/95 dark:bg-[#121214]/95 backdrop-blur-xl border-l border-neutral-200/80 dark:border-zinc-800/80 z-50 shadow-2xl flex flex-col font-sans"
            >
              <div className="p-5 border-b border-neutral-200/60 dark:border-zinc-800/80 flex justify-between items-center">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-sm text-neutral-900 dark:text-white tracking-wide uppercase leading-none">Advisor AI Strategy Room</h3>
                    <p className="text-[9px] text-indigo-605 dark:text-indigo-400 font-bold block mt-1 tracking-wider uppercase font-mono">Customizing: {build.label}</p>
                  </div>
                </div>
                <button onClick={() => setIsAssistantOpen(false)} className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-zinc-405 dark:hover:text-white dark:hover:bg-zinc-800/50 rounded-xl transition-all cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide text-left">
                {chatHistory.length === 0 ? (
                  <div className="space-y-6">
                    <div className="glass-card border border-neutral-200/50 dark:border-zinc-850 rounded-2xl p-5 shadow-md">
                      <h4 className="text-sm font-heading font-extrabold text-neutral-900 dark:text-zinc-200 uppercase tracking-wide flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Solve Operational Edge Cases
                      </h4>
                      <p className="text-xs text-neutral-700 dark:text-zinc-300 leading-relaxed mt-2.5 font-medium">
                        Real businesses have unique constraints, legacy systems, or specific customer habits. Enter your bottleneck below and the Advisor AI will generate an adjusted n8n workflow and action plan.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-400 font-mono">Or select a typical constraint:</h5>
                      <div className="flex flex-col gap-2">
                        {[
                          "Customers prefer offline channels like direct calls or SMS over email.",
                          "Staff is part-time — we need a consolidated end-of-day batch instead of instant alerts.",
                          "We need HIPAA-compliant data handling and on-premise storage.",
                          "Contracts require physical signatures before any automation can proceed."
                        ].map((preset, idx) => (
                          <button key={idx} onClick={() => setNuanceInput(preset)}
                            className="w-full text-left p-3.5 bg-white/40 hover:bg-indigo-50/20 dark:bg-zinc-900/40 dark:hover:bg-zinc-900 border border-neutral-250 dark:border-zinc-700/60 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 rounded-xl text-xs text-neutral-805 dark:text-zinc-300 transition-all cursor-pointer leading-relaxed hover:translate-x-0.5"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-405 block font-mono">Describe Your Bottleneck:</label>
                      <textarea
                        value={nuanceInput}
                        onChange={(e) => setNuanceInput(e.target.value)}
                        placeholder="e.g., We only want this to trigger after 5 PM, or we need to route to different team members by zip code..."
                        rows={4}
                        className="w-full bg-white/40 dark:bg-zinc-950/40 border border-neutral-250 dark:border-zinc-800 rounded-xl p-4 text-xs text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:focus:ring-indigo-500/10 focus:border-indigo-600 leading-relaxed shadow-sm font-medium"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isGenerating || !nuanceInput.trim()}
                        className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/10 font-heading"
                      >
                        {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Formulating Strategy...</span></> : <><Sparkles className="w-4 h-4" /><span>Generate Custom Strategy</span></>}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 pb-20">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-450 mb-1.5 font-mono">
                          {msg.role === "user" ? "Your Constraint" : "Advisor AI Strategy"}
                        </span>
                        {msg.role === "user" ? (
                          <div className="bg-neutral-100/60 dark:bg-zinc-800/40 p-4 rounded-2xl border border-neutral-250 dark:border-zinc-700/50 text-xs md:text-sm text-neutral-900 dark:text-zinc-200 max-w-[90%] leading-relaxed font-medium">{msg.text}</div>
                        ) : (
                          <div className="glass-card p-5 rounded-2xl text-xs md:text-sm text-neutral-800 dark:text-zinc-300 max-w-full leading-relaxed shadow-sm prose dark:prose-invert">
                            <ReactMarkdown components={mdComponents}>{msg.text}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="flex flex-col items-start">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-zinc-455 mb-1.5 font-mono">Advisor AI is designing...</span>
                        <div className="glass-card p-5 rounded-2xl flex items-center gap-3 shadow-sm">
                          <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                          <span className="text-xs font-semibold text-neutral-600 dark:text-zinc-300 animate-pulse">Running diagnostic on {industry.name}...</span>
                        </div>
                      </div>
                    )}
                    {aiError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 font-semibold">
                        <p className="font-bold">Error</p><p className="mt-1">{aiError}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {chatHistory.length > 0 && (
                <div className="p-4 border-t border-neutral-200/60 dark:border-zinc-800/80 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md sticky bottom-0 flex flex-col gap-2.5 z-10 shadow-lg">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Ask a follow-up..."
                      value={nuanceInput}
                      onChange={(e) => setNuanceInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      disabled={isGenerating}
                      className="flex-1 bg-white/40 dark:bg-zinc-900/60 border border-neutral-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs md:text-sm text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-650/10 focus:border-indigo-500 transition-all font-medium"
                    />
                    <button onClick={handleSendMessage} disabled={isGenerating || !nuanceInput.trim()} className="p-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl disabled:opacity-40 transition-all cursor-pointer hover:scale-102 active:scale-97">
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-1 font-mono text-[9px] font-black tracking-widest text-neutral-500 dark:text-zinc-500">
                    <span>Powered by Gemini 2.0</span>
                    <button onClick={() => { setChatHistory([]); setNuanceInput(""); setAiError(null); }} disabled={isGenerating} className="text-rose-600 dark:text-rose-500 hover:text-rose-400 uppercase tracking-widest font-black cursor-pointer disabled:opacity-50 transition-all">
                      Reset Consultation
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
