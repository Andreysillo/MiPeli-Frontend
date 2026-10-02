import React, { useEffect, useRef } from "react";

const hexToRgb = hex => {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return { r: parseInt(clean.slice(0,2),16), g: parseInt(clean.slice(2,4),16), b: parseInt(clean.slice(4,6),16) };
};
const mixRgb = (from, to, amount) => ({
  r: Math.round(from.r + (to.r - from.r) * amount),
  g: Math.round(from.g + (to.g - from.g) * amount),
  b: Math.round(from.b + (to.b - from.b) * amount)
});
const rgbToCss = rgb => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

const resolveFontSize = (value, container, fontWeight, fontFamily) => {
  if (typeof value === 'number') return value;
  const probe = document.createElement('span');
  probe.textContent = 'M';
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  probe.style.fontSize = value;
  probe.style.fontWeight = String(fontWeight);
  probe.style.fontFamily = fontFamily;
  container.appendChild(probe);
  const size = parseFloat(window.getComputedStyle(probe).fontSize) || 96;
  probe.remove();
  return size;
};

const waitForFonts = async font => {
  if (!('fonts' in document)) return;
  try { await document.fonts.load(font); } catch {}
  await document.fonts.ready;
};

const Aurora = ({
  colorStops = ['#0f4fb8', '#ffffff', '#3300ff'],
  amplitude = 1.6, blend = 0.5, speed = 1.0, style = undefined
}) => {
  const ref = useRef(null);
  const propsRef = useRef({ colorStops, amplitude, blend, speed });
  propsRef.current = { colorStops, amplitude, blend, speed };

  useEffect(() => {
    const ctn = ref.current;
    if (!ctn) return;
    let live = false, creating = false, disposed = false;
    let renderer, program, mesh, gl, animateId, ro, canvas;
    let isIntersecting = false;
    const stops = Array.isArray(colorStops) ? colorStops : String(colorStops).split(',').map(s => s.trim());

    const createGL = async () => {
      if (creating || live || disposed) return;
      creating = true;
      const { Renderer, Program, Mesh, Color, Triangle } = await import("ogl");
      creating = false;
      if (disposed || !isIntersecting || document.hidden) return;

      const VERT = `#version 300 es
      in vec2 position;
      void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;
      const FRAG = `#version 300 es
      precision highp float;
      uniform float uTime; uniform float uAmplitude; uniform vec3 uColorStops[3];
      uniform vec2 uResolution; uniform float uBlend;
      out vec4 fragColor;
      vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x,289.0); }
      float snoise(vec2 v){
        const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
        vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
        vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
        vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.0);
        vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
        vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
        m=m*m; m=m*m; vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5;
        vec3 ox=floor(x+0.5); vec3 a0=x-ox;
        m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
        vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
        return 130.0*dot(m,g);
      }
      struct ColorStop { vec3 color; float position; };
      #define COLOR_RAMP(colors, factor, finalColor) { \
        int index=0; \
        for(int i=0;i<2;i++){ ColorStop cs=colors[i]; bool ib=cs.position<=factor; index=int(mix(float(index),float(i),float(ib))); } \
        ColorStop cc=colors[index]; ColorStop nc=colors[index+1]; \
        float range=nc.position-cc.position; float lf=(factor-cc.position)/range; \
        finalColor=mix(cc.color,nc.color,clamp(lf,0.0,1.0)); }
      void main(){
        vec2 uv=gl_FragCoord.xy/uResolution;
        ColorStop colors[3];
        colors[0]=ColorStop(uColorStops[0],0.0);
        colors[1]=ColorStop(uColorStops[1],0.5);
        colors[2]=ColorStop(uColorStops[2],1.0);
        vec3 rampColor; COLOR_RAMP(colors,uv.x,rampColor);
        float height=snoise(vec2(uv.x*2.0+uTime*0.1,uTime*0.25))*0.5*uAmplitude;
        height=exp(height); height=(uv.y*2.0-height+0.2);
        float intensity=0.6*height;
        float midPoint=0.20;
        float auroraAlpha=smoothstep(midPoint-uBlend*0.5,midPoint+uBlend*0.5,intensity);
        vec3 auroraColor=intensity*rampColor;
        fragColor=vec4(auroraColor*auroraAlpha,auroraAlpha);
      }`;

      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      canvas = gl.canvas;
      canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block';
      canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); }, false);
      ctn.appendChild(canvas);

      const geometry = new Triangle(gl);
      const colorStopsArray = stops.map(hex => { const c = new Color(hex); return [c.r, c.g, c.b]; });
      program = new Program(gl, {
        vertex: VERT, fragment: FRAG,
        uniforms: {
          uTime: { value: 0 },
          uAmplitude: { value: Number(propsRef.current.amplitude) || 1 },
          uColorStops: { value: colorStopsArray },
          uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
          uBlend: { value: Number(propsRef.current.blend) || 0.5 }
        }
      });
      mesh = new Mesh(gl, { geometry, program });

      const resize = () => {
        if (!ctn) return;
        const w = ctn.offsetWidth, h = ctn.offsetHeight;
        renderer.setSize(w, h);
        program.uniforms.uResolution.value = [w, h];
      };
      ro = new ResizeObserver(resize); ro.observe(ctn); resize();

      const update = t => {
        if (disposed || !live) return;
        animateId = requestAnimationFrame(update);
        const { amplitude, blend, speed } = propsRef.current;
        program.uniforms.uTime.value = t * 0.001 * (Number(speed) ?? 1) * 0.4;
        program.uniforms.uAmplitude.value = Number(amplitude) || 1;
        program.uniforms.uBlend.value = Number(blend) || 0.5;
        renderer.render({ scene: mesh });
      };
      live = true;
      animateId = requestAnimationFrame(update);
    };

    const destroyGL = () => {
      if (!live) return;
      live = false;
      if (animateId) cancelAnimationFrame(animateId);
      animateId = null;
      if (ro) { ro.disconnect(); ro = null; }
      if (canvas && canvas.parentNode === ctn) ctn.removeChild(canvas);
      if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext();
      renderer = program = mesh = gl = canvas = null;
    };

    const reconcile = () => {
      const shouldRun = isIntersecting && !document.hidden;
      if (shouldRun && !live) createGL();
      else if (!shouldRun && live) destroyGL();
    };

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      reconcile();
    }, { rootMargin: '150px' });
    io.observe(ctn);
    const onVis = () => reconcile();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      disposed = true;
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      destroyGL();
    };
  }, [Array.isArray(colorStops) ? colorStops.join(',') : colorStops]);

  return React.createElement('div', {
    ref: ref,
    style: { width: '100%', height: '100%', position: 'relative', ...style }
  });
};

export default Aurora;
