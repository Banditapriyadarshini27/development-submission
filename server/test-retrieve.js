require("dotenv").config();
const { findTopMatches } = require("./retrieve");

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

async function test() {
  const token = await getBearerToken();
  const question = "How do I build something on sloped farmland to stop water runoff?";
  const questionEmbedding = await getEmbedding(question, token);

  const matches = findTopMatches(questionEmbedding, 2);

  console.log("Question:", question);
  console.log("\nTop matches:");
  matches.forEach((m, i) => {
    console.log(`${i + 1}. ${m.filename} (score: ${m.score.toFixed(3)})`);
  });
}

test();
