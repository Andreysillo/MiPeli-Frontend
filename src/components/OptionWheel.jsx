import React, { useRef, useState, useCallback, useEffect } from "react";

const CSS = `
.option-wheel{--ow-text-color:#a6a6a6;--ow-active-color:#fff;--ow-font-size:3rem;--ow-inset:80px;position:relative;width:100%;height:100%;overflow:hidden;cursor:grab;user-select:none;touch-action:none;outline:none}
.option-wheel--dragging{cursor:grabbing}
.option-wheel__item{position:absolute;top:50%;left:var(--ow-inset);white-space:nowrap;font-size:var(--ow-font-size);line-height:1;font-weight:200;transform-origin:left center;cursor:pointer;will-change:transform,opacity,filter;color:color-mix(in srgb,var(--ow-active-color) calc(var(--ow-p,0) * 100%),var(--ow-text-color))}
.option-wheel--right .option-wheel__item{left:auto;right:var(--ow-inset);transform-origin:right center}
.option-wheel__item--selected{font-weight:500}
`;

const DEFAULT_ITEMS = ['Thriller','Drama','Noir','Ciencia ficción','Terror','Comedia','Romance','Animación'];

const OptionWheel = props => {
  const n = (v, d) => { const x = Number(v); return isNaN(x) ? d : x; };
  const bool = v => v === undefined ? undefined : (v === true || v === 'true' || v === '' || v === 1 || v === '1');
  const items = Array.isArray(props.items) && props.items.length ? props.items : DEFAULT_ITEMS;
  const defaultSelected = n(props.defaultSelected, 3);
  const onChange = props.onChange;
  const textColor = props.textColor || '#a6a6a6';
  const activeColor = props.activeColor || '#ffffff';
  const side = props.side || 'left';
  const fontSize = n(props.fontSize, 3);
  const spacing = n(props.spacing, 1.4);
  const curve = n(props.curve, 1);
  const tilt = n(props.tilt, 6);
  const blur = n(props.blur, 2);
  const fade = n(props.fade, 0.25);
  const minOpacity = n(props.minOpacity, 0.05);
  const smoothing = n(props.smoothing, 200);
  const inset = n(props.inset, 80);
  const loop = bool(props.loop) ?? false;
  const draggable = bool(props.draggable) ?? true;
  const soundUrl = props.soundUrl || '';
  const soundVolume = n(props.soundVolume, 0.5);
  const className = props.className || '';

  const rootRef = useRef(null);
  const itemRefs = useRef([]);
  const posRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const rafRef = useRef(null);
  const lastRef = useRef(0);
  const cfgRef = useRef({});
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef(null);
  const dragRef = useRef(null);
  const dragMovedRef = useRef(false);
  const audioRef = useRef(null);
  const audioUrlRef = useRef('');
  const lastTickRef = useRef(0);
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  const remPx = typeof window !== 'undefined' ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16;
  onChangeRef.current = onChange;
  cfgRef.current = { count: items.length, items, rowH: Math.max(fontSize * spacing * remPx, 1), curve, tilt, blur, fade, minOpacity, side, loop, smoothing, draggable, soundUrl, soundVolume };

  useEffect(() => {
    if (document.getElementById('optionwheel-css')) return;
    const s = document.createElement('style'); s.id = 'optionwheel-css'; s.textContent = CSS; document.head.appendChild(s);
  }, []);

  const runFrame = useCallback(now => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const cfg = cfgRef.current;
    const tau = Math.max(cfg.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);
    const target = targetRef.current;
    const cur = posRef.current;
    let next = cur + (target - cur) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    posRef.current = next;
    const els = itemRefs.current;
    const cnt = cfg.count;
    const mirror = cfg.side === 'right' ? -1 : 1;
    const tiltRad = (cfg.tilt * Math.PI) / 180;
    const R = tiltRad > 0.0005 ? cfg.rowH / tiltRad : 0;
    for (let i = 0; i < cnt; i++) {
      const el = els[i];
      if (!el) continue;
      let d = i - next;
      if (cfg.loop && cnt > 1) { d = ((d % cnt) + cnt) % cnt; if (d > cnt / 2) d -= cnt; }
      const dist = Math.abs(d);
      let x = 0, y = d * cfg.rowH, rot = 0;
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        x = -mirror * R * (1 - Math.cos(ang)) * cfg.curve;
        rot = (mirror * ang * 180) / Math.PI;
      }
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
      el.style.opacity = String(Math.max(cfg.minOpacity, 1 - dist * cfg.fade));
      el.style.filter = cfg.blur > 0 ? `blur(${(dist * cfg.blur).toFixed(2)}px)` : 'none';
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
    }
    rafRef.current = settled ? null : requestAnimationFrame(runFrame);
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    lastRef.current = performance.now();
    // Run the first frame synchronously so items get positioned immediately even if
    // requestAnimationFrame is throttled (e.g. a backgrounded/hidden tab or iframe).
    runFrame(lastRef.current);
  }, [runFrame]);

  const playTick = useCallback(() => {
    const { soundUrl, soundVolume } = cfgRef.current;
    if (!soundUrl) return;
    const now = performance.now();
    if (now - lastTickRef.current < 70) return;
    lastTickRef.current = now;
    if (!audioRef.current || audioUrlRef.current !== soundUrl) {
      audioRef.current = new Audio(soundUrl); audioRef.current.preload = 'auto'; audioUrlRef.current = soundUrl;
    }
    const audio = audioRef.current;
    audio.volume = Math.min(Math.max(soundVolume, 0), 1);
    audio.currentTime = 0;
    audio.play()?.catch(() => {});
  }, []);

  const applyTarget = useCallback((value, snap) => {
    const cfg = cfgRef.current;
    let v = value;
    if (!cfg.loop) v = Math.min(Math.max(v, 0), Math.max(cfg.count - 1, 0));
    if (snap) v = Math.round(v);
    targetRef.current = v;
    const idx = ((Math.round(v) % cfg.count) + cfg.count) % cfg.count;
    if (idx !== selectedRef.current) {
      selectedRef.current = idx; setSelectedIndex(idx);
      onChangeRef.current?.(idx, cfg.items[idx]); playTick();
    }
    startLoop();
  }, [startLoop, playTick]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = e => {
      e.preventDefault();
      const cfg = cfgRef.current;
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      const step = Math.max(-1, Math.min(1, delta / cfg.rowH));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => applyTarget(targetRef.current, true), 140);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { el.removeEventListener('wheel', onWheel); if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current); };
  }, [applyTarget]);

  const handlePointerDown = useCallback(e => {
    if (!cfgRef.current.draggable) return;
    dragRef.current = { y: e.clientY, start: targetRef.current, id: e.pointerId };
    dragMovedRef.current = false; setIsDragging(true);
  }, []);
  const handlePointerMove = useCallback(e => {
    const drag = dragRef.current;
    if (!drag) return;
    const dy = e.clientY - drag.y;
    if (!dragMovedRef.current && Math.abs(dy) > 4) { dragMovedRef.current = true; rootRef.current?.setPointerCapture(drag.id); }
    if (dragMovedRef.current) applyTarget(drag.start - dy / cfgRef.current.rowH, false);
  }, [applyTarget]);
  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null; setIsDragging(false);
    if (dragMovedRef.current) applyTarget(targetRef.current, true);
  }, [applyTarget]);
  const handleItemClick = useCallback(index => {
    if (dragMovedRef.current) return;
    const cfg = cfgRef.current;
    const cur = targetRef.current;
    let d = index - (((cur % cfg.count) + cfg.count) % cfg.count);
    if (cfg.loop && cfg.count > 1) { if (d > cfg.count / 2) d -= cfg.count; else if (d < -cfg.count / 2) d += cfg.count; }
    applyTarget(cur + d, true);
  }, [applyTarget]);
  const handleKeyDown = useCallback(e => {
    let delta = null;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
    if (delta == null) return;
    e.preventDefault();
    applyTarget(Math.round(targetRef.current) + delta, true);
  }, [applyTarget]);

  useEffect(() => { applyTarget(targetRef.current, false); }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, applyTarget]);
  useEffect(() => () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); rafRef.current = null; audioRef.current?.pause(); }, []);

  return React.createElement('div', {
    ref: rootRef, role: 'listbox', tabIndex: 0, 'aria-label': 'Rueda de opciones',
    className: `option-wheel${side === 'right' ? ' option-wheel--right' : ''}${isDragging ? ' option-wheel--dragging' : ''}${className ? ` ${className}` : ''}`,
    style: { '--ow-text-color': textColor, '--ow-active-color': activeColor, '--ow-font-size': `${fontSize}rem`, '--ow-inset': `${inset}px`, ...props.style },
    onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: handlePointerEnd, onPointerCancel: handlePointerEnd, onKeyDown: handleKeyDown
  },
    items.map((label, index) => React.createElement('div', {
      key: `${label}-${index}`,
      ref: el => { itemRefs.current[index] = el; },
      role: 'option', 'aria-selected': selectedIndex === index,
      className: `option-wheel__item${selectedIndex === index ? ' option-wheel__item--selected' : ''}`,
      onClick: () => handleItemClick(index)
    }, label))
  );
};

export default OptionWheel;
