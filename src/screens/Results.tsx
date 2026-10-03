import { useEffect, type ReactNode } from 'react';
import { ArrowsClockwise, BookmarkSimple, ClockCounterClockwise, ShareNetwork, ThumbsDown, ThumbsUp } from '@phosphor-icons/react';
import Button from '../components/Button';
import CountUp from '../components/CountUp';
import PosterGallery from '../components/PosterGallery';
import { Imdb, Reasons, WatchOn, countryName, genreName, runtime } from '../components/Movie';
import { poster } from '../data';
import { recommend, type Rec } from '../recommend';
import PlatformPicker from '../steps/PlatformPicker';
import { useApp } from '../store';

// Extra en formato índice: compacto, sin animación de ficha, pero con lo necesario para decidir
function Stat({ label, children }: Readonly<{ label: string; children: ReactNode }>) {
  return (
    <div data-reveal className="mp-card mp-stack" style={{ padding: 20, gap: 4, justifyContent: 'flex-end' }}>
      <span className="mp-title tnum">{children}</span>
      <span className="mp-label">{label}</span>
    </div>
  );
}

function IndexRow({ m }: Readonly<{ m: Rec }>) {
  const { st, t } = useApp();
  return (
    <li data-reveal className="mp-index-row">
      <img className="mp-index-thumb" src={poster(m)} alt="" width={400} height={600} loading="lazy" />
      <div className="mp-stack" style={{ gap: 6, minWidth: 0 }}>
        <h3 className="mp-index-title">{m.title}</h3>
        <p className="mp-label tnum">{m.year} · {runtime(m.runtime)} · {m.genres.map(g => genreName(g, st.lang)).join(', ')}</p>
        <p className="mp-label"><span className="mp-cap">{t.directedBy}</span> {m.director} <span className="mp-cap">{t.starring}</span> {m.cast.slice(0, 2).join(', ')}</p>
        <p className="mp-index-overview">{m.overview[st.lang]}</p>
        <Reasons m={m} />
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
const NUMBERS = [1, 3, 5, 8, 10];

export default function Results() {
  const { st, set, go, flash, saveRun, redoSurvey, t } = useApp();
  const ranked = recommend(st);
  const recs = ranked.slice(0, st.numMovies);
  const extras = st.numMovies < 10 ? ranked.slice(st.numMovies, st.numMovies + MAX_EXTRAS) : [];
  const titles = recs.map(m => m.title);

  // Con sesión, la encuesta se guarda al llegar y se actualiza cada vez que se afina (más como esta, ya la vi, no me interesa, cuántas)
  useEffect(() => { saveRun(titles); }, [saveRun, st.uid, titles.join('|'), st.boosted, st.seen, st.disliked, st.numMovies]);

  // Los filtros dejaron la lista vacía: se ofrece quitarlos en lugar de mostrar una pantalla rota
  if (recs.length === 0) {
    return (
      <section className="mp-screen">
        <div className="mp-content mp-container mp-page mp-stack" style={{ gap: 20, minHeight: '70vh', justifyContent: 'center' }}>
          <h1 data-reveal className="mp-title">{t.noResultsTitle}</h1>
          <p data-reveal className="mp-lead">{t.noResultsText}</p>
          <div data-reveal style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button onClick={() => set({ avoid: [], maxRuntime: null, company: 'solo', ownedPlatforms: [] })}>{t.relax}</Button>
            <Button variant="secondary" icon={<ArrowsClockwise size={18} aria-hidden />} onClick={redoSurvey}>{t.redoSame}</Button>
          </div>
        </div>
      </section>
    );
  }

  // Lo que explica la selección: el ánimo que eligió y, si hay, una película que marcó
  const moodList = new Intl.ListFormat(st.lang, { style: 'long', type: 'conjunction' }).format(st.moods.map(k => t.moodNames[k].name.toLowerCase()));
  const lead = moodList ? t.because(moodList, st.liked[0] ?? st.duelPicks[0]) : '';
  const topGenre = mostCommon(recs.flatMap(m => m.genres));
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
            {lead && <p data-reveal className="mp-lead">{lead}</p>}
            {st.uid ? (
              <a data-reveal href="#perfil" className="mp-saved"><BookmarkSimple size={16} weight="fill" aria-hidden />{t.savedNote}</a>
            ) : (
              <p data-reveal className="mp-saved">{t.unsavedNote}<button className="mp-linkbtn" onClick={() => set({ returnTo: 'results', screen: 'login' })}>{t.saveCta}</button></p>
            )}
          </div>
          <div data-reveal><Button variant="ghost" size="sm" icon={<ShareNetwork size={18} aria-hidden />} onClick={share}>{t.share}</Button></div>
        </div>

        {/* Cuántas ver: cambiar el número no pide volver a responder */}
        <div data-reveal className="mp-container mp-stack" style={{ gap: 2, marginTop: 28 }}>
          <span id="num-label" className="mp-kicker">{t.numMoviesLabel}</span>
          <div className="mp-nums mp-nums-sm tnum" role="group" aria-labelledby="num-label">
            {NUMBERS.map(n => <button key={n} aria-pressed={st.numMovies === n} onClick={() => set({ numMovies: n })}>{n}</button>)}
          </div>
        </div>

        <PosterGallery key={recs.map(m => m.title).join('|')} movies={recs} />

        <div className="mp-container mp-stack" style={{ gap: 72, marginTop: 88 }}>
          <div className="mp-stack" style={{ gap: 16 }}>
            <h2 data-reveal className="mp-title">{t.wrappedTitle}</h2>
            <div className="mp-bento">
              <div data-reveal className="mp-card mp-raised lead mp-stack" style={{ padding: 24, justifyContent: 'flex-end', minHeight: 180 }}>
                <span className="mp-display">{genreName(topGenre, st.lang)}</span>
                <span className="mp-label" style={{ color: 'var(--text-muted)' }}>{t.wGenre}</span>
              </div>
              <Stat label={t.wRareza}><CountUp value={outside} suffix="%" /></Stat>
              <Stat label={t.wCine}>{cine}</Stat>
              <Stat label={t.wNota}><CountUp value={avgImdb} decimals={1} /></Stat>
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

          <div data-reveal className="mp-card mp-stack" style={{ padding: 24, gap: 16 }}>
            <h2 className="mp-h3">{t.myPlatforms}</h2>
            <PlatformPicker label={t.myPlatforms} />
          </div>

          <div data-reveal className="mp-card mp-stack" style={{ padding: 24, gap: 24 }}>
            <div className="mp-stack" style={{ gap: 12 }}>
              <h2 className="mp-h3">{t.usefulAsk}</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button variant="secondary" size="sm" aria-pressed={st.useful === 'up'} icon={<ThumbsUp size={18} weight={st.useful === 'up' ? 'fill' : 'regular'} aria-hidden />} onClick={() => rate('up')}>{t.useful}</Button>
                <Button variant="secondary" size="sm" aria-pressed={st.useful === 'down'} icon={<ThumbsDown size={18} weight={st.useful === 'down' ? 'fill' : 'regular'} aria-hidden />} onClick={() => rate('down')}>{t.notUseful}</Button>
                {st.useful && <span className="mp-label" role="status">{t.thanksFeedback}</span>}
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--border)' }} />
            <div className="mp-stack" style={{ gap: 12 }}>
              <h2 className="mp-h3">{t.redoTitle}</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button variant="secondary" size="sm" icon={<ArrowsClockwise size={18} aria-hidden />} onClick={() => set({ confirm: 'redo' })}>{t.redoSame}</Button>
                <Button variant="secondary" size="sm" onClick={() => set({ confirm: 'restart' })}>{t.redoFresh}</Button>
                {st.uid && <Button variant="secondary" size="sm" icon={<ClockCounterClockwise size={18} aria-hidden />} onClick={() => go('profile')}>{t.myRuns}</Button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
