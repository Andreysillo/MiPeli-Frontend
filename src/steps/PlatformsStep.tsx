import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Shuffle } from '@phosphor-icons/react';
import gsap from 'gsap';
import { CINE, cinemaLogo, platforms, type Platform } from '../data';
import { platformName } from '../components/Movie';
import { useApp } from '../store';
import { allPlatforms } from './PlatformPicker';
import StepHeader from './StepHeader';

const logoOf = (p: Platform) => (p === CINE ? cinemaLogo : platforms[p].logo);

// Paso 1: dónde ve películas. Lista tipográfica al estilo de fontsinmovies.com: al pasar el mouse por una plataforma, su imagen sigue al cursor.
// "Recomiéndame donde sea" es la lista vacía: sin filtro de plataforma. Se guarda en el navegador y la próxima vez llega ya marcada.
export default function PlatformsStep() {
  const { st, set, t, name } = useApp();
  const [peek, setPeek] = useState<{ p: Platform; on: boolean }>({ p: allPlatforms[0], on: false });
  const card = useRef<HTMLDivElement>(null);
  const anywhere = st.ownedPlatforms.length === 0;
  const toggle = (p: Platform) => set({ ownedPlatforms: st.ownedPlatforms.includes(p) ? st.ownedPlatforms.filter(x => x !== p) : [...st.ownedPlatforms, p] });

  // La imagen se mueve con el cursor, con un poco de retraso (sin retraso si se pidió reducir el movimiento)
  useEffect(() => {
    const el = card.current!;
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.45;
    const x = gsap.quickTo(el, 'x', { duration, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration, ease: 'power3' });
    // Del lado derecho de la pantalla la imagen se abre hacia la izquierda, para no salirse
    const move = (e: PointerEvent) => { x(e.clientX); y(e.clientY); el.dataset.side = e.clientX > innerWidth / 2 ? 'left' : 'right'; };
    document.addEventListener('pointermove', move);
    return () => { document.removeEventListener('pointermove', move); gsap.killTweensOf(el); };
  }, []);

  return (
    <>
      <StepHeader kicker={t.hi(name)} title={t.platformsQ} hint={t.platformsHint} />
      <div className="mp-stack" style={{ gap: 28, marginTop: 36 }}>
        <button data-reveal className="mp-any" aria-pressed={anywhere} onClick={() => set({ ownedPlatforms: [] })}>
          <span className="mp-any-icon" aria-hidden>{anywhere ? <Check size={22} weight="bold" /> : <Shuffle size={22} weight="bold" />}</span>
          <span className="mp-any-text">
            <span className="mp-any-name">{t.platformsAny}</span>
            <span className="mp-any-hint">{t.platformsAnyHint}</span>
          </span>
        </button>
        <ul data-reveal className="mp-plist" aria-label={t.platformsQ}>
          {allPlatforms.map((p, i) => (
            <li key={p}>
              <button className="mp-prow" aria-pressed={st.ownedPlatforms.includes(p)} onClick={() => toggle(p)}
                onPointerEnter={() => setPeek({ p, on: true })} onPointerLeave={() => setPeek(s => ({ ...s, on: false }))}>
                <span className="mp-prow-idx" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                <span className="mp-prow-name" translate={p === CINE ? undefined : 'no'}>{platformName(p, t)}</span>
                <img className="mp-prow-thumb" src={logoOf(p)} alt="" width={44} height={44} loading="lazy" draggable={false} />
                <span className="mp-check"><Check size={14} weight="bold" aria-hidden /></span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {createPortal(
        <div ref={card} className="mp-peek" aria-hidden>
          <div className="mp-peek-card" data-on={peek.on}>
            {allPlatforms.map(p => <img key={p} src={logoOf(p)} alt="" data-on={peek.p === p} data-cine={p === CINE} draggable={false} />)}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
