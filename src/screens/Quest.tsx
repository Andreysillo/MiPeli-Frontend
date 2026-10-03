import { ArrowCounterClockwise, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import Ambient from '../components/Ambient';
import Button from '../components/Button';
import Reveal from '../components/Reveal';
import ContextStep from '../steps/ContextStep';
import DuelStep from '../steps/DuelStep';
import FavoritesStep from '../steps/FavoritesStep';
import MoodStep from '../steps/MoodStep';
import PlatformsStep from '../steps/PlatformsStep';
import { buildSteps, type Step } from '../survey';
import { useApp } from '../store';

const stepClass = (i: number, current: number) => {
  if (i < current) return 'done';
  return i === current ? 'current' : '';
};

function Stepper({ steps }: Readonly<{ steps: Step[] }>) {
  const { st, set, t } = useApp();
  const label = t.stepOf(st.qi + 1, steps.length);
  return (
    <div className="mp-stack" style={{ gap: 12 }}>
      <div className="mp-step-head">
        <span className="mp-kicker tnum">{label}<span className="mp-mobile-only"> · {t.stepNames[steps[st.qi]]}</span></span>
        <button className="mp-restart" onClick={() => set({ confirm: 'restart' })}><ArrowCounterClockwise size={14} weight="bold" aria-hidden />{t.restart}</button>
      </div>
      <nav aria-label={label}>
        <ol className="mp-steps">
          {steps.map((step, i) => (
            <li key={step} className={stepClass(i, st.qi)}>
              <button disabled={i > st.qi} aria-current={i === st.qi ? 'step' : undefined} onClick={() => set({ qi: i })}>
                <span className="bar" /><span className="label">{t.stepNames[step]}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

// La encuesta: ánimo → contexto → duelos → favoritas (→ plataformas la primera vez). Una pantalla por paso, ~1 minuto en total.
export default function Quest() {
  const { st, set, t } = useApp();
  const steps = st.questSteps.length ? st.questSteps : buildSteps(st.ownedPlatforms);
  const qi = Math.min(st.qi, steps.length - 1);
  const kind = steps[qi];
  const isLast = qi >= steps.length - 1;
  const next = () => set(isLast ? { screen: 'loading', questActive: false } : { qi: qi + 1 });
  // El ánimo es la única pregunta obligatoria; en las opcionales sin respuesta el botón dice "Omitir"
  let nextLabel = t.next;
  if (isLast) nextLabel = t.seeResult;
  else if (kind === 'favorites' && st.liked.length === 0) nextLabel = t.skip;

  return (
    <section className="mp-screen">
      <Ambient />
      <div className="mp-content mp-container mp-wide mp-page mp-flow">
        <Stepper steps={steps} />
        <Reveal key={kind + (kind === 'duel' ? st.duelIdx : '')} style={{ marginTop: 36 }}>
          {kind === 'mood' && <MoodStep />}
          {kind === 'context' && <ContextStep />}
          {kind === 'duel' && <DuelStep onDone={next} />}
          {kind === 'favorites' && <FavoritesStep />}
          {kind === 'platforms' && <PlatformsStep />}
        </Reveal>

        <div className="mp-actionbar" style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          {qi > 0 ? <Button variant="secondary" icon={<ArrowLeft size={18} aria-hidden />} onClick={() => set({ qi: qi - 1 })}>{t.back}</Button> : <span />}
          <Button disabled={kind === 'mood' && st.moods.length === 0} onClick={next}>{nextLabel}<ArrowRight size={18} weight="bold" aria-hidden /></Button>
        </div>
      </div>
    </section>
  );
}
