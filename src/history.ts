// Encuestas guardadas de cada cuenta. Hoy viven en este navegador, una lista por usuario (uid de Firebase).
// ponytail: es la costura con el backend: cuando exista, `loadRuns`/`storeRuns` pasan a llamar a `GET`/`POST /surveys` (ver docs/recomendacion.md).
import type { Answers } from './recommend';

// Las respuestas con que se hizo (las plataformas son una preferencia de hoy y no se guardan aquí) y cuántas películas se pidieron.
// `titles` es una foto de lo que se recomendó, para dibujar la tarjeta sin recalcular.
export type Run = { id: string; at: number; titles: string[]; answers: Omit<Answers, 'ownedPlatforms'> & { numMovies: number } };

export const MAX_RUNS = 30;

const key = (uid: string) => `mipeli:runs:${uid}`;

// Lo guardado puede estar corrupto o venir de otra versión: lo que no tenga la forma esperada se descarta
const isRun = (r: Partial<Run> | null): r is Run =>
  !!r && typeof r.id === 'string' && typeof r.at === 'number' && Array.isArray(r.titles) && Array.isArray(r.answers?.moods);

export function loadRuns(uid: string): Run[] {
  try {
    const runs: unknown = JSON.parse(localStorage.getItem(key(uid)) || '[]');
    return Array.isArray(runs) ? runs.filter(isRun) : [];
  } catch { return []; /* storage bloqueado o corrupto */ }
}

export function storeRuns(uid: string, runs: Run[]) {
  try { localStorage.setItem(key(uid), JSON.stringify(runs)); } catch { /* sin storage: no se guarda */ }
}
