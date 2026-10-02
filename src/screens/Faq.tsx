import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import WavesBg from '../components/WavesBg';
import { faqData } from '../data';
import { useApp } from '../store';

const ease = 'transform .35s var(--ease-out), color .25s ease, opacity .25s ease';

export default function Faq() {
  const { st, t } = useApp();
  const [open, setOpen] = useState(0);
  return (
    <section className="mp-screen">
      <WavesBg />
      <div className="mp-content mp-container mp-page" style={{ maxWidth: 720 }}>
        <h1 data-reveal className="mp-title" style={{ marginBottom: 20 }}>{t.faqTitle}</h1>
        {faqData[st.lang].map((f, i) => {
          const on = open === i;
          return (
            <div key={i} data-reveal style={{ borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: 'inherit' }}>
                <button id={`faq-q${i}`} aria-expanded={on} aria-controls={`faq-a${i}`} onClick={() => setOpen(on ? -1 : i)}
                  style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 16, padding: '22px 2px', border: 0, background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span className="tnum" style={{ width: 32, flex: 'none', fontSize: '.875rem', fontWeight: 600, color: on ? 'var(--accent-text)' : 'var(--text-subtle)', transition: ease }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="mp-h3" style={{ flex: 1, color: on ? 'var(--text)' : 'var(--text-muted)', transition: ease }}>{f.q}</span>
                  <Plus size={20} aria-hidden style={{ flex: 'none', transform: `rotate(${on ? 45 : 0}deg)`, transition: ease }} />
                </button>
              </h2>
              <div id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`} hidden={!on} style={{ padding: '0 8px 22px 50px', color: 'var(--text-muted)', maxWidth: '62ch' }}>{f.a}</div>
            </div>
          );
        })}
        <p data-reveal style={{ marginTop: 32, color: 'var(--text-muted)' }}>{t.faqMore} <a href="#contacto">{t.faqWrite}</a></p>
      </div>
    </section>
  );
}
