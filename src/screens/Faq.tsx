import { useState } from 'react';
import { ArrowRight, EnvelopeSimple, Plus } from '@phosphor-icons/react';
import { contactInfo, faqData } from '../data';
import { useApp } from '../store';

// Acordeón: cada pregunta es una tarjeta; la respuesta se despliega y el "+" gira hasta ser una "×"
export default function Faq() {
  const { st, t } = useApp();
  const [open, setOpen] = useState(0);

  return (
    <section className="mp-screen">
      <div className="mp-content mp-container mp-page">
        <div className="mp-stack mp-narrow" style={{ gap: 10, marginBottom: 32 }}>
          <p data-reveal className="mp-kicker">{t.faqKick}</p>
          <h1 data-reveal className="mp-title">{t.faqTitle}</h1>
        </div>

        <ul className="mp-faq mp-narrow">
          {faqData[st.lang].map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} data-reveal className="mp-card">
                <h2>
                  <button className="mp-faq-q" id={`faq-q${i}`} aria-expanded={on} aria-controls={`faq-a${i}`} onClick={() => setOpen(on ? -1 : i)}>
                    {f.q}<Plus className="mp-faq-ico" size={20} weight="bold" aria-hidden />
                  </button>
                </h2>
                <div className={on ? 'mp-faq-a open' : 'mp-faq-a'} id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </li>
            );
          })}
        </ul>

        <div data-reveal className="mp-card mp-cta-card mp-narrow">
          <div className="mp-stack" style={{ gap: 4 }}>
            <h2 className="mp-h3">{t.faqMore}</h2>
            <p className="mp-label">{t.faqMoreD}</p>
          </div>
          <div className="mp-row">
            <a className="btn btn-primary" href={`mailto:${contactInfo.email}`}><EnvelopeSimple size={18} weight="bold" aria-hidden />{t.faqWrite}</a>
            <a className="btn btn-secondary" href="#contacto">{t.navContact}<ArrowRight size={18} aria-hidden /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
