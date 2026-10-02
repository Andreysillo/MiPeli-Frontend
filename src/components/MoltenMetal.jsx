import React, { useEffect, useRef } from "react";

const MM_CSS = `.molten-metal-container{position:relative;width:100%;height:100%;overflow:hidden}`;
if (typeof document !== 'undefined' && !document.getElementById('moltenmetal-css')) {
  const s = document.createElement('style'); s.id = 'moltenmetal-css'; s.textContent = MM_CSS; document.head.appendChild(s);
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const colorModeToFloat = (mode) => (mode === 'ember' ? 1 : mode === 'frost' ? 2 : 0);

const VERTEX = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 drift = vec2(0.0);
  if (uEnableMouse > 0.5) drift = (uMouse - 0.5) * uMouseStrength * 2.0;
  p += drift;

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;
  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;
  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if (uColorMode > 1.5) mid = 0.65;
  else if (uColorMode > 0.5) mid = 0.35;

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  fragColor = vec4(col * a, a);
}
`;

function compileShader(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error('Shader compile error: ' + log);
  }
  return sh;
}

function createProgram(gl) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, 'position');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(prog);
    throw new Error('Program link error: ' + log);
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return prog;
}

const ctxMap = new WeakMap();

function MoltenMetal({
  color1 = '#5227FF',
  color2 = '#FF9FFC',
  color3 = '#FFFFFF',
  speed = 0.35,
  scale = 4,
  detail = 3,
  glow = 1.6,
  coreSize = 0.1,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.05,
  brightness = 1.3,
  colorMode = 'molten',
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = true,
  mouseStrength = 0.3,
  opacity = 1.0,
  className = ''
}) {
  const containerRef = useRef(null);
  const settingsRef = useRef({});
  settingsRef.current = { color1, color2, color3, speed, scale, detail, glow, coreSize, swirl, fold, blackPoint, brightness, colorMode, grain, grainIntensity, mouseInteraction, mouseStrength, opacity };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let cleanupFn = null;
    let isIntersecting = false;
    const tryStartRef = { current: null };
    const tryStopRef = { current: null };

    isIntersecting = true;
    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) tryStartRef.current && tryStartRef.current();
      else tryStopRef.current && tryStopRef.current();
    }, { threshold: 0 });
    io.observe(container);
    start();

    function start() {
      if (cleanupFn || disposed) return;
      const canvas = document.createElement('canvas');
      canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block';
      container.appendChild(canvas);
      const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
      if (!gl) return;

      const program = createProgram(gl);
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);

      const loc = {};
      ['iResolution', 'iTime', 'uSpeed', 'uScale', 'uDetail', 'uGlow', 'uCoreSize', 'uSwirl', 'uFold', 'uBlackPoint', 'uBrightness', 'uColorMode', 'uGrain', 'uGrainIntensity', 'uOpacity', 'uMouse', 'uMouseStrength', 'uEnableMouse', 'uColor1', 'uColor2', 'uColor3'].forEach(n => { loc[n] = gl.getUniformLocation(program, n); });

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const state = { w: 1, h: 1 };
      const setSize = () => {
        const rect = container.getBoundingClientRect();
        const w = Math.max(1, Math.floor(rect.width * dpr));
        const h = Math.max(1, Math.floor(rect.height * dpr));
        if (w === state.w && h === state.h) return;
        state.w = w; state.h = h;
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      };
      const ro = new ResizeObserver(setSize);
      ro.observe(container);
      setSize();

      const targetMouse = [0.5, 0.5]; const currentMouse = [0.5, 0.5];
      const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        targetMouse[0] = (e.clientX - rect.left) / rect.width;
        targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
      };
      const handleMouseLeave = () => { targetMouse[0] = 0.5; targetMouse[1] = 0.5; };
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);

      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.clearColor(0, 0, 0, 0);

      let raf = 0; const t0 = performance.now();
      const render = (t) => {
        const s = settingsRef.current;
        const time = (t - t0) * 0.001;
        currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);

        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.uniform2f(loc.iResolution, canvas.width, canvas.height);
        gl.uniform1f(loc.iTime, time);
        gl.uniform1f(loc.uSpeed, s.speed);
        gl.uniform1f(loc.uScale, s.scale);
        gl.uniform1f(loc.uDetail, s.detail);
        gl.uniform1f(loc.uGlow, s.glow);
        gl.uniform1f(loc.uCoreSize, Math.max(s.coreSize, 0.001));
        gl.uniform1f(loc.uSwirl, s.swirl);
        gl.uniform1f(loc.uFold, s.fold);
        gl.uniform1f(loc.uBlackPoint, s.blackPoint);
        gl.uniform1f(loc.uBrightness, s.brightness);
        gl.uniform1f(loc.uColorMode, colorModeToFloat(s.colorMode));
        gl.uniform1f(loc.uGrain, s.grain ? 1 : 0);
        gl.uniform1f(loc.uGrainIntensity, s.grainIntensity);
        gl.uniform1f(loc.uOpacity, s.opacity);
        gl.uniform2f(loc.uMouse, currentMouse[0], currentMouse[1]);
        gl.uniform1f(loc.uMouseStrength, s.mouseStrength);
        gl.uniform1f(loc.uEnableMouse, s.mouseInteraction ? 1 : 0);
        const c1 = hexToRgb(s.color1), c2 = hexToRgb(s.color2), c3 = hexToRgb(s.color3);
        gl.uniform3f(loc.uColor1, c1[0], c1[1], c1[2]);
        gl.uniform3f(loc.uColor2, c2[0], c2[1], c2[2]);
        gl.uniform3f(loc.uColor3, c3[0], c3[1], c3[2]);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        raf = requestAnimationFrame(render);
      };

      const tryStart = () => { if (raf === 0) raf = requestAnimationFrame(render); };
      const tryStop = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = 0; } };
      tryStartRef.current = tryStart; tryStopRef.current = tryStop;
      render(performance.now());
      tryStart();

      ctxMap.set(container, { gl, program });
      cleanupFn = () => {
        tryStop();
        ro.disconnect();
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        ctxMap.delete(container);
        if (canvas.parentNode === container) container.removeChild(canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    return () => {
      disposed = true;
      io.disconnect();
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return React.createElement('div', { ref: containerRef, className: ('molten-metal-container ' + className).trim() });
}

export default MoltenMetal;
