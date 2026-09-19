import { useEffect, useRef, useState } from 'react';

// Tracks how far the user has scrolled through the wrapping container (0 to 1)
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.min(Math.max(scrolled / total, 0), 1);
      setProgress(pct);
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return progress;
}

export default function WaterTableScroll({ containerRef, children }) {
  const progress = useScrollProgress(containerRef);

  // Water table starts near the top (20% depth) and drops to near the bottom (80% depth)
  const waterLevel = 20 + progress * 60;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div className="sticky-illustration">
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Soil layer */}
          <rect x="0" y="0" width="800" height="600" fill="#EDE6D6" />
          <rect x="0" y="0" width="800" height="600" fill="#8B6F47" opacity="0.15" />

          {/* Water table fill, animated by scroll */}
          <rect
            x="0"
            y={waterLevel * 6}
            width="800"
            height={600 - waterLevel * 6}
            fill="#2C4A52"
            opacity="0.55"
          />

          {/* Water table line + label */}
          <line
            x1="0" y1={waterLevel * 6}
            x2="800" y2={waterLevel * 6}
            stroke="#4A7C7E" strokeWidth="3" strokeDasharray="6,6"
          />
          <text
            x="20" y={waterLevel * 6 - 12}
            fontFamily="Inter" fontSize="16" fill="#2C4A52"
          >
            Water table: {Math.round(60 + progress * 40)}% depleted
          </text>

          {/* Simple borewell shaft */}
          <rect x="390" y="0" width="20" height="600" fill="#5a4a35" opacity="0.4" />
        </svg>
      </div>

      {/* Narrative text scrolls over the sticky illustration */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
