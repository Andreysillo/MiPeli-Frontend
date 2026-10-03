import { useRef } from 'react';
import { ArrowRight, Clock, Lightning, SlidersHorizontal, Star } from '@phosphor-icons/react';
import Ambient from '../components/Ambient';
import Rise from '../components/Rise';
import { useSpotlight } from '../useSpotlight';
import { useApp, type State, type SurveyType as Kind } from '../store';

const presets: Record<Kind, Partial<State>> = {
  full: { surveyType: 'full', length: 'long', rec: { movies: true, genres: true, director: true } },
  short: { surveyType: 'short', length: 'short', rec: { movies: true, genres: true, director: false } },
  custom: { surveyType: 'custom', length: 'med', rec: { movies: false, genres: true, director: false } },
};

// Tres paneles: con mouse, el que tocas se expande y los demás ceden espacio; con tacto quedan apilados.
// Cada panel lleva un resplandor que sigue al cursor, un número en contorno gigante y una flecha que gira al apuntarla.
export default function SurveyType() {
  const { set, t, name } = useApp();
  const list = useRef<HTMLDivElement>(null);
  useSpotlight(list);

  const types = [
    { key: 'full' as const, title: t.typeFull, desc: t.typeFullD, time: `~5 ${t.min}`, Icon: Star },
    { key: 'short' as const, title: t.typeShort, desc: t.typeShortD, time: `~2 ${t.min}`, Icon: Lightning },
    { key: 'custom' as const, title: t.typeCustom, desc: t.typeCustomD, time: t.youChoose, Icon: SlidersHorizontal },
  ];

  return (
    <section className="mp-screen">
      <Ambient />
      <div className="mp-content mp-container mp-wide mp-page">
        <p data-reveal className="mp-kicker">{t.hi(name)}</p>
        <Rise text={t.typeTitle} className="mp-display" />
        <p data-reveal className="mp-lead" style={{ margin: '16px 0 0' }}>{t.typeDesc}</p>

        <div ref={list} className="mp-choices">
          {types.map(({ key, title, desc, time, Icon }, i) => (
            <button key={key} data-reveal className="mp-panel" onClick={() => set({ ...presets[key], screen: 'rectypes' })}>
              <span className="mp-panel-num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <span className="mp-panel-top">
                <span className="mp-icon-tile"><Icon size={22} weight="duotone" aria-hidden /></span>
                {i === 0 && <span className="mp-tag">{t.recommendedTag}</span>}
              </span>
              <span className="mp-panel-body">
                <span className="mp-panel-title">{title}</span>
                <span className="mp-panel-desc">{desc}</span>
              </span>
              <span className="mp-panel-foot">
                <span className="mp-label mp-inline"><Clock size={16} aria-hidden />{time}</span>
                <span className="mp-go"><ArrowRight size={20} aria-hidden /></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
