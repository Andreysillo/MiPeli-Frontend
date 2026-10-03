import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { L, type Lang } from './i18n';
import { platforms, type Platform } from './data';
import { buildSteps, type Company, type Mood, type Step } from './survey';
import { firstName, onUserChange } from './auth';

export type Screen = 'welcome' | 'login' | 'quest' | 'loading' | 'results' | 'faq' | 'contacto';

export type State = {
  screen: Screen;
  loggedIn: boolean; user: string; lang: Lang;
  numMovies: number;
  // Respuestas de la encuesta (ver survey.ts). avoid y ownedPlatforms son preferencias estables y se guardan; el resto es de esta noche
  moods: Mood[]; maxRuntime: number | null; company: Company; avoid: string[];
  duelPicks: string[]; liked: string[]; boosted: string[]; disliked: string[]; seen: string[]; ownedPlatforms: Platform[];
  useful: 'up' | 'down' | null;
  questSteps: Step[]; qi: number; duelIdx: number; questActive: boolean;
  toast: string | null;
  confirm: 'signout' | 'restart' | null; // aviso abierto antes de una acción que no se deshace
};

// Avance de la encuesta en blanco: lo que se limpia al empezar de nuevo o al cerrar sesión (avoid y ownedPlatforms se conservan)
export const blankSurvey = () => ({
  questSteps: [] as Step[], qi: 0, duelIdx: 0, questActive: false,
  moods: [] as Mood[], maxRuntime: null as number | null, company: 'solo' as Company,
  duelPicks: [] as string[], liked: [] as string[], boosted: [] as string[], disliked: [] as string[], seen: [] as string[],
});

const freshQuest = (s: State): State => ({ ...s, ...blankSurvey(), questSteps: buildSteps(s.ownedPlatforms), questActive: true, screen: 'quest' });

const KEY = 'mipeli:v1';
export const LOADING_MS = 4600;
const routes: Record<string, Screen> = { '#home': 'welcome', '#faq': 'faq', '#contacto': 'contacto' };
// La sesión (loggedIn, user) no se guarda aquí: la restaura Firebase
const PERSISTED = ['numMovies', 'useful', 'lang', 'avoid', 'ownedPlatforms'] as const;

function initialState(): State {
  let saved: Partial<State> = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { /* storage bloqueado o corrupto */ }
  return {
    screen: routes[location.hash] ?? 'welcome', // enlaces directos a /#faq, /#contacto…
    loggedIn: false, user: '', lang: saved.lang || 'es',
    numMovies: saved.numMovies || 5,
    avoid: Array.isArray(saved.avoid) ? saved.avoid : [],
    // Una plataforma guardada que ya no existe en la lista se descarta
    ownedPlatforms: Array.isArray(saved.ownedPlatforms) ? saved.ownedPlatforms.filter(p => p in platforms) : [],
    useful: saved.useful || null,
    ...blankSurvey(),
    toast: null, confirm: null,
  };
}

export function useStore() {
  const [st, setSt] = useState(initialState);
  const set = useCallback((partial: Partial<State>) => setSt(s => ({ ...s, ...partial })), []);
  const go = useCallback((screen: Screen) => set({ screen }), [set]);
  // Empieza una encuesta desde cero (las preferencias guardadas se conservan) y entra al primer paso
  const startSurvey = useCallback(() => setSt(freshQuest), []);
  // Entra a la encuesta: retoma la que está a medias o, si no hay, empieza una
  const enterSurvey = useCallback(() => setSt(s => (s.questActive ? { ...s, screen: 'quest' } : freshQuest(s))), []);

  const toastTimer = useRef<number>(undefined);
  const flash = useCallback((toast: string) => {
    clearTimeout(toastTimer.current);
    set({ toast });
    toastTimer.current = window.setTimeout(() => set({ toast: null }), 2400);
  }, [set]);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(PERSISTED.map(k => [k, st[k]])))); } catch { /* sin storage: no se guarda */ }
  }, [st]);

  // Firebase avisa al iniciar o cerrar sesión, y al recargar si ya había una sesión abierta
  useEffect(() => onUserChange(u => set({ loggedIn: !!u, user: u ? firstName(u) : '' })), [set]);

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
  return { st, set, go, startSurvey, enterSurvey, flash, t, name: st.loggedIn && st.user ? st.user : t.guestName };
}

export type Store = ReturnType<typeof useStore>;
export const StoreContext = createContext<Store | null>(null);
export const useApp = () => useContext(StoreContext)!;
