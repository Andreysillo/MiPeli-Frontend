// Datos de demo: aún no hay backend, todo lo que ve el usuario sale de aquí.
import type { ReactNode } from 'react';
import { EnvelopeSimple, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';
import type { Lang } from './i18n';

export type Movie = { title: string; year: number; director: string; genre: string; rating: number; color: string; platforms?: string[] };

export const catalog: Movie[] = [
  { title: 'Parasite', year: 2019, director: 'Bong Joon-ho', genre: 'Drama', rating: 4.8, color: '#3b82f6', platforms: ['Netflix', 'Max'] },
  { title: 'Oldboy', year: 2003, director: 'Park Chan-wook', genre: 'Thriller', rating: 4.6, color: '#8b5cf6', platforms: ['Mubi'] },
  { title: 'Burning', year: 2018, director: 'Lee Chang-dong', genre: 'Misterio', rating: 4.3, color: '#06b6d4', platforms: ['Prime Video'] },
  { title: 'Memories of Murder', year: 2003, director: 'Bong Joon-ho', genre: 'Crimen', rating: 4.7, color: '#ec4899', platforms: ['Max'] },
  { title: 'Drive', year: 2011, director: 'Nicolas Winding Refn', genre: 'Noir', rating: 4.3, color: '#f59e0b', platforms: ['Prime Video'] },
  { title: 'Whiplash', year: 2014, director: 'Damien Chazelle', genre: 'Drama', rating: 4.6, color: '#10b981', platforms: ['Netflix'] },
  { title: 'Zodiac', year: 2007, director: 'David Fincher', genre: 'Thriller', rating: 4.4, color: '#ef4444', platforms: ['Max'] },
  { title: 'Seven', year: 1995, director: 'David Fincher', genre: 'Crimen', rating: 4.5, color: '#6366f1', platforms: ['Netflix'] },
  { title: 'Prisoners', year: 2013, director: 'Denis Villeneuve', genre: 'Thriller', rating: 4.3, color: '#0ea5e9', platforms: ['Prime Video'] },
  { title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai', genre: 'Romance', rating: 4.7, color: '#e11d48', platforms: ['Mubi'] },
  { title: 'Heat', year: 1995, director: 'Michael Mann', genre: 'Acción', rating: 4.4, color: '#2563eb' },
  { title: 'The Chaser', year: 2008, director: 'Na Hong-jin', genre: 'Thriller', rating: 4.2, color: '#7c3aed' },
  { title: 'Nightcrawler', year: 2014, director: 'Dan Gilroy', genre: 'Thriller', rating: 4.4, color: '#d97706' },
  { title: 'Mother', year: 2009, director: 'Bong Joon-ho', genre: 'Drama', rating: 4.4, color: '#0891b2' },
  { title: 'I Saw the Devil', year: 2010, director: 'Kim Jee-woon', genre: 'Thriller', rating: 4.3, color: '#be123c' },
];

const byTitle = (title: string) => catalog.find(m => m.title === title)!;
export const recommended = ['Parasite', 'Oldboy', 'Burning', 'Memories of Murder', 'Drive', 'Whiplash', 'Zodiac', 'Seven', 'Prisoners', 'In the Mood for Love'].map(byTitle);
export const questMovies = ['Oldboy', 'Parasite', 'Drive', 'Seven', 'Zodiac', 'Heat'].map(byTitle);
export const duels: [Movie, Movie][] = [['Oldboy', 'Drive'], ['Parasite', 'Seven'], ['Whiplash', 'Burning']].map(([a, b]) => [byTitle(a), byTitle(b)]);
export const welcomePosters = ['In the Mood for Love', 'Parasite', 'Oldboy'].map(byTitle);

export const genres = ['Thriller', 'Drama', 'Noir', 'Ciencia ficción', 'Terror', 'Comedia', 'Romance', 'Animación', 'Documental'];
export const directors = ['Bong Joon-ho', 'Denis Villeneuve', 'David Fincher', 'Park Chan-wook', 'Wong Kar-wai', 'Christopher Nolan', 'Céline Sciamma', 'Kelly Reichardt'];
export const themes = ['Venganza', 'Soledad urbana', 'Memoria', 'Familia', 'Identidad', 'Distopía', 'Mayoría de edad', 'Amor imposible'];
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
export const chromaItem = (m: Movie) => ({ title: m.title, subtitle: `${m.year} · ${m.genre}`, handle: `★ ${m.rating}`, image: poster(m), borderColor: m.color, gradient: '#141030' });
export const driftItem = (m: Movie) => ({ title: m.title, year: m.year, rating: String(m.rating), subtitle: `${m.year} · ★ ${m.rating}`, image: poster(m) });

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

export const listIdeas: Record<Lang, string[]> = {
  es: ['Tu ranking definitivo de Bong Joon-ho', 'Neo-noir para noches de insomnio', 'Coreanas que te volaron la cabeza', 'Directoras que necesitas ver'],
  en: ['Your definitive Bong Joon-ho ranking', 'Neo-noir for sleepless nights', 'Korean films that blew your mind', 'Women directors you must watch'],
};

export const faqData: Record<Lang, { q: string; a: string }[]> = {
  es: [{ q: '¿De dónde salen las recomendaciones?', a: 'De tus respuestas, cruzadas con nuestra base de títulos.' }, { q: '¿Necesito cuenta?', a: 'No para probar. Con Google guardas tu progreso y repites encuestas sin límite.' }, { q: '¿Qué es el botón "Elegir por mí"?', a: 'Toma tus recomendaciones y te muestra una sola, con 10 segundos para ir a verla. Cero parálisis.' }, { q: '¿Dónde veo la peli?', a: 'Junto a cada recomendación mostramos en qué plataforma está.' }],
  en: [{ q: 'Where do recommendations come from?', a: 'Your answers, matched against our title base.' }, { q: 'Do I need an account?', a: 'Not to try. With Google you save progress and repeat surveys with no limit.' }, { q: 'What is the "Choose for me" button?', a: 'It takes your recommendations and shows a single one, with 10 seconds to go watch it. Zero paralysis.' }, { q: 'Where can I watch it?', a: 'Next to each recommendation we show which platform has it.' }],
};
