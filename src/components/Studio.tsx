import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import gsap from 'gsap';
import { X } from '@phosphor-icons/react';
import { contactInfo } from '../data';
import { useApp } from '../store';

// Armazón de las páginas editoriales (Contacto y FAQ), inspirado en rokumaruichi.tokyo/about:
// crema sobre casi negro, una sola familia tipográfica, líneas de 1px, texto anclado a los bordes,
// barra superior (marca · lema · navegación) y barra inferior (correo · volver · idioma).
export default function StudioPage({ children }: Readonly<{ children: ReactNode }>) {
  const { st, set, go, t } = useApp();
  const mark = useRef<HTMLDivElement>(null);

  // La marca gigante del fondo se desplaza apenas con el cursor (solo mouse y sin movimiento reducido)
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (hover: hover)', () => {
      const x = gsap.quickTo(mark.current, 'x', { duration: 1.4, ease: 'power3.out' });
      const y = gsap.quickTo(mark.current, 'y', { duration: 1.4, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        x((e.clientX / innerWidth - 0.5) * -36);
        y((e.clientY / innerHeight - 0.5) * -24);
      };
      addEventListener('pointermove', move);
      return () => removeEventListener('pointermove', move);
    });
    return () => mm.revert();
  }, []);

  const links = [
    { href: '#home', label: t.navHome, screen: 'home' },
    { href: '#faq', label: 'FAQ', screen: 'faq' },
    { href: '#contacto', label: t.navContact, screen: 'contacto' },
  ];

  return (
    <div className="mp-screen mp-601">
      <div ref={mark} className="mp-601-mark" aria-hidden translate="no">MP</div>
      <div className="mp-601-top">
        <a className="mp-601-logo" href="#home" aria-label="MiPeli" translate="no">MP</a>
        <p className="mp-601-tag">{t.studioTag}</p>
        <nav aria-label="MiPeli" translate="no">
          <ul className="mp-601-nav">
            {links.map(l => (
              <li key={l.href}><a href={l.href} aria-current={st.screen === l.screen ? 'page' : undefined}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>

      {children}

      <footer className="mp-601-bottom">
        <a className="mp-601-text" href={`mailto:${contactInfo.email}`}>{t.emailUs}</a>
        <button className="mp-601-text" onClick={() => go('home')}>{t.back}<X size={12} weight="bold" aria-hidden /></button>
        <button className="mp-601-text" onClick={() => set({ lang: st.lang === 'es' ? 'en' : 'es' })} aria-label={t.langHint} translate="no">
          {st.lang === 'es' ? 'EN' : 'ES'}
        </button>
      </footer>
    </div>
  );
}

// Sección con etiqueta pequeña en mayúsculas y una línea de 1px que se dibuja al entrar
export function Section({ label, level = 2, delay = 0.1, children }: Readonly<{ label: string; level?: 1 | 2; delay?: number; children: ReactNode }>) {
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <section className="mp-601-sec">
      <Heading data-reveal className="mp-601-label">{label}</Heading>
      <span className="mp-601-rule" style={{ '--d': `${delay}s` } as CSSProperties} aria-hidden />
      {children}
    </section>
  );
}
