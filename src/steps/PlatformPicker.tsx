import { Check } from '@phosphor-icons/react';
import { CINE, platforms, type Platform } from '../data';
import { PlatformLogo, platformName } from '../components/Movie';
import { useApp } from '../store';

const all: Platform[] = [...(Object.keys(platforms) as Platform[]), CINE]; // el cine va al final

// Logos de las plataformas (y el cine) como interruptores. Lo comparten el paso de plataformas y los resultados (donde cambiarlas reordena al instante).
export default function PlatformPicker({ label }: Readonly<{ label: string }>) {
  const { st, set, t } = useApp();
  const toggle = (p: Platform) => set({ ownedPlatforms: st.ownedPlatforms.includes(p) ? st.ownedPlatforms.filter(x => x !== p) : [...st.ownedPlatforms, p] });

  return (
    <div className="mp-plats" role="group" aria-label={label}>
      {all.map(p => (
        <button key={p} className="mp-plat" aria-pressed={st.ownedPlatforms.includes(p)} onClick={() => toggle(p)}>
          <PlatformLogo p={p} />
          <span className="mp-plat-name">{platformName(p, t)}</span>
          <span className="mp-check"><Check size={14} weight="bold" aria-hidden /></span>
        </button>
      ))}
    </div>
  );
}
