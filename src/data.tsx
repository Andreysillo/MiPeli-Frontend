// Datos de demo: aún no hay backend, todo lo que ve el usuario sale de aquí.
import type { Lang } from './i18n';

export type Movie = { title: string; subtitle: string; gradient: string; handle?: string; borderColor?: string; year?: number; rating?: string };

export const genres = ['Thriller', 'Drama', 'Noir', 'Ciencia ficción', 'Terror', 'Comedia', 'Romance', 'Animación', 'Documental'];
export const directors = ['Bong Joon-ho', 'Denis Villeneuve', 'David Fincher', 'Park Chan-wook', 'Wong Kar-wai', 'Christopher Nolan', 'Céline Sciamma', 'Kelly Reichardt'];
export const themes = ['Venganza', 'Soledad urbana', 'Memoria', 'Familia', 'Identidad', 'Distopía', 'Mayoría de edad', 'Amor imposible'];
export const auroraStops = ['#0f4fb8', '#ffffff', '#3300ff'];
export const navItems = [{ label: 'FAQ', href: '#faq' }, { label: 'Contacto', href: '#contacto' }];

// Pósters placeholder dibujados en canvas (franjas diagonales sobre degradado)
function stripes(w: number, h: number, stops: [number, string][], line: string, lineWidth: number, step: number) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
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

const iconStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eef1ff' };
export const socialLogos = [
  {
    href: 'https://github.com/', title: 'GitHub',
    node: <span style={iconStyle}><svg width={40} height={40} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 0 1 2.5-.34c.85 0 1.7.12 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" /></svg></span>,
  },
  {
    href: 'https://www.linkedin.com/', title: 'LinkedIn',
    node: <span style={iconStyle}><svg width={40} height={40} viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05c.53-.95 1.83-1.96 3.77-1.96 4.03 0 4.78 2.56 4.78 5.88V21h-4v-5.5c0-1.31-.02-3-1.86-3-1.86 0-2.14 1.42-2.14 2.9V21h-4V9Z" /></svg></span>,
  },
  {
    href: 'mailto:kevin@mipeli.app', title: 'Correo',
    node: <span style={iconStyle}><svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><rect x={2} y={4} width={20} height={16} rx={3} /><path d="m3 6 9 6 9-6" /></svg></span>,
  },
];

const chromaG = ['linear-gradient(145deg,#3a5bd0,#0a0a1e)', 'linear-gradient(210deg,#6a3cff,#0a0a1e)', 'linear-gradient(165deg,#2f6bff,#0a0a1e)', 'linear-gradient(195deg,#7a4dff,#0a0a1e)', 'linear-gradient(225deg,#3a5bd0,#0a0a1e)', 'linear-gradient(135deg,#6a3cff,#0a0a1e)'];
export const chromaMovies: Movie[] = [['Oldboy', '2003 · Thriller', '★ 4.6'], ['Parasite', '2019 · Drama', '★ 4.8'], ['Drive', '2011 · Noir', '★ 4.3'], ['Seven', '1995 · Crimen', '★ 4.5'], ['Zodiac', '2007 · Thriller', '★ 4.4'], ['Heat', '1995 · Acción', '★ 4.4']]
  .map(([title, subtitle, handle], i) => ({ title, subtitle, handle, borderColor: i % 2 ? '#7ea6ff' : '#b18cff', gradient: chromaG[i % chromaG.length] }));

const driftG = ['linear-gradient(160deg,#1b2a6b,#0a0a1e)', 'linear-gradient(160deg,#3a1d7a,#0a0a1e)', 'linear-gradient(160deg,#0f3aa8,#0a0a1e)', 'linear-gradient(160deg,#5a2ea0,#0a0a1e)', 'linear-gradient(160deg,#123a8f,#120a2e)'];
export const driftMovies: Movie[] = ([['Oldboy', 2003, '4.6'], ['Parasite', 2019, '4.8'], ['Drive', 2011, '4.3'], ['Seven', 1995, '4.5'], ['Zodiac', 2007, '4.4'], ['Heat', 1995, '4.4'], ['Burning', 2018, '4.3'], ['Memories of Murder', 2003, '4.7'], ['The Chaser', 2008, '4.2'], ['Whiplash', 2014, '4.6'], ['Prisoners', 2013, '4.3'], ['Nightcrawler', 2014, '4.4'], ['Mother', 2009, '4.4'], ['A Bittersweet Life', 2005, '4.2'], ['I Saw the Devil', 2010, '4.3']] as const)
  .map(([title, year, rating], i) => ({ title, year, rating, subtitle: `${year} · ★ ${rating}`, gradient: driftG[i % driftG.length] }));

