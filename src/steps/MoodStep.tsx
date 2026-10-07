import { Check } from '@phosphor-icons/react';
import { MAX_MOODS, moods, type Mood } from '../survey';
import { useApp } from '../store';
import StepHeader from './StepHeader';

// Paso 1: una sensación, no un género. Hasta dos tarjetas; al elegir una tercera se suelta la más antigua.
// Estilo de nk.studio/impact: nombre grande arriba, índice "/ 01", descripción abajo; al pasar el mouse (o elegida) la tarjeta se invierte a clara.
export default function MoodStep() {
  const { st, set, t } = useApp();
  const toggle = (key: Mood) => set({ moods: st.moods.includes(key) ? st.moods.filter(k => k !== key) : [...st.moods, key].slice(-MAX_MOODS) });

  return (
    <>
      <StepHeader title={t.moodQ} hint={t.moodHint(MAX_MOODS)} />
      <div className="mp-moods" role="group" aria-label={t.moodQ}>
        {moods.map(({ key, Icon }, i) => {
          const on = st.moods.includes(key);
          return (
            <button key={key} data-reveal className="mp-mood" aria-pressed={on} onClick={() => toggle(key)}>
              <span className="mp-mood-head">
                <span className="mp-mood-name">{t.moodNames[key].name}</span>
                <span className="mp-mood-kick" aria-hidden><span className="mp-mood-slash">/</span> {String(i + 1).padStart(2, '0')}</span>
              </span>
              <span className="mp-mood-cta" aria-hidden>
                <span className="mp-mood-dot">{on ? <Check size={18} weight="bold" /> : <Icon size={20} weight="duotone" />}</span>
                <span className="mp-mood-label">{on ? t.moodPicked : t.moodPick}</span>
              </span>
              <span className="mp-mood-hint">{t.moodNames[key].hint}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
