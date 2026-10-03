import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { L, type Lang } from './i18n';
import { CINE, platforms, type Platform } from './data';
import { buildSteps, type Company, type Mood, type Step } from './survey';
import { authEnabled, firstName, onUserChange } from './auth';
import { MAX_NAME, MAX_RUNS, loadRuns, storeRuns, type Run } from './history';

export type Screen = 'welcome' | 'login' | 'quest' | 'loading' | 'results' | 'profile' | 'faq' | 'contacto';
export type Confirm = 'signout' | 'restart' | 'redo'; // aviso abierto antes de una acción que no se deshace

export type State = {
  screen: Screen;
  loggedIn: boolean; user: string; lang: Lang;
  // Sesión de Firebase: uid y correo. authReady dice que Firebase ya respondió si hay sesión (hasta entonces no se sabe)
  uid: string; email: string; authReady: boolean;
  numMovies: number;
  // Respuestas de la encuesta (ver survey.ts). avoid y ownedPlatforms son preferencias estables y se guardan; el resto es de esta noche
  moods: Mood[]; maxRuntime: number | null; company: Company; avoid: string[];
  duelPicks: string[]; liked: string[]; boosted: string[]; disliked: string[]; seen: string[]; ownedPlatforms: Platform[];
  useful: 'up' | 'down' | null;
  questSteps: Step[]; qi: number; duelIdx: number; questActive: boolean;
  // Encuestas guardadas de la cuenta (history.ts) y la que se está viendo (null: todavía sin guardar)
  runs: Run[]; runId: string | null;
  returnTo: Screen | null; // adónde volver tras iniciar sesión, p. ej. los resultados de un invitado que quiere guardarlos
  toast: string | null;
  confirm: Confirm | null;
};

// Avance de la encuesta en blanco: lo que se limpia al empezar de nuevo o al cerrar sesión (avoid y ownedPlatforms se conservan).
// runId: la encuesta nueva todavía no está guardada.
export const blankSurvey = () => ({
  questSteps: [] as Step[], qi: 0, duelIdx: 0, questActive: false, runId: null as string | null,
  moods: [] as Mood[], maxRuntime: null as number | null, company: 'solo' as Company,
  duelPicks: [] as string[], liked: [] as string[], boosted: [] as string[], disliked: [] as string[], seen: [] as string[],
});

const freshQuest = (s: State): State => ({ ...s, ...blankSurvey(), questSteps: buildSteps(s.ownedPlatforms), questActive: true, screen: 'quest' });

// Lo que se guarda de una encuesta para poder reabrirla
const answersOf = (s: State): Run['answers'] => ({
  numMovies: s.numMovies, moods: s.moods, maxRuntime: s.maxRuntime, company: s.company, avoid: s.avoid,
  duelPicks: s.duelPicks, liked: s.liked, boosted: s.boosted, disliked: s.disliked, seen: s.seen,
});

const KEY = 'mipeli:v1';
export const LOADING_MS = 4600;
const routes: Record<string, Screen> = { '#home': 'welcome', '#faq': 'faq', '#contacto': 'contacto', '#perfil': 'profile' };
// La sesión (loggedIn, user) no se guarda aquí: la restaura Firebase
const PERSISTED = ['numMovies', 'useful', 'lang', 'avoid', 'ownedPlatforms'] as const;

function initialState(): State {
  let saved: Partial<State> = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { /* storage bloqueado o corrupto */ }
  return {
    screen: routes[location.hash] ?? 'welcome', // enlaces directos a /#faq, /#contacto, /#perfil…
    loggedIn: false, user: '', lang: saved.lang || 'es',
    uid: '', email: '', authReady: !authEnabled, // sin Firebase configurado nadie va a responder: no hay nada que esperar
    numMovies: saved.numMovies || 5,
    avoid: Array.isArray(saved.avoid) ? saved.avoid : [],
    // Una plataforma guardada que ya no existe en la lista se descarta (el cine no es una plataforma de streaming, pero se guarda igual)
    ownedPlatforms: Array.isArray(saved.ownedPlatforms) ? saved.ownedPlatforms.filter(p => p in platforms || p === CINE) : [],
    useful: saved.useful || null,
    ...blankSurvey(),
    runs: [], returnTo: null,
    toast: null, confirm: null,
  };
}

