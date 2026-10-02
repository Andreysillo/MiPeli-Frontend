import Aurora from '../components/Aurora';
import ParticleText from '../components/ParticleText';
import GlowButton from '../components/GlowButton';
import { auroraStops } from '../data';
import { useApp } from '../store';

export function AuroraBg() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><Aurora colorStops={auroraStops} amplitude={1.6} blend={0.5} /></div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(180deg,rgba(4,3,15,.35),rgba(4,3,15,.1) 45%,#04030f 100%)', pointerEvents: 'none' }} />
    </>
  );
}

export function LogoParticles({ fontSize }: { fontSize: string }) {
  return (
    <ParticleText text="MiPeli" color="#ffffff" highlightColor="#b18cff" particleSize={2.3} density={3} scatter={170} gatherDuration={1700} stagger={520}
      pointerRepel={48} repelRadius={120} idleDrift={0.6} trigger="mount" fontFamily="Trebuchet MS, Tahoma, Arial, sans-serif" fontWeight={700} fontSize={fontSize} />
  );
}

export default function Welcome() {
  const { set, t } = useApp();
  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#3300ff' }}>
      <AuroraBg />
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 22px' }}>
        <span className="mp-heading" style={{ fontSize: 22, color: '#fff' }}>MiPeli</span>
      </div>

      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 560, width: '100%', margin: '0 auto', padding: '10px 24px 30px', textAlign: 'center' }}>
        <p className="mp-mono" style={{ letterSpacing: '.16em', fontSize: 11, color: 'rgba(255,255,255,.85)', margin: 0 }}>{t.tag}</p>
        <div style={{ height: 150, margin: '14px 0 2px' }}><LogoParticles fontSize="132" /></div>
        <p style={{ fontSize: 17, lineHeight: 1.5, color: 'rgba(238,241,255,.9)', margin: '6px auto 0', maxWidth: 420 }}>{t.welcomeDesc}</p>
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 460, margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <GlowButton label={t.google} onClick={() => set({ loggedIn: true, user: 'Kevin', screen: 'type' })} />
          <GlowButton label={t.guest} bg="#0a0a1e" color="#cdd7ff" onClick={() => set({ loggedIn: false, user: 'invitado', screen: 'type' })} />
        </div>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 16, fontSize: 12 }}>
          <a href="#faq" style={{ color: 'rgba(255,255,255,.7)' }}>{t.faq}</a>
          <a href="#contacto" style={{ color: 'rgba(255,255,255,.7)' }}>{t.sug}</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener" style={{ color: '#b18cff' }}>Kevin ↗</a>
        </div>
      </div>
    </div>
  );
}
