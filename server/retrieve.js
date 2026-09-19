const fs = require("fs");
const path = require("path");

function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function loadVectorStore() {
  const filePath = path.join(__dirname, "vector-store.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function findTopMatches(queryEmbedding, topN = 2) {
  const vectorStore = loadVectorStore();

  const scored = vectorStore.map((doc) => ({
    filename: doc.filename,
    content: doc.content,
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}

module.exports = { findTopMatches };
