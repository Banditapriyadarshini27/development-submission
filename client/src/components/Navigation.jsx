import React from "react";
import { Droplet, Activity, Compass } from "lucide-react";

export default function Navigation({ backendOnline, activeSection, onJumpTo }) {
  return (
    <header className="fixed top-5 left-0 right-0 z-50 px-6 max-w-7xl mx-auto flex justify-between items-center pointer-events-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-slate-700/40 px-4 py-2.5 rounded-2xl shadow-2xl pointer-events-auto">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Droplet className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-white text-base">Undercurrent</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Odisha
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Surface to Aquifer Intelligence</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 backdrop-blur-xl border border-slate-700/40 p-1.5 rounded-2xl shadow-2xl pointer-events-auto">
        {[
          { id: "hero", label: "Canopy" },
          { id: "runoff", label: "Gorge & Runoff" },
          { id: "risk", label: "CGWB Risk" },
          { id: "blueprints", label: "RWH Strata" },
          { id: "advisor", label: "Granite AI" }
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onJumpTo(item.id)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all ${
              activeSection === item.id
                ? "bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-md shadow-teal-500/25"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Live System Status Indicator */}
      <div className="flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-xl border border-slate-700/40 px-3.5 py-2 rounded-2xl shadow-2xl pointer-events-auto">
        <span className="relative flex h-2.5 w-2.5">
          {backendOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${backendOnline ? "bg-emerald-500" : "bg-red-500"}`}></span>
        </span>
        <span className="text-xs font-medium text-slate-300 hidden sm:inline">
          {backendOnline ? "API Live :5000" : "Offline"}
        </span>
      </div>
    </header>
  );
}
