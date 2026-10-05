// Piezas de película compartidas por la galería, la ficha y la lista de extras
import { CINE, cinemaLogo, platforms, poster, type Movie, type Platform } from '../data';
import type { Lang, Strings } from '../i18n';
import type { Reason, Rec } from '../recommend';
import type { Mood } from '../survey';
import { useApp } from '../store';

// Los géneros vienen en español (como los da TMDB con language=es); para inglés se traducen aquí
const genreEn: Record<string, string> = {
  'Comedia': 'Comedy', 'Ciencia ficción': 'Science fiction', 'Terror': 'Horror', 'Animación': 'Animation', 'Documental': 'Documentary',
  'Crimen': 'Crime', 'Misterio': 'Mystery', 'Acción': 'Action', 'Aventura': 'Adventure', 'Fantasía': 'Fantasy', 'Familia': 'Family', 'Música': 'Music', 'Bélica': 'War', 'Historia': 'History',
};
export const genreName = (g: string, lang: Lang) => (lang === 'en' && genreEn[g]) || g;
export const countryName = (code: string, lang: Lang) => new Intl.DisplayNames([lang], { type: 'region' }).of(code) ?? code;
export const runtime = (min: number) => {
  const h = Math.floor(min / 60), rest = min % 60;
  return rest ? `${h} h ${rest} min` : `${h} h`;
};

// Póster en su marco: marco negro fino + paspartú claro, como un póster colgado
export function FramedPoster({ m, className = '' }: Readonly<{ m: Movie; className?: string }>) {
  return (
    <figure className={`mp-frame ${className}`}>
      <div className="mp-frame-mat"><img src={poster(m)} alt="" width={400} height={600} draggable={false} /></div>
    </figure>
  );
}

export function Imdb({ m }: Readonly<{ m: Movie }>) {
  const { t } = useApp();
  return <span className="mp-tag tnum" aria-label={t.imdbOf(m.imdb)}><span className="mp-imdb" aria-hidden translate="no">IMDb</span><span aria-hidden>{m.imdb}</span></span>;
}

// Nombre que se muestra de una plataforma; el cine tiene el suyo, traducido
export const platformName = (p: Platform, t: Strings) => (p === CINE ? t.inTheaters : p);

// Logo de una plataforma o del cine, al alto que fije el contexto (.mp-platform-logo). El del cine va de fondo para poder acercarlo (ver .mp-cine)
export function PlatformLogo({ p }: Readonly<{ p: Platform }>) {
  if (p === CINE) return <span className="mp-platform-logo mp-cine" style={{ backgroundImage: `url("${cinemaLogo}")` }} aria-hidden />;
  return <img className="mp-platform-logo" src={platforms[p].logo} alt="" height={38} draggable={false} />;
}

// Botón de plataforma: logo en su baldosa + nombre. El cine no lleva enlace: solo dice "En cines"
function PlatformLink({ p, big }: Readonly<{ p: Platform; big?: boolean }>) {
  const { t } = useApp();
  const cls = `mp-platform${big ? ' big' : ''}`;
  if (p === CINE) return <span className={cls}><PlatformLogo p={p} />{t.inTheaters}</span>;
  return (
    <a href={platforms[p].url} target="_blank" rel="noopener noreferrer" aria-label={t.openIn(p)} className={cls} translate="no">
      <PlatformLogo p={p} />
      {p}
    </a>
  );
}

// Etiqueta (label={null} la oculta) + un botón por plataforma que abre su web en otra pestaña
export function WatchOn({ m, big, label }: Readonly<{ m: Movie; big?: boolean; label?: string | null }>) {
  const { t } = useApp();
  return (
    <div className="mp-stack" style={{ gap: 10 }}>
      {label !== null && <span className="mp-label">{label ?? t.whereToWatch}</span>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {m.platforms.map(p => <PlatformLink key={p} p={p} big={big} />)}
      </div>
    </div>
  );
}

// Por qué sale esta película (parecida a una que eligió, su ánimo, su plataforma) y qué restricción incumple, si alguna
export function Reasons({ m }: Readonly<{ m: Rec }>) {
  const { t } = useApp();
  const label = (r: Reason) => {
    if (r.kind === 'mood') return t.moodNames[r.ref as Mood].name;
    if (r.kind === 'cinema') return t.inTheaters;
    return r.ref;
  };
  return (
    <ul className="mp-reasons">
      {m.reasons.map(r => <li key={r.kind} className="mp-tag">{t.reasons[r.kind](label(r))}</li>)}
      {m.flags.map(f => <li key={f} className="mp-tag mp-tag-warn">{t.flags[f]}</li>)}
    </ul>
  );
}
