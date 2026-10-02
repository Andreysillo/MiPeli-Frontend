import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';

// Entrada de una pantalla o paso: el bloque sube y aparece, y sus [data-reveal] entran escalonados.
// Para repetirla al cambiar de paso, se le da un `key` nuevo. Sin animación con prefers-reduced-motion.
export default function Reveal({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(el, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', clearProps: 'transform' });
      const items = el.querySelectorAll('[data-reveal]');
      if (items.length) gsap.fromTo(items, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.08, clearProps: 'transform' });
    });
    return () => mm.revert();
  }, []);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}
