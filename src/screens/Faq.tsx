import { useState } from 'react';
import WavesBg from '../components/WavesBg';
import { faqData } from '../data';
import { useApp } from '../store';

const ease = 'all .35s cubic-bezier(.2,.7,.2,1)';

export default function Faq() {
  const { st, t } = useApp();
  const [open, setOpen] = useState(0);
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#04030f', padding: '96px 24px 48px' }}>
      <WavesBg />
      <div className="mp-up" style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
        <h1 className="mp-heading" style={{ fontSize: 36, margin: '0 0 18px' }}>{t.faqTitle}</h1>
        {faqData[st.lang].map((f, i) => {
          const on = open === i;
          return (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.14)' }}>
              <div onClick={() => setOpen(on ? -1 : i)} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '20px 2px', cursor: 'pointer' }}>
                <div style={{ position: 'relative', width: 40, height: 40, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#7ea6ff', transform: `scale(${on ? 1 : 0})`, opacity: on ? 1 : 0, transition: ease }} />
                  <span className="mp-mono" style={{ position: 'relative', zIndex: 1, fontSize: 13, fontWeight: 600, color: on ? '#0a0a1e' : 'rgba(255,255,255,.6)', transition: 'color .3s ease' }}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mp-heading" style={{ fontSize: 'clamp(18px,3vw,24px)', margin: 0, color: on ? '#ffffff' : 'rgba(255,255,255,.78)', transform: `translateX(${on ? 4 : 0}px)`, transition: ease }}>{f.q}</h3>
                <span style={{ marginLeft: 'auto', fontSize: 22, color: '#fff', opacity: on ? 1 : 0.5, transform: `rotate(${on ? 45 : 0}deg)`, transition: ease }}>+</span>
              </div>
              <div style={{ overflow: 'hidden', maxHeight: on ? 220 : 0, opacity: on ? 1 : 0, transition: 'max-height .4s cubic-bezier(.2,.7,.2,1),opacity .3s ease' }}>
                <p style={{ padding: '0 12px 22px 58px', margin: 0, fontSize: 14, color: 'rgba(238,241,255,.75)', lineHeight: 1.6 }}>{f.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
