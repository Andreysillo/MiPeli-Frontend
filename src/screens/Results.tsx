import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowsClockwise, Lightning, ShareNetwork, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import Button from '../components/Button';
import PosterGallery from '../components/PosterGallery';
import { Imdb, WatchOn, countryName, genreName, runtime } from '../components/Movie';
import { poster, recommend, type Movie } from '../data';
import { useApp } from '../store';

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

// Extra en formato índice: compacto, sin animación de ficha, pero con lo necesario para decidir
function IndexRow({ m }: { m: Movie }) {
  const { st, t } = useApp();
  return (
    <li data-reveal className="mp-index-row">
      <img className="mp-index-thumb" src={poster(m)} alt="" width={400} height={600} loading="lazy" />
      <div className="mp-stack" style={{ gap: 6, minWidth: 0 }}>
        <h3 className="mp-index-title">{m.title}</h3>
        <p className="mp-label tnum">{m.year} · {runtime(m.runtime)} · {m.genres.map(g => genreName(g, st.lang)).join(', ')}</p>
        <p className="mp-label"><span className="mp-cap">{t.directedBy}</span> {m.director} <span className="mp-cap">{t.starring}</span> {m.cast.slice(0, 2).join(', ')}</p>
        <p className="mp-index-overview">{m.overview[st.lang]}</p>
      </div>
      <div className="mp-index-side">
        <Imdb m={m} />
        <WatchOn m={m} label={null} />
      </div>
    </li>
  );
}

const mostCommon = (xs: string[]) => xs.reduce((best, x) => (xs.filter(y => y === x).length > xs.filter(y => y === best).length ? x : best), xs[0]);

// Si pidió menos de 10, se añaden hasta 4 extras al final del feed
const MAX_EXTRAS = 4;

export default function Results() {
  const { st, set, go, flash, t } = useApp();
  const ranked = recommend(st);
  const recs = ranked.slice(0, st.numMovies);
  const extras = st.numMovies < 10 ? ranked.slice(st.numMovies, st.numMovies + MAX_EXTRAS) : [];

  // Lo que explica la selección: el género y director que eligió, o lo que más se repite en sus recomendaciones
  const topGenre = st.rec.genres ? st.picks.genre : mostCommon(recs.flatMap(m => m.genres));
  const director = st.rec.director ? st.picks.director : undefined;
  const outside = Math.round((100 * recs.filter(m => m.country !== 'US').length) / recs.length);
  const cine = countryName(mostCommon(recs.map(m => m.country)), st.lang);
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
      <div className="mp-content mp-page">
        <div className="mp-container mp-results-head">
          <div className="mp-stack" style={{ gap: 10 }}>
            <h1 data-reveal className="mp-title">{recs.length === 1 ? t.tonightKick : t.yourMovies(recs.length)}</h1>
            <p data-reveal className="mp-lead">{t.because(genreName(topGenre, st.lang), director)}</p>
          </div>
          <div data-reveal><Button variant="ghost" size="sm" icon={<ShareNetwork size={18} aria-hidden />} onClick={share}>{t.share}</Button></div>
        </div>

        <PosterGallery movies={recs} />

        <div className="mp-container mp-stack" style={{ gap: 72, marginTop: 88 }}>
          <div className="mp-stack" style={{ gap: 16 }}>
            <h2 data-reveal className="mp-title">{t.wrappedTitle}</h2>
            <div className="mp-bento">
              <div data-reveal className="mp-card lead mp-stack" style={{ padding: 24, justifyContent: 'flex-end', minHeight: 180, background: 'linear-gradient(150deg,rgba(82,39,255,.6),rgba(18,14,46,.75) 70%)' }}>
                <span className="mp-display">{genreName(topGenre, st.lang)}</span>
                <span className="mp-label" style={{ color: 'var(--text-muted)' }}>{t.wGenre}</span>
              </div>
              {([[<CountUp value={outside} suffix="%" />, t.wRareza], [cine, t.wCine], [<CountUp value={avgImdb} decimals={1} />, t.wNota]] as const).map(([value, label]) => (
                <div key={label} data-reveal className="mp-card mp-stack" style={{ padding: 20, gap: 4, justifyContent: 'flex-end' }}>
                  <span className="mp-title tnum">{value}</span>
                  <span className="mp-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {extras.length > 0 && (
            <div className="mp-stack" style={{ gap: 16 }}>
              <div data-reveal className="mp-stack" style={{ gap: 6 }}>
                <h2 className="mp-title">{t.moreForYou}</h2>
                <p className="mp-label">{t.moreHint}</p>
              </div>
              <ul className="mp-index">{extras.map(m => <IndexRow key={m.title} m={m} />)}</ul>
            </div>
          )}

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
      </div>
    </section>
  );
}
