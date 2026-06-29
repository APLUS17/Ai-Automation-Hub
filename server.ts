import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function callGeminiWithRetry<T>(apiCall: () => Promise<T>, maxRetries = 5): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      const errorStr = String(error.message || error.status || error);
      const isRateLimit =
        errorStr.includes("429") ||
        errorStr.includes("RESOURCE_EXHAUSTED") ||
        errorStr.includes("Quota") ||
        errorStr.includes("rate limit") ||
        error.status === 429;

      if (isRateLimit && attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt + 1) * 1000 + Math.random() * 1000;
        console.warn(`[GEMINI RATE LIMIT] Backing off ${(waitTime / 1000).toFixed(2)}s... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed after max retries due to rate limits.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ask AI — strategy advisor
  app.post("/api/ask-ai", async (req, res) => {
    try {
      const { industry, nicheName, buildLabel, steps, nuance, history } = req.body;
      if (!nicheName || !nuance) return res.status(400).json({ error: "Niche name and nuance are required." });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "GEMINI_API_KEY not configured." });

      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

      const stepsText = Array.isArray(steps)
        ? steps.map((s: any, i: number) => `${i + 1}. ${s.t || ""}`).join("\n")
        : "No steps defined.";

      const systemInstruction = `You are an AI Automation Architect for the WAT Framework (Workflows, Agents, Tools).
You specialize in n8n workflow design, Claude AI integration, and automation consulting for SMBs.
Provide highly practical, direct, n8n-specific advice. Format responses in clean Markdown with headers and bullet points.`;

      const prompt = `Industry: ${nicheName} (${industry || "General"})
Automation Build: ${buildLabel || "Custom Build"}

Workflow Steps:
${stepsText}

Business Constraint / Question:
"${nuance}"

Provide:
1. 🎯 **Analysis**: Why this constraint occurs in ${nicheName} and how automation addresses it
2. 🔄 **Workflow Adjustments**: Specific n8n node changes or additions
3. 🛠️ **Recommended Stack**: Exact tools (n8n nodes, APIs, credentials) to use
4. ⚡ **Quick Win**: One immediate action they can implement today`;

      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          contents.push({ role: msg.role === "user" ? "user" : "model", parts: [{ text: msg.text }] });
        });
      }
      contents.push({ role: "user", parts: [{ text: prompt }] });

      const response = await callGeminiWithRetry(() =>
        ai.models.generateContent({ model: "gemini-2.0-flash", contents, config: { systemInstruction, temperature: 0.7 } })
      );

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Ask AI error:", error);
      res.status(500).json({ error: error.message || "Failed to generate strategy" });
    }
  });

  // Market Research — Google Search grounding
  app.post("/api/market-research", async (req, res) => {
    try {
      const { query, industry, nicheName } = req.body;
      if (!query) return res.status(400).json({ error: "Search query is required." });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "GEMINI_API_KEY not configured." });

      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

      const contents = `Perform thorough, up-to-the-minute market research for ${nicheName || "this niche"} in the ${industry || "general"} industry.
Analyze this question: "${query}"

Provide factual, data-driven insights with recent trends and statistics. Structure your response in clear Markdown with headers and bullet points.`;

      const response = await callGeminiWithRetry(() =>
        ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents,
          config: {
            systemInstruction: "You are an expert market research analyst. Give authoritative, data-driven answers with clear headings and bullet points. Cite real data where possible.",
            tools: [{ googleSearch: {} }],
          },
        })
      );

      res.json({ text: response.text, groundingMetadata: response.candidates?.[0]?.groundingMetadata || null });
    } catch (error: any) {
      console.error("Market Research error:", error);
      res.status(500).json({ error: error.message || "Failed to generate market research" });
    }
  });

  // Warm Partners — Google Maps grounding
  app.post("/api/maps-grounding", async (req, res) => {
    try {
      const { partnerType, locationName, lat, lng } = req.body;
      if (!partnerType) return res.status(400).json({ error: "Partner type is required." });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "GEMINI_API_KEY not configured." });

      const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });

      let prompt = `Find 3-5 real, active businesses of type: "${partnerType}"`;
      if (locationName) prompt += ` located in or near "${locationName}"`;
      prompt += `. For each business:
1. Provide their actual business name and full address.
2. Outline their core services.
3. Explain why they are a strong warm referral partner for an AI automation agency.
Return real businesses from Google Maps — do not invent fictitious businesses. Format as structured Markdown.`;

      const cityCoordinates: Record<string, { lat: number; lng: number }> = {
        "cincinnati": { lat: 39.1031, lng: -84.5120 },
        "cincinnati, oh": { lat: 39.1031, lng: -84.5120 },
        "san francisco": { lat: 37.7749, lng: -122.4194 },
        "san francisco, ca": { lat: 37.7749, lng: -122.4194 },
        "new york": { lat: 40.7128, lng: -74.0060 },
        "new york, ny": { lat: 40.7128, lng: -74.0060 },
        "chicago": { lat: 41.8781, lng: -87.6298 },
        "chicago, il": { lat: 41.8781, lng: -87.6298 },
        "los angeles": { lat: 34.0522, lng: -118.2437 },
        "los angeles, ca": { lat: 34.0522, lng: -118.2437 },
        "miami": { lat: 25.7617, lng: -80.1918 },
        "miami, fl": { lat: 25.7617, lng: -80.1918 },
        "austin": { lat: 30.2672, lng: -97.7431 },
        "austin, tx": { lat: 30.2672, lng: -97.7431 },
        "seattle": { lat: 47.6062, lng: -122.3321 },
        "seattle, wa": { lat: 47.6062, lng: -122.3321 },
        "dallas": { lat: 32.7767, lng: -96.7970 },
        "dallas, tx": { lat: 32.7767, lng: -96.7970 },
        "atlanta": { lat: 33.7490, lng: -84.3880 },
        "atlanta, ga": { lat: 33.7490, lng: -84.3880 },
      };

      const config: any = { tools: [{ googleMaps: {} }] };

      let activeLat = lat;
      let activeLng = lng;

      if (locationName && (activeLat === null || activeLat === undefined)) {
        const cleaned = locationName.toLowerCase().trim();
        let found = cityCoordinates[cleaned];
        if (!found) {
          const key = Object.keys(cityCoordinates).find((k) => cleaned.includes(k) || k.includes(cleaned));
          if (key) found = cityCoordinates[key];
        }
        if (found) { activeLat = found.lat; activeLng = found.lng; }
      }

      if (activeLat !== null && activeLat !== undefined && activeLng !== null && activeLng !== undefined) {
        config.toolConfig = { retrievalConfig: { latLng: { latitude: Number(activeLat), longitude: Number(activeLng) } } };
      }

      const response = await callGeminiWithRetry(() =>
        ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt, config })
      );

      res.json({ text: response.text, groundingMetadata: response.candidates?.[0]?.groundingMetadata || null });
    } catch (error: any) {
      console.error("Maps grounding error:", error);
      res.status(500).json({ error: error.message || "Failed to search Maps partners" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 AI Automation Hub running at http://localhost:${PORT}\n`);
  });
}

startServer();
