var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function callGeminiWithRetry(apiCall, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      const errorStr = String(error.message || error.status || error);
      const isRateLimit = errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("Quota") || errorStr.includes("rate limit") || error.status === 429;
      if (isRateLimit && attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt + 1) * 1e3 + Math.random() * 1e3;
        console.warn(`[GEMINI RATE LIMIT] Backing off ${(waitTime / 1e3).toFixed(2)}s... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed after max retries due to rate limits.");
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/ask-ai", async (req, res) => {
    try {
      const { industry, nicheName, buildLabel, steps, nuance, history } = req.body;
      if (!nicheName || !nuance) return res.status(400).json({ error: "Niche name and nuance are required." });
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "GEMINI_API_KEY not configured." });
      const ai = new import_genai.GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
      const stepsText = Array.isArray(steps) ? steps.map((s, i) => `${i + 1}. ${s.t || ""}`).join("\n") : "No steps defined.";
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
1. \u{1F3AF} **Analysis**: Why this constraint occurs in ${nicheName} and how automation addresses it
2. \u{1F504} **Workflow Adjustments**: Specific n8n node changes or additions
3. \u{1F6E0}\uFE0F **Recommended Stack**: Exact tools (n8n nodes, APIs, credentials) to use
4. \u26A1 **Quick Win**: One immediate action they can implement today`;
      const contents = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg) => {
          contents.push({ role: msg.role === "user" ? "user" : "model", parts: [{ text: msg.text }] });
        });
      }
      contents.push({ role: "user", parts: [{ text: prompt }] });
      const response = await callGeminiWithRetry(
        () => ai.models.generateContent({ model: "gemini-2.0-flash", contents, config: { systemInstruction, temperature: 0.7 } })
      );
      res.json({ text: response.text });
    } catch (error) {
      console.error("Ask AI error:", error);
      res.status(500).json({ error: error.message || "Failed to generate strategy" });
    }
  });
  app.post("/api/market-research", async (req, res) => {
    try {
      const { query, industry, nicheName } = req.body;
      if (!query) return res.status(400).json({ error: "Search query is required." });
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "GEMINI_API_KEY not configured." });
      const ai = new import_genai.GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
      const contents = `Perform thorough, up-to-the-minute market research for ${nicheName || "this niche"} in the ${industry || "general"} industry.
Analyze this question: "${query}"

Provide factual, data-driven insights with recent trends and statistics. Structure your response in clear Markdown with headers and bullet points.`;
      const response = await callGeminiWithRetry(
        () => ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents,
          config: {
            systemInstruction: "You are an expert market research analyst. Give authoritative, data-driven answers with clear headings and bullet points. Cite real data where possible.",
            tools: [{ googleSearch: {} }]
          }
        })
      );
      res.json({ text: response.text, groundingMetadata: response.candidates?.[0]?.groundingMetadata || null });
    } catch (error) {
      console.error("Market Research error:", error);
      res.status(500).json({ error: error.message || "Failed to generate market research" });
    }
  });
  app.post("/api/maps-grounding", async (req, res) => {
    try {
      const { partnerType, locationName, lat, lng } = req.body;
      if (!partnerType) return res.status(400).json({ error: "Partner type is required." });
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(400).json({ error: "GEMINI_API_KEY not configured." });
      const ai = new import_genai.GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
      let prompt = `Find 3-5 real, active businesses of type: "${partnerType}"`;
      if (locationName) prompt += ` located in or near "${locationName}"`;
      prompt += `. For each business:
1. Provide their actual business name and full address.
2. Outline their core services.
3. Explain why they are a strong warm referral partner for an AI automation agency.
Return real businesses from Google Maps \u2014 do not invent fictitious businesses. Format as structured Markdown.`;
      const cityCoordinates = {
        "cincinnati": { lat: 39.1031, lng: -84.512 },
        "cincinnati, oh": { lat: 39.1031, lng: -84.512 },
        "san francisco": { lat: 37.7749, lng: -122.4194 },
        "san francisco, ca": { lat: 37.7749, lng: -122.4194 },
        "new york": { lat: 40.7128, lng: -74.006 },
        "new york, ny": { lat: 40.7128, lng: -74.006 },
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
        "dallas": { lat: 32.7767, lng: -96.797 },
        "dallas, tx": { lat: 32.7767, lng: -96.797 },
        "atlanta": { lat: 33.749, lng: -84.388 },
        "atlanta, ga": { lat: 33.749, lng: -84.388 }
      };
      const config = { tools: [{ googleMaps: {} }] };
      let activeLat = lat;
      let activeLng = lng;
      if (locationName && (activeLat === null || activeLat === void 0)) {
        const cleaned = locationName.toLowerCase().trim();
        let found = cityCoordinates[cleaned];
        if (!found) {
          const key = Object.keys(cityCoordinates).find((k) => cleaned.includes(k) || k.includes(cleaned));
          if (key) found = cityCoordinates[key];
        }
        if (found) {
          activeLat = found.lat;
          activeLng = found.lng;
        }
      }
      if (activeLat !== null && activeLat !== void 0 && activeLng !== null && activeLng !== void 0) {
        config.toolConfig = { retrievalConfig: { latLng: { latitude: Number(activeLat), longitude: Number(activeLng) } } };
      }
      const response = await callGeminiWithRetry(
        () => ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt, config })
      );
      res.json({ text: response.text, groundingMetadata: response.candidates?.[0]?.groundingMetadata || null });
    } catch (error) {
      console.error("Maps grounding error:", error);
      res.status(500).json({ error: error.message || "Failed to search Maps partners" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => res.sendFile(import_path.default.join(distPath, "index.html")));
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`
\u{1F680} AI Automation Hub running at http://localhost:${PORT}
`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
