import { ArrowRight } from '@phosphor-icons/react';
import PosterWall from '../components/PosterWall';
import Button from '../components/Button';
import { useApp } from '../store';

export default function Home() {
  const { st, go, t, name } = useApp();
  return (
    <section className="mp-screen" style={{ display: 'flex', alignItems: 'flex-end' }}>
      <PosterWall scrim="radial-gradient(120% 90% at 18% 85%,rgba(15,15,20,.9),rgba(15,15,20,.25) 60%,transparent)" />
      <div className="mp-content mp-container mp-stack" style={{ gap: 16, paddingBottom: 64, pointerEvents: 'none' }}>
        <span data-reveal className="mp-kicker">{t.hi(name)}</span>
        <h1 data-reveal className="mp-display" style={{ maxWidth: '14ch' }}>{t.homeH1}</h1>
        <p data-reveal className="mp-lead">{t.homeDesc}</p>
        <div data-reveal style={{ marginTop: 8, pointerEvents: 'auto' }}>
          <Button onClick={() => go(st.questActive ? 'quest' : 'type')}>
            {st.questActive ? t.continueSurvey : t.startSurvey}<ArrowRight size={18} weight="bold" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
