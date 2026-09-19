import { useRef } from 'react';
import WaterTableScroll from './components/WaterTableScroll';
import RiskTool from './components/RiskTool';
import RainfallCalculator from './components/RainfallCalculator';
import RiskMap from './components/RiskMap';
import './App.css';

function App() {
  const scrollRef = useRef(null);

  return (
    <>
      <WaterTableScroll containerRef={scrollRef}>
        <div className="hero">
          <h1>Odisha's water table is falling.</h1>
          <p>Most people won't know until their borewell runs dry.</p>
        </div>
        <div className="narrative-section">
          <div className="narrative-text">
            <h2>Rain falls, and the ground absorbs it.</h2>
            <p>Every monsoon, Odisha receives an average of 1,419mm of rainfall — enough to sustain groundwater if extraction stays balanced.</p>
          </div>
        </div>
        <div className="narrative-section">
          <div className="narrative-text">
            <h2>But extraction is rising.</h2>
            <p>Nine blocks across the state — including parts of Bhubaneswar, Nayagarh, and Talcher — have crossed 70% extraction, entering the Semi-Critical zone.</p>
          </div>
        </div>
      </WaterTableScroll>

      <RiskTool />
      <RainfallCalculator />
      <RiskMap />
    </>
  );
}

export default App;