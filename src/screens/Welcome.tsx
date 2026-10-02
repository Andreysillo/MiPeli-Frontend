import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { GoogleLogo, UserCircle } from '@phosphor-icons/react';
import Aurora from '../components/Aurora';
import ParticleText from '../components/ParticleText';
import Button from '../components/Button';
import { auroraStops, poster, welcomePosters } from '../data';
import { useApp } from '../store';

export function AuroraBg() {
  return (
    <>
      <div className="mp-bg"><Aurora colorStops={auroraStops} amplitude={1.6} blend={0.5} /></div>
      <div className="mp-scrim" style={{ background: 'linear-gradient(180deg,rgba(7,6,26,.35),rgba(7,6,26,.15) 40%,#07061a 100%)' }} />
    </>
  );
}

export function LogoParticles({ fontSize }: { fontSize: string }) {
  return (
    <ParticleText text="MiPeli" color="#ffffff" highlightColor="#b18cff" particleSize={2.1} density={3} scatter={170} gatherDuration={1700} stagger={520}
      pointerRepel={48} repelRadius={120} idleDrift={0.6} trigger="mount" fontFamily="'Geist Variable', system-ui, sans-serif" fontWeight={750} fontSize={fontSize} />
  );
}

// Posición final de cada póster del abanico: izquierda, centro (delante), derecha
const fanPose = [{ x: -150, y: 24, rotation: -9 }, { x: 0, y: -18, rotation: 0, zIndex: 2 }, { x: 150, y: 24, rotation: 9 }];

export default function Welcome() {
  const { set, t } = useApp();
  const fan = useRef<HTMLDivElement>(null);

  // El abanico se despliega al entrar: anticipa el tipo de resultado que vas a obtener
  useLayoutEffect(() => {
    const imgs = fan.current!.querySelectorAll('img');
    imgs.forEach((img, i) => gsap.set(img, { xPercent: -50, yPercent: -50, ...fanPose[i] }));
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(imgs, { x: 0, y: 80, rotation: 0, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.25 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="mp-screen" style={{ display: 'flex', flexDirection: 'column', background: '#2a10c9' }}>
      <AuroraBg />
      <div className="mp-content mp-container mp-hero" style={{ flex: 1, minHeight: 0, maxWidth: 1240 }}>
        <div className="mp-stack" style={{ gap: 24, maxWidth: 640 }}>
          <div data-reveal style={{ height: 104, width: 340, maxWidth: '100%', marginLeft: -12 }}><LogoParticles fontSize="92" /></div>
          <h1 data-reveal className="mp-display" style={{ fontSize: 'clamp(2.25rem, 2.2vw + 1.1rem, 3.2rem)' }}>{t.heroTitle}</h1>
          <p data-reveal className="mp-lead">{t.heroDesc}</p>
          <div data-reveal style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <Button icon={<GoogleLogo size={20} weight="bold" aria-hidden />} onClick={() => set({ loggedIn: true, user: 'Kevin', screen: 'type' })}>{t.google}</Button>
            <Button variant="secondary" icon={<UserCircle size={20} aria-hidden />} onClick={() => set({ loggedIn: false, screen: 'type' })}>{t.guest}</Button>
          </div>
        </div>
        <div className="mp-fan" ref={fan} aria-hidden>
          {welcomePosters.map(m => <img key={m.title} src={poster(m)} alt="" />)}
        </div>
      </div>
      <footer className="mp-content mp-container" style={{ maxWidth: 1240, display: 'flex', gap: 20, flexWrap: 'wrap', paddingBottom: 24, fontSize: '.875rem' }}>
        <a href="#faq" style={{ color: 'var(--text-muted)' }}>{t.faq}</a>
        <a href="#contacto" style={{ color: 'var(--text-muted)' }}>{t.sug}</a>
      </footer>
    </section>
  );
}
