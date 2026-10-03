import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../store';

// Header de todo el sitio (referencias: 14islands y Velour): "MiPeli" a la izquierda, enlaces en mayúsculas pequeñas y las acciones a la derecha.
// En la landing los enlaces bajan a sus secciones y "MiPeli" sube al inicio; en el resto llevan a Inicio, FAQ y Contacto, y "MiPeli" a la landing.
// En pantallas angostas los enlaces pasan a un menú a pantalla completa (<dialog> modal: atrapa el foco y Esc lo cierra).
// `children` son las acciones del header (cerrar sesión, idioma), que van entre los enlaces y el botón de menú.
export default function SiteNav({ children }: Readonly<{ children: ReactNode }>) {
  const { st, t } = useApp();
  const menu = useRef<HTMLDialogElement>(null);
  const landing = st.screen === 'welcome';
  const { howLabel, statsLabel, navStart, navLabel, menu: menuLabel, menuClose } = t.landing;
  const links = landing
    ? [{ href: '#how', label: howLabel }, { href: '#numbers', label: statsLabel }, { href: '#start', label: navStart }]
    : [{ href: '#home', label: t.navHome }, { href: '#faq', label: 'FAQ' }, { href: '#contacto', label: t.navContact }];
  const home = landing ? '#top' : '#home';
  const close = () => menu.current?.close();

  return (
    <>
      <a className="mp-wordmark" href={home} translate="no">MiPeli</a>
      <nav className="mp-nav" data-landing={landing ? '' : undefined} aria-label={navLabel}>
        {links.map(l => <a key={l.href} href={l.href} aria-current={l.href === `#${st.screen}` ? 'page' : undefined}>{l.label}</a>)}
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
            {links.map(l => <a key={l.href} href={l.href} onClick={close}>{l.label}</a>)}
          </nav>
        </dialog>,
        document.body,
      )}
    </>
  );
}
