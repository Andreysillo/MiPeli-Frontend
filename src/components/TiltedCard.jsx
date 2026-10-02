import React, { useRef, useState, useEffect } from "react";

const CSS = `
.tilted-card-figure{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;perspective:900px;margin:0}
.tilted-card-inner{position:relative;transform-style:preserve-3d;transition:transform .12s cubic-bezier(.2,.7,.2,1);will-change:transform;border-radius:18px}
.tilted-card-surface{position:absolute;inset:0;border-radius:18px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.14)}
.tilted-card-surface img{width:100%;height:100%;object-fit:cover;display:block}
.tilted-card-poster{position:absolute;inset:0;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.1) 0 9px,transparent 9px 18px)}
.tilted-card-overlay{position:absolute;left:0;right:0;bottom:0;z-index:2;transform:translateZ(40px);padding:18px;background:linear-gradient(to top,rgba(0,0,0,.72),transparent);border-radius:0 0 18px 18px}
.tilted-card-caption{pointer-events:none;position:absolute;left:0;top:0;border-radius:6px;background:#fff;padding:4px 10px;font:600 11px ui-monospace,monospace;color:#1b0f45;opacity:0;z-index:3;transition:opacity .2s ease;white-space:nowrap;box-shadow:0 8px 20px rgba(0,0,0,.35)}
`;
if (typeof document !== 'undefined' && !document.getElementById('tiltedcard-css')) {
  const s = document.createElement('style'); s.id = 'tiltedcard-css'; s.textContent = CSS; document.head.appendChild(s);
}

const TiltedCard = ({
  imageSrc = undefined,
  gradient,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '380px',
  containerWidth = '260px',
  imageHeight = '380px',
  imageWidth = '260px',
  scaleOnHover = 1.08,
  rotateAmplitude = 14,
  showTooltip = true,
  displayOverlayContent = false,
  overlayContent = null,
  children
}) => {
  const ref = useRef(null);
  const [tf, setTf] = useState('rotateX(0deg) rotateY(0deg) scale(1)');
  const [cap, setCap] = useState({ x: 0, y: 0, o: 0, r: 0 });
  const lastY = useRef(0);

  const onMove = e => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const ox = e.clientX - rect.left - rect.width / 2;
    const oy = e.clientY - rect.top - rect.height / 2;
    const rx = (oy / (rect.height / 2)) * -rotateAmplitude;
    const ry = (ox / (rect.width / 2)) * rotateAmplitude;
    setTf(`rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scaleOnHover})`);
    const vY = oy - lastY.current; lastY.current = oy;
    setCap({ x: e.clientX - rect.left, y: e.clientY - rect.top, o: 1, r: Math.max(-18, Math.min(18, -vY * 0.6)) });
  };
  const onLeave = () => { setTf('rotateX(0deg) rotateY(0deg) scale(1)'); setCap(c => ({ ...c, o: 0, r: 0 })); };

  const ce = React.createElement;
  return ce('figure', { ref, className: 'tilted-card-figure', style: { height: containerHeight, width: containerWidth }, onMouseMove: onMove, onMouseLeave: onLeave },
    ce('div', { className: 'tilted-card-inner', style: { width: imageWidth, height: imageHeight, transform: tf } },
      ce('div', { className: 'tilted-card-surface', style: gradient && !imageSrc ? { background: gradient } : null },
        imageSrc ? ce('img', { src: imageSrc, alt: altText }) : ce('div', { className: 'tilted-card-poster' }),
        (displayOverlayContent && (overlayContent || children)) ? ce('div', { className: 'tilted-card-overlay' }, overlayContent || children) : null
      )
    ),
    showTooltip && captionText ? ce('figcaption', {
      className: 'tilted-card-caption',
      style: { transform: `translate(${cap.x}px, ${cap.y}px) rotate(${cap.r}deg)`, opacity: cap.o }
    }, captionText) : null
  );
};

export default TiltedCard;
