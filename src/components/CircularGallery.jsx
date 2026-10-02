import React, { useRef, useEffect } from "react";

const CSS = `
.circular-gallery{width:100%;height:100%;overflow:hidden;cursor:grab;position:relative}
.circular-gallery:active{cursor:grabbing}
.circular-gallery:focus-visible{outline:2px solid #fff;outline-offset:4px}
`;
if (typeof document !== 'undefined' && !document.getElementById('circulargallery-css')) {
  const s = document.createElement('style'); s.id = 'circulargallery-css'; s.textContent = CSS; document.head.appendChild(s);
}

function debounce(fn, wait){ let t; return function(...a){ clearTimeout(t); t=setTimeout(()=>fn.apply(this,a),wait); }; }
function lerp(a,b,t){ return a+(b-a)*t; }
function getFontSize(font){ const m=font.match(/(\d+)px/); return m?parseInt(m[1],10):30; }

function createTextTexture(OGL, gl, text, font, color){
  const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
  ctx.font=font; const w=Math.ceil(ctx.measureText(text).width); const h=Math.ceil(getFontSize(font)*1.2);
  canvas.width=w+20; canvas.height=h+20; ctx.font=font; ctx.fillStyle=color; ctx.textBaseline='middle'; ctx.textAlign='center';
  ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillText(text,canvas.width/2,canvas.height/2);
  const texture=new OGL.Texture(gl,{generateMipmaps:false}); texture.image=canvas;
  return { texture, width:canvas.width, height:canvas.height };
}

