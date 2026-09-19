require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { findTopMatches } = require("./retrieve");
const { assessRisk } = require("./riskModel");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = (process.env.IBM_WATSONX_APIKEY || "").trim();
const PROJECT_ID = (process.env.IBM_PROJECT_ID || "").trim();
const REGION_URL = (process.env.IBM_REGION_URL || "").trim().replace(/^[:\s]+/, "").replace(/\/+$/, "");

async function getBearerToken() {
  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`
  });
  const data = await res.json();
  return data.access_token;
}

async function getEmbedding(text, token) {
  const response = await fetch(`${REGION_URL}/ml/v1/text/embeddings?version=2024-05-31`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model_id: "ibm/granite-embedding-278m-multilingual",
      project_id: PROJECT_ID,
      inputs: [text]
    })
  });
  const result = await response.json();
  return result.results[0].embedding;
}

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the Undercurrent backend!" });
});

// Dedicated risk assessment endpoint
app.post("/api/risk", (req, res) => {
  try {
    const { blockName, manualExtractionPercent } = req.body;
    const assessment = assessRisk({ blockName, manualExtractionPercent });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/ask", async (req, res) => {
  try {
    const { question, blockName, manualExtractionPercent } = req.body;

    // Handle simple greetings/small talk without running the full pipeline
    const greetingPattern = /^(hi|hii|hello|hey|hola|namaste|good morning|good evening|good afternoon)[\s!.?]*$/i;
    if (greetingPattern.test(question.trim())) {
      return res.json({
        answer: "Hello! I'm your groundwater advisor for Odisha. Pick a block above and ask me anything — like whether your water is safe, what recharge structures could help, or how serious the depletion risk is in your area.",
        risk: null,
        sources: []
      });
    }

    const token = await getBearerToken();

    // Real risk assessment using CGWB data
    const risk = assessRisk({ blockName, manualExtractionPercent });

    // RAG retrieval (your existing pipeline)
    const questionEmbedding = await getEmbedding(question, token);
    const matches = findTopMatches(questionEmbedding, 2);
    const context = matches.map((m) => m.content).join("\n\n");

    // Combined prompt: real data + RAG context
    const prompt = `You are a groundwater sustainability advisor for Odisha.

Real assessment data for this location:
- Block: ${risk.block}${risk.district ? `, District: ${risk.district}` : ""}
- Category: ${risk.category} (${risk.riskLabel})
${risk.extractionStagePercent !== null ? `- Extraction stage: ${risk.extractionStagePercent}%` : ""}
${risk.note ? `- Note: ${risk.note}` : ""}

Reference information (only use if relevant to the question below):
${context}

The user's actual question is: "${question}"

Answer the user's specific question directly and completely. Only bring in 
the reference information or recharge recommendations if they are actually 
relevant to what was asked — do not default to recharge advice if the 
question is about something else (e.g. water quality, safety, general 
information). Use the assessment data above for context, but prioritize 
answering exactly what was asked.`;

    const response = await fetch(`${REGION_URL}/ml/v1/text/chat?version=2024-05-31`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model_id: "ibm/granite-4-h-small",
        project_id: PROJECT_ID,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300
      })
    });

    const result = await response.json();
    const answer = result.choices[0].message.content;

    res.json({
      answer,
      risk,
      sources: matches.map((m) => m.filename)
    });
  } catch (err) {
    console.error("API error in /api/ask:", err);
    res.status(500).json({ error: err.message });
  }
});

// Serve client static files if built
const clientDist = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

// Catch-all fallback for client-side routing (Express 5 compatible)
app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Endpoint not found" });
  }
  const indexPath = path.join(clientDist, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).send("Not found");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});