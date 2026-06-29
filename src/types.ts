export interface N8nNode {
  name: string;
  type: string;
}

export interface Step {
  t: string;
  nodeType?: string;
}

export interface GtmChannel {
  channel: string;
  desc: string;
}

export interface Build {
  label: string;
  steps: Step[];
  nodes: N8nNode[];
  aiTasks: string;
  testPlan: string;
  gtm: GtmChannel[];
  problemSubheader: string;
  problemDescription: string;
  redditTitle: string;
  redditComments: string;
  integrations: string[];
}

export interface Industry {
  id: string;
  name: string;
  segment: string;
  keywords: string[];
  builds: Build[];
  partners: string[];
}

export interface Scores {
  demand: number;
  moat: number;
  difficulty: number;
  revenue: number;
  overall: number;
}
