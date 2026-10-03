import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { EnvelopeSimple, UserCircle } from '@phosphor-icons/react';
import Aurora from '../components/Aurora';
import ParticleText from '../components/ParticleText';
import Button from '../components/Button';
import { auroraStops, poster, welcomePosters } from '../data';
import { useGoogleSignIn } from '../useGoogleSignIn';
import { useApp } from '../store';

export function AuroraBg() {
  return (
    <>
      <div className="mp-bg"><Aurora colorStops={auroraStops} amplitude={1.6} blend={0.5} /></div>
      <div className="mp-scrim" style={{ background: 'linear-gradient(180deg,rgba(15,15,20,.35),rgba(15,15,20,.15) 40%,#0f0f14 100%)' }} />
    </>
  );
}

export function LogoParticles({ fontSize }: Readonly<{ fontSize: string }>) {
  return (
    <ParticleText text="MiPeli" color="#f4f4f4" highlightColor="#a3a3b8" particleSize={2.1} density={3} scatter={170} gatherDuration={1700} stagger={520}
      pointerRepel={48} repelRadius={120} idleDrift={0.6} trigger="mount" fontFamily="'Geist Variable', system-ui, sans-serif" fontWeight={750} fontSize={fontSize} />
  );
}

// "G" oficial de Google: las guías de marca de Sign in with Google piden el logo a color, sin modificar
export function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

// Posición final de cada póster del abanico: izquierda, centro (delante), derecha
const fanPose = [{ x: -150, y: 24, rotation: -9 }, { x: 0, y: -18, rotation: 0, zIndex: 2 }, { x: 150, y: 24, rotation: 9 }];

export default function Welcome() {
  const { st, set, go, t, name } = useApp();
  const fan = useRef<HTMLDivElement>(null);
  const { busy, google } = useGoogleSignIn();

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
    <section className="mp-screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <AuroraBg />
      <div className="mp-content mp-container mp-hero" style={{ flex: 1, minHeight: 0, maxWidth: 1240 }}>
        <div className="mp-stack" style={{ gap: 24, maxWidth: 640 }}>
          <div data-reveal style={{ height: 104, width: 340, maxWidth: '100%', marginLeft: -12 }}><LogoParticles fontSize="92" /></div>
          <h1 data-reveal className="mp-display" style={{ fontSize: 'clamp(2.25rem, 2.2vw + 1.1rem, 3.2rem)' }}>{t.heroTitle}</h1>
          <p data-reveal className="mp-lead">{t.heroDesc}</p>
          <div data-reveal style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
            <Button variant="google" icon={<GoogleG />} onClick={google} disabled={busy} aria-busy={busy}>{st.loggedIn ? t.continueAs(name) : t.google}</Button>
            {!st.loggedIn && <Button variant="secondary" icon={<EnvelopeSimple size={20} aria-hidden />} onClick={() => go('login')}>{t.emailLogin}</Button>}
            {!st.loggedIn && <Button variant="ghost" icon={<UserCircle size={20} aria-hidden />} onClick={() => set({ screen: 'type' })}>{t.guest}</Button>}
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
