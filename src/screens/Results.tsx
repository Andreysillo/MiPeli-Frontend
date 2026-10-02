import { ArrowsClockwise, DiceFive, Lightning, ListPlus, ShareNetwork, Star, Television, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import MoltenMetal from '../components/MoltenMetal';
import TiltedCard from '../components/TiltedCard';
import ChromaGrid from '../components/ChromaGrid';
import Button from '../components/Button';
import { chromaItem, listIdeas, poster, recommended } from '../data';
import { useApp } from '../store';

export default function Results() {
  const { st, set, go, flash, t } = useApp();
  const { genre, director, theme } = st.picks;
  const recs = recommended.slice(0, st.numMovies);
  const [top, ...rest] = recs;
  const cine = /Bong|Park|Wong/.test(director) ? 'Corea' : 'Autoral';
  const rareza = /Noir|Distop|Nicho/.test(genre + theme) ? '73%' : '48%';

  const share = () => {
    const url = location.href;
    if (navigator.share) navigator.share({ title: 'MiPeli', text: `${t.tonightKick}: ${top.title}`, url }).catch(() => {});
    else if (navigator.clipboard) { navigator.clipboard.writeText(url).catch(() => {}); flash(t.linkCopied); }
    else flash(t.shareFallback + url);
  };
  const rate = (v: 'up' | 'down') => set({ useful: st.useful === v ? null : v });

  return (
    <section className="mp-screen">
      <div className="mp-bg">
        <MoltenMetal color1="#0a0630" color2="#5227ff" color3="#e0d2ff" speed={0.26} scale={2.9} detail={3} glow={2.6} coreSize={0.16} swirl={1} fold={-0.26} blackPoint={0.03}
          brightness={2} colorMode="molten" grain grainIntensity={0.05} mouseInteraction mouseStrength={0.22} opacity={1} />
      </div>
      <div className="mp-scrim" style={{ background: 'linear-gradient(180deg,rgba(7,6,26,.2),rgba(7,6,26,.55) 50%,rgba(7,6,26,.85))' }} />

      <div className="mp-content mp-container mp-page mp-stack" style={{ gap: 72 }}>
        {/* La recomendación principal */}
        <div className="mp-pick">
          <div data-reveal className="mp-pick-poster">
            <TiltedCard imageSrc={poster(top)} altText={`${top.title} (${top.year})`} captionText={`★ ${top.rating}`} containerHeight="100%" containerWidth="100%"
              imageHeight="100%" imageWidth="100%" rotateAmplitude={12} scaleOnHover={1.04} showTooltip />
          </div>
          <div className="mp-stack" style={{ gap: 16 }}>
            <span data-reveal className="mp-kicker">{t.tonightKick}</span>
            <h1 data-reveal className="mp-display">{top.title}</h1>
            <p data-reveal className="mp-lead tnum">{top.year} · {top.director}</p>
            <div data-reveal style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="mp-tag">{top.genre}</span>
              <span className="mp-tag tnum"><Star size={14} weight="fill" color="var(--star)" aria-hidden />{top.rating}</span>
              {top.platforms && <span className="mp-tag"><Television size={14} aria-hidden /><span className="sr-only">{t.whereToWatch}: </span>{top.platforms.join(', ')}</span>}
            </div>
            <p data-reveal style={{ color: 'var(--text-muted)', maxWidth: '48ch' }}>{t.because(genre, director)}</p>
            <div data-reveal style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
              <Button icon={<DiceFive size={20} weight="bold" aria-hidden />} onClick={() => set({ showRoulette: true })}>{t.chooseForMe}</Button>
              <Button variant="secondary" icon={<ShareNetwork size={20} aria-hidden />} onClick={share}>{t.share}</Button>
            </div>
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mp-stack" style={{ gap: 16 }}>
            <div data-reveal className="mp-stack" style={{ gap: 6 }}>
              <h2 className="mp-title">{t.moreForYou}</h2>
              <p className="mp-label">{t.moreHint}</p>
            </div>
            <div data-reveal className="mp-rest-grid">
              <ChromaGrid items={rest.map(chromaItem)} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" />
            </div>
          </div>
        )}

        <div className="mp-stack" style={{ gap: 16 }}>
          <h2 data-reveal className="mp-title">{t.wrappedTitle}</h2>
          <div className="mp-bento">
            <div data-reveal className="mp-card lead mp-stack" style={{ padding: 24, justifyContent: 'flex-end', minHeight: 180, background: 'linear-gradient(150deg,rgba(82,39,255,.6),rgba(18,14,46,.75) 70%)' }}>
              <span className="mp-display">{genre}</span>
              <span className="mp-label" style={{ color: 'var(--text-muted)' }}>{t.wGenre}</span>
            </div>
            {[[rareza, t.wRareza], [cine, t.wCine], ['4.4★', t.wNota]].map(([value, label]) => (
              <div key={label} data-reveal className="mp-card mp-stack" style={{ padding: 20, gap: 4, justifyContent: 'flex-end' }}>
                <span className="mp-title tnum">{value}</span>
                <span className="mp-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mp-stack" style={{ gap: 16 }}>
          <div data-reveal className="mp-stack" style={{ gap: 6 }}>
            <h2 className="mp-title">{t.listIdeasTitle}</h2>
            <p className="mp-label">{t.listIdeasDesc}</p>
          </div>
          <ul className="mp-ideas" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {listIdeas[st.lang].map(idea => (
              <li key={idea} data-reveal className="mp-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px' }}>
                <span className="mp-icon-tile" style={{ width: 36, height: 36 }}><ListPlus size={18} aria-hidden /></span>{idea}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="mp-card mp-stack" style={{ padding: 24, gap: 24 }}>
          <div className="mp-stack" style={{ gap: 12 }}>
            <h2 className="mp-h3">{t.usefulAsk}</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant={st.useful === 'up' ? 'primary' : 'secondary'} size="sm" aria-pressed={st.useful === 'up'} icon={<ThumbsUp size={18} weight={st.useful === 'up' ? 'fill' : 'regular'} aria-hidden />} onClick={() => rate('up')}>{t.useful}</Button>
              <Button variant={st.useful === 'down' ? 'primary' : 'secondary'} size="sm" aria-pressed={st.useful === 'down'} icon={<ThumbsDown size={18} weight={st.useful === 'down' ? 'fill' : 'regular'} aria-hidden />} onClick={() => rate('down')}>{t.notUseful}</Button>
              {st.useful && <span className="mp-label" role="status">{t.thanksFeedback}</span>}
            </div>
          </div>
          <div style={{ height: 1, background: 'var(--border)' }} />
          <div className="mp-stack" style={{ gap: 12 }}>
            <h2 className="mp-h3">{t.redoTitle}</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button variant="secondary" size="sm" icon={<ArrowsClockwise size={18} aria-hidden />} onClick={() => set({ qi: 0, duelIdx: 0, screen: 'quest', questActive: true })}>{t.redoSame}</Button>
              <Button variant="secondary" size="sm" onClick={() => go('type')}>{t.redoDiff}</Button>
              {st.loggedIn && <Button variant="secondary" size="sm" icon={<Lightning size={18} aria-hidden />} onClick={() => { go('loading'); flash(t.freshPick); }}>{t.quickRec}</Button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