function makeMedia(OGL){
  class Title {
    constructor({gl,plane,text,textColor,font}){ this.gl=gl; this.plane=plane; this.text=text; this.textColor=textColor; this.font=font; this.createMesh(); }
    createMesh(){
      const {texture,width,height}=createTextTexture(OGL,this.gl,this.text,this.font,this.textColor);
      const geometry=new OGL.Plane(this.gl);
      const program=new OGL.Program(this.gl,{ vertex:`attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`, fragment:`precision highp float;uniform sampler2D tMap;varying vec2 vUv;void main(){vec4 c=texture2D(tMap,vUv);if(c.a<0.1)discard;gl_FragColor=c;}`, uniforms:{tMap:{value:texture}}, transparent:true });
      this.mesh=new OGL.Mesh(this.gl,{geometry,program});
      const aspect=width/height; const th=this.plane.scale.y*0.15; const tw=th*aspect;
      this.mesh.scale.set(tw,th,1); this.mesh.position.y=-this.plane.scale.y*0.5-th*0.5-0.05; this.mesh.setParent(this.plane);
    }
  }
  class Media {
    constructor(o){ Object.assign(this,o); this.extra=0; this.createShader(); this.createMesh(); this.createTitle(); this.onResize(); }
    createShader(){
      const texture=new OGL.Texture(this.gl,{generateMipmaps:true});
      this.program=new OGL.Program(this.gl,{ depthTest:false, depthWrite:false,
        vertex:`precision highp float;attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;uniform float uTime;uniform float uSpeed;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;p.z=(sin(p.x*4.0+uTime)*1.5+cos(p.y*2.0+uTime)*1.5)*(0.1+uSpeed*0.5);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
        fragment:`precision highp float;uniform vec2 uImageSizes;uniform vec2 uPlaneSizes;uniform sampler2D tMap;uniform float uBorderRadius;varying vec2 vUv;float roundedBoxSDF(vec2 p,vec2 b,float r){vec2 d=abs(p)-b;return length(max(d,vec2(0.0)))+min(max(d.x,d.y),0.0)-r;}void main(){vec2 ratio=vec2(min((uPlaneSizes.x/uPlaneSizes.y)/(uImageSizes.x/uImageSizes.y),1.0),min((uPlaneSizes.y/uPlaneSizes.x)/(uImageSizes.y/uImageSizes.x),1.0));vec2 uv=vec2(vUv.x*ratio.x+(1.0-ratio.x)*0.5,vUv.y*ratio.y+(1.0-ratio.y)*0.5);vec4 color=texture2D(tMap,uv);float d=roundedBoxSDF(vUv-0.5,vec2(0.5-uBorderRadius),uBorderRadius);float edge=0.002;float alpha=1.0-smoothstep(-edge,edge,d);gl_FragColor=vec4(color.rgb,alpha);}`,
        uniforms:{ tMap:{value:texture}, uPlaneSizes:{value:[0,0]}, uImageSizes:{value:[0,0]}, uSpeed:{value:0}, uTime:{value:100*Math.random()}, uBorderRadius:{value:this.borderRadius} }, transparent:true });
      const img=new Image(); img.crossOrigin='anonymous'; img.src=this.image;
      img.onload=()=>{ texture.image=img; this.program.uniforms.uImageSizes.value=[img.naturalWidth,img.naturalHeight]; };
    }
    createMesh(){ this.plane=new OGL.Mesh(this.gl,{geometry:this.geometry,program:this.program}); this.plane.setParent(this.scene); }
    createTitle(){ this.title=new Title({gl:this.gl,plane:this.plane,text:this.text,textColor:this.textColor,font:this.font}); }
    update(scroll,direction){
      this.plane.position.x=this.x-scroll.current-this.extra;
      const x=this.plane.position.x; const H=this.viewport.width/2;
      if(this.bend===0){ this.plane.position.y=0; this.plane.rotation.z=0; }
      else { const B=Math.abs(this.bend); const R=(H*H+B*B)/(2*B); const ex=Math.min(Math.abs(x),H); const arc=R-Math.sqrt(R*R-ex*ex);
        if(this.bend>0){ this.plane.position.y=-arc; this.plane.rotation.z=-Math.sign(x)*Math.asin(ex/R); }
        else { this.plane.position.y=arc; this.plane.rotation.z=Math.sign(x)*Math.asin(ex/R); } }
      this.speed=scroll.current-scroll.last; this.program.uniforms.uTime.value+=0.04; this.program.uniforms.uSpeed.value=this.speed;
      const po=this.plane.scale.x/2; const vo=this.viewport.width/2;
      this.isBefore=this.plane.position.x+po<-vo; this.isAfter=this.plane.position.x-po>vo;
      if(direction==='right'&&this.isBefore){ this.extra-=this.widthTotal; this.isBefore=this.isAfter=false; }
      if(direction==='left'&&this.isAfter){ this.extra+=this.widthTotal; this.isBefore=this.isAfter=false; }
    }
    onResize({screen,viewport}={}){
      if(screen)this.screen=screen; if(viewport)this.viewport=viewport;
      this.scale=this.screen.height/1500;
      this.plane.scale.y=(this.viewport.height*(900*this.scale))/this.screen.height;
      this.plane.scale.x=(this.viewport.width*(700*this.scale))/this.screen.width;
      this.plane.program.uniforms.uPlaneSizes.value=[this.plane.scale.x,this.plane.scale.y];
      this.padding=2; this.width=this.plane.scale.x+this.padding; this.widthTotal=this.width*this.length; this.x=this.width*this.index;
    }
  }
  return { Title, Media };
}

function makeApp(OGL, container, opts){
  const { Media } = makeMedia(OGL);
  const scrollSpeed = opts.scrollSpeed ?? 2;
  const app = {
    container, scrollSpeed, scroll:{ ease:opts.scrollEase ?? 0.05, current:0, target:0, last:0 }, raf:0
  };
  app.renderer=new OGL.Renderer({ alpha:true, antialias:true, dpr:Math.min(window.devicePixelRatio||1,2) });
  app.gl=app.renderer.gl; app.gl.clearColor(0,0,0,0); container.appendChild(app.gl.canvas);
  app.camera=new OGL.Camera(app.gl); app.camera.fov=45; app.camera.position.z=20;
  app.scene=new OGL.Transform();
  const onResize=()=>{ app.screen={width:container.clientWidth,height:container.clientHeight}; app.renderer.setSize(app.screen.width,app.screen.height); app.camera.perspective({aspect:app.screen.width/app.screen.height}); const fov=(app.camera.fov*Math.PI)/180; const h=2*Math.tan(fov/2)*app.camera.position.z; app.viewport={width:h*app.camera.aspect,height:h}; if(app.medias)app.medias.forEach(m=>m.onResize({screen:app.screen,viewport:app.viewport})); };
  onResize();
  app.planeGeometry=new OGL.Plane(app.gl,{heightSegments:50,widthSegments:100});
  const items=opts.items&&opts.items.length?opts.items:[{image:'',text:'—'}];
  app.mediasImages=items.concat(items);
  app.medias=app.mediasImages.map((d,i)=>new Media({ geometry:app.planeGeometry, gl:app.gl, image:d.image, index:i, length:app.mediasImages.length, scene:app.scene, screen:app.screen, text:d.text, viewport:app.viewport, bend:opts.bend??3, textColor:opts.textColor??'#fff', borderRadius:opts.borderRadius??0.05, font:opts.font??'bold 30px Figtree' }));
  const onCheck=()=>{ if(!app.medias||!app.medias[0])return; const w=app.medias[0].width; const idx=Math.round(Math.abs(app.scroll.target)/w); const it=w*idx; app.scroll.target=app.scroll.target<0?-it:it; };
  const onCheckDeb=debounce(onCheck,200);
  let isDown=false,start=0,pos=0,moved=false;
  const onDown=e=>{ isDown=true; moved=false; pos=app.scroll.current; start=e.touches?e.touches[0].clientX:e.clientX; };
  const onMove=e=>{ if(!isDown)return; const x=e.touches?e.touches[0].clientX:e.clientX; if(Math.abs(start-x)>4)moved=true; app.scroll.target=pos+(start-x)*(scrollSpeed*0.025); };
  const onUp=e=>{ isDown=false; onCheck(); if(!moved&&opts.onSelect&&app.medias&&app.medias[0]){ const w=app.medias[0].width; const idx=Math.round(Math.abs(app.scroll.target)/w); const base=idx%items.length; opts.onSelect(items[base].text, base); } };
  const onWheel=e=>{ const d=e.deltaY||e.wheelDelta||e.detail; app.scroll.target+=(d>0?scrollSpeed:-scrollSpeed)*0.2; onCheckDeb(); };
  const loop=()=>{ app.scroll.current=lerp(app.scroll.current,app.scroll.target,app.scroll.ease); const dir=app.scroll.current>app.scroll.last?'right':'left'; if(app.medias)app.medias.forEach(m=>m.update(app.scroll,dir)); app.renderer.render({scene:app.scene,camera:app.camera}); app.scroll.last=app.scroll.current; app.raf=requestAnimationFrame(loop); };
  loop();
  window.addEventListener('resize',onResize);
  container.addEventListener('wheel',onWheel,{passive:true});
  container.addEventListener('mousedown',onDown); window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
  container.addEventListener('touchstart',onDown,{passive:true}); container.addEventListener('touchmove',onMove,{passive:true}); container.addEventListener('touchend',onUp);
  app.destroy=()=>{ cancelAnimationFrame(app.raf); window.removeEventListener('resize',onResize); container.removeEventListener('wheel',onWheel); container.removeEventListener('mousedown',onDown); window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); container.removeEventListener('touchstart',onDown); container.removeEventListener('touchmove',onMove); container.removeEventListener('touchend',onUp); if(app.gl&&app.gl.canvas&&app.gl.canvas.parentNode===container)container.removeChild(app.gl.canvas); if(app.gl)app.gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  return app;
}

const CircularGallery = ({ items, bend = 3, textColor = '#ffffff', borderRadius = 0.05, font = 'bold 30px Figtree', scrollSpeed = 2, scrollEase = 0.05, onSelect = /** @type {any} */ (undefined), style = undefined }) => {
  const ref = useRef(null);
  const onSelectRef = useRef(onSelect); onSelectRef.current = onSelect;
  useEffect(() => {
    const container = ref.current; if (!container) return;
    let app, disposed=false, isIn=false, creating=false;
    const opts = { items, bend:Number(bend), textColor, borderRadius:Number(borderRadius), font, scrollSpeed:Number(scrollSpeed), scrollEase:Number(scrollEase), onSelect:(t,i)=>onSelectRef.current&&onSelectRef.current(t,i) };
    const create = async () => {
      if (creating || app || disposed) return; creating = true;
      let OGL;
      try {
        OGL = await import("ogl");
      } catch (e) { creating = false; console.error('CircularGallery import failed', e); return; }
      creating = false;
      if (disposed || !isIn) return;
      try { if (document.fonts && document.fonts.load) { await document.fonts.load(font); } } catch(e){}
      if (disposed || !isIn) return;
      try { app = makeApp(OGL, container, opts); }
      catch (e) { console.error('CircularGallery makeApp failed', e); }
    };
    const destroy = () => { if (app) { app.destroy(); app = null; } };
    const io = new IntersectionObserver(([e]) => { isIn = e.isIntersecting; if (isIn) create(); else destroy(); }, { rootMargin:'120px' });
    io.observe(container);
    return () => { disposed = true; io.disconnect(); destroy(); };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);
  return React.createElement('div', { className:'circular-gallery', ref, tabIndex:0, role:'region', 'aria-label':'Galería de géneros', style });
};

export default CircularGallery;
