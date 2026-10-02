import WavesBg, { loading } from '../components/WavesBg';
import { useApp } from '../store';

// Anillos cónicos concéntricos: [ángulo inicial, gradiente, máscara (radios %), opacidad, animación]
const rings = [
  ['0deg', 'transparent 0deg, #ffffff 90deg, transparent 180deg', [35, 37, 39, 41], 0.8, 'mp-ring-rot 3s linear infinite'],
  ['0deg', 'transparent 0deg, #ffffff 120deg, rgba(255,255,255,.5) 240deg, transparent 360deg', [42, 44, 48, 50], 0.9, 'mp-ring-rot 2.5s cubic-bezier(.4,0,.6,1) infinite'],
  ['180deg', 'transparent 0deg, rgba(255,255,255,.6) 45deg, transparent 90deg', [52, 54, 56, 58], 0.35, 'mp-ring-rot-rev 4s cubic-bezier(.4,0,.6,1) infinite'],
  ['270deg', 'transparent 0deg, rgba(255,255,255,.4) 20deg, transparent 40deg', [61, 62, 63, 64], 0.5, 'mp-ring-rot 3.5s linear infinite'],
] as const;

export default function Loading() {
  const { t } = useApp();
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#04030f' }}>
      <WavesBg {...loading} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ position: 'relative', width: 128, height: 128, margin: '0 auto', animation: 'mp-scale-pulse 4s cubic-bezier(.4,0,.6,1) infinite' }}>
          {rings.map(([from, stops, [a, b, c, d], opacity, animation], i) => {
            const mask = `radial-gradient(circle at 50% 50%, transparent ${a}%, #000 ${b}%, #000 ${c}%, transparent ${d}%)`;
            return <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from ${from}, ${stops})`, WebkitMaskImage: mask, maskImage: mask, opacity, animation }} />;
          })}
        </div>
        <h1 className="mp-heading" style={{ fontSize: 32, margin: '48px 0 0' }}><span style={{ display: 'inline-block', animation: 'mp-breathe-title 3s cubic-bezier(.4,0,.6,1) infinite' }}>{t.loadingTitle}</span></h1>
        <p className="mp-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.82)', margin: '12px 0 22px' }}><span style={{ display: 'inline-block', animation: 'mp-breathe-sub 4s cubic-bezier(.4,0,.6,1) infinite' }}>{t.loadingSub}</span></p>
        <div style={{ width: 220, height: 6, borderRadius: 999, background: 'rgba(255,255,255,.2)', overflow: 'hidden', margin: '0 auto' }}>
          <div style={{ height: '100%', background: '#fff', width: '82%', animation: 'mp-fill 2.4s cubic-bezier(.2,.7,.2,1) both' }} />
        </div>
      </div>
    </div>
  );
}
