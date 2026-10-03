import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

// Fondo de las pantallas de elección: líneas de columna casi invisibles, dos manchas grises que derivan y un resplandor que persigue al cursor.
// Sustituye a las olas animadas. Solo grises: el color queda para los pósters y el botón principal.
export default function Ambient() {
  const glow = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (hover: hover)', () => {
      gsap.set(glow.current, { x: innerWidth * 0.7, y: innerHeight * 0.35 });
      const x = gsap.quickTo(glow.current, 'x', { duration: 0.9, ease: 'power3.out' });
      const y = gsap.quickTo(glow.current, 'y', { duration: 0.9, ease: 'power3.out' });
      const move = (e: PointerEvent) => { x(e.clientX); y(e.clientY); };
      addEventListener('pointermove', move);
      return () => removeEventListener('pointermove', move);
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="mp-ambient" aria-hidden>
      <span className="mp-blob a" />
      <span className="mp-blob b" />
      <div ref={glow} className="mp-glow" />
    </div>
  );
}
