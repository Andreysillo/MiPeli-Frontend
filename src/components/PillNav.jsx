import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CSS = `
.pill-nav-container{position:absolute;top:1em;left:50%;transform:translateX(-50%);z-index:99}
.pill-nav{--nav-h:42px;--logo:36px;--pill-pad-x:18px;--pill-gap:3px;width:max-content;display:flex;align-items:center;box-sizing:border-box}
.pill-nav-items{position:relative;display:flex;align-items:center;height:var(--nav-h);background:var(--base,#000);border-radius:9999px}
.pill-logo{width:var(--nav-h);height:var(--nav-h);border-radius:50%;background:var(--base,#000);margin-right:var(--pill-gap);display:inline-flex;align-items:center;justify-content:center;overflow:hidden;text-decoration:none;font-family:var(--font-heading,Georgia),serif;font-size:15px;color:var(--pill-bg,#fff)}
.pill-logo img{width:100%;height:100%;object-fit:cover;display:block}
.pill-list{list-style:none;display:flex;align-items:stretch;gap:var(--pill-gap);margin:0;padding:3px;height:100%}
.pill-list>li{display:flex;height:100%}
.pill{display:inline-flex;align-items:center;justify-content:center;height:100%;padding:0 var(--pill-pad-x);background:var(--pill-bg,#fff);color:var(--pill-text,var(--base,#000));text-decoration:none;border-radius:9999px;box-sizing:border-box;font-weight:600;font-size:14px;line-height:0;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap;cursor:pointer;position:relative;overflow:hidden}
.pill .hover-circle{position:absolute;left:50%;bottom:0;border-radius:50%;background:var(--base,#000);z-index:1;display:block;pointer-events:none;will-change:transform}
.pill .label-stack{position:relative;display:inline-block;line-height:1;z-index:2}
.pill .pill-label{position:relative;z-index:2;display:inline-block;line-height:1;will-change:transform}
.pill .pill-label-hover{position:absolute;left:0;top:0;color:var(--hover-text,#fff);z-index:3;display:inline-block;will-change:transform,opacity}
.pill.is-active::after{content:'';position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:12px;height:12px;background:var(--base,#000);border-radius:50px;z-index:4}
`;

const isExternal = href => !href || href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#');

const PillNav = props => {
  const bool = v => v === true || v === 'true' || v === '' || v === 1 || v === '1';
  const items = Array.isArray(props.items) && props.items.length ? props.items : [{ label: 'Home', href: '#home' }, { label: 'FAQ', href: '#faq' }, { label: 'Contacto', href: '#contacto' }];
  const logo = props.logo;
  const brand = props.brand || 'MP';
  const logoAlt = props.logoAlt || 'Logo';
  const activeHref = props.activeHref;
  const className = props.className || '';
  const ease = props.ease || 'power3.easeOut';
  const baseColor = props.baseColor || '#3a1d7a';
  const pillColor = props.pillColor || '#ffffff';
  const hoveredPillTextColor = props.hoveredPillTextColor || '#ffffff';
  const pillTextColor = props.pillTextColor || '#1b0f45';
  const initialLoadAnimation = props.initialLoadAnimation === undefined ? true : bool(props.initialLoadAnimation);

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById('pillnav-css')) {
      const s = document.createElement('style'); s.id = 'pillnav-css'; s.textContent = CSS; document.head.appendChild(s);
    }
    if (!gsap) return;
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (!w || !h) return;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;
        circle.style.width = `${D}px`; circle.style.height = `${D}px`; circle.style.bottom = `-${delta}px`;
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });
        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');
        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });
        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;
        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        if (white) { gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 }); tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0); }
        tlRefs.current[index] = tl;
      });
    };
    layout();
    const onResize = () => layout();
    window.addEventListener('resize', onResize);
    if (document.fonts?.ready) document.fonts.ready.then(layout).catch(() => {});
    if (initialLoadAnimation) {
      const lg = logoRef.current, ni = navItemsRef.current;
      if (lg) { gsap.set(lg, { scale: 0 }); gsap.to(lg, { scale: 1, duration: 0.6, ease }); }
      if (ni) { gsap.set(ni, { opacity: 0, scale: 0.94, transformOrigin: '0% 50%' }); gsap.to(ni, { opacity: 1, scale: 1, duration: 0.5, ease }); setTimeout(() => { ni.style.opacity = '1'; ni.style.transform = ''; }, 900); }
    }
    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = i => { const tl = tlRefs.current[i]; if (!tl) return; activeTweenRefs.current[i]?.kill(); activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' }); };
  const handleLeave = i => { const tl = tlRefs.current[i]; if (!tl) return; activeTweenRefs.current[i]?.kill(); activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' }); };
  const handleLogoEnter = () => { const img = logoImgRef.current; if (!img || !gsap) return; logoTweenRef.current?.kill(); gsap.set(img, { rotate: 0 }); logoTweenRef.current = gsap.to(img, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' }); };

  const cssVars = { '--base': baseColor, '--pill-bg': pillColor, '--hover-text': hoveredPillTextColor, '--pill-text': pillTextColor, ...props.style };
  const ce = React.createElement;

  return ce('div', { className: 'pill-nav-container' },
    ce('nav', { className: `pill-nav ${className}`.trim(), 'aria-label': 'Primary', style: cssVars },
      ce('a', { className: 'pill-logo', href: props.logoHref || items?.[0]?.href || '#', 'aria-label': 'Home', onMouseEnter: handleLogoEnter, ref: el => { logoRef.current = el; } },
        logo ? ce('img', { src: logo, alt: logoAlt, ref: logoImgRef }) : ce('span', { ref: logoImgRef }, brand)
      ),
      ce('div', { className: 'pill-nav-items', ref: navItemsRef },
        ce('ul', { className: 'pill-list', role: 'menubar' },
          items.map((item, i) => ce('li', { key: item.href || `item-${i}`, role: 'none' },
            ce('a', {
              role: 'menuitem', href: item.href, className: `pill${activeHref === item.href ? ' is-active' : ''}`,
              'aria-label': item.ariaLabel || item.label, onMouseEnter: () => handleEnter(i), onMouseLeave: () => handleLeave(i)
            },
              ce('span', { className: 'hover-circle', 'aria-hidden': 'true', ref: el => { circleRefs.current[i] = el; } }),
              ce('span', { className: 'label-stack' },
                ce('span', { className: 'pill-label' }, item.label),
                ce('span', { className: 'pill-label-hover', 'aria-hidden': 'true' }, item.label)
              )
            )
          ))
        )
      )
    )
  );
};

export default PillNav;