const recColors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];
const recAngles = [145, 210, 165, 195, 225, 135, 160, 200];
export const recMovieList: Movie[] = [['Parasite', '2019 · Netflix, Max', '★ 4.8'], ['Oldboy', '2003 · Mubi', '★ 4.6'], ['Burning', '2018 · Prime', '★ 4.3'], ['Memories of Murder', '2003 · Max', '★ 4.7'], ['Drive', '2011 · Prime', '★ 4.3'], ['Whiplash', '2014 · Netflix', '★ 4.6'], ['Zodiac', '2007 · Max', '★ 4.4'], ['Seven', '1995 · Netflix', '★ 4.5'], ['Prisoners', '2013 · Prime', '★ 4.3'], ['In the Mood for Love', '2000 · Mubi', '★ 4.7']]
  .map(([title, subtitle, handle], i) => ({ title, subtitle, handle, borderColor: recColors[i % 8], gradient: `linear-gradient(${recAngles[i % 8]}deg,${recColors[i % 8]},#0a0a1e)` }));

export type DuelMovie = { title: string; sub: string; g: string };
export const duels: [DuelMovie, DuelMovie][] = [
  [{ title: 'Oldboy', sub: '2003 · Park Chan-wook', g: 'linear-gradient(160deg,#3a1d7a,#0a0a1e)' }, { title: 'Drive', sub: '2011 · N. W. Refn', g: 'linear-gradient(160deg,#0f3aa8,#0a0a1e)' }],
  [{ title: 'Parasite', sub: '2019 · Bong Joon-ho', g: 'linear-gradient(160deg,#5a2ea0,#0a0a1e)' }, { title: 'Seven', sub: '1995 · David Fincher', g: 'linear-gradient(160deg,#1b2a6b,#0a0a1e)' }],
  [{ title: 'Whiplash', sub: '2014 · Chazelle', g: 'linear-gradient(160deg,#123a8f,#0a0a1e)' }, { title: 'Burning', sub: '2018 · Lee Chang-dong', g: 'linear-gradient(160deg,#3a1d7a,#120a2e)' }],
];

export const listIdeas: Record<Lang, string[]> = {
  es: ['Tu ranking definitivo de Bong Joon-ho', 'Neo-noir para noches de insomnio', 'Coreanas que te reventaron la cabeza', 'Directoras que necesitas ver'],
  en: ['Your definitive Bong Joon-ho ranking', 'Neo-noir for sleepless nights', 'Korean films that broke your brain', 'Women directors you must watch'],
};

export const faqData: Record<Lang, { q: string; a: string }[]> = {
  es: [{ q: '¿De dónde salen las recomendaciones?', a: 'De tus respuestas, cruzadas con nuestra base de títulos.' }, { q: '¿Necesito cuenta?', a: 'No para probar. Con Google guardas tu progreso y repites encuestas sin límite.' }, { q: '¿Qué es el botón "Elegir por mí"?', a: 'Toma las finalistas y te muestra una sola con 10 segundos para ir a verla. Cero parálisis.' }, { q: '¿Dónde veo la peli?', a: 'Debajo del póster mostramos en qué plataforma está según tu país.' }],
  en: [{ q: 'Where do recommendations come from?', a: 'Your answers, matched against our title base.' }, { q: 'Do I need an account?', a: 'Not to try. With Google you save progress and repeat surveys with no limit.' }, { q: 'What is the "Choose for me" button?', a: 'It takes the finalists and shows a single one with 10 seconds to go watch it. Zero paralysis.' }, { q: 'Where can I watch it?', a: 'Under the poster we show which platform has it based on your country.' }],
};
