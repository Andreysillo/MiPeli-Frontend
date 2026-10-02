import SplitText from '../components/SplitText';
import OptionWheel from '../components/OptionWheel';
import ChromaGrid from '../components/ChromaGrid';
import CircularGallery from '../components/CircularGallery';
import GlowButton from '../components/GlowButton';
import WavesBg from '../components/WavesBg';
import { chromaMovies, directors, duels, genres, moodGallery, themes } from '../data';
import { useApp } from '../store';

const section = { position: 'relative', zIndex: 2, maxWidth: 1000, margin: '0 auto', padding: '0 24px' } as const;
const hint = { fontSize: 11, color: 'rgba(255,255,255,.6)', margin: '0 0 14px' };
const toggle = (list: string[], item: string) => list.includes(item) ? list.filter(x => x !== item) : [...list, item];

function Stepper() {
  const { st, set } = useApp();
  return (
    <div style={{ display: 'flex', alignItems: 'center', maxWidth: 520, margin: '0 auto' }}>
      {st.questSteps.map((step, i) => {
        const done = i < st.qi, active = i === st.qi, last = i === st.questSteps.length - 1;
        return (
          <div key={step} style={{ position: 'relative', cursor: 'pointer', flex: last ? '0 0 auto' : '1', display: 'flex', alignItems: 'center' }} onClick={() => { if (i <= st.qi) set({ qi: i }); }}>
            <div style={{ width: 34, height: 34, flex: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 14px var(--font-body)', transition: 'all .3s cubic-bezier(.2,.7,.2,1)', background: done || active ? '#5227ff' : 'rgba(255,255,255,.12)', color: done || active ? '#ffffff' : 'rgba(255,255,255,.6)', boxShadow: active ? '0 0 0 4px rgba(82,39,255,.35)' : 'none' }}>{done ? '✓' : i + 1}</div>
            {!last && (
              <div style={{ flex: 1, height: 2, margin: '0 8px', borderRadius: 2, background: 'rgba(255,255,255,.16)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: '#5227ff', transition: 'width .4s cubic-bezier(.2,.7,.2,1)', width: done ? '100%' : '0%' }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function WheelStep({ items, value, onPick, label, fontSize, pickSize }: { items: string[]; value: string; onPick: (item: string) => void; label: string; fontSize: number; pickSize: number }) {
  const { t } = useApp();
  return (
    <div style={{ ...section, display: 'flex', minHeight: '70vh', alignItems: 'stretch' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <div style={{ position: 'absolute', top: '50%', left: 24, right: 12, height: 1, background: 'linear-gradient(90deg,rgba(255,255,255,.35),transparent)', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', left: 20, width: 10, height: 10, borderRadius: '50%', background: '#fff', boxShadow: '0 0 12px rgba(255,255,255,.7)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', inset: 0 }}>
          <OptionWheel items={items} defaultSelected={Math.max(0, items.indexOf(value))} onChange={(_i: number, item: string) => onPick(item)}
            textColor="rgba(190,205,255,0.42)" activeColor="#ffffff" side="left" fontSize={fontSize} spacing={1.5} curve={1} tilt={7} blur={1.6} fade={0.42} smoothing={220} inset={40} draggable />
        </div>
      </div>
      <div style={{ width: 280, flex: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 24 }}>
        <p className="mp-mono" style={{ fontSize: 10, letterSpacing: '.14em', color: '#a9c0ff', margin: 0 }}>{t.center} · {label}</p>
        <div className="mp-heading mp-grad" style={{ fontSize: pickSize, lineHeight: 1.02, margin: '10px 0 0' }}>{value}</div>
      </div>
    </div>
  );
}

export default function Quest() {
  const { st, set, t } = useApp();
  const kind = st.questSteps[st.qi];
  const isLast = st.qi >= st.questSteps.length - 1;
  const duel = duels[Math.min(st.duelIdx, duels.length - 1)];
  const nextStep = () => set(isLast ? { screen: 'loading', questActive: false } : { qi: st.qi + 1 });
  const pick = (k: keyof typeof st.picks) => (item: string) => set({ picks: { ...st.picks, [k]: item } });

  const chooseDuel = (winner: string) => {
    const duelWins = { ...st.duelWins, [winner]: (st.duelWins[winner] || 0) + 1 };
    if (st.duelIdx < duels.length - 1) set({ duelWins, duelIdx: st.duelIdx + 1 });
    else { set({ duelWins }); nextStep(); }
  };

  const duelCard = (m: typeof duel[0], justifySelf: 'end' | 'start') => (
    <div className="mp-card mp-pick" onClick={() => chooseDuel(m.title)} style={{ justifySelf, width: '100%', padding: 0, overflow: 'hidden', aspectRatio: '2/3', maxHeight: '62vh', background: m.g, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ width: '100%', padding: 16, background: 'linear-gradient(to top,rgba(0,0,0,.7),transparent)' }}>
        <div className="mp-heading" style={{ fontSize: 26 }}>{m.title}</div>
        <div className="mp-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.75)' }}>{m.sub}</div>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#04030f' }}>
      <WavesBg />
      <div style={{ ...section, padding: '132px 24px 22px' }}><Stepper /></div>

      {kind === 'duel' && (
        <div style={section}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <SplitText text={t.duelQ} tag="h2" className="mp-heading mp-duel-heading" splitType="chars" textAlign="left" delay={18} duration={0.7} ease="power3.out" threshold={0.1} rootMargin="-40px" />
            <span className="mp-mono" style={{ fontSize: 11, color: '#a9c0ff' }}>{st.duelIdx + 1} / {duels.length}</span>
          </div>
          <p className="mp-mono" style={hint}>{t.duelHint}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8, maxWidth: 640, margin: '0 auto' }}>
            {duelCard(duel[0], 'end')}
            <div className="mp-heading" style={{ fontSize: 18, color: 'rgba(255,255,255,.55)', padding: '0 2px', textAlign: 'center', justifySelf: 'center' }}>{t.duelVs}</div>
            {duelCard(duel[1], 'start')}
          </div>
        </div>
      )}

      {kind === 'genres' && <WheelStep items={genres} value={st.picks.genre} onPick={pick('genre')} label={t.recGenres} fontSize={2.6} pickSize={34} />}
      {kind === 'director' && <WheelStep items={directors} value={st.picks.director} onPick={pick('director')} label={t.recDirector} fontSize={2.3} pickSize={28} />}
      {kind === 'themes' && <WheelStep items={themes} value={st.picks.theme} onPick={pick('theme')} label={t.recThemes} fontSize={2.4} pickSize={30} />}

      {kind === 'movies' && (
        <div style={section}>
          <SplitText text={t.moviesQ} tag="h2" className="mp-heading mp-duel-heading" splitType="chars" textAlign="left" delay={18} duration={0.7} ease="power3.out" threshold={0.1} rootMargin="-40px" />
          <p className="mp-mono" style={{ ...hint, margin: '0 0 12px' }}>{t.moviesHint}</p>
          <div style={{ marginBottom: 8 }}>
            <ChromaGrid items={chromaMovies} columns={3} radius={240} damping={0.45} fadeOut={0.6} selectable selected={st.movieSel} onToggle={(title: string) => set({ movieSel: toggle(st.movieSel, title) })} />
          </div>
        </div>
      )}

      {kind === 'personal' && (
        <>
          <div style={{ ...section, padding: '8px 24px 0', textAlign: 'center' }}>
            <SplitText text={t.moodQ} tag="h2" className="mp-heading mp-mood-heading" splitType="chars" textAlign="center" delay={18} duration={0.7} ease="power3.out" threshold={0.1} rootMargin="-40px" />
            <p className="mp-mono" style={{ ...hint, margin: '0 0 4px' }}>{t.moodHint}</p>
          </div>
          <div style={{ position: 'relative', zIndex: 2, height: 'min(52vh,420px)', margin: '2px 0 6px' }}>
            <CircularGallery items={moodGallery} bend={1.6} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02} font="bold 30px Trebuchet MS" onSelect={(m: string) => set({ moodSel: toggle(st.moodSel, m) })} />
          </div>
          <div style={{ ...section, maxWidth: 720, textAlign: 'center' }}>
            <p className="mp-mono" style={{ fontSize: 11, color: '#a9c0ff', margin: '0 0 10px' }}>{t.moodPick}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {st.moodSel.map(m => <button key={m} className="mp-chip on" onClick={() => set({ moodSel: toggle(st.moodSel, m) })}>{m} ✕</button>)}
            </div>
          </div>
        </>
      )}

      <div style={{ ...section, padding: '20px 24px 40px', display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        {st.qi > 0 && <button className="mp-back" onClick={() => set({ qi: st.qi - 1 })}>← {t.back}</button>}
        <div style={{ flex: 1 }} />
        <div style={{ width: 220 }}><GlowButton label={isLast ? t.seeResult : t.next} onClick={nextStep} /></div>
      </div>
    </div>
  );
}
