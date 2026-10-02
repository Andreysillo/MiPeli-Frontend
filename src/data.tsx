// Datos de demo: aún no hay backend, todo lo que ve el usuario sale de aquí.
import type { ReactNode } from 'react';
import { EnvelopeSimple, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';
import { siAppletv, siCrunchyroll, siHbomax, siMubi, siNetflix, siParamountplus, type SimpleIcon } from 'simple-icons';
import type { Lang } from './i18n';

// imdb: calificación de IMDb sobre 10. platforms: claves de `platforms` (abajo).
export type Movie = { title: string; year: number; director: string; genre: string; imdb: number; color: string; platforms: Platform[] };

// Plataformas disponibles en Costa Rica. Logo de simple-icons cuando existe; si no (marcas que no lo permiten), un monograma con sus colores.
// Los botones llevan a la página de inicio de cada plataforma. Qué película está en cuál lo dirá el backend (TMDB watch/providers, region=CR).
export type PlatformInfo = { url: string; tile: string; fg: string; icon?: SimpleIcon; mark?: string };
export const platforms = {
  'Netflix': { url: 'https://www.netflix.com/', tile: '#000000', fg: '#E50914', icon: siNetflix },
  'Prime Video': { url: 'https://www.primevideo.com/', tile: '#00A8E1', fg: '#ffffff', mark: 'prime' },
  'Disney+': { url: 'https://www.disneyplus.com/', tile: '#0B1E5B', fg: '#ffffff', mark: 'D+' },
  'HBO Max': { url: 'https://www.hbomax.com/', tile: '#000000', fg: '#ffffff', icon: siHbomax },
  'Apple TV': { url: 'https://tv.apple.com/', tile: '#000000', fg: '#ffffff', icon: siAppletv },
  'Paramount+': { url: 'https://www.paramountplus.com/', tile: '#0064FF', fg: '#ffffff', icon: siParamountplus },
  'Mubi': { url: 'https://mubi.com/', tile: '#000000', fg: '#ffffff', icon: siMubi },
  'Crunchyroll': { url: 'https://www.crunchyroll.com/', tile: '#FF5E00', fg: '#ffffff', icon: siCrunchyroll },
  'ViX': { url: 'https://vix.com/', tile: '#FF4E00', fg: '#ffffff', mark: 'ViX' },
  'Claro video': { url: 'https://www.clarovideo.com/', tile: '#DA291C', fg: '#ffffff', mark: 'claro' },
  'Pluto TV': { url: 'https://pluto.tv/', tile: '#000000', fg: '#FFF200', mark: 'P' },
} satisfies Record<string, PlatformInfo>;
export type Platform = keyof typeof platforms;

export const catalog: Movie[] = [
  { title: 'Parasite', year: 2019, director: 'Bong Joon-ho', genre: 'Drama', imdb: 8.5, color: '#3b82f6', platforms: ['Netflix', 'Prime Video'] },
  { title: 'Oldboy', year: 2003, director: 'Park Chan-wook', genre: 'Thriller', imdb: 8.3, color: '#8b5cf6', platforms: ['Mubi', 'Prime Video', 'Paramount+'] },
  { title: 'Burning', year: 2018, director: 'Lee Chang-dong', genre: 'Misterio', imdb: 7.5, color: '#06b6d4', platforms: ['Prime Video'] },
  { title: 'Memories of Murder', year: 2003, director: 'Bong Joon-ho', genre: 'Crimen', imdb: 8.1, color: '#ec4899', platforms: ['HBO Max', 'Mubi'] },
  { title: 'Drive', year: 2011, director: 'Nicolas Winding Refn', genre: 'Noir', imdb: 7.8, color: '#f59e0b', platforms: ['Prime Video', 'Apple TV'] },
  { title: 'Whiplash', year: 2014, director: 'Damien Chazelle', genre: 'Drama', imdb: 8.5, color: '#10b981', platforms: ['Netflix', 'Claro video'] },
  { title: 'Zodiac', year: 2007, director: 'David Fincher', genre: 'Thriller', imdb: 7.7, color: '#ef4444', platforms: ['HBO Max', 'Disney+'] },
  { title: 'Seven', year: 1995, director: 'David Fincher', genre: 'Crimen', imdb: 8.6, color: '#6366f1', platforms: ['Netflix', 'HBO Max'] },
  { title: 'Prisoners', year: 2013, director: 'Denis Villeneuve', genre: 'Thriller', imdb: 8.1, color: '#0ea5e9', platforms: ['Paramount+', 'Prime Video'] },
  { title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai', genre: 'Romance', imdb: 8.1, color: '#e11d48', platforms: ['Mubi'] },
  { title: 'Heat', year: 1995, director: 'Michael Mann', genre: 'Acción', imdb: 8.3, color: '#2563eb', platforms: ['Disney+'] },
  { title: 'The Chaser', year: 2008, director: 'Na Hong-jin', genre: 'Thriller', imdb: 7.8, color: '#7c3aed', platforms: ['Pluto TV'] },
  { title: 'Nightcrawler', year: 2014, director: 'Dan Gilroy', genre: 'Thriller', imdb: 7.8, color: '#d97706', platforms: ['Netflix'] },
  { title: 'Mother', year: 2009, director: 'Bong Joon-ho', genre: 'Drama', imdb: 7.8, color: '#0891b2', platforms: ['Mubi'] },
  { title: 'I Saw the Devil', year: 2010, director: 'Kim Jee-woon', genre: 'Thriller', imdb: 7.8, color: '#be123c', platforms: ['ViX', 'Prime Video'] },
];

const byTitle = (title: string) => catalog.find(m => m.title === title)!;
export const recommended = ['Parasite', 'Oldboy', 'Burning', 'Memories of Murder', 'Drive', 'Whiplash', 'Zodiac', 'Seven', 'Prisoners', 'In the Mood for Love'].map(byTitle);
export const questMovies = ['Oldboy', 'Parasite', 'Drive', 'Seven', 'Zodiac', 'Heat'].map(byTitle);
export const duels: [Movie, Movie][] = [['Oldboy', 'Drive'], ['Parasite', 'Seven'], ['Whiplash', 'Burning']].map(([a, b]) => [byTitle(a), byTitle(b)]);
export const welcomePosters = ['In the Mood for Love', 'Parasite', 'Oldboy'].map(byTitle);

export const genres = ['Thriller', 'Drama', 'Noir', 'Ciencia ficción', 'Terror', 'Comedia', 'Romance', 'Animación', 'Documental'];
export const directors = ['Bong Joon-ho', 'Denis Villeneuve', 'David Fincher', 'Park Chan-wook', 'Wong Kar-wai', 'Christopher Nolan', 'Céline Sciamma', 'Kelly Reichardt'];
export const auroraStops = ['#0f4fb8', '#ffffff', '#3300ff'];

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return [c, c.getContext('2d')!] as const;
};

// Arte de póster placeholder: degradado del color de la película + título tipográfico.
// ponytail: se sustituye por los pósters reales cuando haya backend (TMDB o similar).
const posterCache = new Map<string, string>();
export function poster(m: Movie): string {
  const hit = posterCache.get(m.title);
  if (hit) return hit;
  const W = 400, H = 600, pad = 30;
  const [c, ctx] = canvas(W, H);
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, m.color); bg.addColorStop(0.62, '#120d33'); bg.addColorStop(1, '#07061a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.8, H * 0.12, 0, W * 0.8, H * 0.12, W * 0.9);
  glow.addColorStop(0, 'rgba(255,255,255,.28)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  const font = (weight: number, size: number) => `${weight} ${size}px "Geist Variable", system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,.78)';
  ctx.font = font(600, 17);
  ctx.fillText(m.director.toUpperCase(), pad, pad + 14);

  // Título: ajusta tamaño y corta en líneas para que quepa en el ancho
  const words = m.title.toUpperCase().split(' ');
  let size = 62, lines: string[] = [];
  for (; size >= 30; size -= 4) {
    ctx.font = font(760, size);
    lines = [];
    let line = '';
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (ctx.measureText(next).width > W - pad * 2 && line) { lines.push(line); line = w; } else line = next;
    }
    lines.push(line);
    if (lines.length <= 3 && lines.every(l => ctx.measureText(l).width <= W - pad * 2)) break;
  }
  ctx.fillStyle = '#ffffff';
  const lh = size * 0.98, base = H - pad - 34;
  lines.forEach((l, i) => ctx.fillText(l, pad, base - (lines.length - 1 - i) * lh));
  ctx.font = font(500, 18); ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.fillText(String(m.year), pad, H - pad);

  const url = c.toDataURL('image/jpeg', 0.86);
  posterCache.set(m.title, url);
  return url;
}

// Formatos que esperan los componentes de React Bits
export const chromaItem = (m: Movie) => ({ title: m.title, subtitle: `${m.year} · ${m.genre}`, handle: `IMDb ${m.imdb}`, image: poster(m), borderColor: m.color, gradient: '#141030' });
export const driftItem = (m: Movie) => ({ title: m.title, year: m.year, rating: String(m.imdb), subtitle: `${m.year} · IMDb ${m.imdb}`, image: poster(m) });

function stripes(w: number, h: number, stops: [number, string][], line: string, lineWidth: number, step: number) {
  const [c, ctx] = canvas(w, h);
  const g = ctx.createLinearGradient(0, 0, w, h);
  stops.forEach(([at, color]) => g.addColorStop(at, color));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = line; ctx.lineWidth = lineWidth;
  for (let k = -h; k < w; k += step) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + h, h); ctx.stroke(); }
  return c.toDataURL('image/png');
}

