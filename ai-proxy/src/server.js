import express from "express";
import cors from "cors";
import fetch from "node-fetch";
const app = express();
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://ollama:11434";
const API_SECRET = process.env.API_SECRET;
app.use(express.json({ limit: "20mb" }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use((req, res, next) => {
  if (!API_SECRET) return next();
  if (req.headers.authorization !== "Bearer " + API_SECRET) return res.status(401).json({ error: "Unauthorized" });
  next();
});
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.post("/scan", async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "No image provided" });
  const prompt = "You are a vocabulary extraction assistant. Look at this image which contains a vocabulary list. Extract ALL word pairs (term and translation/definition). IGNORE: titles, page numbers, headers, chapter names, instructions. ONLY extract actual vocabulary word pairs. Return ONLY a JSON array, nothing else: [{\"term\": \"...\", \"definition\": \"...\"}, ...]. If no pairs found, return: []";
  try {
    const ollamaRes = await fetch(OLLAMA_URL + "/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llava", stream: false, messages: [{ role: "user", content: prompt, images: [image] }] })
    });
    if (!ollamaRes.ok) return res.status(502).json({ error: "AI model error" });
    const data = await ollamaRes.json();
    const raw = data.message?.content || "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    let pairs;
    try { pairs = JSON.parse(cleaned); }
    catch { const m = cleaned.match(/\[[\s\S]*\]/); pairs = m ? JSON.parse(m[0]) : []; }
    const valid = pairs.filter(p => p && p.term && p.definition).map(p => ({ term: p.term.trim(), definition: p.definition.trim() }));
    res.json({ pairs: valid });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.listen(PORT, () => console.log("AI Proxy running on port " + PORT));