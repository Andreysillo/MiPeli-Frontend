import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../store';

type Item = { href: string; label: string; resume?: boolean };

// Un enlace del menú; "resume" es el botón que retoma la encuesta a medias (no es un enlace de la página)
function NavItem({ item, onPick }: Readonly<{ item: Item; onPick?: () => void }>) {
  const { st, go } = useApp();
  if (item.resume) return <button onClick={() => { onPick?.(); go('quest'); }}>{item.label}</button>;
  return <a href={item.href} onClick={onPick} aria-current={item.href === `#${st.screen}` ? 'page' : undefined}>{item.label}</a>;
}

// Header de todo el sitio (referencias: 14islands y Velour): "MiPeli" a la izquierda, enlaces en mayúsculas pequeñas y las acciones a la derecha.
// En la landing los enlaces bajan a sus secciones y "MiPeli" sube al inicio; en el resto llevan a Inicio, FAQ y Contacto, y "MiPeli" a la landing.
// Con una encuesta a medias aparece "¡Continúa tu encuesta!": en la landing ocupa el lugar del último enlace; en el resto se suma al final.
// En pantallas angostas los enlaces pasan a un menú a pantalla completa (<dialog> modal: atrapa el foco y Esc lo cierra).
// `children` son las acciones del header (cerrar sesión, idioma), que van entre los enlaces y el botón de menú.
export default function SiteNav({ children }: Readonly<{ children: ReactNode }>) {
  const { st, t } = useApp();
  const menu = useRef<HTMLDialogElement>(null);
  const landing = st.screen === 'welcome';
  const { howLabel, statsLabel, navStart, navResume, navLabel, menu: menuLabel, menuClose } = t.landing;
  const resume = st.questActive && st.screen !== 'quest';
  const resumeItem: Item = { href: '#quest', label: navResume, resume: true };
  const lastLanding: Item = resume ? resumeItem : { href: '#start', label: navStart };
  const links: Item[] = landing
    ? [{ href: '#how', label: howLabel }, { href: '#numbers', label: statsLabel }, lastLanding]
    : [{ href: '#home', label: t.navHome }, { href: '#faq', label: 'FAQ' }, { href: '#contacto', label: t.navContact }];
  if (!landing && resume) links.push(resumeItem);
  const home = landing ? '#top' : '#home';
  const close = () => menu.current?.close();

  return (
    <>
      <a className="mp-wordmark" href={home} translate="no">MiPeli</a>
      <nav className="mp-nav" data-landing={landing ? '' : undefined} aria-label={navLabel}>
        {links.map(l => <NavItem key={l.href} item={l} />)}
      </nav>
      {children}
      <button className="mp-lang mp-menu-btn" onClick={() => menu.current?.showModal()}>{menuLabel}</button>
      {createPortal(
        <dialog ref={menu} className="mp-menu" aria-label={menuLabel}>
          <div className="mp-menu-top">
            <a className="mp-wordmark" href={home} onClick={close} translate="no">MiPeli</a>
            <button className="mp-lang" onClick={close}>{menuClose}</button>
          </div>
          <nav aria-label={navLabel}>
            {links.map(l => <NavItem key={l.href} item={l} onPick={close} />)}
          </nav>
        </dialog>,
        document.body,
      )}
    </>
  );
}
