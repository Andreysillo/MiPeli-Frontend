import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./DriftWall.css";

const DEFAULT_ITEMS = Array.from({ length: 15 }, (_, i) => ({ title: `Título ${i + 1}`, year: 2000 + i, rating: (3.8 + (i % 9) * 0.1).toFixed(1) }));

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const columnFactor = (index, variance) => { const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1; return 1 + variance * pseudo; };

const DriftWall = props => {
  const n = (v, d) => { const x = Number(v); return isNaN(x) ? d : x; };
  const b = v => v === true || v === 'true' || v === '' || v === 1 || v === '1';
  const items = Array.isArray(props.items) && props.items.length ? props.items : DEFAULT_ITEMS;
  const columns = n(props.columns, 5);
  const tileWidth = n(props.tileWidth, 150);
  const tileHeight = n(props.tileHeight, 220);
  const gap = n(props.gap, 18);
  const radius = n(props.radius, 14);
  const tilt = n(props.tilt, 16);
  const turn = n(props.turn, -14);
  const roll = n(props.roll, 0);
  const perspective = n(props.perspective, 1200);
  const depth = n(props.depth, 120);
  const speed = n(props.speed, 42);
  const direction = props.direction || 'up';
  const variance = n(props.variance, 0.45);
  const parallax = n(props.parallax, 0.6);
  const pauseOnHover = b(props.pauseOnHover);
  const lift = n(props.lift, 64);
  const fade = n(props.fade, 0.6);
  const dim = n(props.dim, 0.55);
  const grayscale = b(props.grayscale);
  const overlayColor = props.overlayColor || '#0a0a1e';

  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);
  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map(col => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => setContainerHeight(entry.contentRect.height || 600));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => { const altSign = c % 2 === 0 ? 1 : -1; return speed * columnFactor(c, variance) * dirSign * altSign; });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback((px, py) => {
    const plane = planeRef.current;
    if (!plane) return;
    plane.style.transform = `translate(-50%, -50%) scale(1.18) rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`;
  }, [tilt, turn, roll, depth]);

  useEffect(() => {
    const animate = ts => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;
      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;
          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;
          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c]; const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; lastTsRef.current = null; };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id, index) => { activeIdRef.current = id; hoveredColRef.current = index; setActiveId(id); }, []);
  const release = useCallback(() => { activeIdRef.current = null; hoveredColRef.current = -1; setActiveId(null); }, []);

  const handlePointerMove = useCallback(e => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (parallax > 0 && !reduced) {
      pointerRef.current = { x: (e.clientX - rect.left) / rect.width - 0.5, y: (e.clientY - rect.top) / rect.height - 0.5 };
    }
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
    if (!tile) return;
    const id = tile.dataset.tileId;
    if (id === activeIdRef.current) return;
    activeIdRef.current = id;
    hoveredColRef.current = Number(tile.dataset.col);
    setActiveId(id);
  }, [parallax, reduced]);

  const handlePointerLeaveWall = useCallback(() => { wallHoveredRef.current = false; pointerRef.current = { x: 0, y: 0 }; release(); }, [release]);

  const cssVars = {
    '--dw-tile-w': `${tileWidth}px`, '--dw-tile-h': `${tileHeight}px`, '--dw-gap': `${gap}px`, '--dw-radius': `${radius}px`,
    '--dw-perspective': `${perspective}px`, '--dw-lift': `${lift}px`, '--dw-dim': dim, '--dw-gray': grayscale ? 1 : 0,
    '--dw-overlay': overlayColor, '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`, ...props.style
  };

  const renderTile = (item, id, colIndex) => {
    const inner = React.createElement('span', { className: 'drift-wall__inner', style: { background: item.gradient || '#141a3a' } },
      item.image
        ? React.createElement('img', { src: item.image, alt: item.title || '', loading: 'lazy', decoding: 'async', draggable: false })
        : React.createElement('span', { className: 'drift-wall__poster', 'aria-hidden': 'true' }),
      !item.image && React.createElement('span', { className: 'drift-wall__sprocket l', 'aria-hidden': 'true' }),
      !item.image && React.createElement('span', { className: 'drift-wall__sprocket r', 'aria-hidden': 'true' }),
      item.rating && React.createElement('span', { className: 'drift-wall__badge' }, `IMDb ${item.rating}`),
      React.createElement('span', { className: 'drift-wall__meta' },
        React.createElement('span', { className: 'drift-wall__title' }, item.title || 'Película'),
        (item.year || item.subtitle) && React.createElement('span', { className: 'drift-wall__sub' }, item.subtitle || `${item.year}`)
      ),
      React.createElement('span', { className: 'drift-wall__overlay', 'aria-hidden': 'true' })
    );
    const commonProps = { className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`, 'data-tile-id': id, 'data-col': colIndex, onFocus: () => activate(id, colIndex), onBlur: release };
    if (item.href) return React.createElement('a', { key: id, href: item.href, target: '_blank', rel: 'noreferrer noopener', ...commonProps }, inner);
    return React.createElement('div', { key: id, tabIndex: 0, role: 'button', 'aria-label': item.title || 'película', ...commonProps }, inner);
  };

  const rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', props.className || ''].filter(Boolean).join(' ');

  return React.createElement('div', {
    ref: containerRef, className: rootClass, style: cssVars,
    onPointerMove: handlePointerMove, onPointerEnter: () => { wallHoveredRef.current = true; }, onPointerLeave: handlePointerLeaveWall,
    role: 'group', 'aria-label': 'Muro de pósters'
  },
    React.createElement('div', { ref: planeRef, className: 'drift-wall__plane' },
      columnItems.map((col, c) => {
        const meta = columnMeta[c];
        const copies = Array.from({ length: meta.copies });
        return React.createElement('div', { className: 'drift-wall__col', key: `col-${c}` },
          React.createElement('div', { className: 'drift-wall__track', ref: el => (trackRefs.current[c] = el) },
            copies.map((_, copyIndex) => col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c)))
          )
        );
      })
    )
  );
};

export default DriftWall;
