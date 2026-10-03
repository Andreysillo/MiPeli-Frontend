import { Fragment, useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowRight } from '@phosphor-icons/react';
import Button from '../components/Button';
import CountUp from '../components/CountUp';
import { genreName } from '../components/Movie';
import { catalog, contactInfo, platforms, poster, type Movie } from '../data';
import { splitWords } from '../words';
import { useApp } from '../store';

gsap.registerPlugin(ScrollTrigger);

// Landing informativa. Referencia: 14islands.com (tipografía enorme y apretada con una línea gris de contrapunto, tira de pósters a sangre,
// secciones muy separadas, texto que se enciende al hacer scroll). Los colores son los de la app: la única nota de color es el botón rojo del final.
// Todo el movimiento va dentro de gsap.matchMedia: con prefers-reduced-motion queda la página estática.

// Titular gigante: cada línea sube desde una máscara. La última va en gris, como el "&" de la referencia.
function Hero() {
  const { t } = useApp();
  const root = useRef<HTMLElement>(null);
  const lines = t.landing.headline;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.lp-line > span', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.12, delay: 0.15 });
      gsap.from('.lp-fade', { opacity: 0, y: 12, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.75 });
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="lp-hero">
      <p className="lp-eyebrow lp-fade"><b>{t.landing.kicker}</b><span>{t.landing.intro}</span></p>
      <h1 className="lp-display">
        {lines.map((line, i) => {
          const cls = i === lines.length - 1 ? 'lp-line lp-dim' : 'lp-line';
          return <span key={line} className={cls}><span>{line}</span></span>;
        })}
      </h1>
      <p className="lp-scroll lp-fade"><ArrowDown size={14} weight="bold" aria-hidden />{t.landing.scroll}</p>
    </section>
  );
}

function PosterRow({ movies }: Readonly<{ movies: Movie[] }>) {
  return (
    <ul className="lp-marquee-set">
      {movies.map(m => <li key={m.title}><img src={poster(m)} alt="" width={400} height={600} draggable={false} /></li>)}
    </ul>
  );
}

// Tira de pósters a sangre que avanza sola y se acelera con la velocidad del scroll
function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const movies = useMemo(() => catalog.filter((_, i) => i % 4 === 0), []);

  useLayoutEffect(() => {
    const anim = track.current?.getAnimations()[0];
    if (!anim) return; // con movimiento reducido el CSS no la anima
    const speed = { rate: 1 };
    const trigger = ScrollTrigger.create({
      onUpdate: self => {
        speed.rate = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 8);
        anim.playbackRate = speed.rate;
        gsap.to(speed, { rate: 1, duration: 1.2, ease: 'power2.out', overwrite: true, onUpdate: () => { anim.playbackRate = speed.rate; } });
      },
    });
    return () => { trigger.kill(); gsap.killTweensOf(speed); };
  }, []);

  return (
    <div className="lp-marquee" aria-hidden>
      <div ref={track} className="lp-marquee-track">
        <PosterRow movies={movies} />
        <PosterRow movies={movies} />
      </div>
    </div>
  );
}

// Frase que se va encendiendo palabra por palabra mientras haces scroll
function Statement() {
  const { t } = useApp();
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => splitWords(t.landing.statement), [t.landing.statement]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(ref.current!.querySelectorAll('.lp-w'), { opacity: 0.16 }, {
        opacity: 1, ease: 'none', stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 82%', end: 'bottom 55%', scrub: true },
      });
    });
    return () => mm.revert();
  }, [words]);

  return (
    <section className="lp-sec lp-in">
      <p ref={ref} className="lp-statement">
        {words.map(({ word, key }) => <Fragment key={key}><span className="lp-w">{word}</span>{' '}</Fragment>)}
      </p>
    </section>
  );
}

