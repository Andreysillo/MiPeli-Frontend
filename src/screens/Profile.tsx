import { useState } from 'react';
import { ArrowRight, FolderOpen, SignOut, Trash } from '@phosphor-icons/react';
import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import { catalog, poster } from '../data';
import type { Run } from '../history';
import { useApp } from '../store';

const MAX_THUMBS = 5;
const askIcon = { deleteRun: Trash, openRun: FolderOpen };

type Ask = { kind: keyof typeof askIcon; id: string };

// Una encuesta guardada: cuándo se hizo, con qué ánimo, una muestra de lo que salió y sus dos acciones
function RunCard({ run, onOpen, onDelete }: Readonly<{ run: Run; onOpen: () => void; onDelete: () => void }>) {
  const { st, t } = useApp();
  const { answers } = run;
  const date = new Intl.DateTimeFormat(st.lang, { dateStyle: 'medium', timeStyle: 'short' }).format(run.at);
  const meta = [t.runMovies(run.titles.length), t.companyNames[answers.company], answers.maxRuntime ? t.timeOption(answers.maxRuntime) : null].filter(Boolean).join(' · ');
  // Las que ya no estén en el catálogo se saltan
  const thumbs = run.titles.slice(0, MAX_THUMBS).flatMap(title => catalog.find(m => m.title === title) ?? []);
  return (
    <li data-reveal className="mp-card mp-run">
      <div className="mp-run-thumbs" aria-hidden>
        {thumbs.map(m => <img key={m.title} src={poster(m)} alt="" width={400} height={600} loading="lazy" />)}
      </div>
      <div className="mp-stack" style={{ gap: 6, minWidth: 0 }}>
        <p className="mp-kicker tnum">{date}</p>
        <h3 className="mp-h3">{answers.moods.map(k => t.moodNames[k].name).join(' · ')}</h3>
        <p className="mp-label">{meta}</p>
      </div>
      <div className="mp-run-actions">
        <Button variant="secondary" size="sm" icon={<ArrowRight size={18} aria-hidden />} onClick={onOpen} aria-label={`${t.runOpen}, ${date}`}>{t.runOpen}</Button>
        <Button variant="ghost" size="sm" icon={<Trash size={18} aria-hidden />} onClick={onDelete} aria-label={`${t.runDelete}, ${date}`}>{t.runDelete}</Button>
      </div>
    </li>
  );
}

// Mi perfil: las encuestas guardadas de la cuenta (para volver a ver sus recomendaciones) y cerrar sesión
export default function Profile() {
  const { st, set, startSurvey, openRun, deleteRun, t } = useApp();
  const [ask, setAsk] = useState<Ask | null>(null);
  const who = st.user || null;
  const modal = ask && { ...t.runConfirm[ask.kind], Icon: askIcon[ask.kind] };

  // Abrir una guardada pisa las respuestas de la encuesta a medias: antes se pregunta
  const open = (id: string) => {
    if (st.questActive) setAsk({ kind: 'openRun', id });
    else openRun(id);
  };
  const accept = () => {
    if (ask?.kind === 'openRun') openRun(ask.id);
    else if (ask) deleteRun(ask.id);
    setAsk(null);
  };

  // Firebase aún no dijo si hay sesión (o ya la hay y faltan sus datos): solo el título, para no mostrar "inicia sesión" a quien sí la tiene
  if (!st.authReady || (st.loggedIn && !st.uid)) {
    return (
      <section className="mp-screen">
        <div className="mp-content mp-container mp-page"><h1 className="mp-title">{t.myProfile}</h1></div>
      </section>
    );
  }

  // Sin sesión no hay perfil: se explica qué se gana y se vuelve aquí después de entrar
  if (!st.loggedIn) {
    return (
      <section className="mp-screen">
        <div className="mp-content mp-container mp-page mp-stack mp-narrow" style={{ gap: 20 }}>
          <h1 data-reveal className="mp-title">{t.saveTitle}</h1>
          <p data-reveal className="mp-lead">{t.saveText}</p>
          <div data-reveal><Button onClick={() => set({ returnTo: 'profile', screen: 'login' })}>{t.saveCta}<ArrowRight size={18} weight="bold" aria-hidden /></Button></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mp-screen">
      <div className="mp-content mp-container mp-page mp-stack" style={{ gap: 40 }}>
        <div className="mp-stack" style={{ gap: 10 }}>
          <p data-reveal className="mp-kicker">{t.accountKick}</p>
          <h1 data-reveal className="mp-title">{t.hi(st.user)}</h1>
          {st.email && <p data-reveal className="mp-lead" translate="no">{st.email}</p>}
        </div>

        <div className="mp-stack" style={{ gap: 16 }}>
          <div data-reveal className="mp-stack" style={{ gap: 6 }}>
            <h2 className="mp-h3">{t.myRuns}</h2>
            <p className="mp-label">{t.runsHint}</p>
          </div>
          {st.runs.length > 0 ? (
            <ul className="mp-runs">
              {st.runs.map(run => <RunCard key={run.id} run={run} onOpen={() => open(run.id)} onDelete={() => setAsk({ kind: 'deleteRun', id: run.id })} />)}
            </ul>
          ) : (
            <div data-reveal className="mp-card mp-stack" style={{ padding: 24, gap: 12, alignItems: 'flex-start' }}>
              <p className="mp-h3">{t.runsEmpty}</p>
              <p className="mp-label">{t.runsEmptyHint}</p>
              <Button variant="secondary" onClick={startSurvey}>{t.runStart}</Button>
            </div>
          )}
        </div>

        <div data-reveal className="mp-card mp-stack" style={{ padding: 24, gap: 12, alignItems: 'flex-start' }}>
          <h2 className="mp-h3">{t.accountLabel}</h2>
          <Button variant="secondary" size="sm" icon={<SignOut size={18} aria-hidden />} onClick={() => set({ confirm: 'signout' })}>{t.signOut}</Button>
        </div>
      </div>

      {modal && (
        <ConfirmDialog icon={<modal.Icon size={22} weight="duotone" aria-hidden />} title={modal.title(who)} text={modal.text}
          confirmLabel={modal.ok} cancelLabel={modal.cancel} onConfirm={accept} onCancel={() => setAsk(null)} />
      )}
    </section>
  );
}
