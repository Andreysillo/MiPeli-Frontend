import { useState, type FormEvent } from 'react';
import { PaperPlaneRight } from '@phosphor-icons/react';
import LogoLoop from '../components/LogoLoop';
import Button from '../components/Button';
import WavesBg, { interactive } from '../components/WavesBg';
import { socialLogos } from '../data';
import { useApp } from '../store';

export default function Contact() {
  const { flash, t } = useApp();
  const [sug, setSug] = useState('');
  // ponytail: la sugerencia no se envía a ningún lado todavía; conectar al backend cuando exista
  const send = (e: FormEvent) => { e.preventDefault(); setSug(''); flash(t.thanksSug); };

  return (
    <section className="mp-screen" style={{ display: 'grid', placeItems: 'center' }}>
      <WavesBg {...interactive} speed={0.32} />
      <div className="mp-content mp-container mp-page mp-stack" style={{ maxWidth: 520, gap: 12, textAlign: 'center' }}>
        <span data-reveal className="mp-kicker">{t.aboutKick}</span>
        <h1 data-reveal className="mp-title">{t.authorName}</h1>
        <p data-reveal className="mp-lead" style={{ margin: '0 auto' }}>{t.authorBio}</p>
        <div data-reveal style={{ height: 76, position: 'relative', overflow: 'hidden', margin: '20px 0 28px' }}>
          <LogoLoop logos={socialLogos} speed={36} direction="left" logoHeight={40} gap={56} fadeOut fadeOutColor="#07061a" scaleOnHover />
        </div>
        <form data-reveal onSubmit={send} className="mp-stack" style={{ gap: 8, textAlign: 'left' }}>
          <label htmlFor="sug" className="mp-label" style={{ color: 'var(--text-muted)' }}>{t.sugLabel}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input id="sug" value={sug} onChange={e => setSug(e.target.value)} placeholder={t.sugPh} autoComplete="off"
              style={{ flex: 1, minWidth: 0, height: 48, padding: '0 18px', borderRadius: 999, border: '1px solid var(--border-strong)', background: 'rgba(7,6,26,.6)', color: 'var(--text)', font: 'inherit', fontSize: '1rem' }} />
            <Button type="submit" disabled={!sug.trim()} icon={<PaperPlaneRight size={18} weight="bold" aria-hidden />}>{t.send}</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
