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
  App.tsx             shell: idioma, nav, pantalla actual, toast
  store.ts            estado global (pantalla, respuestas, persistencia en localStorage, rutas #hash)
  i18n.ts             textos es/en
  data.tsx            catálogo de demo con forma de TMDB (director, reparto, géneros, sinopsis, nota IMDb, plataformas),
                      recomendador local recommend() y arte de póster en canvas; lo reemplazará el backend
  screens/            una pantalla por archivo (Welcome, SurveyType, RecTypes, Quest, Loading, Results, Home, Faq, Contact)
  components/         Button, Reveal (transiciones GSAP + ScrollTrigger), PosterGallery (galería de pósters + ficha en <dialog>),
                      Movie (póster enmarcado, IMDb, plataformas), Studio (armazón editorial de Contacto y FAQ), Credits (atribuciones
                      de TMDB, JustWatch y OMDb), WavesBg y componentes animados de React Bits (.jsx)
  styles/global.css   tokens de diseño (color, radios, tipografía) y clases mp-*
```

Los componentes `.jsx` de `src/components/` vienen de [React Bits](https://github.com/DavidHDev/react-bits) adaptados; usan `gsap` y `ogl` (WebGL).
Íconos: [Phosphor](https://phosphoricons.com); logos de plataformas de streaming: [simple-icons](https://simpleicons.org) (monograma con los colores de la marca cuando no hay logo). Tipografía: Geist para la interfaz, Bodoni Moda para títulos de película y Space Grotesk en Contacto y FAQ (auto-hospedadas vía `@fontsource-variable`).
La galería de resultados toma como referencia [a24.raviklaassens.com](https://a24.raviklaassens.com/); Contacto y FAQ, [rokumaruichi.tokyo/about](https://www.rokumaruichi.tokyo/about/) y [monopo.vn/contact](https://monopo.vn/).

## Créditos de datos
TMDB exige mostrar su logo y el aviso "This product uses the TMDB API but is not endorsed or certified by TMDB", además de atribuir a JustWatch los datos de plataformas; OMDb pide citar su licencia CC BY-NC 4.0. Todo eso está en la sección Créditos de Contacto (`src/components/Credits.tsx`) y no debe quitarse al conectar el backend.
Todas las animaciones respetan `prefers-reduced-motion`.
