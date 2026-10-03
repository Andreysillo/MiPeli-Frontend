import { useEffect, type RefObject } from 'react';

// Luz que sigue al cursor dentro de cada `.mp-panel` de un contenedor: escribe --mx/--my y el CSS pinta el degradado.
// Solo con mouse; es un refuerzo visual, así que el listener va nativo y los paneles son <button> normales.
export function useSpotlight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      for (const el of root.querySelectorAll<HTMLElement>('.mp-panel')) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    };
    root.addEventListener('pointermove', move);
    return () => root.removeEventListener('pointermove', move);
  }, [ref]);
}
