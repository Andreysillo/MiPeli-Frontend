import { useState } from 'react';
import LogoLoop from '../components/LogoLoop';
import WavesBg, { interactive } from '../components/WavesBg';
import { socialLogos } from '../data';
import { useApp } from '../store';

export default function Contact() {
  const { flash, t } = useApp();
  const [sug, setSug] = useState('');
  // ponytail: la sugerencia no se envía a ningún lado todavía; conectar al backend cuando exista
  const send = () => { setSug(''); flash(t.thanksSug); };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#04030f', padding: '96px 24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <WavesBg {...interactive} speed={0.32} />
      <div className="mp-up" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 480, textAlign: 'center' }}>
        <p className="mp-mono" style={{ fontSize: 11, letterSpacing: '.14em', color: '#a9c0ff', margin: 0 }}>{t.aboutKick}</p>
        <h1 className="mp-heading" style={{ fontSize: 34, margin: '8px 0 6px' }}>{t.authorName}</h1>
        <p style={{ fontSize: 15, color: 'rgba(238,241,255,.8)', margin: '0 auto 22px', maxWidth: 400, lineHeight: 1.55 }}>{t.authorBio}</p>
        <div style={{ height: 76, position: 'relative', overflow: 'hidden', marginBottom: 26 }}>
          <LogoLoop logos={socialLogos} speed={36} direction="left" logoHeight={40} gap={56} fadeOut fadeOutColor="#04030f" scaleOnHover />
        </div>
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left' }}>
          <p className="mp-mono" style={{ fontSize: 11, letterSpacing: '.1em', color: 'rgba(255,255,255,.55)', margin: '0 0 8px' }}>{t.sugAsk}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={sug} onChange={e => setSug(e.target.value)} placeholder={t.sugPh}
              style={{ flex: 1, minWidth: 0, background: 'rgba(0,0,0,.25)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 999, padding: '0 16px', height: 44, color: '#fff', fontFamily: 'inherit', fontSize: 13, outline: 'none' }} />
            <button onClick={send} style={{ flex: 'none', height: 44, padding: '0 18px', borderRadius: 999, border: 'none', background: '#fff', color: '#2a0d6b', font: '600 13px var(--font-body)', cursor: 'pointer' }}>{t.send}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
