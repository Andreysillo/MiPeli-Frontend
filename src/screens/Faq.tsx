import { useState } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import StudioPage from '../components/Studio';
import { contactInfo, faqData } from '../data';
import { useApp } from '../store';

// Dos círculos que se encuentran: guiño al título de la referencia (monopo.vn/contact)
function Rings() {
  return (
    <svg className="mp-rings" viewBox="0 0 56 32" aria-hidden>
      <circle cx="17" cy="16" r="15" />
      <circle cx="39" cy="16" r="15" />
    </svg>
  );
}

// FAQ: título enorme y delgado, preguntas como filas de tipo grande y respuesta que se despliega.
// Mezcla el cuerpo editorial de 601 (crema sobre negro) con el ritmo de monopo.vn (etiquetas pequeñas, flechas, correo grande).
export default function Faq() {
  const { st, t } = useApp();
  const [open, setOpen] = useState(0);

  return (
    <StudioPage>
      <div className="mp-601-body mp-faq">
        <header className="mp-faq-head">
          <p data-reveal className="mp-faq-crumb"><ArrowRight size={14} aria-hidden />{t.faqKick}</p>
          <h1 data-reveal className="mp-faq-display">{t.faqTitle}<Rings /></h1>
        </header>

        <ul className="mp-faq-list">
          {faqData[st.lang].map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} data-reveal>
                <h2>
                  <button className="mp-faq-q" id={`faq-q${i}`} aria-expanded={on} aria-controls={`faq-a${i}`} onClick={() => setOpen(on ? -1 : i)}>
                    <span className="mp-faq-n tnum" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                    <span className="mp-faq-text">{f.q}</span>
                    <ArrowRight className="mp-faq-ico" size={22} aria-hidden />
                  </button>
                </h2>
                <div className={on ? 'mp-faq-a open' : 'mp-faq-a'} id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`}>
                  <div><p>{f.a}</p></div>
                </div>
              </li>
            );
          })}
        </ul>

        <div data-reveal className="mp-faq-cta">
          <p className="mp-601-colLabel">{t.faqMore}</p>
          <a className="mp-faq-mail" href={`mailto:${contactInfo.email}`} translate="no">{contactInfo.email}</a>
          <a className="mp-601-a" href="#contacto"><ArrowRight size={14} weight="bold" aria-hidden />{t.navContact}</a>
        </div>
      </div>
    </StudioPage>
  );
}
