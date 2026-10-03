import { Check } from '@phosphor-icons/react';
import { platforms, type Platform } from '../data';
import { useApp } from '../store';

const all = Object.keys(platforms) as Platform[];

// Logos de las plataformas como interruptores. Lo comparten el paso de plataformas y los resultados (donde cambiarlas reordena al instante).
export default function PlatformPicker({ label }: Readonly<{ label: string }>) {
  const { st, set } = useApp();
  const toggle = (p: Platform) => set({ ownedPlatforms: st.ownedPlatforms.includes(p) ? st.ownedPlatforms.filter(x => x !== p) : [...st.ownedPlatforms, p] });

  return (
    <div className="mp-plats" role="group" aria-label={label}>
      {all.map(p => (
        <button key={p} className="mp-plat" aria-pressed={st.ownedPlatforms.includes(p)} onClick={() => toggle(p)}>
          <img className="mp-platform-logo" src={platforms[p].logo} alt="" height={38} draggable={false} />
          <span>{p}</span>
          <span className="mp-check"><Check size={14} weight="bold" aria-hidden /></span>
        </button>
      ))}
    </div>
  );
}
