import SplitText from '../components/SplitText';
import GlowButton from '../components/GlowButton';
import WavesBg, { interactive } from '../components/WavesBg';
import { useApp, type Length, type RecKey, type Step } from '../store';

const cbxIcon = <svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-6" /></svg>;
const pill = (on: boolean, padding: string, fontSize: number) => ({ height: 34, padding, fontSize, borderRadius: 999, border: '1px solid rgba(255,255,255,.3)', background: on ? '#fff' : 'transparent', color: on ? '#2a0d6b' : '#fff', cursor: 'pointer' });
const rowCard = { marginTop: 18, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' } as const;
const rowLabel = { fontSize: 11, letterSpacing: '.1em', color: 'rgba(255,255,255,.6)' };

export default function RecTypes() {
  const { st, set, flash, t } = useApp();
  const surveyLabel = st.surveyType === 'full' ? t.surveyFull : st.surveyType === 'short' ? t.surveyShort : t.surveyCustom;
  const recCount = Object.values(st.rec).filter(Boolean).length;
  const options: { key: RecKey; icon: string; title: string; desc: string }[] = [
    { key: 'movies', icon: '🍿', title: t.recMovies, desc: t.recMoviesD },
    { key: 'genres', icon: '🎭', title: t.recGenres, desc: t.recGenresD },
    { key: 'director', icon: '🎬', title: t.recDirector, desc: t.recDirectorD },
    { key: 'themes', icon: '🌗', title: t.recThemes, desc: t.recThemesD },
  ];
  const lengths: [Length, string][] = [['short', t.lenShort], ['med', t.lenMed], ['long', t.lenLong]];

  const startQuest = () => {
    const r = st.rec, steps: Step[] = [];
    if (r.genres) steps.push('genres');
    if (r.director) steps.push('director');
    if (r.themes) steps.push('themes');
    if (r.movies) steps.push('duel', 'movies');
    if (!steps.length) { flash(t.pickAtLeastOne); return; }
    set({ questSteps: [...steps, 'personal'], qi: 0, duelIdx: 0, screen: 'quest', questActive: true });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '96px 24px 48px' }}>
      <WavesBg {...interactive} />
      <div className="mp-up" style={{ position: 'relative', zIndex: 2, maxWidth: 880, margin: '0 auto' }}>
        <p className="mp-mono" style={{ letterSpacing: '.14em', fontSize: 11, color: '#a9c0ff', margin: 0 }}>{surveyLabel}</p>
        <SplitText text={t.recTitle} tag="h1" className="mp-heading mp-rec-heading" splitType="chars" textAlign="left" delay={18} duration={0.7} ease="power3.out" threshold={0.1} rootMargin="-40px" />
        <p style={{ fontSize: 15, color: 'rgba(238,241,255,.78)', margin: '0 0 24px' }}>{t.recDesc}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 14 }}>
          {options.map(o => {
            const on = st.rec[o.key];
            return (
              <div key={o.key} className="mp-card mp-pick" onClick={() => set({ rec: { ...st.rec, [o.key]: !on } })}
                style={{ padding: 18, borderColor: on ? '#7ea6ff' : 'rgba(255,255,255,.18)', background: on ? 'rgba(122,140,255,.16)' : 'rgba(255,255,255,.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 22 }}>{o.icon}</span><span className={'mp-cbx' + (on ? ' on' : '')}>{cbxIcon}</span></div>
                <div className="mp-heading" style={{ fontSize: 19, marginTop: 12 }}>{o.title}</div>
                <div className="mp-mono" style={{ fontSize: 10.5, color: 'rgba(255,255,255,.6)' }}>{o.desc}</div>
              </div>
            );
          })}
        </div>

        {st.rec.movies && (
          <div className="mp-card" style={rowCard}>
            <span className="mp-mono" style={rowLabel}>🍿 {t.numMoviesLabel}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 3, 5, 8, 10].map(n => (
                <button key={n} className={'mp-numbtn' + (st.numMovies === n ? ' on' : '')} style={pill(st.numMovies === n, '0 15px', 13)} onClick={() => set({ numMovies: n })}>{n}</button>
              ))}
            </div>
          </div>
        )}

        {st.surveyType === 'custom' && (
          <div className="mp-card" style={rowCard}>
            <span className="mp-mono" style={rowLabel}>{t.lengthLabel}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {lengths.map(([l, label]) => (
                <button key={l} className={'mp-numbtn' + (st.length === l ? ' on' : '')} style={pill(st.length === l, '0 14px', 12)} onClick={() => set({ length: l })}>{label}</button>
              ))}
            </div>
            <span className="mp-mono" style={{ fontSize: 11, color: '#a9c0ff' }}>⏱ {{ short: '~2', med: '~4', long: '~7' }[st.length]} {t.min}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28, flexWrap: 'wrap' }}>
          <span className="mp-mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{recCount} {t.selected}</span>
          <div style={{ flex: 1, minWidth: 120 }} />
          <div style={{ width: 220 }}><GlowButton label={t.start} onClick={startQuest} /></div>
        </div>
      </div>
    </div>
  );
}
