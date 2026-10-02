import { useMemo } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import DriftWall from '../components/DriftWall';
import Button from '../components/Button';
import { catalog, driftItem } from '../data';
import { useApp } from '../store';

export default function Home() {
  const { st, go, t, name } = useApp();
  // 24 bastan para llenar el muro; generar el arte de todo el catálogo trabaría la entrada
  const wall = useMemo(() => catalog.slice(0, 24).map(driftItem), []);
  return (
    <section className="mp-screen" style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div className="mp-bg">
        <DriftWall items={wall} columns={6} tileWidth={150} tileHeight={225} gap={18} tilt={16} turn={-14} perspective={1200} depth={120} speed={42} direction="up"
          variance={0.45} parallax={0.6} lift={70} fade={0.62} dim={0.5} overlayColor="#07061a" />
      </div>
      <div className="mp-scrim" style={{ background: 'radial-gradient(120% 90% at 18% 85%,rgba(7,6,26,.9),rgba(7,6,26,.25) 60%,transparent)' }} />
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
