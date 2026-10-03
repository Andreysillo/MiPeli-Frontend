import { useLayoutEffect, useRef, type ComponentType } from 'react';
import { ArrowCounterClockwise, CheckCircle, Globe, SignOut } from '@phosphor-icons/react';
import ConfirmDialog from './components/ConfirmDialog';
import SiteNav from './components/SiteNav';
import Reveal from './components/Reveal';
import { StoreContext, blankSurvey, freshSurvey, useStore, type Screen } from './store';
import { signOutUser } from './auth';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import SurveyType from './screens/SurveyType';
import RecTypes from './screens/RecTypes';
import Quest from './screens/Quest';
import Loading from './screens/Loading';
import Results from './screens/Results';
import Faq from './screens/Faq';
import Contact from './screens/Contact';

const screens: Record<Screen, ComponentType> = {
  welcome: Welcome, login: Login, type: SurveyType, rectypes: RecTypes, quest: Quest, loading: Loading,
  results: Results, faq: Faq, contacto: Contact,
};

export default function App() {
  const store = useStore();
  const { st, set, t } = store;
  const Current = screens[st.screen];
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const who = st.loggedIn && st.user ? st.user : null;
  const ask = st.confirm ? t.confirm[st.confirm] : null;
  const dismiss = () => set({ confirm: null });
  // Cerrar sesión también descarta la encuesta a medias; empezar de nuevo limpia las respuestas y vuelve a elegir el tipo
  const accept = () => {
    if (st.confirm === 'signout') { signOutUser().catch(console.error); set({ ...blankSurvey(), confirm: null, screen: 'welcome' }); }
    else set({ ...freshSurvey(), confirm: null, screen: 'type' });
  };
  const actions = (
    <div className="mp-header-actions">
      {st.loggedIn && (
        <button className="mp-lang mp-signout" onClick={() => set({ confirm: 'signout' })} title={t.signOut} aria-label={t.signOut}>
          <SignOut size={18} weight="bold" aria-hidden /><span className="mp-hide-sm">{t.signOut}</span>
        </button>
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
        <ConfirmDialog icon={st.confirm === 'signout' ? <SignOut size={22} weight="duotone" aria-hidden /> : <ArrowCounterClockwise size={22} weight="duotone" aria-hidden />}
          title={ask.title(who)} text={ask.text} confirmLabel={ask.ok} cancelLabel={ask.cancel} onConfirm={accept} onCancel={dismiss} />
      )}

      <div role="status" aria-live="polite">
        {st.toast && <div className="mp-toast"><CheckCircle size={20} weight="fill" aria-hidden />{st.toast}</div>}
      </div>
    </StoreContext.Provider>
  );
}
