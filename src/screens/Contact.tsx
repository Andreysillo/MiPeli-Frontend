import { useState, type FormEvent } from 'react';
import { ArrowRight, GithubLogo, LinkedinLogo } from '@phosphor-icons/react';
import Credits from '../components/Credits';
import { contactInfo } from '../data';
import { useApp } from '../store';

export default function Contact() {
  const { flash, t } = useApp();
  const [sug, setSug] = useState('');
  // ponytail: la sugerencia no se envía a ningún lado todavía; conectar al backend cuando exista
  const send = (e: FormEvent) => { e.preventDefault(); setSug(''); flash(t.thanksSug); };

  return (
    <section className="mp-screen">
      <div className="mp-content mp-container mp-page">
        <div className="mp-stack" style={{ gap: 10 }}>
          <p data-reveal className="mp-kicker">{t.navContact}</p>
          <h1 data-reveal className="mp-title">{t.aboutBrand}</h1>
          <p data-reveal className="mp-lead">{t.studioStatement}</p>
        </div>

        <div className="mp-contact">
          <article data-reveal className="mp-card">
            <h2 className="mp-label">{t.aboutKick}</h2>
            <p className="mp-h3" translate="no">{t.authorName}</p>
            <p style={{ color: 'var(--text-muted)' }}>{t.authorBio}</p>
          </article>

          <article data-reveal className="mp-card">
            <h2 className="mp-label">{t.contactLabel}</h2>
            <a className="mp-mail" href={`mailto:${contactInfo.email}`} translate="no">{contactInfo.email}</a>
            <div className="mp-row" translate="no">
              <a className="btn btn-secondary btn-sm" href={contactInfo.github} target="_blank" rel="noopener noreferrer"><GithubLogo size={18} aria-hidden />GitHub</a>
              <a className="btn btn-secondary btn-sm" href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinLogo size={18} aria-hidden />LinkedIn</a>
            </div>
          </article>

          <form data-reveal className="mp-card mp-span-2" onSubmit={send}>
            <label htmlFor="sug" className="mp-h3">{t.sugLabel}</label>
            <div className="mp-field">
              <input id="sug" name="suggestion" className="mp-input" value={sug} onChange={e => setSug(e.target.value)} placeholder={t.sugPh} autoComplete="off" />
              <button type="submit" className="btn btn-primary" disabled={!sug.trim()}>{t.send}<ArrowRight size={18} weight="bold" aria-hidden /></button>
            </div>
          </form>

          <section data-reveal className="mp-card mp-span-2" id="privacidad">
            <h2 className="mp-label">{t.privacyLabel}</h2>
            <ul className="mp-points">
              {t.privacyPoints.map(p => <li key={p}>{p}</li>)}
            </ul>
            <p className="mp-note">{t.privacyDelete} <a href={`mailto:${contactInfo.email}`} translate="no">{contactInfo.email}</a>. {t.privacyNote}</p>
          </section>

          <Credits />
        </div>
      </div>
    </section>
  );
}
