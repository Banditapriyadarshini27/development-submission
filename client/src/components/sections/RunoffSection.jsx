import React from "react";
import { CloudRain, AlertTriangle, Droplets, ArrowDownRight } from "lucide-react";

export default function RunoffSection() {
  return (
    <section id="runoff" className="min-h-screen flex items-center justify-center px-6 py-24 relative z-10">
      <div className="max-w-5xl mx-auto w-full">
        {/* Stage Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-6 shadow-inner">
          <CloudRain className="w-3.5 h-3.5 text-sky-400" />
          <span>Stage 02 • The Waterfall Face & Surface Runoff</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Narrative Column */}
          <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-8 sm:p-10 rounded-3xl shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Odisha receives over <span className="text-sky-400">1,400 mm</span> of monsoon rain. Yet wells run dry by April.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-6">
              Over 80% of Odisha’s total annual rainfall arrives in a fierce 90-day monsoon deluge. 
              On sloped agricultural land and compacted urban basins, water accelerates downward—eroding 
              rich topsoil and draining straight into the Bay of Bengal before it has time to seep into the rock.
            </p>

            <div className="border-l-2 border-teal-500 pl-4 py-1 mb-6 text-sm text-slate-300 italic">
              "Without artificial infiltration structures to slow the velocity of surface water, 
              the natural recharge rate remains under 10% of potential precipitation."
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 border border-slate-700/40 p-4 rounded-2xl">
                <span className="text-2xl font-bold text-teal-400">1,450 mm</span>
                <p className="text-xs text-slate-400 mt-1">Average Coastal Rainfall (Puri/Cuttack)</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/40 p-4 rounded-2xl">
                <span className="text-2xl font-bold text-amber-400">&lt; 90 Days</span>
                <p className="text-xs text-slate-400 mt-1">Monsoon Intensity Window</p>
              </div>
            </div>
          </div>

          {/* Regional Micro-Reality Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-slate-900/75 backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Urban Over-Extraction</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bhubaneswar's extraction rate has surged to <strong>88.66%</strong>, placing it in the CGWB <em>Semi-Critical</em> category due to rapid concrete paving and reduced natural absorption.
              </p>
            </div>

            <div className="bg-slate-900/75 backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Coastal Salinity Ingress</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In blocks like Ersama and Kendrapara, excessive pumping pulls seawater into sweet shallow aquifers, turning well water saline and unpotable.
              </p>
            </div>

            <div className="bg-slate-900/75 backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Western Hard Rock Drought</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In Nuapada & Balangir, non-porous crystalline granites yield little storage, requiring contour trenches and check dams to force recharge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
