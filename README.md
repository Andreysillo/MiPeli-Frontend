<div align="center">

# MiPeli

### Un recomendador de películas que te pregunta en vez de pedirte que busques.

Responde unas preguntas de un minuto y descubre qué ver esta noche y dónde verlo: en streaming en Costa Rica o, si está en cartelera, en el cine.

<br>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0B1F33)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![esbuild](https://img.shields.io/badge/esbuild-0.28-FFCF00?style=for-the-badge&logo=esbuild&logoColor=black)](https://esbuild.github.io/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

<sub>Encuesta por ánimo · Duelos de pósters · Dónde verla · Encuestas guardadas</sub>

</div>

## La experiencia

MiPeli convierte la pregunta de cada noche, "¿qué vemos hoy?", en una encuesta corta: tu ánimo (una sensación, nunca un "género"), el contexto, cuatro duelos de pósters, tus favoritas y las plataformas que usas. A cambio recibes una galería de pósters enmarcados donde cada película explica por qué salió y dónde verla.

Este repo es solo el **frontend**. El backend irá en otro repo.

## Funciones principales

- Encuesta de ~1 minuto: ánimo, contexto (tiempo, con quién, qué evitar), duelos de pósters, hasta 3 favoritas con buscador y plataformas.
- Resultados en galería de pósters enmarcados, con director, reparto, nota de IMDb, plataformas y botones para afinar (más como esta, ya la vi, no me interesa).
- "En cines" como una plataforma más, junto a las de streaming.
- Inicio de sesión con Google, correo y contraseña, o como invitado.
- **Mi perfil**: cada encuesta de una cuenta se guarda sola, se puede renombrar, reabrir o borrar. Los invitados no guardan nada.
- Español e inglés, interfaz oscura y accesible, animaciones que respetan `prefers-reduced-motion`.

## Flujo de la app

1. **Landing** (`Welcome`): página informativa. Su único acceso está al final: "¡Entrémosle!" o, con sesión abierta, "Continuar como …".
2. **Login**: Google, correo y contraseña (crear cuenta, restablecer) o invitado, sobre el mural de pósters.
3. **Encuesta** (`Quest`): ánimo, contexto, 4 duelos, favoritas y, solo la primera vez, plataformas. Detalle de cada señal en [docs/recomendacion.md](docs/recomendacion.md).
4. **Carga** (`Loading`, simulada) y **Resultados** (`Results`). El número de películas y las plataformas se cambian ahí mismo. En cines no hay enlace ni horarios: TMDB no los da.
5. **Mi perfil** (`Profile`, `#perfil`, solo con sesión): encuestas guardadas y cierre de sesión. Repetir la encuesta, empezar de cero, borrar una guardada y abrir una con otra a medias piden confirmación.

FAQ y Contacto son pantallas aparte (`#faq`, `#contacto`). Todo el texto vive en `src/i18n.ts` en español e inglés; cualquier texto nuevo debe llevar las dos versiones.

## Tecnologías

| Área | Tecnología |
| --- | --- |
| Framework | React 19, TypeScript |
| Empaquetado | esbuild (`build.mjs`), sin Vite |
| Animación | GSAP + ScrollTrigger |
| Íconos y tipografía | Phosphor, Geist, Bodoni Moda (`@fontsource-variable`) |
| Autenticación | Firebase Authentication (Google, correo y contraseña) |
| Datos (backend, pendiente) | TMDB, OMDb, JustWatch, TasteDive opcional |

## Empezar

### Requisitos

- Node.js 20.12 o superior (`build.mjs` usa `process.loadEnvFile`)
- npm

### Ejecutar en local

```bash
git clone https://github.com/Andreysillo/MiPeli-Frontend.git
cd MiPeli-Frontend
npm install
npm run dev
```

Abre [http://localhost:8000](http://localhost:8000) (o el siguiente puerto libre). Se recarga solo al guardar y Ctrl+C lo cierra.

## Configuración

Sin `.env` la app funciona igual y el inicio de sesión solo muestra un aviso. Para activarlo, copia `.env.example` a `.env`:

```dotenv
# valores de firebaseConfig; build.mjs los inyecta con `define`
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_APP_ID=...
```

1. En [console.firebase.google.com](https://console.firebase.google.com) crea un proyecto (plan Spark, gratis y sin tarjeta).
2. **Authentication → Comenzar → Método de acceso**: habilita **Google** y **Correo electrónico/contraseña**.
3. **Configuración del proyecto → Tus apps → Web (`</>`)**: registra la app y copia los valores de `firebaseConfig`.
4. Pégalos en `.env` y reinicia `npm run dev` desde `localhost`. Para `127.0.0.1` u otro dominio, agrégalo en **Authentication → Configuración → Dominios autorizados**.

Las contraseñas las guarda Firebase (cifradas); MiPeli nunca las ve. Cuando exista el backend, el frontend le enviará `user.getIdToken()` y este lo verificará con Firebase Admin.

## Calidad

```bash
npm run build      # genera dist/
npm run typecheck  # tsc --noEmit
npm run check      # reglas del recomendador de demo (src/recommend.check.ts)
npm run smoke      # tras el build: sirve dist/ con las cabeceras de vercel.json y recorre landing → login → encuesta
```

`smoke` usa Chrome (otro navegador: `SMOKE_CHANNEL=msedge npm run smoke`). `npm audit` (solo críticas), `typecheck`, `check`, el build y `smoke` corren en GitHub Actions; Dependabot propone las actualizaciones cada semana.

## Seguridad

- **XSS:** sin `innerHTML`, `dangerouslySetInnerHTML` ni `eval`; React escapa todo lo que escribe el usuario. Los enlaces externos llevan `rel="noopener noreferrer"`.
- **Cabeceras** (`vercel.json`): CSP restrictiva (`default-src 'self'`; solo se abren Google/Firebase para el inicio de sesión), `nosniff`, `frame-ancestors 'none'`, `Referrer-Policy` y `Permissions-Policy`. No se usa `Cross-Origin-Opener-Policy: same-origin` porque rompe el popup de Google. Todo estilo va en CSS (nada de `<style>` inyectado); los `style` en línea están permitidos solo como atributo. **Al conectar el backend hay que sumar a la CSP el host de imágenes de TMDB (`img-src`) y la URL de la API (`connect-src`)**; `npm run smoke` avisa si algo queda bloqueado.
- **Sin cookies ni CSRF:** la sesión es de Firebase (IndexedDB) y el backend recibirá `Authorization: Bearer`. Las contraseñas las guarda Firebase; el intento repetido lo limita Firebase (`auth/too-many-requests`).
- **Backend (pendiente):** validar todo con Pydantic, tomar el `uid` solo del token verificado, límite de peticiones por IP en `/recommend` y por usuario en `/surveys`, y CORS solo al dominio de Vercel. Mongo no usa SQL, pero evitar filtros armados con datos crudos (inyección NoSQL).
- **Dependencias:** `npm audit` marca vulnerabilidades altas en `@grpc/grpc-js` vía Firestore (dependencia de `firebase` que la app no importa); revisar al actualizar Firebase.

## Estado y pendientes

- Hecho: toda la interfaz, el inicio de sesión real (Firebase), las encuestas guardadas y un catálogo de demo con recomendador local (`src/data.tsx`, `src/recommend.ts`).
- Falta el **backend** (otro repo): catálogo, pósters y reparto desde TMDB (TasteDive como refuerzo opcional), plataformas (atribuidas a JustWatch) y notas de IMDb desde OMDb. El contrato, el algoritmo y la prueba para decidir sobre TasteDive están en [docs/recomendacion.md](docs/recomendacion.md). Al conectarlo hay que reemplazar `recommend()` y `data.tsx`, enviar `user.getIdToken()` y actualizar el texto de privacidad de FAQ y Contacto si se guardan datos.
- Las encuestas guardadas viven solo en el navegador de cada cuenta (`src/history.ts`) y no se sincronizan entre dispositivos. El cine, hoy dato de demo, saldrá de TMDB (sección "Cine" de `docs/recomendacion.md`).
- Privacidad: la app no usa cookies (verificado en el navegador) y no tiene analítica. Si se agrega analítica, publicidad o contenido de terceros, hace falta un aviso de consentimiento antes de cargarlos y actualizar `privacyPoints` y la FAQ.
- En Google Cloud, restringir la API key de Firebase a los dominios de la app antes de publicar.

## Estructura

```
index.html            HTML de entrada (esbuild lo copia a dist/)
build.mjs             build y servidor de desarrollo (esbuild; lee .env e inyecta Firebase con define)
vercel.json           build de Vercel y cabeceras de seguridad (CSP, nosniff, frame-ancestors…)
scripts/smoke.mjs     prueba de humo con las cabeceras de vercel.json (npm run smoke)
src/
  main.tsx            monta <App />
  App.tsx             shell: header (nav, Mi perfil, idioma), pantalla actual, avisos de confirmación, toast
  auth.ts             Firebase Authentication: Google, correo/contraseña, restablecer, cerrar sesión, escuchar la sesión
  words.ts            splitWords: palabras con clave estable (titulares animados)
  useSpotlight.ts     luz que sigue al cursor dentro de cada .mp-panel
  useGoogleSignIn.ts  hook del botón de Google (estado de carga y avisos), compartido por Welcome y Login
  assets/platforms/   logos de las plataformas de streaming y del cine (PNG/JPG, esbuild los copia con hash a dist/)
  store.ts            estado global (pantalla, respuestas, sesión, encuestas guardadas, persistencia en localStorage, rutas #hash)
  history.ts          encuestas guardadas de cada cuenta (hoy en el navegador, una lista por uid); la costura que reemplazará el backend
  i18n.ts             textos es/en
  data.tsx            catálogo de demo con forma de TMDB y arte de póster en canvas; lo reemplazará el backend
  survey.ts           configuración de la encuesta: pasos, moods, compañía, qué evitar, duelos, sugerencias y búsqueda de favoritas
  recommend.ts        recomendador local (demo): puntaje, razones y marcas por película; la costura que reemplazará el backend
  recommend.check.ts  comprobación rápida de esas reglas (npm run check)
  steps/              un archivo por paso de la encuesta, StepHeader y PlatformPicker
  screens/            una pantalla por archivo (Welcome, Login, Quest, Loading, Results, Profile, Faq, Contact)
  components/         Button, Reveal, PosterGallery, Movie, PosterWall, ConfirmDialog, SiteNav, Ambient, Rise, CountUp, GoogleG,
                      Credits (atribuciones de TMDB, JustWatch y OMDb), DriftWall (mural de React Bits, .jsx)
  styles/global.css   tokens de diseño (color, radios, tipografía) y clases mp-*
```

## Convenciones del proyecto

- Los commits los hago yo a mano, en inglés y con Conventional Commits (`feat(ui): …`, `fix(auth): …`).
- Código pensado para pasar SonarQube: manejadores solo en `<button>` nativos, sin JSX dentro de arreglos, sin índices como `key`, sin ternarios anidados y props con `Readonly<{…}>`.
- Un solo sistema visual para todas las pantallas (mismo header, tipografía, tarjetas y botones).
- Las atribuciones de TMDB, JustWatch y OMDb son obligatorias y no se quitan.
- `graphify-out/` (grafo de código para navegar el repo) es local y no se sube; se refresca con `graphify update .`.

## Paleta (regla 60-30-10)

- **60 %** fondo de sala de cine `#0F0F14`.
- **30 %** texto `#F4F4F4`, grises, bordes y tarjetas `#1F1F2E`. Selección, foco y progreso van en blanco.
- **10 %** rojo `#E50914`, solo en el botón de acción principal (`.btn-primary`); con texto blanco da 4.8:1 (WCAG AA).

El botón de Google sigue el tema oscuro de las [guías de marca de Sign in with Google](https://developers.google.com/identity/branding-guidelines). Los pósters conservan sus colores: son contenido, no interfaz.

## Créditos de datos

TMDB exige mostrar su logo y el aviso "This product uses the TMDB API but is not endorsed or certified by TMDB", además de atribuir a JustWatch los datos de plataformas; OMDb pide citar su licencia CC BY-NC 4.0. Todo eso está en la sección Créditos de Contacto (`src/components/Credits.tsx`) y **no debe quitarse** al conectar el backend.

Otros créditos:
- El mural de `src/components/DriftWall.jsx` viene de [React Bits](https://github.com/DavidHDev/react-bits), adaptado.
- Íconos: [Phosphor](https://phosphoricons.com). Logos de plataformas y cine: archivos de `src/assets/platforms/`.
- La galería de resultados toma como referencia [a24.raviklaassens.com](https://a24.raviklaassens.com/) y la landing, [14islands.com](https://www.14islands.com/), con los colores de la app.

## Autor

Andrey Jiménez, estudiante avanzado de Ingeniería en Computación del Tecnológico de Costa Rica (TEC). [GitHub](https://github.com/Andreysillo)
