import { useEffect, useState, type CSSProperties } from 'react';
import { Check } from '@phosphor-icons/react';
import { poster } from '../data';
import { recommend } from '../recommend';
import { LOADING_MS, useApp } from '../store';

// Fases: barajar el mazo mientras avanzan los pasos → abrirlo en abanico con las películas elegidas
// → desvanecerse justo antes de que el store pase a resultados (a los LOADING_MS).
const TICK_MS = 520, FAN_AT = LOADING_MS - 1150, EXIT_AT = LOADING_MS - 420;

const stepState = (i: number, current: number) => {
  if (i < current) return 'done';
  return i === current ? 'active' : '';
};

export default function Loading() {
  const { st, t } = useApp();
  // El mazo son tus primeras recomendaciones: el abanico final adelanta lo que verás en resultados
  const deck = recommend(st).slice(0, 5);
  const shown = Math.min(st.numMovies, deck.length);
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState<'shuffle' | 'fan' | 'exit'>('shuffle');
  useEffect(() => {
    const shuffle = setInterval(() => setTick(n => n + 1), TICK_MS);
    const fan = setTimeout(() => { clearInterval(shuffle); setPhase('fan'); }, FAN_AT);
    const exit = setTimeout(() => setPhase('exit'), EXIT_AT);
    return () => { clearInterval(shuffle); clearTimeout(fan); clearTimeout(exit); };
  }, []);

  const shuffling = phase === 'shuffle';
  const step = shuffling ? Math.min(t.loadingSteps.length - 1, Math.floor(tick / 2)) : t.loadingSteps.length;
  const mid = (shown - 1) / 2;

  const cardStyle = (i: number): CSSProperties => {
    if (shuffling) {
      // Cada tick la carta de adelante se va al fondo (animación mp-deck-tuck)
      const slot = (i - (tick % deck.length) + deck.length) % deck.length;
      const pose = `translateY(${slot * -10}px) scale(${1 - slot * 0.06})`;
      return { '--pose': pose, transform: pose, zIndex: deck.length - slot, filter: `brightness(${1 - slot * 0.14})`,
        animation: slot === deck.length - 1 && tick > 0 ? `mp-deck-tuck ${TICK_MS}ms var(--ease-out)` : undefined } as CSSProperties;
    }
    if (i >= shown) return { transform: 'translateY(30px) scale(.8)', opacity: 0, zIndex: 0 };
    const k = i - mid;
    return { transform: `translateX(calc(${k} * var(--fan-step))) translateY(${Math.abs(k) * 12}px) rotate(${k * 6}deg)${shown === 1 ? ' scale(1.08)' : ''}`, zIndex: 10 - Math.abs(k) };
  };

  return (
    <section className={`mp-screen mp-loading${phase === 'exit' ? ' exit' : ''}`}>
      <div className="mp-aura" aria-hidden>{deck.slice(0, 3).map(m => <span key={m.title} style={{ background: m.color }} />)}</div>
      <div className="mp-content mp-loading-inner">
        <div className={`mp-deck${shuffling ? '' : ' fanned'}`} aria-hidden>
          {deck.map((m, i) => <img key={m.title} src={poster(m)} alt="" style={cardStyle(i)} />)}
        </div>
        <h1 className="mp-title" aria-live="polite">{shuffling ? t.loadingTitle : t.loadingDone(st.numMovies)}</h1>
        <ol className="mp-load-steps">
          {t.loadingSteps.map((s, i) => (
            <li key={s} className={stepState(i, step)}>
              <span className="mp-load-dot">{i < step && <Check size={12} weight="bold" aria-hidden />}</span>{s}
            </li>
          ))}
        </ol>
        <progress className="mp-progress" max={1} value={shuffling ? Math.min(1, (tick * TICK_MS) / FAN_AT) : 1} aria-label={t.loadingTitle} />
      </div>
    </section>
  );
}
