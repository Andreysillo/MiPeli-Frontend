import MoltenMetal from '../components/MoltenMetal';
import SplitText from '../components/SplitText';
import TiltedCard from '../components/TiltedCard';
import ChromaGrid from '../components/ChromaGrid';
import GlowButton from '../components/GlowButton';
import { listIdeas, recMovieList } from '../data';
import { useApp } from '../store';

const h22 = { tag: 'h2', className: 'mp-heading mp-h22', splitType: 'chars', textAlign: 'left', delay: 14, duration: 0.6, ease: 'power3.out', threshold: 0.1, rootMargin: '-40px' };
const muted = { fontSize: 11, color: 'rgba(255,255,255,.6)' };

function RateButton({ on, onColor, label, onClick, icon }: { on: boolean; onColor: string; label: string; onClick: () => void; icon: string[] }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 46, padding: '0 20px', borderRadius: 999, cursor: 'pointer', font: '600 14px var(--font-body)', border: `1px solid ${on ? onColor : 'rgba(255,255,255,.3)'}`, background: on ? onColor : 'transparent', color: '#fff', transition: 'all .3s cubic-bezier(.34,1.56,.64,1)', transform: `scale(${on ? 1.05 : 1})` }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{icon.map(d => <path key={d} d={d} />)}</svg>
      {label}
    </button>
  );
}

export default function Results() {
  const { st, set, go, flash, t } = useApp();
  const { genre, director, theme } = st.picks;
  const cine = /Bong|Park|Wong/.test(director) ? 'Corea' : 'Autoral';
  const rareza = /Noir|Distop|Nicho/.test(genre + theme) ? '73%' : '48%';
  const first = recMovieList[0];

  const share = () => {
    const url = location.href;
    if (navigator.share) navigator.share({ title: 'MiPeli', text: 'Encuentra qué ver hoy', url }).catch(() => {});
    else if (navigator.clipboard) { navigator.clipboard.writeText(url).catch(() => {}); flash(t.linkCopied); }
    else flash(t.shareFallback + url);
  };
  const redoButtons: [string, () => void][] = [
    [t.redoSame, () => set({ qi: 0, duelIdx: 0, screen: 'quest' })],
    [t.redoDiff, () => go('type')],
    ['🔗 ' + t.share, share],
    ['🎲 ' + t.chooseForMe, () => set({ showRoulette: true })],
  ];
  const widths = [170, 170, 150, 180];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#04030f' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MoltenMetal color1="#0a0630" color2="#5227ff" color3="#e0d2ff" speed={0.26} scale={2.9} detail={3} glow={2.6} coreSize={0.16} swirl={1} fold={-0.26} blackPoint={0.03}
          brightness={2} colorMode="molten" grain grainIntensity={0.05} mouseInteraction mouseStrength={0.22} opacity={1} />
      </div>
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', padding: '88px 24px 48px' }}>
        {st.rec.movies && (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '30px 0 4px' }}>
              <SplitText {...h22} text={`${t.recSetTitle} · ${st.numMovies}`} />
            </div>
            <p className="mp-mono" style={{ ...muted, margin: '0 0 12px' }}>{t.recSetHint}</p>
            {st.numMovies === 1 ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
                <TiltedCard gradient={first.gradient} captionText={first.handle} containerHeight="380px" containerWidth="260px" imageHeight="380px" imageWidth="260px" rotateAmplitude={14} scaleOnHover={1.08} showTooltip displayOverlayContent>
                  <div>
                    <div className="mp-heading" style={{ fontSize: 24, color: '#fff' }}>{first.title}</div>
                    <div className="mp-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,.8)' }}>{first.subtitle}</div>
                  </div>
                </TiltedCard>
              </div>
            ) : (
              <div className="mp-scroll" style={{ minHeight: 360 }}>
                <ChromaGrid items={recMovieList.slice(0, st.numMovies)} columns={3} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" />
              </div>
            )}
          </>
        )}

        <SplitText {...h22} text={t.wrappedTitle} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 }}>
          {[[genre, t.wGenre], [rareza, t.wRareza], [cine, t.wCine], ['4.4★', t.wNota]].map(([value, label]) => (
            <div key={label} className="mp-card" style={{ padding: 16 }}>
              <div className="mp-heading" style={{ fontSize: 26 }}>{value}</div>
              <div className="mp-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,.65)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="mp-card" style={{ marginTop: 22, padding: 20 }}>
          <h2 className="mp-heading" style={{ fontSize: 20, margin: '0 0 4px' }}>{t.listIdeasTitle}</h2>
          <p className="mp-mono" style={{ ...muted, margin: '0 0 12px' }}>{t.listIdeasDesc}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {listIdeas[st.lang].map(idea => (
              <div key={idea} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 12, padding: '11px 14px', fontSize: 14 }}>＋ {idea}</div>
            ))}
          </div>
        </div>

        <div className="mp-card" style={{ marginTop: 22, padding: 20 }}>
          <p style={{ margin: '0 0 12px', fontSize: 14, color: 'rgba(238,241,255,.85)' }}>{t.usefulAsk}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <RateButton on={st.useful === 'up'} onColor="#5227ff" label={t.useful} onClick={() => set({ useful: st.useful === 'up' ? null : 'up' })}
              icon={['M7 10v12', 'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z']} />
            <RateButton on={st.useful === 'down'} onColor="#c0392b" label={t.notUseful} onClick={() => set({ useful: st.useful === 'down' ? null : 'down' })}
              icon={['M17 14V2', 'M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z']} />
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,.14)', margin: '18px 0' }} />
          <p className="mp-mono" style={{ ...muted, letterSpacing: '.1em', margin: '0 0 10px' }}>↻ {t.redoTitle}</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {redoButtons.map(([label, onClick], i) => (
              <div key={i} style={{ width: widths[i] }}><GlowButton label={label} onClick={onClick} bg="#0a0a1e" color="#cdd7ff" /></div>
            ))}
            {st.loggedIn && (
              <div style={{ width: 280 }}><GlowButton label={t.quickRec} onClick={() => { go('loading'); flash(t.freshPick); }} /></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
