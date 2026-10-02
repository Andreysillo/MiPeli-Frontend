import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Entrada de una pantalla o paso: el bloque aparece y sus [data-reveal] entran escalonados (subida + desenfoque que se aclara).
// Los que están bajo el pliegue entran al hacer scroll hasta ellos. Para repetirla al cambiar de paso, se le da un `key` nuevo.
// Sin animación con prefers-reduced-motion.
export default function Reveal({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
      const items = el.querySelectorAll('[data-reveal]');
      if (!items.length) return;
      // opacity (no autoAlpha): lo que espera bajo el pliegue sigue siendo enfocable con Tab
      gsap.set(items, { opacity: 0, y: 22, filter: 'blur(8px)' });
      ScrollTrigger.batch(items, {
        start: 'top 94%', once: true,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', stagger: 0.07, clearProps: 'transform,filter' }),
      });
    });
    return () => mm.revert();
  }, []);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}
