import { useLayoutEffect, useMemo, useRef, type ComponentType } from 'react';
import { CheckCircle, Globe, SignOut } from '@phosphor-icons/react';
import PillNav from './components/PillNav';
import Reveal from './components/Reveal';
import { StoreContext, useStore, type Screen } from './store';
import { signOutUser } from './auth';
import Welcome from './screens/Welcome';
import SurveyType from './screens/SurveyType';
import RecTypes from './screens/RecTypes';
import Quest from './screens/Quest';
import Loading from './screens/Loading';
import Results from './screens/Results';
import Home from './screens/Home';
import Faq from './screens/Faq';
import Contact from './screens/Contact';

const screens: Record<Screen, ComponentType> = {
  welcome: Welcome, type: SurveyType, rectypes: RecTypes, quest: Quest, loading: Loading,
  results: Results, home: Home, faq: Faq, contacto: Contact,
};

export default function App() {
  const store = useStore();
  const { st, set, go, t } = store;
  const Current = screens[st.screen];
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const navItems = useMemo(() => [{ label: t.navHome, href: '#home' }, { label: 'FAQ', href: '#faq' }, { label: t.navContact, href: '#contacto' }], [t]);
  const activeHref = navItems.find(i => i.href === `#${st.screen}`)?.href;
  const signOut = () => { signOutUser().catch(console.error); go('welcome'); };

  // Cada pantalla nueva empieza arriba y con el foco en el contenido (lectores de pantalla)
  useLayoutEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [st.screen]);

  return (
    <StoreContext.Provider value={store}>
      {/* La carga va a pantalla completa, sin header */}
      {st.screen !== 'loading' && (
        <header className="mp-header">
          {st.screen !== 'welcome' && (
            <PillNav items={navItems} activeHref={activeHref} logoHref="#home" brand="MP" baseColor="#1f1f2e" pillColor="#f4f4f4" pillTextColor="#0f0f14" hoveredPillTextColor="#f4f4f4" />
          )}
          <div className="mp-header-actions">
            {st.loggedIn && (
              <button className="mp-lang mp-signout" onClick={signOut} title={t.signOut} aria-label={t.signOut}>
                <SignOut size={18} weight="bold" aria-hidden /><span className="mp-hide-sm">{t.signOut}</span>
              </button>
            )}
            <button className="mp-lang" onClick={() => set({ lang: st.lang === 'es' ? 'en' : 'es' })} title={t.langHint} aria-label={t.langHint}>
              <Globe className="mp-hide-xs" size={18} weight="bold" aria-hidden /> {st.lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </header>
      )}

      <main ref={mainRef} tabIndex={-1} style={{ outline: 'none' }}>
        <Reveal key={st.screen}><Current /></Reveal>
      </main>

      <div role="status" aria-live="polite">
        {st.toast && <div className="mp-toast"><CheckCircle size={20} weight="fill" aria-hidden />{st.toast}</div>}
      </div>
    </StoreContext.Provider>
  );
}
