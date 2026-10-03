# MiPeli-Frontend

Recomendador de películas: el usuario responde una encuesta corta y MiPeli elige qué ver esta noche.
React 19 + TypeScript, empaquetado con esbuild (sin Vite).

## Uso

```bash
npm install
npm run dev        # http://localhost:8000 (o el siguiente puerto libre); se recarga solo al guardar, Ctrl+C lo cierra
npm run build      # genera dist/
npm run typecheck  # tsc --noEmit
```

`build.mjs` hace ambas cosas: lee `.env`, inyecta la config de Firebase con `define` y, en modo dev, vigila los archivos y sirve `dist/`.

## Inicio de sesión (Firebase Authentication)

Google y correo con contraseña. No depende del backend: Firebase guarda la sesión en el navegador. Sin `.env` la app funciona igual y el inicio de sesión solo muestra un aviso.
Para el correo, habilita también **Método de acceso → Correo electrónico/contraseña** en Firebase. Las contraseñas las guarda Firebase (cifradas); MiPeli nunca las ve. El restablecimiento de contraseña usa el correo de Firebase.

1. En [console.firebase.google.com](https://console.firebase.google.com) crea un proyecto (plan Spark, gratis y sin tarjeta).
2. **Authentication → Comenzar → Método de acceso → Google → Habilitar**, elige el correo de asistencia y guarda.
3. **Configuración del proyecto → Tus apps → Web (`</>`)**: registra la app y copia los valores de `firebaseConfig`.
4. Copia `.env.example` a `.env` y pega `apiKey`, `authDomain`, `projectId` y `appId`.
5. Reinicia `npm run dev` y abre la URL con `localhost`. Para usar `127.0.0.1` u otro dominio, agrégalo en **Authentication → Configuración → Dominios autorizados**.

Cuando exista el backend, el frontend le enviará `user.getIdToken()` y el backend lo verificará con Firebase Admin.

## Estructura

```
index.html            HTML de entrada (esbuild lo copia a dist/)
build.mjs             build y servidor de desarrollo (esbuild)
src/
  main.tsx            monta <App />
  App.tsx             shell: header (nav, cerrar sesión, idioma), pantalla actual, toast
  auth.ts             Firebase Authentication: Google, correo/contraseña, restablecer, cerrar sesión, escuchar la sesión
  useGoogleSignIn.ts  hook del botón de Google (estado de carga y avisos), compartido por Welcome y Login
  assets/platforms/   logos de las plataformas de streaming (PNG/JPG, esbuild los copia con hash a dist/)
  store.ts            estado global (pantalla, respuestas, persistencia en localStorage, rutas #hash)
  i18n.ts             textos es/en
  data.tsx            catálogo de demo con forma de TMDB (director, reparto, géneros, sinopsis, nota IMDb, plataformas),
                      recomendador local recommend() y arte de póster en canvas; lo reemplazará el backend
  screens/            una pantalla por archivo (Welcome, Login, SurveyType, RecTypes, Quest, Loading, Results, Home, Faq, Contact)
  components/         Button, Reveal (transiciones GSAP + ScrollTrigger), PosterGallery (galería de pósters + ficha en <dialog>),
                      Movie (póster enmarcado, IMDb, plataformas), Credits (atribuciones de TMDB, JustWatch y OMDb),
                      WavesBg y componentes animados de React Bits (.jsx)
  styles/global.css   tokens de diseño (color, radios, tipografía) y clases mp-*
```

## Paleta (regla 60-30-10)

- **60 %** fondo de sala de cine `#0F0F14` (también los fondos animados, en grises).
- **30 %** texto `#F4F4F4`, grises, bordes y tarjetas `#1F1F2E`. Selección, foco y progreso van en blanco.
- **10 %** rojo `#E50914`, solo en el botón de acción principal de cada pantalla (`.btn-primary`). Con texto blanco da 4.8:1 (WCAG AA).

El botón de Google sigue el tema oscuro de las [guías de marca de Sign in with Google](https://developers.google.com/identity/branding-guidelines). Los pósters conservan sus colores: son contenido, no interfaz.

Los componentes `.jsx` de `src/components/` vienen de [React Bits](https://github.com/DavidHDev/react-bits) adaptados; usan `gsap` y `ogl` (WebGL).
Íconos: [Phosphor](https://phosphoricons.com); logos de las plataformas de streaming: archivos de `src/assets/platforms/` (se importan en `data.tsx`). Tipografía: Geist para la interfaz y Bodoni Moda para títulos de película (auto-hospedadas vía `@fontsource-variable`).
La galería de resultados toma como referencia [a24.raviklaassens.com](https://a24.raviklaassens.com/).

## Créditos de datos
TMDB exige mostrar su logo y el aviso "This product uses the TMDB API but is not endorsed or certified by TMDB", además de atribuir a JustWatch los datos de plataformas; OMDb pide citar su licencia CC BY-NC 4.0. Todo eso está en la sección Créditos de Contacto (`src/components/Credits.tsx`) y no debe quitarse al conectar el backend.
Todas las animaciones respetan `prefers-reduced-motion`.
