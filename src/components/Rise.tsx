import { Fragment, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { splitWords } from '../words';

// Titular cuyas palabras suben una a una desde una máscara (el mismo gesto de la landing). Con prefers-reduced-motion se ve estático.
export default function Rise({ text, as: Tag = 'h1', className }: Readonly<{ text: string; as?: 'h1' | 'h2'; className?: string }>) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = useMemo(() => splitWords(text), [text]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.mp-rise > span', { yPercent: 115, duration: 1, ease: 'power4.out', stagger: 0.06, delay: 0.1 });
    }, ref);
    return () => mm.revert();
  }, [words]);

  return (
    <Tag ref={ref} className={className}>
      {words.map(({ word, key }) => <Fragment key={key}><span className="mp-rise"><span>{word}</span></span>{' '}</Fragment>)}
    </Tag>
  );
}
