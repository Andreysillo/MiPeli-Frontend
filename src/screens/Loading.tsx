import { useEffect, useState } from 'react';
import WavesBg, { loading } from '../components/WavesBg';
import { LOADING_MS, useApp } from '../store';

// Anillos cónicos concéntricos: [ángulo inicial, gradiente, máscara (radios %), opacidad, animación]
const rings = [
  ['0deg', 'transparent 0deg, #ffffff 90deg, transparent 180deg', [35, 37, 39, 41], 0.8, 'mp-ring-rot 3s linear infinite'],
  ['0deg', 'transparent 0deg, #ffffff 120deg, rgba(255,255,255,.5) 240deg, transparent 360deg', [42, 44, 48, 50], 0.9, 'mp-ring-rot 2.5s cubic-bezier(.4,0,.6,1) infinite'],
  ['180deg', 'transparent 0deg, rgba(255,255,255,.6) 45deg, transparent 90deg', [52, 54, 56, 58], 0.35, 'mp-ring-rot-rev 4s cubic-bezier(.4,0,.6,1) infinite'],
  ['270deg', 'transparent 0deg, rgba(255,255,255,.4) 20deg, transparent 40deg', [61, 62, 63, 64], 0.5, 'mp-ring-rot 3.5s linear infinite'],
] as const;

const DURATION = LOADING_MS / 1000;

export default function Loading() {
  const { t } = useApp();
  const [msg, setMsg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setMsg(m => Math.min(m + 1, t.loadingSteps.length - 1)), (DURATION * 1000) / t.loadingSteps.length);
    return () => clearInterval(id);
  }, [t]);

  return (
    <section className="mp-screen" style={{ display: 'grid', placeItems: 'center', textAlign: 'center' }}>
      <WavesBg {...loading} />
      <div className="mp-content mp-stack" style={{ alignItems: 'center', padding: 24 }}>
        <div style={{ position: 'relative', width: 128, height: 128, animation: 'mp-scale-pulse 4s cubic-bezier(.4,0,.6,1) infinite' }} aria-hidden>
          {rings.map(([from, stops, [a, b, c, d], opacity, animation], i) => {
            const mask = `radial-gradient(circle at 50% 50%, transparent ${a}%, #000 ${b}%, #000 ${c}%, transparent ${d}%)`;
            return <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(from ${from}, ${stops})`, WebkitMaskImage: mask, maskImage: mask, opacity, animation }} />;
          })}
        </div>
        <h1 className="mp-title" style={{ marginTop: 44 }}>{t.loadingTitle}</h1>
        <p className="mp-lead" style={{ marginTop: 10, minHeight: '1.6em' }} aria-live="polite">{t.loadingSteps[msg]}</p>
        <div className="mp-progress" style={{ width: 240, marginTop: 24 }} role="progressbar" aria-label={t.loadingTitle}>
          <span style={{ animation: `mp-fill ${DURATION}s cubic-bezier(.3,.6,.4,1) both` }} />
        </div>
      </div>
    </section>
  );
}
