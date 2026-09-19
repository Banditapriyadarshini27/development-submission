import { useState } from 'react';

const KNOWN_BLOCKS = [
  "Bamra", "Puri", "Anugul", "Talcher", "Baliapal", "Korei",
  "Jharsuguda", "Bhubaneswar", "Bologarh", "Khurda", "Nayagarh",
  "Nuapada", "Ersama", "Mahakalpada"
];

const BLOCK_COORDS = {
  "Bamra": { lat: 21.53, lon: 84.38 },
  "Puri": { lat: 19.81, lon: 85.83 },
  "Anugul": { lat: 20.85, lon: 85.10 },
  "Talcher": { lat: 20.95, lon: 85.23 },
  "Baliapal": { lat: 21.68, lon: 87.15 },
  "Korei": { lat: 20.85, lon: 86.30 },
  "Jharsuguda": { lat: 21.86, lon: 84.02 },
  "Bhubaneswar": { lat: 20.30, lon: 85.82 },
  "Bologarh": { lat: 20.25, lon: 85.60 },
  "Khurda": { lat: 20.18, lon: 85.62 },
  "Nayagarh": { lat: 20.13, lon: 85.10 },
  "Nuapada": { lat: 20.81, lon: 82.54 },
  "Ersama": { lat: 20.32, lon: 86.36 },
  "Mahakalpada": { lat: 20.30, lon: 86.75 }
};

const CATEGORY_COLORS = {
  safe: "#3D5A3D",
  semi_critical: "#C4472E",
  saline: "#4A7C7E",
  unknown: "#8B6F47"
};

const SUGGESTED_QUESTIONS = [
  "Is this water safe to drink?",
  "What recharge structure should I build here?",
  "How serious is the depletion risk here?",
  "What can I do to reduce my water usage?",
  "Why is this block classified this way?"
];

async function getWeather(blockName) {
  const coords = BLOCK_COORDS[blockName];
  if (!coords) return null;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,precipitation&daily=precipitation_sum&timezone=auto&forecast_days=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      temperature: data.current.temperature_2m,
      currentPrecipitation: data.current.precipitation,
      todayRainfallForecast: data.daily.precipitation_sum[0]
    };
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
}

export default function RiskTool() {
  const [blockName, setBlockName] = useState("Bhubaneswar");
  const [question, setQuestion] = useState("What should I do to manage groundwater here?");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setWeather(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    try {
      const [res, weatherData] = await Promise.all([
        fetch(`${API_URL}/api/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, blockName })
        }),
        getWeather(blockName)
      ]);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "80px 8vw", background: "#EDE6D6" }}>
      <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2.2rem", marginBottom: "8px", color: "#2C4A52" }}>
        Check your block
      </h2>
      <p style={{ color: "#3a4a4d", marginBottom: "30px", maxWidth: "500px" }}>
        Real CGWB 2024 assessment data, combined with AI-generated, source-grounded advice.
      </p>

      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <label style={{ display: "block", marginBottom: "16px", fontWeight: 500 }}>
          Select your block
          <select
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #8B6F47", borderRadius: "4px", fontFamily: "Inter, sans-serif" }}
          >
            {KNOWN_BLOCKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>

        <label style={{ display: "block", marginBottom: "16px", fontWeight: 500 }}>
          Your question
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            style={{ display: "block", width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #8B6F47", borderRadius: "4px", fontFamily: "Inter, sans-serif" }}
          />
        </label>

        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "0.85rem", color: "#777", marginBottom: "8px" }}>Try asking:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuestion(q)}
                style={{
                  padding: "6px 14px", fontSize: "0.85rem", background: "#fff",
                  border: "1px solid #8B6F47", borderRadius: "20px", cursor: "pointer",
                  color: "#2C4A52", fontFamily: "Inter, sans-serif"
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 28px", background: "#2C4A52", color: "#EDE6D6",
            border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontWeight: 500
          }}
        >
          {loading ? "Analyzing..." : "Get Advice"}
        </button>
      </form>

      {error && <p style={{ color: "#C4472E", marginTop: "20px" }}>Error: {error}</p>}

      {result && (
        <div style={{
          marginTop: "30px", maxWidth: "560px", padding: "28px",
          background: "#fff", borderRadius: "6px",
          borderLeft: result.risk ? `6px solid ${CATEGORY_COLORS[result.risk.category] || "#8B6F47"}` : "6px solid #4A7C7E"
        }}>
          {result.risk && (
            <>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                {result.risk.block} {result.risk.district && `· ${result.risk.district} district`}
              </p>
              <h3 style={{ fontFamily: "Fraunces, serif", margin: "6px 0 4px 0", fontSize: "1.6rem" }}>
                {result.risk.riskLabel}
              </h3>
              {result.risk.extractionStagePercent !== null && (
                <p style={{ margin: "0 0 16px 0", fontSize: "0.95rem", color: "#555" }}>
                  {result.risk.extractionStagePercent}% extraction stage
                </p>
              )}
            </>
          )}

          {weather && (
            <div style={{ margin: "12px 0", padding: "12px", background: "#EDE6D6", borderRadius: "4px", fontSize: "0.9rem" }}>
              🌤️ Currently {weather.temperature}°C · Today's rainfall forecast: {weather.todayRainfallForecast}mm
            </div>
          )}

          <p style={{ lineHeight: 1.6, color: "#333" }}>{result.answer}</p>

          {result.sources && result.sources.length > 0 && (
            <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "16px" }}>
              Sources: {result.sources.join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
