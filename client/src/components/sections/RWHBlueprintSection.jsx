import React, { useState } from "react";
import { Layers, ShieldCheck, Wrench, CheckCircle2 } from "lucide-react";

const STRUCTURES = [
  {
    id: "percolation-pits",
    title: "Percolation Pits",
    scope: "Individual Rooftops & Paved Plots",
    dimensions: "1–2m depth × 1m diameter",
    soil: "Sandy / Loamy Permeable Soil",
    odishaSuitability: "Urban Bhubaneswar, Cuttack, Puri (Rooftop RWH Mandate)",
    costEstimate: "₹8,000 – ₹15,000",
    description: "Small pits dug into the earth and backfilled with coarse gravel, 20mm aggregate, and sand. Captures rooftop rainwater and conducts it directly into the subsoil before it evaporates or joins open drains.",
    specs: [
      "Top Layer: 0.3m Coarse Sand (Filters debris and sediment)",
      "Mid Layer: 0.5m 20mm Broken Stone Metal",
      "Base Layer: 0.7m 40mm Graded River Gravel",
      "Perforated PVC central recharge pipe (optional for deeper alluvium)"
    ]
  },
  {
    id: "check-dams",
    title: "Check Dams",
    scope: "Community Streams & Drainage Channels",
    dimensions: "1.5–3m height × 8–15m crest length",
    soil: "Fractured Rock & Riverbeds",
    odishaSuitability: "Mayurbhanj, Keonjhar, Koraput, Rayagada (Hilly Drainage)",
    costEstimate: "₹1,50,000 – ₹4,00,000 (Pani Panchayat / MGNREGS)",
    description: "Small masonry or gabion barriers built across non-perennial streams. They arrest monsoon runoff velocity, pond water upstream, and allow water to percolate over tens of acres of adjacent farmland.",
    specs: [
      "Upstream sedimentation basin with stone apron",
      "Masonry / Wire-mesh gabion boulder structure with spillway",
      "Downstream water cushion to prevent channel scouring",
      "Increases water table within 1.5 km radius of structure"
    ]
  },
  {
    id: "contour-trenches",
    title: "Contour Trenches",
    scope: "Sloped Farmland & Watershed Slopes",
    dimensions: "0.5m depth × 0.5m width (along contour lines)",
    soil: "Red Laterite & Gravelly Slopes",
    odishaSuitability: "Nuapada, Balangir, Kalahandi (KBK Agricultural Slopes)",
    costEstimate: "₹20,000 – ₹45,000 per hectare",
    description: "Continuous or staggered horizontal ditches excavated precisely along the natural elevation contour lines of sloping terrain. Intercepts sheet runoff, holds water in place, and nourishes trees planted on berms.",
    specs: [
      "Excavated soil deposited on downstream side to form berm",
      "Combined with vetiver grass or tree plantation along edge",
      "Reduces hillside runoff velocity by 70%",
      "Prevents gully erosion and boosts moisture retention for rabi crops"
    ]
  }
];

export default function RWHBlueprintSection({ onAskAboutStructure }) {
  const [activeTab, setActiveTab] = useState("percolation-pits");
  const current = STRUCTURES.find(s => s.id === activeTab);

  return (
    <section id="blueprints" className="min-h-screen flex items-center justify-center px-6 py-24 relative z-10">
      <div className="max-w-5xl mx-auto w-full">
        {/* Stage Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-inner">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Stage 04 • Subsurface Aquifer Cross-Section & Infiltration Blueprints</span>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-10 rounded-3xl shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Recharge Structures for Odisha's Soil Strata
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Engineering specifications adapted to alluvium, red laterite, and hard rock aquifers.
              </p>
            </div>

            {/* Structure Tabs */}
            <div className="flex flex-wrap gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/50">
              {STRUCTURES.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveTab(s.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    activeTab === s.id
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Overview Column */}
            <div className="lg:col-span-6 flex flex-col gap-5">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-teal-400">
                  Target Domain: {current.scope}
                </span>
                <h4 className="text-2xl font-black text-white mt-1">{current.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {current.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/40">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Dimensions</span>
                  <p className="text-xs font-bold text-white mt-0.5">{current.dimensions}</p>
                </div>
                <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/40">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Cost Estimate</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">{current.costEstimate}</p>
                </div>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/40">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Odisha Geographic Fit</span>
                <p className="text-xs font-medium text-sky-300 mt-0.5">{current.odishaSuitability}</p>
              </div>

              <button
                type="button"
                onClick={() => onAskAboutStructure(`How do I construct and maintain ${current.title} in Odisha?`)}
                className="w-full bg-slate-800/90 hover:bg-slate-700/90 border border-emerald-500/30 text-emerald-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>Consult IBM Granite on {current.title} Blueprints</span>
              </button>
            </div>

            {/* Specifications & Cross-Section Breakdown */}
            <div className="lg:col-span-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/40">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Technical Cross-Section Specs
              </h5>

              <div className="flex flex-col gap-3">
                {current.specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
                <span>Groundwater Vector Reference:</span>
                <code className="bg-slate-900 px-2 py-0.5 rounded text-sky-300 font-mono">
                  {current.id}.txt
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
