import { Clock, Lightning, SlidersHorizontal, Star, ArrowRight } from '@phosphor-icons/react';
import MaskedHeading from '../components/MaskedHeading';
import WavesBg, { interactive } from '../components/WavesBg';
import { maskedHeadingSrc } from '../data';
import { useApp, type State, type SurveyType as Kind } from '../store';

const presets: Record<Kind, Partial<State>> = {
  full: { surveyType: 'full', length: 'long', rec: { movies: true, genres: true, director: true } },
  short: { surveyType: 'short', length: 'short', rec: { movies: true, genres: true, director: false } },
  custom: { surveyType: 'custom', length: 'med', rec: { movies: false, genres: true, director: false } },
};

export default function SurveyType() {
  const { set, t, name } = useApp();
  const types = [
    { key: 'full' as const, title: t.typeFull, desc: t.typeFullD, time: `~5 ${t.min}`, Icon: Star, grad: 'linear-gradient(150deg,rgba(82,39,255,.55),rgba(18,14,46,.7) 60%)' },
    { key: 'short' as const, title: t.typeShort, desc: t.typeShortD, time: `~2 ${t.min}`, Icon: Lightning },
    { key: 'custom' as const, title: t.typeCustom, desc: t.typeCustomD, time: t.youChoose, Icon: SlidersHorizontal },
  ];

  return (
    <section className="mp-screen">
      <WavesBg {...interactive} />
      <div className="mp-content mp-container mp-page">
        <p data-reveal className="mp-kicker">{t.hi(name)}</p>
        <MaskedHeading text={t.typeTitle} src={maskedHeadingSrc} tag="h1" align="left" textScale={window.innerWidth < 640 ? 0.09 : 0.046}
          weight={700} tracking={-0.03} reveal="rise" trigger="view" duration={1} stagger={0.06} fillScale={1.2} parallax={18} drift={10} />
        <p data-reveal className="mp-lead" style={{ margin: '8px 0 28px' }}>{t.typeDesc}</p>

        <div className="mp-types">
          {types.map(({ key, title, desc, time, Icon, grad }, i) => (
            <button key={key} data-reveal className="mp-option" onClick={() => set({ ...presets[key], screen: 'rectypes' })}
              style={{ gap: 12, padding: i === 0 ? 28 : 22, justifyContent: 'space-between', minHeight: i === 0 ? 260 : 0, background: grad }}>
              <span style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span className="mp-icon-tile"><Icon size={22} weight="duotone" aria-hidden /></span>
                {i === 0 && <span className="mp-tag" style={{ color: 'var(--text)', borderColor: 'var(--accent)' }}>{t.recommendedTag}</span>}
              </span>
              <span className="mp-stack" style={{ gap: 6 }}>
                <span className={i === 0 ? 'mp-title' : 'mp-h3'}>{title}</span>
                <span style={{ color: 'var(--text-muted)', maxWidth: '40ch' }}>{desc}</span>
              </span>
              <span style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="mp-label" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Clock size={16} aria-hidden />{time}</span>
                <ArrowRight size={20} aria-hidden />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
