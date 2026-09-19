import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, FileText, RefreshCw, AlertCircle } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "What can I build on a sloped field to stop water from running off?",
  "Can I construct a percolation pit for my building in Bhubaneswar?",
  "How do check dams compare with percolation pits?",
  "What solutions prevent groundwater depletion in semi-critical areas?"
];

export default function GraniteAdvisorSection({ activeBlock = "Bhubaneswar", initialPrompt = "" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Welcome to the Undercurrent Sustainability Advisor. I am grounded in Odisha's official CGWB hydrogeological data and local artificial recharge manuals. Ask me about groundwater risks, soil infiltration, or construction guidelines for any block in Odisha.",
      sources: [],
      risk: null
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (questionText = input) => {
    const q = questionText.trim();
    if (!q || loading) return;

    const userMessage = { role: "user", text: q };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          blockName: activeBlock
        })
      });

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || data.error || "No answer returned.",
          sources: data.sources || [],
          risk: data.risk || null
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Connection Error: Unable to communicate with the Undercurrent backend on port 5000.",
          sources: [],
          risk: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        text: "Conversation refreshed. Ask a new question regarding groundwater management or RWH structures.",
        sources: [],
        risk: null
      }
    ]);
  };

  return (
    <section id="advisor" className="min-h-screen flex items-center justify-center px-6 py-24 relative z-10">
      <div className="max-w-5xl mx-auto w-full">
        {/* Stage Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold mb-6 shadow-inner">
          <Bot className="w-3.5 h-3.5 text-sky-400" />
          <span>Stage 05 • Deep Groundwater Table — IBM watsonx Granite RAG Advisor</span>
        </div>

        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 p-6 sm:p-10 rounded-3xl shadow-2xl flex flex-col min-h-[640px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <span>Groundwater Sustainability Advisor</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Granite 4h-small
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Currently linked to block context: <strong className="text-sky-400">{activeBlock}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Thread</span>
            </button>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap gap-2 py-4">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInput(prompt);
                  handleSend(prompt);
                }}
                className="text-xs bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/40 px-3 py-1.5 rounded-full transition-all cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[380px] my-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-teal-600 to-sky-600 text-white rounded-br-none shadow-lg"
                      : "bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-bl-none shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Attached Risk Status Pill */}
                  {m.risk && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px]">Location Context:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {m.risk.block} ({m.risk.riskLabel})
                      </span>
                    </div>
                  )}

                  {/* Grounded Document Citations */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex flex-wrap items-center gap-2">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                        Grounded References:
                      </span>
                      {m.sources.map((src, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-300 text-[10px] font-mono"
                        >
                          <FileText className="w-3 h-3" />
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-sky-400 py-2">
                <div className="w-5 h-5 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin"></div>
                <span>Retrieving local hydrological context & consulting Granite...</span>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Chat Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="pt-4 border-t border-slate-800 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder={`Ask a groundwater question about ${activeBlock} or artificial recharge...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-400 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-white font-bold p-3 rounded-xl transition-all shadow-lg shadow-teal-500/20 disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
