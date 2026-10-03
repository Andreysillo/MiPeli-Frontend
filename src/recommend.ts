// Recomendador de demo: ordena el catálogo local según las respuestas de la encuesta.
// ponytail: heurística local; la reemplaza el backend. Este módulo es la costura: cada respuesta tiene su equivalente en TMDB
// (ver docs/recomendacion.md). Mientras tanto aquí se puntúa con los mismos criterios que usará el servidor.
import { catalog, type Movie, type Platform } from './data';
import { companyRules, moods, type Company, type Mood } from './survey';

// Por qué sale una película: parecida a una que eligió (o del mismo director), va con su mood o está en su plataforma
export type Reason = { kind: 'director' | 'liked' | 'mood' | 'platform'; ref: string };
// Qué restricción incumple (se muestran al final de la lista y marcadas, solo si no alcanzan las que sí cumplen)
export type Flag = 'offPlatform' | 'overRuntime';
export type Rec = Movie & { reasons: Reason[]; flags: Flag[] };

export type Answers = {
  moods: Mood[]; maxRuntime: number | null; company: Company; avoid: string[];
  duelPicks: string[]; liked: string[]; boosted: string[]; disliked: string[]; seen: string[]; ownedPlatforms: Platform[];
};

const genresOf = (key: Mood) => moods.find(x => x.key === key)!.genres;

// Cuánto se parece una película a otra que el usuario eligió: géneros en común, mismo director, reparto compartido y época cercana
function affinity(m: Movie, a: Movie) {
  const shared = m.genres.filter(g => a.genres.includes(g)).length;
  let s = (shared / new Set([...m.genres, ...a.genres]).size) * 1.5;
  if (m.director === a.director) s += 1.5;
  if (m.cast.some(c => a.cast.includes(c))) s += 0.5;
  if (Math.abs(m.year - a.year) <= 8) s += 0.3;
  return s;
}

export function recommend(a: Answers): Rec[] {
  // Las favoritas pesan más que las ganadoras de los duelos; "más como esta" (boosted) suma sin sacar la película de la lista
  const anchors = [...a.liked.map(title => ({ title, w: 1 })), ...a.boosted.map(title => ({ title, w: 0.8 })), ...a.duelPicks.map(title => ({ title, w: 0.6 }))]
    .flatMap(({ title, w }) => { const m = catalog.find(x => x.title === title); return m ? [{ m, w }] : []; });
  const known = new Set([...a.liked, ...a.duelPicks, ...a.seen, ...a.disliked]); // ya elegidas, vistas o descartadas: no se repiten
  const moodGenres = new Set(a.moods.flatMap(genresOf));
  const rules = companyRules[a.company];
  const banned = new Set([...a.avoid, ...rules.ban]);

  const rank = (m: Movie) => {
    const hits = anchors.filter(x => x.m.title !== m.title).map(({ m: other, w }) => ({ other, w, s: w * affinity(m, other) }));
    const best = hits.reduce<(typeof hits)[number] | undefined>((top, h) => (!top || h.s > top.s ? h : top), undefined);
    const taste = Math.min(4, hits.reduce((n, h) => n + h.s, 0));
    const own = m.platforms.filter(p => a.ownedPlatforms.includes(p));
    const score = m.imdb / 10
      + Math.min(2, m.genres.filter(g => moodGenres.has(g)).length) * 1.6
      + taste
      + m.genres.filter(g => rules.boost.includes(g)).length * 0.5;

    const reasons: Reason[] = [];
    if (best && m.director === best.other.director) reasons.push({ kind: 'director', ref: best.other.title });
    else if (best && best.s >= 0.5 * best.w) reasons.push({ kind: 'liked', ref: best.other.title });
    const mood = a.moods.find(k => genresOf(k).some(g => m.genres.includes(g)));
    if (mood) reasons.push({ kind: 'mood', ref: mood });
    if (own.length) reasons.push({ kind: 'platform', ref: own[0] });

    const flags: Flag[] = [];
    if (a.ownedPlatforms.length > 0 && own.length === 0) flags.push('offPlatform');
    if (a.maxRuntime !== null && m.runtime > a.maxRuntime) flags.push('overRuntime');
    return { rec: { ...m, reasons: reasons.slice(0, 2), flags }, score };
  };

  // Primero las que cumplen todo lo pedido (plataformas y duración), cada grupo por puntaje
  return catalog
    .filter(m => !known.has(m.title) && !m.genres.some(g => banned.has(g)))
    .map(rank)
    .sort((x, y) => x.rec.flags.length - y.rec.flags.length || y.score - x.score)
    .map(r => r.rec);
}
