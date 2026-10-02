import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
const ce = React.createElement;

const ANIMATION_CONFIG = { SMOOTH_TAU: 0.25, MIN_COPIES: 2, COPY_HEADROOM: 2 };
const toCssLength = (v) => (typeof v === 'number' ? v + 'px' : (v ?? undefined));

const LL_CSS = `
.logoloop{position:relative;--logoloop-gap:32px;--logoloop-logoHeight:28px;--logoloop-fadeColorAuto:#ffffff}
.logoloop--vertical{height:100%;display:inline-block}
.logoloop--scale-hover{padding-top:calc(var(--logoloop-logoHeight)*0.1);padding-bottom:calc(var(--logoloop-logoHeight)*0.1)}
.logoloop__track{display:flex;width:max-content;will-change:transform;user-select:none;position:relative;z-index:0}
.logoloop--vertical .logoloop__track{flex-direction:column;height:max-content;width:100%}
.logoloop__list{display:flex;align-items:center;list-style:none;margin:0;padding:0}
.logoloop--vertical .logoloop__list{flex-direction:column}
.logoloop__item{flex:0 0 auto;margin-right:var(--logoloop-gap);font-size:var(--logoloop-logoHeight);line-height:1;list-style:none}
.logoloop--vertical .logoloop__item{margin-right:0;margin-bottom:var(--logoloop-gap)}
.logoloop__item:last-child{margin-right:var(--logoloop-gap)}
.logoloop--vertical .logoloop__item:last-child{margin-right:0;margin-bottom:var(--logoloop-gap)}
.logoloop__node{display:inline-flex;align-items:center}
.logoloop__item img{height:var(--logoloop-logoHeight);width:auto;display:block;object-fit:contain;-webkit-user-drag:none;pointer-events:none;transition:transform .3s cubic-bezier(.4,0,.2,1)}
.logoloop--scale-hover .logoloop__item{overflow:visible}
.logoloop--scale-hover .logoloop__item:hover img,.logoloop--scale-hover .logoloop__item:hover .logoloop__node{transform:scale(1.2);transform-origin:center center}
.logoloop--scale-hover .logoloop__node{transition:transform .3s cubic-bezier(.4,0,.2,1)}
.logoloop__link{display:inline-flex;align-items:center;text-decoration:none;border-radius:4px;transition:opacity .2s ease}
.logoloop__link:hover{opacity:.8}
.logoloop__link:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.logoloop--fade{-webkit-mask-image:linear-gradient(to right,transparent 0,#000 clamp(24px,8%,120px),#000 calc(100% - clamp(24px,8%,120px)),transparent 100%);mask-image:linear-gradient(to right,transparent 0,#000 clamp(24px,8%,120px),#000 calc(100% - clamp(24px,8%,120px)),transparent 100%)}
.logoloop--vertical.logoloop--fade{-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 clamp(24px,8%,120px),#000 calc(100% - clamp(24px,8%,120px)),transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 clamp(24px,8%,120px),#000 calc(100% - clamp(24px,8%,120px)),transparent 100%)}
`;
if (typeof document !== 'undefined' && !document.getElementById('logoloop-css')) {
  const s = document.createElement('style'); s.id = 'logoloop-css'; s.textContent = LL_CSS; document.head.appendChild(s);
}

function useResizeObserver(callback, elements, dependencies) {
  useEffect(() => {
    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }
    const observers = elements.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(callback);
      observer.observe(ref.current);
      return observer;
    });
    callback();
    return () => observers.forEach((o) => o && o.disconnect());
  }, [callback, elements, dependencies]);
}

function useImageLoader(seqRef, onLoad, dependencies) {
  useEffect(() => {
    const images = seqRef.current ? seqRef.current.querySelectorAll('img') : [];
    if (!images.length) { onLoad(); return; }
    let remaining = images.length;
    const onOne = () => { remaining -= 1; if (remaining === 0) onLoad(); };
    images.forEach((img) => {
      if (img.complete) onOne();
      else { img.addEventListener('load', onOne, { once: true }); img.addEventListener('error', onOne, { once: true }); }
    });
    return () => images.forEach((img) => { img.removeEventListener('load', onOne); img.removeEventListener('error', onOne); });
  }, [onLoad, seqRef, dependencies]);
}

function useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical) {
  const rafRef = useRef(null);
  const lastRef = useRef(null);
  const offsetRef = useRef(0);
  const velRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const seqSize = isVertical ? seqHeight : seqWidth;

    if (seqSize > 0) {
      offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
      track.style.transform = isVertical ? `translate3d(0, ${-offsetRef.current}px, 0)` : `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    const animate = (ts) => {
      if (lastRef.current === null) lastRef.current = ts;
      const dt = Math.max(0, ts - lastRef.current) / 1000;
      lastRef.current = ts;
      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const ease = 1 - Math.exp(-dt / ANIMATION_CONFIG.SMOOTH_TAU);
      velRef.current += (target - velRef.current) * ease;
      if (seqSize > 0) {
        let next = offsetRef.current + velRef.current * dt;
        next = ((next % seqSize) + seqSize) % seqSize;
        offsetRef.current = next;
        track.style.transform = isVertical ? `translate3d(0, ${-offsetRef.current}px, 0)` : `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, [targetVelocity, seqWidth, seqHeight, isHovered, hoverSpeed, isVertical, trackRef]);
}

