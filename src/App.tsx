import { useLayoutEffect, useRef, type ComponentType } from 'react';
import { ArrowCounterClockwise, CheckCircle, Globe, SignOut, UserCircle, type Icon } from '@phosphor-icons/react';
import ConfirmDialog from './components/ConfirmDialog';
import SiteNav from './components/SiteNav';
import Reveal from './components/Reveal';
import { StoreContext, blankSurvey, useStore, type Confirm, type Screen, type State } from './store';
import type { Fate } from './i18n';
import { signOutUser } from './auth';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Quest from './screens/Quest';
import Loading from './screens/Loading';
import Results from './screens/Results';
import Profile from './screens/Profile';
import Faq from './screens/Faq';
import Contact from './screens/Contact';

const screens: Record<Screen, ComponentType> = {
  welcome: Welcome, login: Login, quest: Quest, loading: Loading, results: Results, profile: Profile, faq: Faq, contacto: Contact,
};

const confirmIcon: Record<Confirm, Icon> = { signout: SignOut, restart: ArrowCounterClockwise, redo: ArrowCounterClockwise };

// Qué pasa con los resultados que se ven si se empieza otra ronda: con sesión quedan guardados, un invitado los pierde
const fateOf = (s: State): Fate => {
  if (s.screen !== 'results') return 'survey';
  return s.uid ? 'saved' : 'unsaved';
};

export default function App() {
  const store = useStore();
  const { st, set, startSurvey, redoSurvey, t } = store;
  const Current = screens[st.screen];
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const who = st.loggedIn && st.user ? st.user : null;
  const ask = st.confirm ? { ...t.confirm[st.confirm], Icon: confirmIcon[st.confirm] } : null;
  const dismiss = () => set({ confirm: null });
  // Cerrar sesión también descarta la encuesta a medias; repetir la encuesta conserva las respuestas; empezar de nuevo las limpia. Las dos últimas entran al primer paso
  const accept = () => {
    const kind = st.confirm;
    set({ confirm: null });
    if (kind === 'signout') { signOutUser().catch(console.error); set({ ...blankSurvey(), screen: 'welcome' }); }
    else if (kind === 'redo') redoSurvey();
    else startSurvey();
  };
  const actions = (
    <div className="mp-header-actions">
      {st.loggedIn && (
        <a className="mp-lang mp-profile" href="#perfil" title={t.myProfile} aria-label={t.myProfile} aria-current={st.screen === 'profile' ? 'page' : undefined}>
          <UserCircle size={18} weight="bold" aria-hidden /><span className="mp-hide-sm">{t.myProfile}</span>
        </a>
      )}
      <button className="mp-lang" onClick={() => set({ lang: st.lang === 'es' ? 'en' : 'es' })} title={t.langHint} aria-label={t.langHint}>
        <Globe className="mp-hide-xs" size={18} weight="bold" aria-hidden /> {st.lang === 'es' ? 'EN' : 'ES'}
      </button>
    </div>
  );

  // Cada pantalla nueva empieza arriba y con el foco en el contenido (lectores de pantalla); 'instant' evita el desplazamiento suave de la landing
  useLayoutEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    mainRef.current?.focus({ preventScroll: true });
  }, [st.screen]);

  return (
    <StoreContext.Provider value={store}>
      {/* La carga va a pantalla completa, sin header */}
      {st.screen !== 'loading' && (
        <header className="mp-header">
          {st.screen === 'login' ? actions : <SiteNav>{actions}</SiteNav>}
        </header>
      )}

      <main ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        <Reveal key={st.screen}><Current /></Reveal>
      </main>

      {ask && (
        <ConfirmDialog icon={<ask.Icon size={22} weight="duotone" aria-hidden />}
          title={ask.title(who)} text={ask.text(fateOf(st))} confirmLabel={ask.ok} cancelLabel={ask.cancel} onConfirm={accept} onCancel={dismiss} />
      )}

      <div role="status" aria-live="polite">
        {st.toast && <div className="mp-toast"><CheckCircle size={20} weight="fill" aria-hidden />{st.toast}</div>}
      </div>
    </StoreContext.Provider>
  );
}
