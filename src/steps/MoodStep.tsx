import { useRef } from 'react';
import { Check } from '@phosphor-icons/react';
import { MAX_MOODS, moods, type Mood } from '../survey';
import { useSpotlight } from '../useSpotlight';
import { useApp } from '../store';
import StepHeader from './StepHeader';

// Paso 1: una sensación, no un género. Hasta dos mosaicos; al elegir un tercero se suelta el más antiguo.
export default function MoodStep() {
  const { st, set, t, name } = useApp();
  const list = useRef<HTMLDivElement>(null);
  useSpotlight(list);
  const toggle = (key: Mood) => set({ moods: st.moods.includes(key) ? st.moods.filter(k => k !== key) : [...st.moods, key].slice(-MAX_MOODS) });

  return (
    <>
      <StepHeader kicker={t.hi(name)} title={t.moodQ} hint={t.moodHint(MAX_MOODS)} />
      <div ref={list} className="mp-moods" role="group" aria-label={t.moodQ}>
        {moods.map(({ key, Icon }) => (
          <button key={key} data-reveal className="mp-panel mp-pick mp-mood" aria-pressed={st.moods.includes(key)} onClick={() => toggle(key)}>
            <span className="mp-panel-top">
              <span className="mp-icon-tile"><Icon size={22} weight="duotone" aria-hidden /></span>
              <span className="mp-check"><Check size={14} weight="bold" aria-hidden /></span>
            </span>
            <span className="mp-panel-body">
              <span className="mp-panel-title">{t.moodNames[key].name}</span>
              <span className="mp-panel-desc">{t.moodNames[key].hint}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