export function useStore() {
  const [st, setSt] = useState(initialState);
  const set = useCallback((partial: Partial<State>) => setSt(s => ({ ...s, ...partial })), []);
  const go = useCallback((screen: Screen) => set({ screen, returnTo: null }), [set]);
  // Empieza una encuesta desde cero (las preferencias guardadas se conservan) y entra al primer paso
  const startSurvey = useCallback(() => setSt(freshQuest), []);
  // Entra a la encuesta: vuelve adonde se quedó antes de iniciar sesión (returnTo) o retoma la que está a medias o, si no hay, empieza una
  const enterSurvey = useCallback(() => setSt(s => {
    if (s.returnTo) return { ...s, screen: s.returnTo, returnTo: null };
    return s.questActive ? { ...s, screen: 'quest' } : freshQuest(s);
  }), []);
  // Repite la encuesta con las mismas respuestas desde la primera pregunta; la anterior sigue guardada tal como quedó
  const redoSurvey = useCallback(() => setSt(s => ({ ...s, qi: 0, duelIdx: 0, duelPicks: [], screen: 'quest', questActive: true, runId: null })), []);

  // Con sesión, la encuesta que se ve se guarda al llegar y se actualiza cada vez que se afina; sin runId es una nueva
  const saveRun = useCallback((titles: string[]) => setSt(s => {
    if (!s.uid || titles.length === 0) return s;
    const prev = s.runs.find(r => r.id === s.runId);
    const run: Run = { id: prev?.id ?? crypto.randomUUID(), at: prev?.at ?? Date.now(), name: prev?.name, titles, answers: answersOf(s) };
    return { ...s, runId: run.id, runs: prev ? s.runs.map(r => (r.id === run.id ? run : r)) : [run, ...s.runs].slice(0, MAX_RUNS) };
  }), []);
  // Reabre una encuesta guardada: restaura sus respuestas y muestra los resultados (se recalculan con las plataformas de hoy)
  const openRun = useCallback((id: string) => setSt(s => {
    const run = s.runs.find(r => r.id === id);
    return run ? { ...s, ...run.answers, runId: id, questActive: false, screen: 'results' } : s;
  }), []);
  const deleteRun = useCallback((id: string) => setSt(s => ({ ...s, runs: s.runs.filter(r => r.id !== id), runId: s.runId === id ? null : s.runId })), []);
  // Le pone nombre a una encuesta guardada; vacío (o sin cambios) vuelve al título automático
  const renameRun = useCallback((id: string, name: string) => setSt(s => ({ ...s, runs: s.runs.map(r => (r.id === id ? { ...r, name: name.trim().slice(0, MAX_NAME) || undefined } : r)) })), []);

  const toastTimer = useRef<number>(undefined);
  const flash = useCallback((toast: string) => {
    clearTimeout(toastTimer.current);
    set({ toast });
    toastTimer.current = window.setTimeout(() => set({ toast: null }), 2400);
  }, [set]);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(PERSISTED.map(k => [k, st[k]])))); } catch { /* sin storage: no se guarda */ }
  }, [st]);

  // Cada cuenta guarda sus encuestas en este navegador (history.ts); sin sesión no se guarda nada
  useEffect(() => { if (st.uid) storeRuns(st.uid, st.runs); }, [st.uid, st.runs]);

  // Firebase avisa al iniciar o cerrar sesión, y al recargar si ya había una sesión abierta.
  // uid y encuestas cambian juntos: así el efecto de arriba nunca guarda una lista vacía encima de la real.
  useEffect(() => onUserChange(u => set({
    loggedIn: !!u, user: u ? firstName(u) : '', email: u?.email ?? '', uid: u?.uid ?? '', runs: u ? loadRuns(u.uid) : [], authReady: true,
  })), [set]);

  // La pantalla de carga es simulada: pasa sola a resultados
  useEffect(() => {
    if (st.screen !== 'loading') return;
    const id = setTimeout(() => go('results'), LOADING_MS);
    return () => clearTimeout(id);
  }, [st.screen, go]);

  useEffect(() => {
    const onHash = () => { const s = routes[location.hash]; if (s) go(s); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [go]);

  // El hash refleja la pantalla actual; si no, volver a pulsar un enlace del nav no dispararía hashchange
  useEffect(() => {
    const hash = Object.keys(routes).find(h => h !== '#home' && routes[h] === st.screen) ?? ''; // la landing se queda en la raíz limpia
    if (location.hash !== hash) history.replaceState(null, '', hash || location.pathname + location.search);
  }, [st.screen]);

  const t = L[st.lang];
  return { st, set, go, startSurvey, enterSurvey, redoSurvey, saveRun, openRun, deleteRun, renameRun, flash, t, name: st.loggedIn && st.user ? st.user : t.guestName };
}

export type Store = ReturnType<typeof useStore>;
export const StoreContext = createContext<Store | null>(null);
export const useApp = () => useContext(StoreContext)!;
