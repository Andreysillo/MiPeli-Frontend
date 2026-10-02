import { useLayoutEffect, useRef, type PointerEvent } from 'react';
import gsap from 'gsap';
import { ArrowsClockwise, Lightning, ShareNetwork, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import MoltenMetal from '../components/MoltenMetal';
import TiltedCard from '../components/TiltedCard';
import Button from '../components/Button';
import { platforms, poster, recommended, type Movie, type Platform, type PlatformInfo } from '../data';
import { useApp } from '../store';

function Imdb({ m }: { m: Movie }) {
  const { t } = useApp();
  return <span className="mp-tag tnum" aria-label={t.imdbOf(m.imdb)}><span className="mp-imdb" aria-hidden>IMDb</span><span aria-hidden>{m.imdb}</span></span>;
}

// Botón de plataforma: logo en su baldosa de color + nombre
function PlatformLink({ p, big }: { p: Platform; big?: boolean }) {
  const { t } = useApp();
  const { url, tile, fg, icon, mark }: PlatformInfo = platforms[p];
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={t.openIn(p)} className={`mp-platform${big ? ' big' : ''}`}>
      <span className="mp-platform-logo" style={{ background: tile, color: fg }} aria-hidden>
        {icon ? <svg viewBox="0 0 24 24" fill="currentColor"><path d={icon.path} /></svg> : <b>{mark}</b>}
      </span>
      {p}
    </a>
  );
}

// "Puedes verla en:" + un botón por plataforma que abre su web en otra pestaña
function WatchOn({ m, big }: { m: Movie; big?: boolean }) {
  const { t } = useApp();
  return (
    <div className="mp-stack" style={{ gap: 10 }}>
      <span className="mp-label">{t.whereToWatch}</span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {m.platforms.map(p => <PlatformLink key={p} p={p} big={big} />)}
      </div>
    </div>
  );
}

// Número que sube desde 0 cuando entra en pantalla. El texto lo escribe GSAP, no React.
function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!;
    const fmt = (v: number) => v.toFixed(decimals) + suffix;
    el.textContent = fmt(value);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const o = { v: 0 };
      el.textContent = fmt(0);
      gsap.to(o, { v: value, duration: 1.4, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); }, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    return () => mm.revert();
  }, [value, decimals, suffix]);
  return <span ref={ref} />;
}

// Brillo que sigue al puntero sobre la tarjeta (CSS lee --mx/--my)
const spotlight = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

function MovieCard({ m }: { m: Movie }) {
  return (
    <li data-reveal className="mp-card mp-movie-card" onPointerMove={spotlight}>
      <div className="mp-movie-poster"><img src={poster(m)} alt={`${m.title} (${m.year})`} loading="lazy" /></div>
      <div className="mp-stack" style={{ gap: 12, padding: 16, flex: 1 }}>
        <div className="mp-stack" style={{ gap: 4 }}>
          <h3 className="mp-h3">{m.title}</h3>
          <span className="mp-label tnum">{m.year} · {m.genre} · {m.director}</span>
        </div>
        <div><Imdb m={m} /></div>
        <WatchOn m={m} />
      </div>
    </li>
  );
}

// ponytail: el pool de demo tiene 10 recomendaciones; el backend dará cuantas haga falta.
const MAX_EXTRAS = 4;

