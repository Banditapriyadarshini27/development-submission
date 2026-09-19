const fs = require("fs");
const path = require("path");

function loadBlockData() {
  const filePath = path.join(__dirname, "data", "odisha-blocks.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// CGWB's own official classification thresholds
function classifyByPercent(percent) {
  if (percent > 100) return "over_exploited";
  if (percent > 90) return "critical";
  if (percent > 70) return "semi_critical";
  return "safe";
}

function getRiskLabel(category) {
  const labels = {
    safe: "Low Risk",
    semi_critical: "Medium Risk",
    critical: "High Risk",
    over_exploited: "Critical Risk",
    saline: "Saline (not extraction-related)"
  };
  return labels[category] || "Unknown";
}

function findBlock(blockName) {
  const data = loadBlockData();
  const allBlocks = [
    ...data.safeExampleBlocks,
    ...data.semiCriticalBlocks,
    ...data.salineBlocks
  ];

  const normalized = blockName.trim().toLowerCase();
  return allBlocks.find((b) => b.block.toLowerCase() === normalized);
}

function assessRisk({ blockName, manualExtractionPercent }) {
  if (blockName) {
    const match = findBlock(blockName);
    if (match) {
      if (match.category === "saline") {
        return {
          block: match.block,
          district: match.district,
          category: "saline",
          riskLabel: getRiskLabel("saline"),
          extractionStagePercent: null,
          note: "This block is classified as Saline due to coastal saltwater intrusion, not groundwater over-extraction. Different mitigation strategies apply (e.g. desalination, saltwater intrusion barriers) rather than standard recharge structures."
        };
      }
      return {
        block: match.block,
        district: match.district,
        category: match.category,
        riskLabel: getRiskLabel(match.category),
        extractionStagePercent: match.extractionStagePercent,
        note: null
      };
    }
  }

  if (manualExtractionPercent !== undefined && manualExtractionPercent !== null) {
    const category = classifyByPercent(manualExtractionPercent);
    return {
      block: blockName || "Unknown",
      district: null,
      category,
      riskLabel: getRiskLabel(category),
      extractionStagePercent: manualExtractionPercent,
      note: "This block wasn't in our CGWB dataset, so this classification is based on your provided extraction percentage using CGWB's official thresholds."
    };
  }

  return {
    block: blockName || "Unknown",
    district: null,
    category: "unknown",
    riskLabel: "Unable to assess",
    extractionStagePercent: null,
    note: "This block isn't in our current dataset, and no extraction percentage was provided. Try one of the known blocks, or provide an estimated extraction percentage."
  };
}

module.exports = { assessRisk, classifyByPercent, getRiskLabel };
