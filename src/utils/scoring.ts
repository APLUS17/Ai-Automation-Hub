import { Industry, Build, Scores } from "../types";

export function computeScores(industry: Industry, build: Build): Scores {
  const nodesText = build.nodes.map(n => (n.name + " " + n.type).toLowerCase()).join(" ");
  const stepsText = build.steps.map(s => s.t.toLowerCase()).join(" ");
  const combinedText = nodesText + " " + stepsText;

  let demand = 6;
  if (build.nodes.length >= 8) demand += 2;
  else if (build.nodes.length >= 5) demand += 1;

  const highDemandKeywords = [
    "missed", "urgent", "emergency", "overdue", "no-show",
    "loss", "cancel", "denial", "reactivation", "upsell", "voice", "bland"
  ];
  if (highDemandKeywords.some(kw => combinedText.includes(kw))) demand += 2;
  else demand += 1;
  demand = Math.min(10, demand);

  let moat = 5;
  if (combinedText.includes("claude") || combinedText.includes("openai") || combinedText.includes("llm")) moat += 2;
  if (combinedText.includes("extract") || combinedText.includes("parse") || combinedText.includes("extraction")) moat += 2;
  if (combinedText.includes("classify") || combinedText.includes("sentiment") || combinedText.includes("vision")) moat += 1;
  if (combinedText.includes("route") || combinedText.includes("prioritize") || combinedText.includes("dispatch")) moat += 1;
  if (combinedText.includes("apify") || combinedText.includes("firecrawl") || combinedText.includes("scrape")) moat += 1;
  moat = Math.min(10, moat);

  let difficulty = 3;
  difficulty += Math.floor((build.nodes.length - 3) * 0.5);

  if (combinedText.includes("bland") || combinedText.includes("voice") || combinedText.includes("call")) difficulty += 2;
  if (combinedText.includes("splitinbatches") || combinedText.includes("split in batches")) difficulty += 1;
  if (combinedText.includes("apify") || combinedText.includes("firecrawl")) difficulty += 1;
  if (combinedText.includes("quickbooks") || combinedText.includes("shopify") || combinedText.includes("clearinghouse")) difficulty += 1;
  difficulty = Math.min(10, Math.max(1, Math.round(difficulty)));

  let revenue = 5;
  const highRevenueIds = ["hvac", "pharma", "healthcare-rev", "appraisal"];
  const medRevenueIds = ["coaching", "ecommerce", "hotels", "water-damage"];
  if (highRevenueIds.includes(industry.id)) revenue += 3;
  else if (medRevenueIds.includes(industry.id)) revenue += 2;
  else revenue += 1;

  if (combinedText.includes("reactivat") || combinedText.includes("upsell") || combinedText.includes("drip")) revenue += 1;
  revenue = Math.min(10, revenue);

  const ease = 10 - difficulty;
  const overall = demand + moat + ease + revenue;

  return { demand, moat, difficulty, revenue, overall };
}

export function getFindingsMarket(industry: Industry, build: Build): string[] {
  const findings: string[] = [];
  const combinedText = build.nodes.map(n => n.name.toLowerCase()).join(" ") + " " + build.steps.map(s => s.t.toLowerCase()).join(" ");

  const marketFacts: Record<string, string[]> = {
    "hvac": [
      "<strong>Speed-to-Lead is Everything:</strong> HVAC contractors who respond within 1 hour are 7x more likely to close the job than those who respond in 2+ hours.",
      "<strong>Seasonal Surge Bottleneck:</strong> During heat waves, a single 8-truck operation can receive 80+ calls in 48 hours — a volume impossible to handle without automation."
    ],
    "healthcare-rev": [
      "<strong>Revenue Leakage Crisis:</strong> The average medical practice loses 10–15% of gross revenue to claim denials, most caused by correctable coding errors.",
      "<strong>Compliance Penalty Risk:</strong> HIPAA violations average $10,000+ per incident, yet most small practices track certifications manually in spreadsheets."
    ],
    "coaching": [
      "<strong>Lead Cost Pressure:</strong> High-ticket coaching leads from Meta ads cost $45–$120 each. A database of 1,200 cold leads represents $54,000–$144,000 in acquisition spend sitting idle.",
      "<strong>Drip ROI:</strong> Coaches who implement 5-step reactivation sequences average 8–12% conversion from cold lists — often their highest-ROI activity of the quarter."
    ],
    "appraisal": [
      "<strong>Speed Wins Assignments:</strong> Appraisers who acknowledge new orders within 2 hours receive 60% more recurring assignments from lender clients.",
      "<strong>Market Fragmentation:</strong> 78,000 US appraisers operate mostly solo or in small firms with zero automation, making even basic n8n workflows a significant differentiator."
    ],
    "water-damage": [
      "<strong>First-Response Advantage:</strong> The contractor who responds to a water damage call within 15 minutes wins the job 70% of the time — delay loses to competitors.",
      "<strong>Upsell Opportunity:</strong> Emergency mitigation contracts average $8,500, but post-mitigation remodels average $35,000+ — a 4x revenue multiplier most contractors miss."
    ],
    "chiro": [
      "<strong>Retention is the Business:</strong> Acquiring a new chiropractic patient costs 5–7x more than retaining an existing one — automated follow-up directly defends margins.",
      "<strong>Review Velocity:</strong> Chiro clinics with 50+ Google reviews convert 3x more new patient inquiries than clinics with fewer than 20 reviews."
    ]
  };

  const industryFindings = marketFacts[industry.id];
  if (industryFindings) {
    findings.push(...industryFindings);
  } else {
    findings.push(`<strong>Demand Opportunity:</strong> Key processes in ${industry.name.toLowerCase()} are backlogged due to high manual workload requirements.`);
    findings.push("<strong>Administrative Bottleneck:</strong> Inefficient tracking systems prevent staff from focusing on revenue-generating activities.");
  }

  if (build.nodes.length >= 8) {
    findings.push(`<strong>Multilayered Workflow:</strong> Features ${build.nodes.length} n8n nodes, signaling a complete end-to-end system that businesses can't replicate without dedicated automation expertise.`);
  }

  return findings;
}

