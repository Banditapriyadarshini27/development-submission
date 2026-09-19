import React from "react";
import { ArrowDown, Sun, Waves, ShieldCheck } from "lucide-react";

export default function HeroSection({ onScrollDown }) {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10 pt-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6 shadow-inner">
          <Sun className="w-3.5 h-3.5 text-amber-300" />
          <span>Stage 01 • Sal & Teak Forest Canopy</span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Where Surface Water Meets the{" "}
          <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Undercurrent
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          In Odisha, monsoons cascade through lush river gorges only to rush out to sea. 
          Scroll down the waterfall to penetrate the earth, explore subterranean aquifers, 
          and discover how artificial recharge preserves our hidden water.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 text-xs text-slate-300 font-medium">
            <Waves className="w-4 h-4 text-sky-400" />
            <span>Dynamic WebGL Fluid Shader</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 text-xs text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CGWB 2024 Odisha Data</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 backdrop-blur-md border border-slate-700/40 text-xs text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span>IBM Granite Multilingual RAG</span>
          </div>
        </div>

        {/* Animated Scroll Down Prompt */}
        <button
          type="button"
          onClick={onScrollDown}
          className="group flex flex-col items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
        >
          <span>Descend the Waterfall</span>
          <div className="w-8 h-12 rounded-full border-2 border-slate-500/50 flex items-start justify-center p-1.5 group-hover:border-teal-400 transition-colors">
            <div className="w-1.5 h-3 rounded-full bg-teal-400 animate-bounce"></div>
          </div>
        </button>
      </div>
    </section>
  );
}
