import { useRef } from 'react';
import DriftWall from '../components/DriftWall';
import GlowButton from '../components/GlowButton';
import { AuroraBg, LogoParticles } from './Welcome';
import { driftMovies } from '../data';
import { useApp } from '../store';

export default function Home() {
  const { st, go, t } = useApp();
  const feedRef = useRef<HTMLDivElement>(null);
  const scrollToFeed = () => { const el = feedRef.current; if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' }); };

  return (
    <div>
      {/* Sección 1: héroe con logo de partículas */}
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#3300ff', overflow: 'hidden' }}>
        <AuroraBg />
        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '80px 24px 40px' }}>
          <p className="mp-mono" style={{ letterSpacing: '.16em', fontSize: 11, color: 'rgba(255,255,255,.85)', margin: 0 }}>{t.hi} {st.user}</p>
          <div style={{ height: 160, width: '100%', maxWidth: 520, margin: '14px 0 2px' }}><LogoParticles fontSize="140" /></div>
          <p style={{ fontSize: 17, lineHeight: 1.5, color: 'rgba(238,241,255,.9)', margin: '6px auto 0', maxWidth: 420 }}>{t.welcomeDesc}</p>
        </div>
        <button onClick={scrollToFeed} className="mp-mono" style={{ position: 'relative', zIndex: 2, margin: '0 auto 26px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,.75)', fontSize: 11, letterSpacing: '.14em', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: 'Trebuchet MS' }}>
          {t.scrollFeed}<span style={{ fontSize: 18, animation: 'mp-bob 1.6s ease-in-out infinite' }}>↓</span>
        </button>
      </div>

      {/* Sección 2: muro de pósters */}
      <div ref={feedRef} style={{ position: 'relative', minHeight: '100vh', background: '#04030f', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <DriftWall items={driftMovies} columns={6} tileWidth={150} tileHeight={220} gap={18} tilt={16} turn={-14} perspective={1200} depth={120} speed={42} direction="up"
            variance={0.45} parallax={0.6} lift={70} fade={0.62} dim={0.5} overlayColor="#0a0a1e" />
        </div>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(120% 90% at 22% 46%,rgba(4,3,15,.72),rgba(4,3,15,.15) 60%,transparent)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', maxWidth: 560, padding: '0 24px 56px', pointerEvents: 'none' }}>
          <p className="mp-mono" style={{ fontSize: 11, letterSpacing: '.14em', color: '#a9c0ff', margin: 0 }}>{t.hi} {st.user}</p>
          <h1 className="mp-heading mp-grad" style={{ fontSize: 'clamp(38px,7vw,58px)', margin: '10px 0 0' }}>{t.homeH1}</h1>
          <p style={{ fontSize: 15, color: 'rgba(238,241,255,.86)', margin: '14px 0 0', maxWidth: 420 }}>{t.homeDesc}</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, pointerEvents: 'auto', flexWrap: 'wrap' }}>
            <div style={{ width: 210 }}>
              <GlowButton label={st.questActive ? t.continueSurvey : t.startSurvey} onClick={() => go(st.questActive ? 'quest' : 'type')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