export function getFindingsDifferentiation(build: Build, scores: Scores): string[] {
  const findings: string[] = [];
  const combinedText = build.nodes.map(n => (n.name + " " + n.type).toLowerCase()).join(" ");

  const aiNodes = build.nodes.filter(n =>
    n.name.toLowerCase().includes("claude") ||
    n.name.toLowerCase().includes("sentiment") ||
    n.name.toLowerCase().includes("extract") ||
    n.name.toLowerCase().includes("narrative") ||
    n.name.toLowerCase().includes("personalize")
  );

  if (aiNodes.length > 0) {
    aiNodes.slice(0, 2).forEach(node => {
      findings.push(`<strong>AI-Powered Node:</strong> "<em>${node.name}</em>" requires a custom-prompted Claude integration — not configurable in off-the-shelf tools like Zapier or Make without significant engineering.`);
    });
  } else {
    findings.push("<strong>Integration Depth:</strong> Connects multiple best-in-class services in a single workflow — complexity that commodity automation builders can't replicate without custom code.");
  }

  if (scores.moat >= 8) {
    findings.push("<strong>High-Defensibility Stack:</strong> Natural language processing + multi-step conditional routing creates a solution that's deeply embedded in operations, making it sticky and hard to replace.");
  } else {
    findings.push("<strong>Process Optimization Moat:</strong> Value lies in complete end-to-end integration across communication channels and core databases — replacing even one piece breaks the whole chain.");
  }

  return findings;
}

export function getFindingsExecution(build: Build, scores: Scores): string[] {
  const findings: string[] = [];

  let buildTime = "3–5 days with n8n";
  if (scores.difficulty >= 8) {
    buildTime = "7–10 days (requires voice APIs, complex webhooks, or multi-system sync)";
  } else if (scores.difficulty >= 6) {
    buildTime = "5–7 days (involves scraping, AI prompting, and multi-step conditional logic)";
  }
  findings.push(`<strong>Estimated Build Time:</strong> ${buildTime}. Recommended stack: n8n + Claude API + relevant integrations from the credential map.`);

  const complexNodes = build.nodes.find(n =>
    n.name.toLowerCase().includes("claude") ||
    n.name.toLowerCase().includes("apify") ||
    n.name.toLowerCase().includes("bland") ||
    n.name.toLowerCase().includes("firecrawl") ||
    n.name.toLowerCase().includes("clearinghouse")
  );

  const bottleneckName = complexNodes ? complexNodes.name : build.nodes[Math.floor(build.nodes.length / 2)]?.name || build.nodes[0]?.name;
  findings.push(`<strong>Primary Build Bottleneck:</strong> "<em>${bottleneckName}</em>" is the most technically complex node — requires careful API parameter mapping, auth token handling, and error recovery logic.`);

  return findings;
}

export interface ValueTier {
  tier: string;
  label: string;
  desc: string;
}

export function getValueLadder(industry: Industry): ValueTier[] {
  let corePrice = "$299/mo";
  let setupFee = "$500 – $1,000 setup";
  let frontPrice = "$149/mo";
  let baitDoc = "Free process audit and friction review";
  let backendText = "Custom multi-system integrations, ongoing SOP updates, and monthly strategy retainer";

  const highValueIds = ["hvac", "pharma", "healthcare-rev", "appraisal", "water-damage"];
  const midValueIds = ["coaching", "ecommerce", "hotels"];

  if (highValueIds.includes(industry.id)) {
    corePrice = "$499/mo";
    setupFee = "$1,500 – $3,000 setup";
    frontPrice = "$249/mo";
    baitDoc = "Free operations blueprint + workflow friction report";
    backendText = "Enterprise multi-branch setup + white-glove custom reporting and quarterly strategy reviews";
  } else if (midValueIds.includes(industry.id)) {
    corePrice = "$349/mo";
    setupFee = "$750 – $1,500 setup";
    frontPrice = "$179/mo";
  }

  return [
    {
      tier: "Tier 1 — Bait",
      label: "Free Assessment / Audit",
      desc: baitDoc
    },
    {
      tier: "Tier 2 — Frontend",
      label: `${frontPrice} Starter System`,
      desc: "Core trigger + alert setup, standard templated communications, limited integrations."
    },
    {
      tier: "Tier 3 — Core",
      label: `${corePrice} Full Automation`,
      desc: `Complete end-to-end workflow, all integrations live, customized messaging, ${setupFee}.`
    },
    {
      tier: "Tier 4 — Backend",
      label: "Custom Retainer & Scaling",
      desc: backendText
    }
  ];
}
