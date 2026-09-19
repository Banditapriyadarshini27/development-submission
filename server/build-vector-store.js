require("dotenv").config();
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.IBM_WATSONX_APIKEY;
const PROJECT_ID = process.env.IBM_PROJECT_ID;
const REGION_URL = process.env.IBM_REGION_URL;

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

async function buildVectorStore() {
  const token = await getBearerToken();
  const knowledgeDir = path.join(__dirname, "knowledge");
  const files = fs.readdirSync(knowledgeDir);

  const vectorStore = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(knowledgeDir, file), "utf-8");
    console.log(`Embedding ${file}...`);
    const embedding = await getEmbedding(content, token);
    vectorStore.push({ filename: file, content, embedding });
  }

  fs.writeFileSync(
    path.join(__dirname, "vector-store.json"),
    JSON.stringify(vectorStore, null, 2)
  );

  console.log(`Done! Embedded ${vectorStore.length} documents into vector-store.json`);
}

buildVectorStore();
