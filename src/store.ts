import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { L, type Lang } from './i18n';

export type Screen = 'welcome' | 'type' | 'rectypes' | 'quest' | 'loading' | 'results' | 'home' | 'faq' | 'contacto';
export type Step = 'genres' | 'director' | 'themes' | 'duel' | 'movies' | 'personal';
export type RecKey = 'movies' | 'genres' | 'themes' | 'director';
export type SurveyType = 'full' | 'short' | 'custom';
export type Length = 'short' | 'med' | 'long';

export type State = {
  screen: Screen;
  loggedIn: boolean; user: string; lang: Lang;
  surveyType: SurveyType | null; rec: Record<RecKey, boolean>; length: Length; numMovies: number;
  picks: { genre: string; director: string; theme: string };
  moodSel: string[]; movieSel: string[]; duelWins: Record<string, number>;
  useful: 'up' | 'down' | null;
  questSteps: Step[]; qi: number; duelIdx: number; questActive: boolean;
  showRoulette: boolean; toast: string | null;
};

const KEY = 'mipeli:v1';
export const LOADING_MS = 4600;
const routes: Record<string, Screen> = { '#home': 'home', '#faq': 'faq', '#contacto': 'contacto' };
const PERSISTED = ['loggedIn', 'user', 'surveyType', 'rec', 'length', 'numMovies', 'picks', 'useful', 'lang'] as const;

function initialState(): State {
  let saved: Partial<State> = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { /* storage bloqueado o corrupto */ }
  return {
    screen: 'welcome',
    loggedIn: !!saved.loggedIn, user: saved.user || 'Kevin', lang: saved.lang || 'es',
    surveyType: saved.surveyType || null,
    rec: saved.rec || { movies: true, genres: true, themes: false, director: true },
    length: saved.length || 'med', numMovies: saved.numMovies || 5,
    picks: saved.picks || { genre: 'Noir', director: 'Park Chan-wook', theme: 'Venganza' },
    moodSel: ['Thriller'], movieSel: [], duelWins: {},
    useful: saved.useful || null,
    questSteps: [], qi: 0, duelIdx: 0, questActive: false,
    showRoulette: false, toast: null,
  };
}

export function useStore() {
  const [st, setSt] = useState(initialState);
  const set = useCallback((partial: Partial<State>) => setSt(s => ({ ...s, ...partial })), []);
  const go = useCallback((screen: Screen) => set({ screen }), [set]);

  const toastTimer = useRef<number>(undefined);
  const flash = useCallback((toast: string) => {
    clearTimeout(toastTimer.current);
    set({ toast });
    toastTimer.current = window.setTimeout(() => set({ toast: null }), 2400);
  }, [set]);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(PERSISTED.map(k => [k, st[k]])))); } catch { /* sin storage: no se guarda */ }
  }, [st]);

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
    const hash = Object.keys(routes).find(h => routes[h] === st.screen) ?? '';
    if (location.hash !== hash) history.replaceState(null, '', hash || location.pathname + location.search);
  }, [st.screen]);

  const t = L[st.lang];
  return { st, set, go, flash, t, name: st.loggedIn ? st.user : t.guestName };
}

export type Store = ReturnType<typeof useStore>;
export const StoreContext = createContext<Store | null>(null);
export const useApp = () => useContext(StoreContext)!;
