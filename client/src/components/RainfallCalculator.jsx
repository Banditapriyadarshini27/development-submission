import { useState } from 'react';

// Approximate average annual rainfall by district (mm) — CGWB 2024 report
const DISTRICT_RAINFALL = {
  "Khurda": 1450,
  "Angul": 1400,
  "Sambalpur": 1489,
  "Puri": 1350,
  "Balasore": 1550,
  "Jajpur": 1400,
  "Jharsuguda": 1420,
  "Nayagarh": 1380,
  "Nuapada": 1300,
  "Statewide average": 1419.2
};

const RUNOFF_COEFFICIENT = 0.85; // typical for a hard rooftop

export default function RainfallCalculator() {
  const [district, setDistrict] = useState("Statewide average");
  const [roofArea, setRoofArea] = useState(1000);

  const rainfallMm = DISTRICT_RAINFALL[district];
  // Formula: Liters = Roof Area (sq.m) x Rainfall (mm) x Runoff Coefficient
  const roofAreaSqM = roofArea * 0.0929; // convert sq ft to sq m
  const harvestableLiters = roofAreaSqM * rainfallMm * RUNOFF_COEFFICIENT;

  return (
    <div style={{ padding: "80px 8vw", background: "#fff" }}>
      <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2.2rem", marginBottom: "8px", color: "#2C4A52" }}>
        How much rain could you harvest?
      </h2>
      <p style={{ color: "#3a4a4d", marginBottom: "30px", maxWidth: "500px" }}>
        Based on average district rainfall and a standard rooftop runoff coefficient of 85%.
      </p>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", maxWidth: "600px", marginBottom: "30px" }}>
        <label style={{ flex: 1, minWidth: "220px" }}>
          Your district
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            style={{ display: "block", width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #8B6F47", borderRadius: "4px" }}
          >
            {Object.keys(DISTRICT_RAINFALL).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label style={{ flex: 1, minWidth: "220px" }}>
          Roof area (sq ft)
          <input
            type="number"
            value={roofArea}
            onChange={(e) => setRoofArea(Number(e.target.value))}
            min="0"
            style={{ display: "block", width: "100%", padding: "10px", marginTop: "6px", border: "1px solid #8B6F47", borderRadius: "4px" }}
          />
        </label>
      </div>

      <div style={{
        padding: "28px", background: "#EDE6D6", borderRadius: "6px",
        borderLeft: "6px solid #4A7C7E", maxWidth: "600px"
      }}>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>Estimated annual harvest</p>
        <h3 style={{ fontFamily: "Fraunces, serif", fontSize: "2.4rem", margin: "6px 0", color: "#2C4A52" }}>
          {Math.round(harvestableLiters).toLocaleString()} liters/year
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#555", margin: 0 }}>
          From a {roofArea} sq ft roof at {rainfallMm}mm average annual rainfall in {district}.
        </p>
      </div>

      <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "20px", maxWidth: "600px" }}>
        Formula: Roof Area (m²) × Rainfall (mm) × Runoff Coefficient (0.85). Source: CGWB Dynamic Ground Water Resources of Odisha, 2024.
      </p>
    </div>
  );
}
