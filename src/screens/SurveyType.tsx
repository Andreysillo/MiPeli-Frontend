import { useState } from 'react';
import MaskedHeading from '../components/MaskedHeading';
import WavesBg, { interactive } from '../components/WavesBg';
import { maskedHeadingSrc } from '../data';
import { useApp, type State, type SurveyType as Kind } from '../store';

const presets: Record<Kind, Partial<State>> = {
  full: { surveyType: 'full', length: 'long', rec: { movies: true, genres: true, themes: true, director: true } },
  short: { surveyType: 'short', length: 'short', rec: { movies: true, genres: true, themes: false, director: false } },
  custom: { surveyType: 'custom', length: 'med', rec: { movies: false, genres: true, themes: false, director: false } },
};

export default function SurveyType() {
  const { st, set, t } = useApp();
  const [active, setActive] = useState<Kind>(st.surveyType || 'full');
  const types = [
    { key: 'full' as const, title: t.typeFull, desc: t.typeFullD, time: '~5 ' + t.min, grad: 'linear-gradient(150deg,#1b2a6b,#0a0a1e)' },
    { key: 'short' as const, title: t.typeShort, desc: t.typeShortD, time: '~2 ' + t.min, grad: 'linear-gradient(150deg,#3a1d7a,#0a0a1e)' },
    { key: 'custom' as const, title: t.typeCustom, desc: t.typeCustomD, time: t.youChoose, grad: 'linear-gradient(150deg,#0f3aa8,#120a2e)' },
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '96px 24px 48px' }}>
      <WavesBg {...interactive} />
      <div className="mp-up" style={{ position: 'relative', zIndex: 2, maxWidth: 920, margin: '0 auto' }}>
        <p className="mp-mono" style={{ letterSpacing: '.14em', fontSize: 11, color: '#a9c0ff', margin: 0 }}>{t.hi} {st.user}</p>
        <MaskedHeading text={t.typeTitle} src={maskedHeadingSrc} tag="h1" className="mp-heading mp-type-heading" align="left" textScale={0.052} weight={700} tracking={-0.02}
          reveal="rise" trigger="view" duration={1} stagger={0.06} fillScale={1.2} parallax={18} drift={10} />
        <p style={{ fontSize: 15, color: 'rgba(238,241,255,.78)', margin: '0 0 26px' }}>{t.typeDesc}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: 440 }}>
          {types.map(tp => {
            const on = active === tp.key;
            return (
              <div key={tp.key} onMouseEnter={() => setActive(tp.key)} onClick={() => set({ ...presets[tp.key], screen: 'rectypes' })}
                style={{ position: 'relative', overflow: 'hidden', borderRadius: 22, cursor: 'pointer', flex: on ? 4 : 1, filter: on ? 'brightness(1)' : 'brightness(.5)', background: tp.grad, border: '1px solid rgba(255,255,255,.16)', transition: 'flex .42s cubic-bezier(.25,1,.5,1),filter .3s ease', minHeight: 56 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(4,3,15,.82),rgba(4,3,15,.15) 55%,transparent)', opacity: on ? 1 : 0, transition: 'opacity .5s ease' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '22px 26px' }}>
                  {on ? (
                    <div>
                      <span className="mp-mono" style={{ display: 'inline-block', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff', background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 999, padding: '4px 12px', backdropFilter: 'blur(6px)' }}>⏱ {tp.time}</span>
                      <h3 className="mp-heading" style={{ fontSize: 'clamp(26px,4vw,40px)', color: '#fff', margin: '12px 0 6px' }}>{tp.title}</h3>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', margin: '0 0 12px', maxWidth: 440 }}>{tp.desc}</p>
                      <span className="mp-mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: '#fff', fontWeight: 700 }}>{t.start} ↗</span>
                    </div>
                  ) : (
                    <span className="mp-heading" style={{ fontSize: 18, color: '#fff', opacity: 0.9 }}>{tp.title}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
