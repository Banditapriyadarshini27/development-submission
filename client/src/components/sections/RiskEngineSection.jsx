import React, { useState, useEffect } from "react";
import { Search, Compass, Activity, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";

const ODISHA_BLOCKS = [
  // Semi-Critical
  { name: "Bhubaneswar", district: "Khurda", category: "semi_critical", percent: 88.66 },
  { name: "Nayagarh", district: "Nayagarh", category: "semi_critical", percent: 85.63 },
  { name: "Bologarh", district: "Khurda", category: "semi_critical", percent: 84.47 },
  { name: "Baliapal", district: "Balasore", category: "semi_critical", percent: 83.19 },
  { name: "Nuapada", district: "Nuapada", category: "semi_critical", percent: 81.16 },
  { name: "Khurda", district: "Khurda", category: "semi_critical", percent: 77.16 },
  { name: "Talcher", district: "Angul", category: "semi_critical", percent: 76.83 },
  { name: "Korei", district: "Jajpur", category: "semi_critical", percent: 76.52 },
  { name: "Jharsuguda", district: "Jharsuguda", category: "semi_critical", percent: 70.85 },
  // Saline Ingress
  { name: "Ersama", district: "Jagatsinghpur", category: "saline", percent: null },
  { name: "Mahakalpada", district: "Kendrapara", category: "saline", percent: null },
  { name: "Marshaghai", district: "Kendrapara", category: "saline", percent: null },
  { name: "Rajkanika", district: "Kendrapara", category: "saline", percent: null },
  { name: "Rajnagar", district: "Kendrapara", category: "saline", percent: null },
  // Safe
  { name: "Puri", district: "Puri", category: "safe", percent: 64.42 },
  { name: "Anugul", district: "Angul", category: "safe", percent: 63.47 },
  { name: "Bamra", district: "Sambalpur", category: "safe", percent: 47.27 }
];

export default function RiskEngineSection({ onSelectBlockForChat }) {
  const [selectedBlock, setSelectedBlock] = useState("Bhubaneswar");
  const [useCustomPercent, setUseCustomPercent] = useState(false);
  const [customPercent, setCustomPercent] = useState("");
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    assessBlock(selectedBlock);
  }, []);

  const assessBlock = async (blockName = selectedBlock) => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const payload = useCustomPercent && customPercent !== ""
        ? { blockName, manualExtractionPercent: parseFloat(customPercent) }
        : { blockName };

      const res = await fetch(`${API_URL}/api/risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setRiskData(data);
    } catch (err) {
      console.error("Risk evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStyles = (category) => {
    switch (category) {
      case "safe":
        return {
          pill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
          bar: "bg-gradient-to-r from-emerald-500 to-teal-400",
          border: "border-l-4 border-l-emerald-500"
        };
      case "semi_critical":
        return {
          pill: "bg-amber-500/15 text-amber-300 border-amber-500/30",
          bar: "bg-gradient-to-r from-amber-500 to-yellow-400",
          border: "border-l-4 border-l-amber-500"
        };
      case "critical":
      case "over_exploited":
        return {
          pill: "bg-red-500/15 text-red-300 border-red-500/30",
          bar: "bg-gradient-to-r from-red-500 to-rose-400",
          border: "border-l-4 border-l-red-500"
        };
      case "saline":
      default:
        return {
          pill: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
          bar: "bg-gradient-to-r from-cyan-500 to-sky-400",
          border: "border-l-4 border-l-cyan-500"
        };
    }
  };

  return (
    <section id="risk" className="min-h-screen flex items-center justify-center px-6 py-24 relative z-10">
      <div className="max-w-5xl mx-auto w-full">
        {/* Stage Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6 shadow-inner">
          <Activity className="w-3.5 h-3.5 text-teal-400" />
          <span>Stage 03 • Plunge Pool & Impact Point — Block Risk Engine</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Card */}
          <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2">Check Aquifer Vulnerability</h3>
            <p className="text-xs text-slate-400 mb-6">
              Official Central Ground Water Board assessment status across Odisha's 314 blocks.
            </p>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Select Administrative Block
                </label>
                <select
                  value={selectedBlock}
                  onChange={(e) => {
                    setSelectedBlock(e.target.value);
                    assessBlock(e.target.value);
                  }}
                  className="w-full bg-slate-800/90 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400 transition-colors"
                >
                  <optgroup label="High Extraction (Semi-Critical Hotspots)">
                    {ODISHA_BLOCKS.filter(b => b.category === "semi_critical").map(b => (
                      <option key={b.name} value={b.name}>{b.name} ({b.district}) — {b.percent}%</option>
                    ))}
                  </optgroup>
                  <optgroup label="Coastal Saline Ingress Zones">
                    {ODISHA_BLOCKS.filter(b => b.category === "saline").map(b => (
                      <option key={b.name} value={b.name}>{b.name} ({b.district}) — Saline</option>
                    ))}
                  </optgroup>
                  <optgroup label="Safe Recharge Basins">
                    {ODISHA_BLOCKS.filter(b => b.category === "safe").map(b => (
                      <option key={b.name} value={b.name}>{b.name} ({b.district}) — {b.percent}%</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Custom Percentage Toggle */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-slate-400">Override with Custom Extraction %?</span>
                <button
                  type="button"
                  onClick={() => setUseCustomPercent(!useCustomPercent)}
                  className="text-xs font-semibold text-sky-400 hover:underline cursor-pointer"
                >
                  {useCustomPercent ? "Use Official Data" : "Custom %"}
                </button>
              </div>

              {useCustomPercent && (
                <div>
                  <input
                    type="number"
                    placeholder="Enter extraction percentage (e.g. 92.5)"
                    value={customPercent}
                    onChange={(e) => setCustomPercent(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700/80 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal-400"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => assessBlock()}
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? "Evaluating Block..." : "Evaluate Groundwater Status"}
              </button>
            </div>
          </div>

          {/* Assessment Result Display */}
          <div className="lg:col-span-6">
            {riskData && (
              <div className={`bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col gap-5 ${getCategoryStyles(riskData.category).border}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-2xl font-black text-white">{riskData.block}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {riskData.district ? `${riskData.district} District, Odisha` : "Custom Location Evaluation"}
                    </p>
                  </div>
                  <span className={`text-xs uppercase font-extrabold tracking-wider px-3.5 py-1 rounded-full border ${getCategoryStyles(riskData.category).pill}`}>
                    {riskData.riskLabel}
                  </span>
                </div>

                {/* Extraction Progress Gauge */}
                {riskData.extractionStagePercent !== null && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 font-semibold mb-2">
                      <span>Groundwater Extraction Stage</span>
                      <span className="text-white font-bold text-sm">{riskData.extractionStagePercent}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getCategoryStyles(riskData.category).bar}`}
                        style={{ width: `${Math.min(riskData.extractionStagePercent, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>0% (Untapped)</span>
                      <span>70% (Semi-Critical)</span>
                      <span>100% (Over-Exploited)</span>
                    </div>
                  </div>
                )}

                {/* Specific Advisory Note */}
                {riskData.note && (
                  <div className="bg-slate-800/60 border border-slate-700/50 p-3.5 rounded-2xl flex gap-3 text-xs text-slate-300 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{riskData.note}</span>
                  </div>
                )}

                {/* Action to link to chat */}
                <button
                  type="button"
                  onClick={() => onSelectBlockForChat(riskData.block)}
                  className="w-full mt-2 bg-slate-800/80 hover:bg-slate-700/80 border border-teal-500/30 text-teal-300 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Ask IBM Granite for recharge solutions in {riskData.block}</span>
                  <ChevronRight className="w-4 h-4 text-teal-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
