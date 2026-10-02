# MiPeli-Frontend

Recomendador de películas: el usuario responde una encuesta corta y MiPeli elige qué ver esta noche.
React 19 + TypeScript, empaquetado con esbuild (sin Vite).

## Uso

```bash
npm install
npm run dev        # http://127.0.0.1:8000
npm run build      # genera dist/
npm run typecheck  # tsc --noEmit
```

## Estructura

```
index.html            HTML de entrada (esbuild lo copia a dist/)
src/
  main.tsx            monta <App />
  App.tsx             shell: idioma, nav, pantalla actual, ruleta, toast
  store.ts            estado global (pantalla, respuestas, persistencia en localStorage, rutas #hash)
  i18n.ts             textos es/en
  data.tsx            catálogo de películas de demo + arte de póster generado en canvas (aún no hay backend)
  screens/            una pantalla por archivo (Welcome, SurveyType, RecTypes, Quest, Loading, Results, Home, Faq, Contact, Roulette)
  components/         Button, Reveal (transiciones GSAP), WavesBg y componentes animados de React Bits (.jsx)
  styles/global.css   tokens de diseño (color, radios, tipografía) y clases mp-*
```

Los componentes `.jsx` de `src/components/` vienen de [React Bits](https://github.com/DavidHDev/react-bits) adaptados; usan `gsap` y `ogl` (WebGL).
Íconos: [Phosphor](https://phosphoricons.com). Tipografía: Geist (auto-hospedada vía `@fontsource-variable/geist`).
Todas las animaciones respetan `prefers-reduced-motion`.
