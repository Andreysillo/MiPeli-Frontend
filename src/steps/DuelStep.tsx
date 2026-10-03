import { useRef } from 'react';
import gsap from 'gsap';
import Button from '../components/Button';
import { poster } from '../data';
import { duels } from '../survey';
import { useApp } from '../store';
import StepHeader from './StepHeader';

// Paso 3: cuatro duelos de pósters, la señal más fuerte de la encuesta. La ganadora suma a duelPicks; "No conozco ninguna" no suma nada.
export default function DuelStep({ onDone }: Readonly<{ onDone: () => void }>) {
  const { st, set, t } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pair = duels[Math.min(st.duelIdx, duels.length - 1)];

  const advance = (winner?: string) => {
    busy.current = false;
    const duelPicks = winner && !st.duelPicks.includes(winner) ? [...st.duelPicks, winner] : st.duelPicks;
    if (st.duelIdx < duels.length - 1) set({ duelPicks, duelIdx: st.duelIdx + 1 });
    else { set({ duelPicks }); onDone(); }
  };

  const choose = (idx: number) => {
    if (busy.current) return;
    busy.current = true;
    const winner = pair[idx].title;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return advance(winner);
    // Feedback de la elección: la ganadora crece, la otra se apaga, y ambas salen
    const cards = ref.current!.querySelectorAll('.mp-poster-btn');
    gsap.timeline({ onComplete: () => advance(winner) })
      .to(cards[idx], { scale: 1.05, duration: 0.2, ease: 'power2.out' })
      .to(cards[1 - idx], { autoAlpha: 0.25, scale: 0.95, duration: 0.2, ease: 'power2.out' }, 0)
      .to(cards, { autoAlpha: 0, y: -16, duration: 0.2, ease: 'power2.in' }, '+=0.15');
  };

  return (
    <>
      <StepHeader kicker={t.duelOf(st.duelIdx + 1, duels.length)} title={t.duelQ} hint={t.duelHint} />
      <div className="mp-duel" ref={ref} style={{ marginTop: 32 }}>
        {[0, 1].map(i => (
          <button key={pair[i].title} data-reveal className="mp-poster-btn" onClick={() => choose(i)} aria-label={`${pair[i].title}, ${pair[i].year}, ${pair[i].director}`} style={{ order: i * 2 }}>
            <img src={poster(pair[i])} alt="" />
          </button>
        ))}
        <span className="mp-label" style={{ order: 1 }} aria-hidden>{t.duelVs}</span>
      </div>
      <div data-reveal style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <Button variant="ghost" size="sm" onClick={() => { if (!busy.current) advance(); }}>{t.duelSkip}</Button>
      </div>
    </>
  );
}
