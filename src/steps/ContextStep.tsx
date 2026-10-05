import type { ReactNode } from 'react';
import { Prohibit, X } from '@phosphor-icons/react';
import { genreName } from '../components/Movie';
import { avoidOptions, companies, runtimeOptions } from '../survey';
import { useApp } from '../store';
import StepHeader from './StepHeader';

type QuestionProps = Readonly<{ id: string; num: string; title: string; hint?: string; icon?: ReactNode; children: ReactNode }>;

// Una pregunta del paso: número, título grande y, debajo, sus opciones
function Question({ id, num, title, hint, icon, children }: QuestionProps) {
  return (
    <section data-reveal className="mp-q" aria-labelledby={id}>
      <div className="mp-q-head">
        <span className="mp-q-num" aria-hidden><span className="mp-mood-slash">/</span> {num}</span>
        <h2 id={id} className="mp-q-title">{icon}{title}</h2>
        {hint && <p className="mp-q-hint">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

// Paso 2: tiempo, compañía y qué evitar. Todo es opcional y tiene valor por defecto. "Evitar" se recuerda para la próxima vez.
// Cada pregunta lleva título grande; en "evitar" lo elegido se tacha y se resume abajo, para que quede claro que son géneros que NO se quieren ver.
export default function ContextStep() {
  const { st, set, t } = useApp();
  const toggleAvoid = (g: string) => set({ avoid: st.avoid.includes(g) ? st.avoid.filter(x => x !== g) : [...st.avoid, g] });
  const avoidNames = st.avoid.map(g => genreName(g, st.lang)).join(', ');

  return (
    <>
      <StepHeader title={t.contextQ} hint={t.contextHint} />
      <div className="mp-stack" style={{ gap: 48, marginTop: 40 }}>
        <Question id="time-label" num="01" title={t.timeLabel}>
          <div className="mp-pills" role="group" aria-labelledby="time-label">
            {runtimeOptions.map(min => (
              <button key={min ?? 'any'} className="mp-pill" aria-pressed={st.maxRuntime === min} onClick={() => set({ maxRuntime: min })}>{t.timeOption(min)}</button>
            ))}
          </div>
        </Question>
        <Question id="company-label" num="02" title={t.companyLabel}>
          <div className="mp-pills" role="group" aria-labelledby="company-label">
            {companies.map(c => <button key={c} className="mp-pill" aria-pressed={st.company === c} onClick={() => set({ company: c })}>{t.companyNames[c]}</button>)}
          </div>
        </Question>
        <Question id="avoid-label" num="03" title={t.avoidLabel} hint={t.avoidHint} icon={<Prohibit className="mp-q-icon" weight="bold" aria-hidden />}>
          <div className="mp-pills mp-pills-avoid" role="group" aria-labelledby="avoid-label">
            {avoidOptions.map(g => {
              const on = st.avoid.includes(g);
              return (
                <button key={g} className="mp-pill" aria-pressed={on} onClick={() => toggleAvoid(g)}>
                  {on && <X size={16} weight="bold" aria-hidden />}
                  <span>{genreName(g, st.lang)}</span>
                </button>
              );
            })}
          </div>
          <p className="mp-q-summary" aria-live="polite">{st.avoid.length > 0 ? t.avoidSome(avoidNames) : t.avoidNone}</p>
        </Question>
      </div>
    </>
  );
}
