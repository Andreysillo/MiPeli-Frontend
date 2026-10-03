import { genreName } from '../components/Movie';
import { avoidOptions, companies, runtimeOptions } from '../survey';
import { useApp } from '../store';
import StepHeader from './StepHeader';

// Paso 2: tiempo, compañía y qué evitar. Todo es opcional y tiene valor por defecto. "Evitar" se recuerda para la próxima vez.
export default function ContextStep() {
  const { st, set, t } = useApp();
  const toggleAvoid = (g: string) => set({ avoid: st.avoid.includes(g) ? st.avoid.filter(x => x !== g) : [...st.avoid, g] });

  return (
    <>
      <StepHeader title={t.contextQ} hint={t.contextHint} />
      <div className="mp-stack" style={{ gap: 32, marginTop: 36 }}>
        <div data-reveal className="mp-stack" style={{ gap: 10 }}>
          <span id="time-label" className="mp-kicker">{t.timeLabel}</span>
          <div className="mp-seg" role="group" aria-labelledby="time-label">
            {runtimeOptions.map(min => (
              <button key={min ?? 'any'} aria-pressed={st.maxRuntime === min} onClick={() => set({ maxRuntime: min })}>{t.timeOption(min)}</button>
            ))}
          </div>
        </div>
        <div data-reveal className="mp-stack" style={{ gap: 10 }}>
          <span id="company-label" className="mp-kicker">{t.companyLabel}</span>
          <div className="mp-seg" role="group" aria-labelledby="company-label">
            {companies.map(c => <button key={c} aria-pressed={st.company === c} onClick={() => set({ company: c })}>{t.companyNames[c]}</button>)}
          </div>
        </div>
        <div data-reveal className="mp-stack" style={{ gap: 10 }}>
          <span id="avoid-label" className="mp-kicker">{t.avoidLabel}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} role="group" aria-labelledby="avoid-label">
            {avoidOptions.map(g => (
              <button key={g} className="mp-chip" aria-pressed={st.avoid.includes(g)} onClick={() => toggleAvoid(g)}>{genreName(g, st.lang)}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
