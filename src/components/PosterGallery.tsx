import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
import Button from './Button';
import { FramedPoster, Imdb, WatchOn, countryName, genreName, runtime } from './Movie';
import type { Movie } from '../data';
import { useApp } from '../store';

// Galería de recomendaciones inspirada en a24.raviklaassens.com: pósters enmarcados flotando en un carril horizontal,
// el del centro es el activo y su ficha técnica se muestra debajo. Click en un póster → la ficha completa en un <dialog>,
// con el póster volando desde la galería hasta su lugar.

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n: number) => String(n).padStart(2, '0');

// Trazo a mano alrededor del póster al pasar el cursor (el círculo dibujado de A24). pathLength=1 deja dibujarlo con CSS
// (sin vector-effect: con non-scaling-stroke los guiones se miden en px de pantalla e ignoran pathLength).
function Scribble() {
  return (
    <svg className="mp-scribble" viewBox="0 0 120 160" preserveAspectRatio="none" aria-hidden>
      <path pathLength={1} d="M24 7 C58 -1 108 1 113 20 C118 58 118 112 112 146 C107 158 44 161 11 153 C2 122 1 62 6 24 C9 9 44 3 78 5 C100 7 113 13 116 31" />
    </svg>
  );
}

// Filas de ficha técnica separadas por líneas finas: etiqueta en versalitas a la izquierda, valor a la derecha
export function Rows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="mp-rows">
      {rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  );
}

