import { ArrowLeft, ArrowRight, Check, FilmSlate, MaskHappy, Popcorn } from '@phosphor-icons/react';
import { poster, welcomePosters } from '../data';
import SplitText from '../components/SplitText';
import Button from '../components/Button';
import WavesBg, { interactive } from '../components/WavesBg';
import { useApp, type Length, type RecKey, type Step } from '../store';

// Orden de los pasos de la encuesta según lo elegido; "personal" (ánimo) siempre cierra
export function buildSteps(rec: Record<RecKey, boolean>): Step[] {
  const steps: Step[] = [];
  if (rec.genres) steps.push('genres');
  if (rec.director) steps.push('director');
  if (rec.movies) steps.push('duel', 'movies');
  return steps.length ? [...steps, 'personal'] : [];
}

export default function RecTypes() {
  const { st, set, go, t } = useApp();
  const options: { key: RecKey; Icon: typeof Popcorn; title: string; desc: string }[] = [
    { key: 'movies', Icon: Popcorn, title: t.recMovies, desc: t.recMoviesD },
    { key: 'genres', Icon: MaskHappy, title: t.recGenres, desc: t.recGenresD },
    { key: 'director', Icon: FilmSlate, title: t.recDirector, desc: t.recDirectorD },
  ];
  const lengths: [Length, string][] = [['short', t.lenShort], ['med', t.lenMed], ['long', t.lenLong]];
  const steps = buildSteps(st.rec);
  const minutes = Math.max(1, Math.round(steps.length * 0.6));

  return (
    <section className="mp-screen">
      <WavesBg {...interactive} />
      <div className="mp-content mp-container mp-page mp-flow">
        <div data-reveal><Button variant="ghost" size="sm" icon={<ArrowLeft size={18} aria-hidden />} onClick={() => go('type')} style={{ marginLeft: -14 }}>{t.changeType}</Button></div>
        <SplitText text={t.recTitle} tag="h1" className="mp-title" splitType="chars" textAlign="left" delay={14} duration={0.6} ease="power3.out" threshold={0.1} rootMargin="-40px" />
        <p data-reveal className="mp-lead" style={{ margin: '10px 0 28px' }}>{t.recDesc}</p>

        <div className="mp-recs" role="group" aria-label={t.recTitle}>
          {options.map(({ key, Icon, title, desc }, i) => i === 0 ? (
            // Películas: la opción estrella, más grande y con pósters de muestra
            <button key={key} data-reveal className="mp-option mp-raised mp-rec-hero" aria-pressed={st.rec[key]} onClick={() => set({ rec: { ...st.rec, [key]: !st.rec[key] } })}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%' }}>
                <span className="mp-icon-tile" style={{ width: 52, height: 52 }}><Icon size={28} weight="duotone" aria-hidden /></span>
                <span className="mp-check"><Check size={14} weight="bold" aria-hidden /></span>
              </span>
              <span className="mp-rec-posters" aria-hidden>{welcomePosters.map(m => <img key={m.title} src={poster(m)} alt="" />)}</span>
              <span className="mp-stack" style={{ gap: 8 }}>
                <span className="mp-tag" style={{ color: 'var(--text)', borderColor: 'var(--border-strong)', alignSelf: 'flex-start' }}>{t.bestTag}</span>
                <span className="mp-title">{title}</span>
                <span className="mp-label" style={{ color: 'var(--text-muted)', maxWidth: '40ch' }}>{desc}</span>
              </span>
            </button>
          ) : (
            <button key={key} data-reveal className="mp-option" aria-pressed={st.rec[key]} onClick={() => set({ rec: { ...st.rec, [key]: !st.rec[key] } })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <span className="mp-icon-tile"><Icon size={22} weight="duotone" aria-hidden /></span>
              <span className="mp-stack" style={{ flex: 1, gap: 2 }}>
                <span className="mp-h3" style={{ fontSize: '1.0625rem' }}>{title}</span>
                <span className="mp-label">{desc}</span>
              </span>
              <span className="mp-check"><Check size={14} weight="bold" aria-hidden /></span>
            </button>
          ))}
        </div>

        <div data-reveal className="mp-stack" style={{ gap: 20, marginTop: 28 }}>
          <div className="mp-stack" style={{ gap: 10 }}>
            <span id="num-label" className="mp-label">{t.numMoviesLabel}</span>
            <div className="mp-seg tnum" role="group" aria-labelledby="num-label">
              {[1, 3, 5, 8, 10].map(n => <button key={n} aria-pressed={st.numMovies === n} onClick={() => set({ numMovies: n })}>{n}</button>)}
            </div>
          </div>
          {st.surveyType === 'custom' && (
            <div className="mp-stack" style={{ gap: 10 }}>
              <span id="len-label" className="mp-label">{t.lengthLabel}</span>
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
