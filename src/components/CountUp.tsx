import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Número que sube desde 0 cuando entra en pantalla. El texto lo escribe GSAP, no React.
export default function CountUp({ value, decimals = 0, suffix = '' }: Readonly<{ value: number; decimals?: number; suffix?: string }>) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!;
    const fmt = (v: number) => v.toFixed(decimals) + suffix;
    el.textContent = fmt(value);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const o = { v: 0 };
      el.textContent = fmt(0);
      gsap.to(o, { v: value, duration: 1.4, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); }, scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    return () => mm.revert();
  }, [value, decimals, suffix]);
  return <span ref={ref} />;
}
