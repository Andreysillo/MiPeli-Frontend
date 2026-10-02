import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const CHROMA_CSS = `
.chroma-grid{position:relative;width:100%;height:auto;display:grid;grid-template-columns:repeat(var(--cols,3),1fr);grid-auto-rows:min-content;align-content:start;gap:12px;box-sizing:border-box;--x:50%;--y:50%;--r:220px}
.chroma-card{position:relative;display:flex;flex-direction:column;border-radius:18px;overflow:hidden;border:1px solid rgba(32,30,29,.25);transition:border-color .3s ease;background:var(--card-gradient,#2b2825);--mouse-x:50%;--mouse-y:50%;--spotlight-color:rgba(245,234,216,.35)}
.chroma-card:hover{border-color:var(--card-border)}
.chroma-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at var(--mouse-x) var(--mouse-y),var(--spotlight-color),transparent 70%);pointer-events:none;opacity:0;transition:opacity .5s ease;z-index:2}
.chroma-card:hover::before{opacity:1}
.chroma-img-wrapper{position:relative;z-index:1;flex:1;padding:8px;box-sizing:border-box}
.chroma-img-wrapper img{width:100%;height:100%;object-fit:cover;border-radius:12px;display:block}
.chroma-poster{width:100%;aspect-ratio:1/1;border-radius:12px;background-color:#4a3d33;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.06) 0 7px,transparent 7px 14px);display:flex;align-items:flex-end;padding:8px}
.chroma-plabel{font:9px ui-monospace,monospace;color:rgba(245,234,216,.6)}
.chroma-card.is-selected{box-shadow:0 14px 34px rgba(0,0,0,.5)}
.chroma-card.is-selected .chroma-img-wrapper img,.chroma-card.is-selected .chroma-poster{filter:brightness(.5) saturate(.85)}
.chroma-img-wrapper img,.chroma-poster{transition:filter .3s ease}
.chroma-thumb{position:absolute;inset:8px;z-index:5;display:flex;align-items:center;justify-content:center;pointer-events:none}
.chroma-thumb svg{width:32%;height:32%;min-width:34px;min-height:34px;filter:drop-shadow(0 6px 16px rgba(0,0,0,.55));animation:chroma-thumb-pop .45s cubic-bezier(.34,1.56,.64,1) both}
@keyframes chroma-thumb-pop{0%{transform:scale(0) rotate(-10deg);opacity:0}60%{transform:scale(1.18) rotate(4deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}
.chroma-info{position:relative;z-index:1;padding:8px 12px 12px;color:#f5ead8;display:grid;grid-template-columns:1fr auto;row-gap:2px;column-gap:8px}
.chroma-info .name{font-family:var(--font-heading,'Caprasimo',Georgia,serif);font-weight:400;font-size:15px;margin:0}
.chroma-info .role,.chroma-info .handle{color:rgba(245,234,216,.6);font-size:11px}
.chroma-overlay{position:absolute;inset:0;pointer-events:none;z-index:3;backdrop-filter:grayscale(1) brightness(.82);-webkit-backdrop-filter:grayscale(1) brightness(.82);background:rgba(0,0,0,.001);-webkit-mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,.22) 45%,rgba(0,0,0,.5) 75%,white 100%);mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,.22) 45%,rgba(0,0,0,.5) 75%,white 100%)}
.chroma-fade{position:absolute;inset:0;pointer-events:none;z-index:4;backdrop-filter:grayscale(1) brightness(.82);-webkit-backdrop-filter:grayscale(1) brightness(.82);background:rgba(0,0,0,.001);-webkit-mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,.78) 45%,rgba(255,255,255,.5) 75%,transparent 100%);mask-image:radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,.78) 45%,rgba(255,255,255,.5) 75%,transparent 100%);opacity:1;transition:opacity .25s ease}
`;
if (typeof document !== 'undefined' && !document.getElementById('chromagrid-css')) {
  const s = document.createElement('style'); s.id = 'chromagrid-css'; s.textContent = CHROMA_CSS; document.head.appendChild(s);
}

const ChromaGrid = ({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  selectable = false,
  selected = /** @type {string[]} */ ([]),
  onToggle = /** @type {any} */ (undefined)
}) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const data = items?.length ? items : [];

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !gsap) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    if (!gsap) return;
    gsap.to(pos.current, {
      x, y, duration: damping, ease,
      onUpdate: () => { setX.current?.(pos.current.x); setY.current?.(pos.current.y); },
      overwrite: true
    });
  };
  const handleMove = e => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    if (gsap) gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };
  const handleLeave = () => {
    if (gsap) gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
  };
  const handleCardClick = (c) => {
    if (selectable && onToggle) { onToggle(c.title, c); return; }
    if (c.url) window.open(c.url, '_blank', 'noopener,noreferrer');
  };
  const handleCardMove = e => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const ce = React.createElement;
  return ce('div', {
    ref: rootRef,
    className: `chroma-grid ${className}`,
    style: { '--r': `${radius}px`, '--cols': columns, '--rows': rows },
    onPointerMove: handleMove,
    onPointerLeave: handleLeave
  },
    data.map((c, i) => ce('article', {
      key: i,
      className: 'chroma-card' + (selectable && selected.indexOf(c.title) !== -1 ? ' is-selected' : ''),
      onMouseMove: handleCardMove,
      onClick: () => handleCardClick(c),
      ...(selectable ? {
        role: 'button', tabIndex: 0, 'aria-pressed': selected.indexOf(c.title) !== -1, 'aria-label': c.title,
        onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(c); } }
      } : {}),
      style: { '--card-border': c.borderColor || 'transparent', '--card-gradient': c.gradient, cursor: (selectable || c.url) ? 'pointer' : 'default' }
    },
      ce('div', { className: 'chroma-img-wrapper' },
        c.image
          ? ce('img', { src: c.image, alt: c.title, loading: 'lazy' })
          : ce('div', { className: 'chroma-poster' }, ce('span', { className: 'chroma-plabel' }, 'PÓSTER')),
        (selectable && selected.indexOf(c.title) !== -1) ? ce('span', { className: 'chroma-thumb', 'aria-hidden': 'true' },
          ce('svg', { viewBox: '0 0 24 24', fill: '#ffffff' }, ce('path', { d: 'M2 21h2a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H2v11zM22 10.5a1.5 1.5 0 0 0-1.5-1.5h-5.7l0.86-4.15.03-.33a1.12 1.12 0 0 0-.33-.8L14.4 3 8.7 8.7A1.5 1.5 0 0 0 8 9.9V19.5A1.5 1.5 0 0 0 9.5 21h8a1.5 1.5 0 0 0 1.38-.91l2.95-6.9a1.5 1.5 0 0 0 .17-.7z' }))
        ) : null
      ),
      ce('footer', { className: 'chroma-info' },
        ce('h3', { className: 'name' }, c.title),
        c.handle ? ce('span', { className: 'handle' }, c.handle) : null,
        ce('p', { className: 'role' }, c.subtitle)
      )
    )),
    ce('div', { className: 'chroma-overlay' }),
    ce('div', { ref: fadeRef, className: 'chroma-fade' })
  );
};

export default ChromaGrid;
