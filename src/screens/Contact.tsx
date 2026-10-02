import { useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import StudioPage, { Section } from '../components/Studio';
import Credits from '../components/Credits';
import { contactInfo } from '../data';
import { useApp } from '../store';

export default function Contact() {
  const { flash, t } = useApp();
  const [sug, setSug] = useState('');
  // ponytail: la sugerencia no se envía a ningún lado todavía; conectar al backend cuando exista
  const send = (e: FormEvent) => { e.preventDefault(); setSug(''); flash(t.thanksSug); };

  return (
    <StudioPage>
      <div className="mp-601-body">
        <Section label={t.aboutBrand} level={1} delay={0.1}>
          <p data-reveal className="mp-601-statement">{t.studioStatement}</p>
        </Section>

        <Section label={t.aboutKick} delay={0.2}>
          <div data-reveal className="mp-601-author">
            <p className="mp-601-name" translate="no">{t.authorName}</p>
            <p className="mp-601-bio">{t.authorBio}</p>
          </div>
        </Section>

        <Section label={t.contactLabel} delay={0.25}>
          <div className="mp-601-cols">
            <div data-reveal>
              <p className="mp-601-colLabel">{t.colMail}</p>
              <a className="mp-601-a" href={`mailto:${contactInfo.email}`} translate="no">{contactInfo.email}</a>
            </div>
            <div data-reveal>
              <p className="mp-601-colLabel">{t.colSocial}</p>
              <ul className="mp-601-list">
                <li><a className="mp-601-a" href={contactInfo.github} target="_blank" rel="noopener noreferrer" translate="no">GitHub<ArrowUpRight size={12} weight="bold" aria-hidden /></a></li>
                <li><a className="mp-601-a" href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" translate="no">LinkedIn<ArrowUpRight size={12} weight="bold" aria-hidden /></a></li>
              </ul>
            </div>
            <form data-reveal onSubmit={send} className="mp-601-form">
              <label htmlFor="sug" className="mp-601-colLabel">{t.sugLabel}</label>
              <input id="sug" name="suggestion" className="mp-601-input" value={sug} onChange={e => setSug(e.target.value)} placeholder={t.sugPh} autoComplete="off" />
              <button type="submit" className="mp-601-out" disabled={!sug.trim()}>{t.send}<ArrowRight size={14} weight="bold" aria-hidden /></button>
            </form>
          </div>
        </Section>

        <Credits />
      </div>
    </StudioPage>
  );
}
