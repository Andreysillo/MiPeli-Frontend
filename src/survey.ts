// Configuración de la encuesta: qué se pregunta, en qué orden y qué implica cada respuesta.
// Los textos (nombres de moods, compañías, etc.) viven en i18n.ts; aquí van las claves y las reglas.
// Cuando haya backend, los duelos y las sugerencias los servirá él y la búsqueda usará TMDB (/search/movie); ver docs/recomendacion.md.
import { Alien, Camera, Compass, Couch, Eye, Ghost, Heart, Smiley, type Icon } from '@phosphor-icons/react';
import { byTitle, catalog, type Movie, type Platform } from './data';

export type Step = 'mood' | 'context' | 'duel' | 'favorites' | 'platforms';
export type Mood = 'laugh' | 'tension' | 'feel' | 'mind' | 'epic' | 'scare' | 'cozy' | 'real';
export type Company = 'solo' | 'couple' | 'friends' | 'family';

export const MAX_MOODS = 2;
export const MAX_FAVORITES = 3;

// Géneros del catálogo (nombres de TMDB en español) que implica cada mood. Nunca se le pregunta al usuario por géneros: elige una sensación.
// En TMDB equivale a with_genres (con "|" = OR) más with_keywords.
export const moods: { key: Mood; Icon: Icon; genres: string[] }[] = [
  { key: 'laugh', Icon: Smiley, genres: ['Comedia'] },
  { key: 'tension', Icon: Eye, genres: ['Thriller', 'Misterio', 'Crimen'] },
  { key: 'feel', Icon: Heart, genres: ['Drama', 'Romance'] },
  { key: 'mind', Icon: Alien, genres: ['Ciencia ficción', 'Misterio', 'Fantasía'] },
  { key: 'epic', Icon: Compass, genres: ['Acción', 'Aventura', 'Fantasía'] },
  { key: 'scare', Icon: Ghost, genres: ['Terror'] },
  { key: 'cozy', Icon: Couch, genres: ['Animación', 'Familia', 'Comedia', 'Aventura'] },
  { key: 'real', Icon: Camera, genres: ['Documental'] },
];

export const companies: Company[] = ['solo', 'couple', 'friends', 'family'];
// Qué suma y qué descarta cada compañía (en TMDB: without_genres y with_genres)
export const companyRules: Record<Company, { boost: string[]; ban: string[] }> = {
  solo: { boost: [], ban: [] },
  couple: { boost: ['Romance', 'Comedia'], ban: [] },
  friends: { boost: ['Comedia', 'Acción', 'Aventura', 'Terror'], ban: [] },
  family: { boost: ['Animación', 'Familia', 'Aventura', 'Comedia'], ban: ['Terror', 'Thriller', 'Crimen'] },
};

// Géneros que se pueden evitar (en TMDB: without_genres) y duraciones máximas en minutos (with_runtime.lte; null = sin límite)
export const avoidOptions = [
  'Terror', 'Romance', 'Animación', 'Documental', 'Ciencia ficción', 'Acción', 'Comedia', 'Drama', 'Thriller', 'Crimen',
  'Misterio', 'Aventura', 'Fantasía', 'Familia', 'Música', 'Western', 'Bélica', 'Historia',
];
export const runtimeOptions: (number | null)[] = [100, 130, null];

// Plataformas guardadas: el paso de plataformas solo se pregunta la primera vez
export const buildSteps = (ownedPlatforms: Platform[]): Step[] => {
  const steps: Step[] = ['mood', 'context', 'duel', 'favorites'];
  return ownedPlatforms.length ? steps : [...steps, 'platforms'];
};

// Cuatro duelos curados con contrastes de tono, época y estilo: así cada elección dice algo distinto
export const duels: [Movie, Movie][] = [['Seven', 'Amélie'], ['Inception', 'The Big Lebowski'], ['Parasite', 'Spirited Away'], ['Heat', 'Before Sunrise']]
  .map(([a, b]) => [byTitle(a), byTitle(b)]);

// Películas para tocar si no se les ocurre una favorita
export const suggestions = ['Parasite', 'Inception', 'Interstellar', 'Coco', 'Get Out', 'La La Land', 'Whiplash', 'Spirited Away', 'Oldboy',
  'Everything Everywhere All at Once', 'The Grand Budapest Hotel', 'Seven'].map(byTitle);

const plain = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Búsqueda sobre el catálogo de demo (sin tildes ni mayúsculas); las que empiezan por lo escrito van primero
export function searchMovies(query: string, limit = 5): Movie[] {
  const q = plain(query.trim());
  if (q.length < 2) return [];
  return catalog
    .filter(m => plain(m.title).includes(q))
    .sort((a, b) => Number(plain(b.title).startsWith(q)) - Number(plain(a.title).startsWith(q)))
    .slice(0, limit);
}
