import { useRef } from 'react';
import { ArrowLeft, ArrowRight, Check, FilmSlate, MaskHappy, Popcorn } from '@phosphor-icons/react';
import { poster, welcomePosters } from '../data';
import Ambient from '../components/Ambient';
import Button from '../components/Button';
import Rise from '../components/Rise';
import { useSpotlight } from '../useSpotlight';
import { useApp, type Length, type RecKey, type Step } from '../store';

// Orden de los pasos de la encuesta según lo elegido; "personal" (ánimo) siempre cierra
export function buildSteps(rec: Record<RecKey, boolean>): Step[] {
  const steps: Step[] = [];
  if (rec.genres) steps.push('genres');
  if (rec.director) steps.push('director');
  if (rec.movies) steps.push('duel', 'movies');
  return steps.length ? [...steps, 'personal'] : [];
}

const NUMBERS = [1, 3, 5, 8, 10];

export default function RecTypes() {
  const { st, set, go, t } = useApp();
  const list = useRef<HTMLDivElement>(null);
  useSpotlight(list);

  const options: { key: RecKey; Icon: typeof Popcorn; title: string; desc: string; hero?: boolean }[] = [
    { key: 'movies', Icon: Popcorn, title: t.recMovies, desc: t.recMoviesD, hero: true },
    { key: 'genres', Icon: MaskHappy, title: t.recGenres, desc: t.recGenresD },
    { key: 'director', Icon: FilmSlate, title: t.recDirector, desc: t.recDirectorD },
  ];
  const lengths: [Length, string][] = [['short', t.lenShort], ['med', t.lenMed], ['long', t.lenLong]];
  const steps = buildSteps(st.rec);
  const minutes = Math.max(1, Math.round(steps.length * 0.6));

  return (
    <section className="mp-screen">
      <Ambient />
      <div className="mp-content mp-container mp-wide mp-page mp-flow">
        <div data-reveal><Button variant="ghost" size="sm" icon={<ArrowLeft size={18} aria-hidden />} onClick={() => go('type')} style={{ marginLeft: -14 }}>{t.changeType}</Button></div>
        <Rise text={t.recTitle} className="mp-title" />
        <p data-reveal className="mp-lead" style={{ margin: '16px 0 0' }}>{t.recDesc}</p>

        {/* Tarjetas de selección múltiple: la elegida se enciende en blanco y su marca de verificación salta */}
        <div ref={list} className="mp-picks" role="group" aria-label={t.recTitle}>
          {options.map(({ key, Icon, title, desc, hero }, i) => (
            <button key={key} data-reveal className={hero ? 'mp-panel mp-pick mp-pick-hero' : 'mp-panel mp-pick'} aria-pressed={st.rec[key]}
              onClick={() => set({ rec: { ...st.rec, [key]: !st.rec[key] } })}>
              <span className="mp-panel-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <span className="mp-panel-top">
                <span className="mp-icon-tile"><Icon size={22} weight="duotone" aria-hidden /></span>
                <span className="mp-check"><Check size={14} weight="bold" aria-hidden /></span>
              </span>
              {hero && <span className="mp-fanmini" aria-hidden>{welcomePosters.map(m => <img key={m.title} src={poster(m)} alt="" />)}</span>}
              <span className="mp-panel-body">
                {hero && <span className="mp-tag">{t.bestTag}</span>}
                <span className="mp-panel-title">{title}</span>
                <span className="mp-panel-desc">{desc}</span>
              </span>
            </button>
          ))}
        </div>

        <div data-reveal className="mp-stack" style={{ gap: 28, marginTop: 40 }}>
          <div className="mp-stack" style={{ gap: 6 }}>
            <span id="num-label" className="mp-kicker">{t.numMoviesLabel}</span>
            <div className="mp-nums tnum" role="group" aria-labelledby="num-label">
              {NUMBERS.map(n => <button key={n} aria-pressed={st.numMovies === n} onClick={() => set({ numMovies: n })}>{n}</button>)}
            </div>
          </div>
          {st.surveyType === 'custom' && (
            <div className="mp-stack" style={{ gap: 10 }}>
              <span id="len-label" className="mp-kicker">{t.lengthLabel}</span>
              <div className="mp-seg" role="group" aria-labelledby="len-label">
                {lengths.map(([l, label]) => <button key={l} aria-pressed={st.length === l} onClick={() => set({ length: l })}>{label}</button>)}
              </div>
            </div>
          )}
        </div>

        <div className="mp-actionbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <span className="mp-label tnum" aria-live="polite">{steps.length ? t.summary(steps.length, minutes) : t.pickAtLeastOne}</span>
          <Button disabled={!steps.length} icon={null} onClick={() => set({ questSteps: steps, qi: 0, duelIdx: 0, screen: 'quest', questActive: true })}>
            {t.start}<ArrowRight size={18} weight="bold" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