function LogoLoop({
  logos,
  speed = 120,
  direction = 'left',
  width = '100%',
  logoHeight = 28,
  gap = 32,
  pauseOnHover = undefined,
  hoverSpeed = undefined,
  fadeOut = false,
  fadeOutColor = /** @type {any} */ (undefined),
  scaleOnHover = false,
  renderItem = undefined,
  ariaLabel = 'Partner logos',
  className = undefined,
  style = undefined
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [copyCount, setCopyCount] = useState(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    if (pauseOnHover === true) return 0;
    if (pauseOnHover === false) return undefined;
    return 0;
  }, [hoverSpeed, pauseOnHover]);

  const isVertical = direction === 'up' || direction === 'down';

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const dirMul = isVertical ? (direction === 'up' ? 1 : -1) : (direction === 'left' ? 1 : -1);
    const speedMul = speed < 0 ? -1 : 1;
    return magnitude * dirMul * speedMul;
  }, [speed, direction, isVertical]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current ? containerRef.current.clientWidth : 0;
    const rect = seqRef.current && seqRef.current.getBoundingClientRect ? seqRef.current.getBoundingClientRect() : null;
    const seqW = rect ? rect.width : 0;
    const seqH = rect ? rect.height : 0;
    if (isVertical) {
      const parentH = containerRef.current && containerRef.current.parentElement ? containerRef.current.parentElement.clientHeight : 0;
      if (containerRef.current && parentH > 0) {
        const targetH = Math.ceil(parentH);
        if (containerRef.current.style.height !== targetH + 'px') containerRef.current.style.height = targetH + 'px';
      }
      if (seqH > 0) {
        setSeqHeight(Math.ceil(seqH));
        const viewport = (containerRef.current ? containerRef.current.clientHeight : 0) || parentH || seqH;
        const copies = Math.ceil(viewport / seqH) + ANIMATION_CONFIG.COPY_HEADROOM;
        setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copies));
      }
    } else if (seqW > 0) {
      setSeqWidth(Math.ceil(seqW));
      const copies = Math.ceil(containerWidth / seqW) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copies));
    }
  }, [isVertical]);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight, isVertical]);
  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight, isVertical]);
  useAnimationLoop(trackRef, targetVelocity, seqWidth, seqHeight, isHovered, effectiveHoverSpeed, isVertical);

  const cssVariables = useMemo(() => Object.assign(
    { '--logoloop-gap': gap + 'px', '--logoloop-logoHeight': logoHeight + 'px' },
    fadeOutColor ? { '--logoloop-fadeColor': fadeOutColor } : {}
  ), [gap, logoHeight, fadeOutColor]);

  const rootClassName = useMemo(() => ['logoloop', isVertical ? 'logoloop--vertical' : 'logoloop--horizontal', fadeOut && 'logoloop--fade', scaleOnHover && 'logoloop--scale-hover', className].filter(Boolean).join(' '), [isVertical, fadeOut, scaleOnHover, className]);

  const handleMouseEnter = useCallback(() => { if (effectiveHoverSpeed !== undefined) setIsHovered(true); }, [effectiveHoverSpeed]);
  const handleMouseLeave = useCallback(() => { if (effectiveHoverSpeed !== undefined) setIsHovered(false); }, [effectiveHoverSpeed]);

  const renderLogoItem = useCallback((item, key) => {
    if (renderItem) return ce('li', { className: 'logoloop__item', key, role: 'listitem' }, renderItem(item, key));
    const isNode = 'node' in item;
    const content = isNode
      ? ce('span', { className: 'logoloop__node', 'aria-hidden': !!item.href && !item.ariaLabel }, item.node)
      : ce('img', { src: item.src, srcSet: item.srcSet, sizes: item.sizes, width: item.width, height: item.height, alt: item.alt || '', title: item.title, loading: 'lazy', decoding: 'async', draggable: false });
    const label = isNode ? (item.ariaLabel || item.title) : (item.alt || item.title);
    const itemContent = item.href
      ? ce('a', { className: 'logoloop__link', href: item.href, 'aria-label': label || 'logo link', target: '_blank', rel: 'noreferrer noopener' }, content)
      : content;
    return ce('li', { className: 'logoloop__item', key, role: 'listitem' }, itemContent);
  }, [renderItem]);

  const logoLists = useMemo(() => Array.from({ length: copyCount }, (_, ci) =>
    ce('ul', { className: 'logoloop__list', key: 'copy-' + ci, role: 'list', 'aria-hidden': ci > 0, ref: ci === 0 ? seqRef : undefined },
      logos.map((item, ii) => renderLogoItem(item, ci + '-' + ii))
    )
  ), [copyCount, logos, renderLogoItem]);

  const containerStyle = useMemo(() => Object.assign(
    { width: isVertical ? (toCssLength(width) === '100%' ? undefined : toCssLength(width)) : (toCssLength(width) || '100%') },
    cssVariables, style
  ), [width, cssVariables, style, isVertical]);

  return ce('div', { ref: containerRef, className: rootClassName, style: containerStyle, role: 'region', 'aria-label': ariaLabel },
    ce('div', { className: 'logoloop__track', ref: trackRef, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, logoLists)
  );
}

export default LogoLoop;
