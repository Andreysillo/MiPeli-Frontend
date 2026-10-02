import GradientWaves from './GradientWaves';

const base = {
  horizonColor: '#0041f7', waveColor: '#6000ff', crestColor: '#ffffff', speed: 0.32, amplitude: 3.2, waveScale: 1.05, waveRatio: 0.6,
  swell: 0, turbulence: 18, tilt: 1.11, zoom: 1, height: 5.3, fogDepth: 16, detail: 'low', brightness: 0.7, opacity: 0.5,
  grain: true, grainIntensity: 0.04, mouseInteraction: false,
};

// Variantes usadas por las pantallas
export const interactive = { speed: 0.4, brightness: 0.8, opacity: 0.55, grainIntensity: 0.05, mouseInteraction: true, parallaxStrength: 0.4 };

export default function WavesBg(overrides: Partial<typeof base> & { parallaxStrength?: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <GradientWaves {...base} {...overrides} />
    </div>
  );
}
