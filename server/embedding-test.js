require("dotenv").config();

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

async function getEmbedding(text) {
  const token = await getBearerToken();
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

function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

async function test() {
  const sentence1 = await getEmbedding("Percolation pits help recharge groundwater.");
  const sentence2 = await getEmbedding("Check dams slow water flow to let it soak into soil.");
  const sentence3 = await getEmbedding("I love eating pizza on weekends.");

  console.log("Similarity (water-related pair):", cosineSimilarity(sentence1, sentence2));
  console.log("Similarity (unrelated pair):", cosineSimilarity(sentence1, sentence3));
}

test();