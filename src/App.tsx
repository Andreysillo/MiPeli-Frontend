import type { ComponentType } from 'react';
import PillNav from './components/PillNav';
import { navItems } from './data';
import { StoreContext, useStore, type Screen } from './store';
import Welcome from './screens/Welcome';
import SurveyType from './screens/SurveyType';
import RecTypes from './screens/RecTypes';
import Quest from './screens/Quest';
import Loading from './screens/Loading';
import Results from './screens/Results';
import Home from './screens/Home';
import Faq from './screens/Faq';
import Contact from './screens/Contact';
import Roulette from './screens/Roulette';

const screens: Record<Screen, ComponentType> = {
  welcome: Welcome, type: SurveyType, rectypes: RecTypes, quest: Quest, loading: Loading,
  results: Results, home: Home, faq: Faq, contacto: Contact,
};

export default function App() {
  const store = useStore();
  const { st, set, t } = store;
  const Current = screens[st.screen];
  const showNav = st.screen !== 'welcome' && st.screen !== 'loading';
  const activeHref = st.screen === 'faq' ? '#faq' : st.screen === 'contacto' ? '#contacto' : '#home';

  return (
    <StoreContext.Provider value={store}>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <button onClick={() => set({ lang: st.lang === 'es' ? 'en' : 'es' })} title={t.langHint} className="mp-lang">
          <span className="mp-lang-shim" />
          <svg className="mp-lang-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: '#DCDDE5' }}>
            <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{st.lang === 'es' ? 'EN' : 'ES'}</span>
        </button>

        {showNav && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, height: 84, background: 'linear-gradient(180deg,rgba(4,3,15,.92),rgba(4,3,15,.55) 55%,transparent)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', WebkitMaskImage: 'linear-gradient(180deg,#000 55%,transparent)', maskImage: 'linear-gradient(180deg,#000 55%,transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', height: 64, pointerEvents: 'auto' }}>
              <PillNav items={navItems} activeHref={activeHref} logoHref="#home" brand="MP" baseColor="#3a1d7a" pillColor="#ffffff" pillTextColor="#1b0f45" hoveredPillTextColor="#ffffff" />
            </div>
          </div>
        )}

        <Current />
        {st.showRoulette && <Roulette />}
        {st.toast && (
          <div style={{ position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)', zIndex: 120, background: '#fff', color: '#2a0d6b', fontWeight: 600, fontSize: 14, padding: '12px 20px', borderRadius: 999, boxShadow: '0 20px 50px rgba(0,0,0,.4)' }}>{st.toast}</div>
        )}
      </div>
    </StoreContext.Provider>
  );
}
