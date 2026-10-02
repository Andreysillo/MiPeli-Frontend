import { useRef } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
import OptionWheel from '../components/OptionWheel';
import ChromaGrid from '../components/ChromaGrid';
import CircularGallery from '../components/CircularGallery';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import WavesBg from '../components/WavesBg';
import { chromaItem, directors, duels, genres, moodGallery, poster, questMovies } from '../data';
import { useApp } from '../store';

const toggle = (list: string[], item: string) => list.includes(item) ? list.filter(x => x !== item) : [...list, item];
const small = () => window.innerWidth < 640;

function Stepper() {
  const { st, set, t } = useApp();
  const kind = st.questSteps[st.qi];
  return (
    <nav aria-label={t.stepOf(st.qi + 1, st.questSteps.length)} className="mp-stack" style={{ gap: 12 }}>
      <span className="mp-kicker tnum">{t.stepOf(st.qi + 1, st.questSteps.length)}<span className="mp-mobile-only"> · {t.stepNames[kind]}</span></span>
      <ol className="mp-steps">
        {st.questSteps.map((step, i) => (
          <li key={step} className={i < st.qi ? 'done' : i === st.qi ? 'current' : ''}>
            <button disabled={i > st.qi} aria-current={i === st.qi ? 'step' : undefined} onClick={() => set({ qi: i })}>
              <span className="bar" /><span className="label">{t.stepNames[step]}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Question({ title, hint, extra }: { title: string; hint: string; extra?: string }) {
  return (
    <div className="mp-stack" style={{ gap: 8, marginBottom: 24 }}>
      <h1 data-reveal className="mp-title">{title}</h1>
      <p data-reveal className="mp-label">{hint}{extra && <span className="tnum" style={{ color: 'var(--accent-text)' }}> {extra}</span>}</p>
    </div>
  );
}

function WheelStep({ title, items, value, onPick, size }: { title: string; items: string[]; value: string; onPick: (item: string) => void; size: number }) {
  const { t } = useApp();
  return (
    <>
      <Question title={title} hint={t.wheelHint} />
      <div className="mp-wheel-step">
        <div data-reveal className="mp-wheel">
          <div style={{ position: 'absolute', top: '50%', left: 24, right: 12, height: 1, background: 'linear-gradient(90deg,rgba(255,255,255,.35),transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', left: 20, width: 10, height: 10, borderRadius: '50%', background: '#fff', boxShadow: '0 0 12px rgba(255,255,255,.7)', transform: 'translateY(-50%)' }} />
          <OptionWheel items={items} defaultSelected={Math.max(0, items.indexOf(value))} onChange={(_i: number, item: string) => onPick(item)}
            textColor="rgba(196,181,255,0.5)" activeColor="#ffffff" side="left" fontSize={small() ? size * 0.75 : size} spacing={1.5} curve={1} tilt={7} blur={1.6} fade={0.42} smoothing={220} inset={40} draggable />
        </div>
        <div data-reveal className="mp-card mp-stack mp-wheel-pick" style={{ padding: 24, gap: 6 }}>
          <span className="mp-label">{t.yourPick}</span>
          <span className="mp-title" style={{ color: 'var(--accent-text)' }} aria-live="polite">{value}</span>
        </div>
      </div>
    </>
  );
}

function Duel({ onDone }: { onDone: () => void }) {
  const { st, set, t } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pair = duels[Math.min(st.duelIdx, duels.length - 1)];

  const choose = (idx: number) => {
    if (busy.current) return;
    busy.current = true;
    const winner = pair[idx].title;
    const commit = () => {
      busy.current = false;
      const duelWins = { ...st.duelWins, [winner]: (st.duelWins[winner] || 0) + 1 };
      if (st.duelIdx < duels.length - 1) set({ duelWins, duelIdx: st.duelIdx + 1 });
      else { set({ duelWins }); onDone(); }
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return commit();
    // Feedback de la elección: la ganadora crece, la otra se apaga, y ambas salen
    const cards = ref.current!.querySelectorAll('.mp-poster-btn');
    gsap.timeline({ onComplete: commit })
      .to(cards[idx], { scale: 1.05, duration: 0.2, ease: 'power2.out' })
      .to(cards[1 - idx], { autoAlpha: 0.25, scale: 0.95, duration: 0.2, ease: 'power2.out' }, 0)
      .to(cards, { autoAlpha: 0, y: -16, duration: 0.2, ease: 'power2.in' }, '+=0.15');
  };

  return (
    <>
      <Question title={t.duelQ} hint={t.duelHint} extra={t.duelOf(st.duelIdx + 1, duels.length)} />
      <div className="mp-duel" ref={ref}>
        {[0, 1].map(i => (
          <button key={pair[i].title} data-reveal className="mp-poster-btn" onClick={() => choose(i)} aria-label={`${pair[i].title}, ${pair[i].year}, ${pair[i].director}`} style={{ order: i * 2 }}>
            <img src={poster(pair[i])} alt="" />
          </button>
        ))}
        <span className="mp-label" style={{ order: 1 }} aria-hidden>{t.duelVs}</span>
      </div>
    </>
  );
}

export default function Quest() {
  const { st, set, t } = useApp();
  const kind = st.questSteps[st.qi];
  const isLast = st.qi >= st.questSteps.length - 1;
  const next = () => set(isLast ? { screen: 'loading', questActive: false } : { qi: st.qi + 1 });
  const pick = (k: keyof typeof st.picks) => (item: string) => set({ picks: { ...st.picks, [k]: item } });

  return (
    <section className="mp-screen">
      <WavesBg />
      <div className="mp-content mp-container mp-page mp-flow">
        <Stepper />
        <Reveal key={kind + (kind === 'duel' ? st.duelIdx : '')} style={{ marginTop: 36 }}>
          {kind === 'genres' && <WheelStep title={t.qGenres} items={genres} value={st.picks.genre} onPick={pick('genre')} size={2.6} />}
          {kind === 'director' && <WheelStep title={t.qDirector} items={directors} value={st.picks.director} onPick={pick('director')} size={2.3} />}
          {kind === 'duel' && <Duel onDone={next} />}

          {kind === 'movies' && (
            <>
              <Question title={t.moviesQ} hint={t.moviesHint} extra={st.movieSel.length ? t.picked(st.movieSel.length) : undefined} />
              <div data-reveal className="mp-movie-grid">
                <ChromaGrid items={questMovies.map(chromaItem)} radius={240} damping={0.45} fadeOut={0.6} selectable selected={st.movieSel}
                  onToggle={(title: string) => set({ movieSel: toggle(st.movieSel, title) })} />
              </div>
            </>
          )}

          {kind === 'personal' && (
            <>
              <Question title={t.moodQ} hint={t.moodHint} />
              <div data-reveal style={{ height: 'min(48vh,400px)', margin: '0 -24px' }}>
                <CircularGallery items={moodGallery} bend={1.6} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} font="600 30px 'Geist Variable'"
                  onSelect={(m: string) => set({ moodSel: toggle(st.moodSel, m) })} />
              </div>
              <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12, minHeight: 40, alignItems: 'center' }} aria-live="polite">
                {st.moodSel.length ? st.moodSel.map(m => (
                  <button key={m} className="mp-chip" onClick={() => set({ moodSel: toggle(st.moodSel, m) })} aria-label={`${t.remove} ${m}`}>
                    {m}<X size={14} weight="bold" aria-hidden />
                  </button>
                )) : <span className="mp-label">{t.moodEmpty}</span>}
              </div>
            </>
          )}
        </Reveal>

        <div className="mp-actionbar" style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          {st.qi > 0 ? <Button variant="secondary" icon={<ArrowLeft size={18} aria-hidden />} onClick={() => set({ qi: st.qi - 1 })}>{t.back}</Button> : <span />}
          <Button onClick={next}>{isLast ? t.seeResult : t.next}<ArrowRight size={18} weight="bold" aria-hidden /></Button>
        </div>
      </div>
    </section>
  );
}