export default function Results() {
  const { st, set, go, flash, t } = useApp();
  const { genre, director } = st.picks;
  // Exactamente las que pidió el usuario, todas al mismo nivel. Si pidió menos que el pool, se añaden unos extras aparte.
  const recs = recommended.slice(0, st.numMovies);
  const extras = recommended.slice(st.numMovies, st.numMovies + MAX_EXTRAS);
  const [top] = recs;
  const cine = /Bong|Park|Wong/.test(director) ? 'Corea' : 'Autoral';
  const rareza = /Noir|Misterio/.test(genre) ? 73 : 48;
  const avgImdb = recs.reduce((sum, m) => sum + m.imdb, 0) / recs.length;

  const share = () => {
    const url = location.href;
    if (navigator.share) navigator.share({ title: 'MiPeli', text: recs.map(m => m.title).join(', '), url }).catch(() => {});
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
        {recs.length === 1 ? (
          <div className="mp-pick">
            <div data-reveal className="mp-pick-poster">
              <TiltedCard imageSrc={poster(top)} altText={`${top.title} (${top.year})`} captionText={`IMDb ${top.imdb}`} containerHeight="100%" containerWidth="100%"
                imageHeight="100%" imageWidth="100%" rotateAmplitude={12} scaleOnHover={1.04} showTooltip />
            </div>
            <div className="mp-stack" style={{ gap: 16 }}>
              <span data-reveal className="mp-kicker">{t.tonightKick}</span>
              <h1 data-reveal className="mp-display">{top.title}</h1>
              <p data-reveal className="mp-lead tnum">{top.year} · {top.director}</p>
              <div data-reveal style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="mp-tag">{top.genre}</span>
                <Imdb m={top} />
              </div>
              <p data-reveal style={{ color: 'var(--text-muted)', maxWidth: '48ch' }}>{t.because(genre, director)}</p>
              <div data-reveal style={{ marginTop: 8 }}><WatchOn m={top} big /></div>
              <div data-reveal><Button variant="ghost" size="sm" icon={<ShareNetwork size={18} aria-hidden />} onClick={share} style={{ marginLeft: -14 }}>{t.share}</Button></div>
            </div>
          </div>
        ) : (
          <div className="mp-stack" style={{ gap: 24 }}>
            <div className="mp-stack" style={{ gap: 12 }}>
              <h1 data-reveal className="mp-display" style={{ fontSize: 'clamp(2.25rem, 3vw + 1rem, 3.75rem)' }}>{t.yourMovies(recs.length)}</h1>
              <p data-reveal style={{ color: 'var(--text-muted)', maxWidth: '56ch' }}>{t.because(genre, director)}</p>
              <div data-reveal><Button variant="ghost" size="sm" icon={<ShareNetwork size={18} aria-hidden />} onClick={share} style={{ marginLeft: -14 }}>{t.share}</Button></div>
            </div>
            <ul className="mp-movies">{recs.map(m => <MovieCard key={m.title} m={m} />)}</ul>
          </div>
        )}

        {extras.length > 0 && (
          <div className="mp-stack" style={{ gap: 16 }}>
            <div data-reveal className="mp-stack" style={{ gap: 6 }}>
              <h2 className="mp-title">{t.moreForYou}</h2>
              <p className="mp-label">{t.moreHint}</p>
            </div>
            <ul className="mp-movies">{extras.map(m => <MovieCard key={m.title} m={m} />)}</ul>
          </div>
        )}

        <div className="mp-stack" style={{ gap: 16 }}>
          <h2 data-reveal className="mp-title">{t.wrappedTitle}</h2>
          <div className="mp-bento">
            <div data-reveal className="mp-card lead mp-stack" style={{ padding: 24, justifyContent: 'flex-end', minHeight: 180, background: 'linear-gradient(150deg,rgba(82,39,255,.6),rgba(18,14,46,.75) 70%)' }}>
              <span className="mp-display">{genre}</span>
              <span className="mp-label" style={{ color: 'var(--text-muted)' }}>{t.wGenre}</span>
            </div>
            {([[<CountUp value={rareza} suffix="%" />, t.wRareza], [cine, t.wCine], [<CountUp value={avgImdb} decimals={1} />, t.wNota]] as const).map(([value, label]) => (
              <div key={label} data-reveal className="mp-card mp-stack" style={{ padding: 20, gap: 4, justifyContent: 'flex-end' }}>
                <span className="mp-title tnum">{value}</span>
                <span className="mp-label">{label}</span>
              </div>
            ))}
          </div>
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