function Steps() {
  const { t } = useApp();
  return (
    <section className="lp-sec lp-in" aria-labelledby="lp-how">
      <h2 id="lp-how" data-reveal className="lp-label">{t.landing.howLabel}</h2>
      <ol className="lp-steps">
        {t.landing.steps.map((s, i) => (
          <li key={s.title} data-reveal className="lp-step">
            <span className="lp-n tnum">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="lp-step-t">{s.title}</h3>
            <p className="lp-step-p">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Tarjeta de ejemplo: el póster ocupa toda la tarjeta y se desliza dentro de su marco al hacer scroll
function ExampleCard({ m }: Readonly<{ m: Movie }>) {
  const { st } = useApp();
  const img = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(img.current, { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: img.current!.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <li data-reveal className="lp-card">
      <div className="lp-card-img"><img ref={img} src={poster(m)} alt="" width={400} height={600} loading="lazy" /></div>
      <p className="lp-card-cap">{m.title} <span className="lp-dim">— {genreName(m.genres[0], st.lang)}</span></p>
    </li>
  );
}

const EXAMPLES = ['Oldboy', 'In the Mood for Love'];

function Showcase() {
  const { t } = useApp();
  const [title, dim] = t.landing.showTitle;
  return (
    <section className="lp-sec lp-in">
      <h2 data-reveal className="lp-h2"><span>{title}</span><span className="lp-dim">{dim}</span></h2>
      <ul className="lp-pair">
        {catalog.filter(m => EXAMPLES.includes(m.title)).map(m => <ExampleCard key={m.title} m={m} />)}
      </ul>
    </section>
  );
}

function Numbers() {
  const { t } = useApp();
  return (
    <section className="lp-sec lp-in" aria-labelledby="lp-nums">
      <h2 id="lp-nums" data-reveal className="lp-label">{t.landing.statsLabel}</h2>
      <ul className="lp-stats">
        {t.landing.stats.map(s => (
          <li key={s.label} data-reveal className="lp-stat">
            <span className="lp-stat-n"><CountUp value={s.value} /></span>
            <span className="lp-stat-l">{s.label}</span>
          </li>
        ))}
      </ul>
      <div data-reveal className="lp-logos">
        <p className="lp-label">{t.landing.platformsLabel}</p>
        <ul>
          {Object.entries(platforms).map(([name, { logo }]) => <li key={name}><img src={logo} alt={name} height={56} loading="lazy" /></li>)}
        </ul>
      </div>
    </section>
  );
}

// Aquí está el único acceso: sin sesión lleva a la pantalla de inicio; con sesión abierta, directo a la encuesta
function Cta() {
  const { st, go, t, name } = useApp();
  const [title, dim] = t.landing.ctaTitle;
  const root = useRef<HTMLElement>(null);

  // El titular sube desde su máscara cuando el scroll llega hasta él
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.lp-line > span', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } });
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="lp-cta lp-in">
      <h2 className="lp-display"><span className="lp-line"><span>{title}</span></span><span className="lp-line lp-dim"><span>{dim}</span></span></h2>
      <p data-reveal className="lp-cta-text">{t.landing.ctaText}</p>
      <div data-reveal>
        <Button className="lp-cta-btn" onClick={() => go(st.loggedIn ? 'type' : 'login')}>
          {st.loggedIn ? t.continueAs(name) : t.landing.cta}<ArrowRight size={20} weight="bold" aria-hidden />
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useApp();
  return (
    <footer className="lp-footer">
      <nav className="lp-in" aria-label="MiPeli">
        <a href="#faq">{t.faq}</a>
        <a href="#contacto">{t.navContact}</a>
        <a href={`mailto:${contactInfo.email}`} translate="no">{contactInfo.email}</a>
      </nav>
      <p className="lp-wordmark" aria-hidden translate="no">MiPeli</p>
    </footer>
  );
}

export default function Welcome() {
  return (
    <section className="mp-screen lp">
      <Hero />
      <Marquee />
      <Statement />
      <Steps />
      <Showcase />
      <Numbers />
      <Cta />
      <Footer />
    </section>
  );
}