const moodColors = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981'];
export const moodGallery = ['Thriller', 'Comedia', 'Terror', 'Drama', 'Ciencia ficción', 'Romance', 'Animación']
  .map((text, i) => ({ text, image: stripes(600, 450, [[0, moodColors[i]], [1, '#0a0a1e']], 'rgba(255,255,255,.08)', 14, 42) }));

export const maskedHeadingSrc = stripes(1600, 440, [[0, '#0f1f6b'], [0.5, '#5227ff'], [1, '#b18cff']], 'rgba(255,255,255,.14)', 26, 70);

const icon = (node: ReactNode) => <span style={{ display: 'flex', color: '#eef1ff' }}>{node}</span>;
export const socialLogos = [
  { href: 'https://github.com/', title: 'GitHub', node: icon(<GithubLogo size={40} weight="fill" />) },
  { href: 'https://www.linkedin.com/', title: 'LinkedIn', node: icon(<LinkedinLogo size={40} weight="fill" />) },
  { href: 'mailto:kevin@mipeli.app', title: 'Correo', node: icon(<EnvelopeSimple size={40} />) },
];

export const faqData: Record<Lang, { q: string; a: string }[]> = {
  es: [{ q: '¿De dónde salen las recomendaciones?', a: 'De tus respuestas, cruzadas con nuestra base de títulos.' }, { q: '¿Necesito cuenta?', a: 'No para probar. Con Google guardas tu progreso y repites encuestas sin límite.' }, { q: '¿De dónde sale la calificación?', a: 'Es la nota de IMDb, sobre 10.' }, { q: '¿Dónde veo la peli?', a: 'Cada recomendación muestra en qué plataformas está, con un botón que te lleva directo a cada una.' }],
  en: [{ q: 'Where do recommendations come from?', a: 'Your answers, matched against our title base.' }, { q: 'Do I need an account?', a: 'Not to try. With Google you save progress and repeat surveys with no limit.' }, { q: 'Where does the rating come from?', a: 'It is the IMDb score, out of 10.' }, { q: 'Where can I watch it?', a: 'Every recommendation shows which platforms have it, with a button that takes you straight to each one.' }],
};
