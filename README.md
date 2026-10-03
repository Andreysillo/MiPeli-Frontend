# MiPeli-Frontend

MiPeli es un recomendador de películas: en lugar de pedirte que busques, te hace unas preguntas (tu ánimo, cuánto tiempo tienes, duelos entre pósters, tus favoritas y dónde ves películas) y te dice qué ver esta noche y dónde verla: en una plataforma de streaming de Costa Rica o, si está en cartelera, en el cine.
Este repo es solo el **frontend** (React 19 + TypeScript, empaquetado con esbuild, sin Vite). El backend irá en otro repo. Proyecto personal: lo desarrollo y mantengo yo solo.

## Flujo de la app

1. **Landing** (`Welcome`): página informativa con animaciones de scroll. Su único acceso está al final: "Iniciar sesión" o, con sesión abierta, "Continuar como …" (o "Continuar encuesta" si hay una a medias).
2. **Login**: Google, correo y contraseña (crear cuenta, restablecer) o entrar como invitado, sobre el mural de pósters.
3. **Encuesta** (`Quest`, ~1 minuto, sin pantallas previas): ánimo (una sensación, nunca "género"), contexto (tiempo, con quién, qué evitar), 4 duelos de pósters, hasta 3 favoritas con buscador y, solo la primera vez, plataformas. Detalle de cada señal en [docs/recomendacion.md](docs/recomendacion.md).
4. **Carga** (`Loading`, simulada) y **Resultados** (`Results`): galería de pósters enmarcados; cada película dice por qué sale y la ficha trae director, reparto, nota de IMDb, plataformas y botones para afinar (más como esta, ya la vi, no me interesa). El número de películas y las plataformas se cambian ahí mismo. "En cines" es una plataforma más: se elige junto a las de streaming y, si la película está en cartelera, la ficha lo dice (sin enlace ni horarios, que TMDB no da).
5. **Mi perfil** (`Profile`, `#perfil`, solo con sesión): cada encuesta que termina una cuenta se guarda sola (y se actualiza al afinar los resultados) para volver a verla después; se le puede cambiar el nombre (el lápiz junto al título; sin nombre propio se titula con el ánimo elegido). Desde ahí también se cierra la sesión. Los invitados no guardan nada y la app se lo dice en la landing, el login, los resultados y la FAQ. Repetir la encuesta, empezar de cero, borrar una guardada y abrir una con otra a medias piden confirmación (`ConfirmDialog`).

El logo "MP" y "Inicio" del menú siempre llevan a la landing, así que un invitado puede iniciar sesión cuando quiera y quien ya la tiene encuentra "Continuar encuesta". FAQ y Contacto son pantallas aparte (`#faq`, `#contacto`).
Todo el texto está en español e inglés (`src/i18n.ts`); cualquier texto nuevo debe llevar las dos versiones.

## Estado y pendientes

- Hecho: toda la interfaz, el inicio de sesión real (Firebase) y un catálogo de demo con recomendador local (`src/data.tsx`, `src/recommend.ts`).
- Falta el **backend** (otro repo): catálogo, pósters y reparto desde TMDB (TasteDive como refuerzo opcional), plataformas de streaming (atribuidas a JustWatch) y notas de IMDb desde OMDb. El contrato, el algoritmo y la prueba para decidir sobre TasteDive están en [docs/recomendacion.md](docs/recomendacion.md). Al conectarlo hay que reemplazar `recommend()` y `data.tsx`, enviar `user.getIdToken()` y actualizar el texto de privacidad de FAQ y Contacto si se guardan datos.
- Las encuestas guardadas viven solo en el navegador de cada cuenta (`src/history.ts`): no se sincronizan entre dispositivos. Falta pasarlas al backend (contrato en [docs/recomendacion.md](docs/recomendacion.md)), y el cine, que hoy es dato de demo, saldrá de TMDB (sección "Cine" del mismo documento).
- La app no usa cookies (verificado en el navegador: ninguna, y sin analítica) y solo guarda en el navegador lo necesario; así lo dice el texto de privacidad (`privacyPoints` y la FAQ). Si algún día se agrega analítica, publicidad o contenido de terceros (videos incrustados, etc.), hace falta un aviso de consentimiento antes de cargarlos y actualizar ese texto.
- En Google Cloud, restringir la API key de Firebase a los dominios de la app antes de publicar.

## Uso

Requiere Node 20.12 o superior (`build.mjs` usa `process.loadEnvFile`).