// Inclinación 3D hacia el cursor (solo mouse) + brillo que lo sigue
function tilt(e: PointerEvent<HTMLButtonElement>) {
  if (e.pointerType !== 'mouse' || reduced()) return;
  const r = e.currentTarget.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
  const el = e.currentTarget.querySelector<HTMLElement>('.mp-tilt')!;
  el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
  el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
  gsap.to(el, { rotationY: px * 18, rotationX: -py * 18, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
}
function untilt(e: PointerEvent<HTMLButtonElement>) {
  gsap.to(e.currentTarget.querySelector('.mp-tilt'), { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' });
}

function Detail({ m, source, opener, onClosed }: { m: Movie; source: HTMLElement; opener: HTMLElement; onClosed: () => void }) {
  const { st, t } = useApp();
  const dlg = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const intro = useRef<gsap.core.Timeline>(null);
  const country = countryName(m.country, st.lang);

  // Desplazamiento y escala que llevan el póster de la ficha a la posición del póster en la galería
  const fromGallery = () => {
    const a = source.querySelector('.mp-frame')!.getBoundingClientRect(), b = frame.current!.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, scale: a.width / b.width };
  };

  useLayoutEffect(() => {
    const d = dlg.current!;
    d.showModal();
    if (reduced()) return;
    const q = gsap.utils.selector(d);
    const ghost = source.querySelector<HTMLElement>('.mp-tilt')!;
    ghost.style.visibility = 'hidden';
    const tl = intro.current = gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(q('.mp-dlg-bg'), { opacity: 0 }, { opacity: 1, duration: 0.45 }, 0)
      .fromTo(frame.current, { ...fromGallery(), transformOrigin: '0 0' }, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'power3.inOut' }, 0)
      .fromTo(q('.mp-mask > span'), { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.06 }, 0.3)
      .fromTo(q('.mp-rule'), { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.9, stagger: 0.08 }, 0.35)
      .fromTo(q('[data-dlg], .mp-dlg-close'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.05 }, 0.5);
    return () => { tl.kill(); ghost.style.visibility = ''; };
  }, []);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const d = dlg.current!;
    const done = () => { d.close(); source.querySelector<HTMLElement>('.mp-tilt')!.style.visibility = ''; opener.focus({ preventScroll: true }); onClosed(); };
    if (reduced()) return done();
    // Interrumpible: si cierran mientras aún entra, la entrada se corta y sale desde donde iba
    intro.current?.kill();
    const q = gsap.utils.selector(d);
    gsap.timeline({ onComplete: done })
      .to(q('[data-dlg], .mp-mask > span, .mp-rule, .mp-dlg-close'), { opacity: 0, duration: 0.2, ease: 'power1.in' }, 0)
      .to(frame.current, { ...fromGallery(), duration: 0.65, ease: 'power3.inOut' }, 0.05)
      .to(q('.mp-dlg-bg'), { opacity: 0, duration: 0.45, ease: 'power1.in' }, 0.25);
  };
  // Click en el fondo vacío (fuera de la ficha) también cierra
  const onBackdrop = (e: MouseEvent) => { if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('mp-dlg-inner')) close(); };

  return (
    <dialog ref={dlg} className="mp-dlg" aria-labelledby="mp-dlg-title" style={{ '--tint': m.color } as CSSProperties}
      onCancel={e => { e.preventDefault(); close(); }} onClick={onBackdrop}>
      <div className="mp-dlg-bg" aria-hidden />
      <button className="btn btn-secondary btn-sm mp-dlg-close" onClick={close}><X size={18} aria-hidden />{t.close}</button>
      <div className="mp-dlg-inner">
        <header className="mp-dlg-head">
          <p data-dlg className="mp-cap tnum">{m.year} · {country}</p>
          <h2 id="mp-dlg-title" className="mp-dlg-title">
            {m.title.split(' ').map((w, i) => <Fragment key={i}>{i > 0 && ' '}<span className="mp-mask"><span>{w}</span></span></Fragment>)}
          </h2>
          <span className="mp-rule" />
          <p data-dlg className="mp-credits">
            <span className="mp-cap">{t.directedBy}</span> {m.director}
            <span className="mp-cap">{t.starring}</span> {m.cast.join(', ')}
          </p>
          <span className="mp-rule" />
        </header>
        <div className="mp-dlg-grid">
          <div ref={frame} className="mp-dlg-poster"><FramedPoster m={m} /></div>
          <div className="mp-stack" style={{ gap: 28, minWidth: 0 }}>
            <div data-dlg><Rows rows={[
              [t.yearL, m.year], [t.runtimeL, runtime(m.runtime)], [t.genresL, m.genres.map(g => genreName(g, st.lang)).join(', ')],
              [t.countryL, country], ['IMDb', <Imdb m={m} />],
            ]} /></div>
            <p data-dlg className="mp-dlg-overview">{m.overview[st.lang]}</p>
            <div data-dlg className="mp-watch"><WatchOn m={m} big label={t.watchNow} /></div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function PosterGallery({ movies }: { movies: Movie[] }) {
  const { st, t } = useApp();
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, left: 0, on: false, moved: false });
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<{ i: number; source: HTMLElement; opener: HTMLElement } | null>(null);
  const m = movies[active];
  const n = movies.length;

  // El póster más cercano al centro del carril es el activo
  const onScroll = () => {
    const el = track.current!, mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, dist = Infinity;
    Array.from(el.children as HTMLCollectionOf<HTMLElement>).forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    setActive(best);
  };
  const goTo = (i: number) => {
    const el = track.current!, c = el.children[i] as HTMLElement | undefined;
    if (c) el.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2, behavior: reduced() ? 'auto' : 'smooth' });
  };
  const step = (dir: number) => {
    const i = Math.min(n - 1, Math.max(0, active + dir));
    goTo(i);
    return i;
  };

  // Arrastrar con el mouse para recorrer el carril (en táctil ya es nativo). Si hubo arrastre, el click no abre la ficha:
  // la captura del puntero hace que el click caiga en el carril y no en el póster.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button === 0) drag.current = { x: e.clientX, left: track.current!.scrollLeft, on: true, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current, dx = e.clientX - d.x;
    if (!d.on || (!d.moved && Math.abs(dx) < 6)) return;
    if (!d.moved) { d.moved = true; track.current!.setPointerCapture(e.pointerId); track.current!.classList.add('dragging'); }
    track.current!.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    if (d.moved) { track.current!.classList.remove('dragging'); goTo(active); }
  };

  return (
    <div className="mp-gallery" style={{ '--tint': m.color } as CSSProperties}>
      <div ref={track} className="mp-track" onScroll={onScroll} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
        onKeyDown={e => {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          e.preventDefault();
          (track.current!.children[step(e.key === 'ArrowRight' ? 1 : -1)] as HTMLElement).focus({ preventScroll: true });
        }}>
        {movies.map((mv, i) => (
          <button key={mv.title} className={`mp-gp${i === active ? ' is-active' : ''}`} style={{ '--i': i } as CSSProperties} aria-label={t.posterOf(mv.title)}
            onClick={e => setOpen({ i, source: e.currentTarget, opener: e.currentTarget })} onPointerMove={tilt} onPointerLeave={untilt}
            onFocus={e => { if (e.currentTarget.matches(':focus-visible')) goTo(i); }}>
            <span className="mp-in"><span className="mp-float"><span className="mp-tilt"><FramedPoster m={mv} /><Scribble /></span></span></span>
          </button>
        ))}
      </div>

      <div className="mp-container">
        <div className="mp-spec">
          <div className="mp-stack" style={{ gap: 14, minWidth: 0 }}>
            {n > 1 && <p className="mp-cap tnum" aria-hidden>{pad(active + 1)} / {pad(n)}</p>}
            <h2 key={m.title} className="mp-spec-title">{m.title}</h2>
            <p className="mp-label">{m.genres.map(g => genreName(g, st.lang)).join(' · ')}</p>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
              <Button size="sm" icon={null} onClick={e => setOpen({ i: active, source: track.current!.children[active] as HTMLElement, opener: e.currentTarget })}>
                {t.seeDetails}<ArrowRight size={16} weight="bold" aria-hidden />
              </Button>
              {n > 1 && <>
                <button className="mp-arrow" aria-label={t.prev} disabled={active === 0} onClick={() => step(-1)}><ArrowLeft size={18} aria-hidden /></button>
                <button className="mp-arrow" aria-label={t.next} disabled={active === n - 1} onClick={() => step(1)}><ArrowRight size={18} aria-hidden /></button>
              </>}
            </div>
          </div>
          <Rows rows={[[t.directedBy, m.director], [t.yearL, `${m.year} · ${runtime(m.runtime)}`], [t.starring, m.cast.slice(0, 3).join(', ')], ['IMDb', <Imdb m={m} />]]} />
        </div>
        <p className="mp-label" style={{ marginTop: 20 }}>{t.galleryHint(n)}</p>
      </div>

      {open && <Detail m={movies[open.i]} source={open.source} opener={open.opener} onClosed={() => setOpen(null)} />}
    </div>
  );
}
