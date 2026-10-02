import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { DiceFive, X } from '@phosphor-icons/react';
import Button from '../components/Button';
import { poster, recommended, type Movie } from '../data';
import { useApp } from '../store';

// Modal "Elegir por mí": baraja tus recomendaciones y se queda con una, con 10 s de cuenta atrás en la barra
export default function Roulette() {
  const { st, set, t } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [pick, setPick] = useState<Movie | null>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const reel = useRef<HTMLImageElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const timer = useRef<number>(undefined);
  const pool = recommended.slice(0, Math.max(st.numMovies, 5));
  const close = () => set({ showRoulette: false });

  const spin = () => {
    clearInterval(timer.current);
    setSpinning(true);
    let n = 0;
    const random = () => pool[Math.floor(Math.random() * pool.length)];
    timer.current = window.setInterval(() => {
      setPick(random());
      if (++n <= 22) return;
      clearInterval(timer.current);
      setPick(random());
      setSpinning(false);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.fromTo(reel.current, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
      gsap.fromTo(bar.current, { scaleX: 1 }, { scaleX: 0, duration: 10, ease: 'none' });
    }, 80);
  };

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    const id = setTimeout(spin, 80);
    return () => { clearTimeout(id); clearInterval(timer.current); gsap.killTweensOf(bar.current); window.removeEventListener('keydown', onKey); opener?.focus(); };
  }, []);

  return (
    <div className="mp-modal" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="roulette-title" className="mp-card mp-stack" style={{ position: 'relative', width: '100%', maxWidth: 400, padding: 28, gap: 6, alignItems: 'center', textAlign: 'center', background: 'rgba(20,16,48,.92)' }}>
        <button ref={closeBtn} onClick={close} aria-label={t.close} className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 10, right: 10, width: 44, padding: 0 }}><X size={20} aria-hidden /></button>
        <span className="mp-kicker">{t.rouletteKick}</span>
        <div style={{ width: 180, aspectRatio: '2 / 3', margin: '14px 0 10px', borderRadius: 'var(--radius-poster)', overflow: 'hidden', border: '1px solid var(--border)', background: '#141030' }}>
          {pick && <img ref={reel} src={poster(pick)} alt={spinning ? '' : `${pick.title} (${pick.year})`} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: spinning ? 'blur(3px)' : 'none', transition: 'filter .2s' }} />}
        </div>
        <h2 id="roulette-title" className="mp-h3" aria-live="polite">{spinning ? t.spinning : pick ? pick.title : t.rouletteHeadline}</h2>
        <p className="mp-label" style={{ minHeight: '2.8em' }}>{!spinning && pick ? t.rouletteSub : ''}</p>
        <div className="mp-progress" style={{ width: '100%', margin: '8px 0 18px' }}><span ref={bar} style={{ transition: 'none' }} /></div>
        <Button block onClick={spin} disabled={spinning} icon={<DiceFive size={20} weight="bold" aria-hidden />}>{spinning ? t.spinning : t.spin}</Button>
      </div>
    </div>
  );
}