```bash
npm install
npm run dev        # http://localhost:8000 (o el siguiente puerto libre); se recarga solo al guardar, Ctrl+C lo cierra
npm run build      # genera dist/
npm run typecheck  # tsc --noEmit
npm run check      # comprueba las reglas del recomendador de demo (src/recommend.check.ts)
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
  App.tsx             shell: header (nav, Mi perfil, idioma), pantalla actual, avisos de confirmación, toast
  auth.ts             Firebase Authentication: Google, correo/contraseña, restablecer, cerrar sesión, escuchar la sesión
  words.ts            splitWords: palabras con clave estable (titulares animados)
  useSpotlight.ts     luz que sigue al cursor dentro de cada .mp-panel
  useGoogleSignIn.ts  hook del botón de Google (estado de carga y avisos), compartido por Welcome y Login
  assets/platforms/   logos de las plataformas de streaming y del cine (PNG/JPG, esbuild los copia con hash a dist/)
  store.ts            estado global (pantalla, respuestas, sesión, encuestas guardadas, persistencia en localStorage, rutas #hash)
  history.ts          encuestas guardadas de cada cuenta (hoy en el navegador, una lista por uid); es la costura que reemplazará el backend
  i18n.ts             textos es/en
  data.tsx            catálogo de demo con forma de TMDB (director, reparto, géneros, sinopsis, nota IMDb, plataformas) y arte de póster en canvas; lo reemplazará el backend
  survey.ts           configuración de la encuesta: pasos, moods, compañía, qué evitar, duelos, sugerencias y búsqueda de favoritas
  recommend.ts        recomendador local (demo): puntaje, razones y marcas por película; es la costura que reemplazará el backend
  recommend.check.ts  comprobación rápida de esas reglas (npm run check, también corre en CI)
  steps/              un archivo por paso de la encuesta (MoodStep, ContextStep, DuelStep, FavoritesStep, PlatformsStep), StepHeader y PlatformPicker
  screens/            una pantalla por archivo (Welcome = landing informativa con el acceso al final, Login, Quest, Loading, Results, Profile, Faq, Contact)
  components/         Button, Reveal (transiciones GSAP + ScrollTrigger), PosterGallery (galería de pósters + ficha en <dialog>),
                      Movie (póster enmarcado, IMDb, plataformas), PosterWall (mural de fondo de Login), ConfirmDialog (aviso modal de confirmación: cerrar sesión, repetir la encuesta, empezar de nuevo, borrar o abrir una guardada), SiteNav (header de todo el sitio: "MiPeli" como enlace al inicio, enlaces a secciones en la landing o a Inicio/FAQ/Contacto en el resto, menú a pantalla completa en móvil), Ambient (fondo gris de la encuesta), Rise (titular con entrada por máscara), CountUp, GoogleG, Credits (atribuciones de TMDB, JustWatch y OMDb),
                      DriftWall (mural de React Bits, .jsx)
  styles/global.css   tokens de diseño (color, radios, tipografía) y clases mp-*
```

## Convenciones del proyecto

- Los commits los hago yo a mano, en inglés y con Conventional Commits (`feat(ui): …`, `fix(auth): …`).
- Código pensado para pasar SonarQube: manejadores solo en `<button>` nativos, sin JSX dentro de arreglos, sin índices como `key`, sin ternarios anidados y props con `Readonly<{…}>`. Las mejoras no interactivas (cursor, scroll) se enganchan con listeners nativos dentro de `useEffect`.
- Un solo sistema visual para todas las pantallas (mismo header, tipografía, tarjetas y botones); ninguna página lleva estilo propio.
- Las atribuciones de TMDB, JustWatch y OMDb son obligatorias y no se quitan.
- `graphify-out/` (grafo de código para navegar el repo) es local y no se sube; se refresca con `graphify update .` después de cambiar código.

## Paleta (regla 60-30-10)

- **60 %** fondo de sala de cine `#0F0F14` (también los fondos animados, en grises).
- **30 %** texto `#F4F4F4`, grises, bordes y tarjetas `#1F1F2E`. Selección, foco y progreso van en blanco.
- **10 %** rojo `#E50914`, solo en el botón de acción principal de cada pantalla (`.btn-primary`). Con texto blanco da 4.8:1 (WCAG AA).

El botón de Google sigue el tema oscuro de las [guías de marca de Sign in with Google](https://developers.google.com/identity/branding-guidelines). Los pósters conservan sus colores: son contenido, no interfaz.

El mural de `src/components/DriftWall.jsx` viene de [React Bits](https://github.com/DavidHDev/react-bits), adaptado.
Íconos: [Phosphor](https://phosphoricons.com); logos de las plataformas de streaming: archivos de `src/assets/platforms/` (se importan en `data.tsx`). Tipografía: Geist en toda la interfaz con el estilo de la landing (peso 500, interlínea cerrada, tracking apretado, etiquetas de 12 px en mayúsculas) y Bodoni Moda para títulos de película (auto-hospedadas vía `@fontsource-variable`).
La galería de resultados toma como referencia [a24.raviklaassens.com](https://a24.raviklaassens.com/) y la landing, [14islands.com](https://www.14islands.com/) (tipografía enorme, tira de pósters, texto que se enciende al hacer scroll), con los colores de la app.

## Créditos de datos
TMDB exige mostrar su logo y el aviso "This product uses the TMDB API but is not endorsed or certified by TMDB", además de atribuir a JustWatch los datos de plataformas; OMDb pide citar su licencia CC BY-NC 4.0. Todo eso está en la sección Créditos de Contacto (`src/components/Credits.tsx`) y no debe quitarse al conectar el backend.
Todas las animaciones respetan `prefers-reduced-motion`.
