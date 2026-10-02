import React, { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
const ce = React.createElement;

const ST_CSS = `
.split-parent{display:inline-block;overflow:hidden;white-space:normal;word-wrap:break-word;will-change:transform,opacity}
.split-char,.split-word,.split-line{display:inline-block;will-change:transform,opacity}
.split-line{display:block}
`;
if (typeof document !== 'undefined' && !document.getElementById('splittext-css')) {
  const s = document.createElement('style'); s.id = 'splittext-css'; s.textContent = ST_CSS; document.head.appendChild(s);
}

function splitNodes(text, splitType) {
  const parts = String(text).split(/(\s+)/);
  if (splitType.includes('chars')) {
    let idx = 0;
    return parts.map((w, wi) => {
      if (/^\s+$/.test(w)) return w;
      const chars = w.split('').map((ch) => { idx += 1; return ce('span', { key: 'c' + idx, className: 'split-char' }, ch); });
      return ce('span', { key: 'w' + wi, className: 'split-word', style: { whiteSpace: 'nowrap' } }, chars);
    });
  }
  if (splitType.includes('words')) {
    return parts.map((w, wi) => (/^\s+$/.test(w) ? w : ce('span', { key: 'w' + wi, className: 'split-word' }, w)));
  }
  return String(text).split('\n').map((line, li) => ce('span', { key: 'l' + li, className: 'split-line' }, line));
}

function SplitText({
  text = '',
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete = undefined
}) {
  const ref = useRef(null);
  const doneRef = useRef(false);
  const tweenRef = useRef(null);

  const nodes = useMemo(() => splitNodes(text, splitType), [text, splitType]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !text) return;
    doneRef.current = false;
    const sel = splitType.includes('chars') ? '.split-char' : splitType.includes('words') ? '.split-word' : '.split-line';
    const targets = el.querySelectorAll(sel);
    if (!targets.length) return;

    gsap.set(targets, from);

    const play = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      if (tweenRef.current) tweenRef.current.kill();
      tweenRef.current = gsap.to(targets, Object.assign({}, to, {
        duration, ease, stagger: delay / 1000,
        onComplete: () => { if (onLetterAnimationComplete) onLetterAnimationComplete(); }
      }));
    };

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { play(); io.disconnect(); }
    }, { threshold, rootMargin });
    io.observe(el);

    return () => { io.disconnect(); if (tweenRef.current) tweenRef.current.kill(); };
  }, [nodes, delay, duration, ease, splitType, threshold, rootMargin, text]);

  const Tag = tag || 'p';
  return ce(Tag, {
    ref,
    className: ('split-parent ' + className).trim(),
    style: { textAlign, overflow: 'hidden', display: 'inline-block', whiteSpace: 'normal', wordWrap: 'break-word', willChange: 'transform, opacity' }
  }, nodes);
}

export default SplitText;
