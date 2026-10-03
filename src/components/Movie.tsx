// Piezas de película compartidas por la galería, la ficha y la lista de extras
import { platforms, poster, type Movie, type Platform, type PlatformInfo } from '../data';
import type { Lang } from '../i18n';
import { useApp } from '../store';

// Los géneros vienen en español (como los da TMDB con language=es); para inglés se traducen aquí
const genreEn: Record<string, string> = {
  'Comedia': 'Comedy', 'Ciencia ficción': 'Science fiction', 'Terror': 'Horror', 'Animación': 'Animation', 'Documental': 'Documentary',
  'Crimen': 'Crime', 'Misterio': 'Mystery', 'Acción': 'Action', 'Aventura': 'Adventure', 'Fantasía': 'Fantasy', 'Familia': 'Family', 'Música': 'Music',
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

// Botón de plataforma: logo en su baldosa de color + nombre
function PlatformLink({ p, big }: Readonly<{ p: Platform; big?: boolean }>) {
  const { t } = useApp();
  const { url, logo }: PlatformInfo = platforms[p];
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={t.openIn(p)} className={`mp-platform${big ? ' big' : ''}`} translate="no">
      <img className="mp-platform-logo" src={logo} alt="" height={38} draggable={false} />
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
