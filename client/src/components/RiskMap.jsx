import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const BLOCKS = [
  { name: "Bamra", district: "Sambalpur", category: "safe", lat: 21.53, lon: 84.38 },
  { name: "Anugul", district: "Angul", category: "safe", lat: 20.85, lon: 85.10 },
  { name: "Puri", district: "Puri", category: "safe", lat: 19.81, lon: 85.83 },
  { name: "Talcher", district: "Angul", category: "semi_critical", lat: 20.95, lon: 85.23 },
  { name: "Baliapal", district: "Balasore", category: "semi_critical", lat: 21.68, lon: 87.15 },
  { name: "Korei", district: "Jajpur", category: "semi_critical", lat: 20.85, lon: 86.30 },
  { name: "Jharsuguda", district: "Jharsuguda", category: "semi_critical", lat: 21.86, lon: 84.02 },
  { name: "Bhubaneswar", district: "Khurda", category: "semi_critical", lat: 20.30, lon: 85.82 },
  { name: "Bologarh", district: "Khurda", category: "semi_critical", lat: 20.25, lon: 85.60 },
  { name: "Khurda", district: "Khurda", category: "semi_critical", lat: 20.18, lon: 85.62 },
  { name: "Nayagarh", district: "Nayagarh", category: "semi_critical", lat: 20.13, lon: 85.10 },
  { name: "Nuapada", district: "Nuapada", category: "semi_critical", lat: 20.81, lon: 82.54 },
  { name: "Ersama", district: "Jagatsinghpur", category: "saline", lat: 20.32, lon: 86.36 },
  { name: "Mahakalpada", district: "Kendrapara", category: "saline", lat: 20.30, lon: 86.75 }
];

const COLORS = {
  safe: "#3D5A3D",
  semi_critical: "#C4472E",
  saline: "#4A7C7E"
};

const LABELS = {
  safe: "Safe",
  semi_critical: "Semi-Critical",
  saline: "Saline"
};

export default function RiskMap() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ padding: "80px 8vw", background: "#EDE6D6" }}>
      <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "2.2rem", marginBottom: "8px", color: "#2C4A52" }}>
        Where the risk sits
      </h2>
      <p style={{ color: "#3a4a4d", marginBottom: "30px", maxWidth: "500px" }}>
        Real CGWB-assessed blocks across Odisha. Click a point for details.
      </p>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ width: "100%", maxWidth: "600px", height: "500px", borderRadius: "8px", overflow: "hidden" }}>
          <MapContainer
            center={[20.5, 84.8]}
            zoom={7}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {BLOCKS.map((b) => (
              <CircleMarker
                key={b.name}
                center={[b.lat, b.lon]}
                radius={9}
                pathOptions={{
                  color: "#fff",
                  weight: 2,
                  fillColor: COLORS[b.category],
                  fillOpacity: 0.9
                }}
                eventHandlers={{
                  mouseover: () => setHovered(b),
                  mouseout: () => setHovered(null)
                }}
              >
                <Popup>
                  <strong>{b.name}</strong><br />
                  {b.district} district<br />
                  {LABELS[b.category]}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <div style={{ minWidth: "220px" }}>
          <div style={{ marginBottom: "20px" }}>
            {Object.entries(COLORS).map(([key, color]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: color }} />
                <span style={{ fontSize: "0.9rem", color: "#3a4a4d" }}>{LABELS[key]}</span>
              </div>
            ))}
          </div>

          {hovered ? (
            <div style={{ padding: "16px", background: "#fff", borderRadius: "6px", borderLeft: `4px solid ${COLORS[hovered.category]}` }}>
              <strong style={{ fontFamily: "Fraunces, serif" }}>{hovered.name}</strong>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#555" }}>
                {hovered.district} district · {LABELS[hovered.category]}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "#999" }}>Hover or click a point on the map.</p>
          )}
        </div>
      </div>
    </div>
  );
}
