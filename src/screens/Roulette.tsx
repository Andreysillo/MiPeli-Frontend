import { useEffect, useRef, useState } from 'react';
import GlowButton from '../components/GlowButton';
import { driftMovies, type Movie } from '../data';
import { useApp } from '../store';

const random = () => driftMovies[Math.floor(Math.random() * driftMovies.length)];

// Modal "Elegir por mí": baraja ~22 pósters y se queda con uno, con 10 s de cuenta atrás en la barra
export default function Roulette() {
  const { set, t } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [pick, setPick] = useState<Movie | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(undefined);

  const spin = () => {
    clearInterval(timer.current);
    setSpinning(true);
    let n = 0;
    timer.current = window.setInterval(() => {
      setPick(random());
      if (++n <= 22) return;
      clearInterval(timer.current);
      setPick(random());
      setSpinning(false);
      const el = bar.current;
      if (el) { el.style.transition = 'none'; el.style.width = '100%'; void el.offsetWidth; el.style.transition = 'width 10s linear'; el.style.width = '0%'; }
    }, 80);
  };

  useEffect(() => {
    const id = setTimeout(spin, 80);
    return () => { clearTimeout(id); clearInterval(timer.current); };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(4,3,15,.82)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="mp-card" style={{ width: '100%', maxWidth: 420, padding: 26, textAlign: 'center', background: 'rgba(20,16,44,.6)' }}>
        <p className="mp-mono" style={{ fontSize: 11, letterSpacing: '.14em', color: '#a9c0ff', margin: 0 }}>{t.rouletteKick}</p>
        <div style={{ margin: '18px auto 0', width: 170, aspectRatio: '2/3', borderRadius: 16, background: '#141a3a', backgroundImage: 'repeating-linear-gradient(135deg,rgba(255,255,255,.12) 0 8px,transparent 8px 16px)', border: '1px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 14, filter: spinning ? 'blur(2px)' : 'none', transition: 'filter .2s' }}>
          <div>
            <div className="mp-heading" style={{ fontSize: 22 }}>{pick ? pick.title : '—'}</div>
            <div className="mp-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>{pick?.subtitle}</div>
          </div>
        </div>
        <h2 className="mp-heading" style={{ fontSize: 24, margin: '20px 0 2px' }}>{spinning ? t.spinning : t.rouletteHeadline}</h2>
        <p style={{ fontSize: 13, color: 'rgba(238,241,255,.78)', margin: '0 0 14px' }}>{!spinning && pick ? t.rouletteSub : ''}</p>
        <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,.2)', overflow: 'hidden', marginBottom: 16 }}><div ref={bar} style={{ height: '100%', background: '#fff', width: '100%' }} /></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><GlowButton label={spinning ? t.spinning : t.spin} onClick={spin} /></div>
          <div style={{ flex: 1 }}><GlowButton label={t.close} bg="#0a0a1e" color="#cdd7ff" onClick={() => set({ showRoulette: false })} /></div>
        </div>
      </div>
    </div>
  );
}
