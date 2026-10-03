# Cómo recomienda MiPeli: contrato con el backend

El frontend recomienda hoy con un catálogo de demo (`src/data.tsx`) y una heurística local (`src/recommend.ts`). Este documento fija qué manda el frontend, qué debe devolver el backend y cómo conviene armarlo con TMDB (base) y TasteDive (refuerzo opcional). Al conectar el backend se reemplaza `recommend()` por una llamada; la interfaz no cambia.

## 1. Qué manda el frontend (`Answers` en `src/recommend.ts`)

| Campo | Qué es | De dónde sale | Cómo se usa en TMDB |
|---|---|---|---|
| `moods[]` | Hasta 2 sensaciones: `laugh`, `tension`, `feel`, `mind`, `epic`, `scare`, `cozy`, `real` | Paso 1 | Suben el puntaje; se traducen a `with_genres` (OR con `\|`) y `with_keywords`. La traducción vive en el backend (config), no en el frontend |
| `maxRuntime` | Minutos máximos o `null` | Paso 2 | `with_runtime.lte` |
| `company` | `solo`, `couple`, `friends`, `family` | Paso 2 | `family` excluye terror, thriller y crimen (`without_genres`); las demás suman géneros |
| `avoid[]` | Géneros a evitar | Paso 2 (se guarda) | `without_genres` |
| `duelPicks[]` | Ganadoras de los duelos | Paso 3 | Anclas de peso 0,6 |
| `liked[]` | Favoritas escritas o tocadas (máx. 3) | Paso 4 | Anclas de peso 1 |
| `boosted[]` | "Más como esta" desde los resultados | Afinar | Anclas de peso 0,8; la película sigue en la lista |
| `seen[]`, `disliked[]` | "Ya la vi", "No me interesa" | Afinar | Se excluyen |
| `ownedPlatforms[]` | Plataformas del usuario y, si va al cine, `Cine` (se guardan) | Paso 5 / resultados | `watch_region=CR`, `with_watch_providers` (ids separados por `\|`) y `with_watch_monetization_types=flatrate`. `Cine` no es un proveedor de TMDB: ver la sección 7 |

En el frontend las películas se identifican por título (demo). El backend usará ids de TMDB y el frontend los enviará tal cual (`liked`, `duelPicks`… pasan a ser listas de ids).

## 2. Qué debe devolver

Una lista ordenada de `Rec` = `Movie` (ver `src/data.tsx`) más:

- `reasons`: hasta 2 de `{ kind: 'director' | 'liked' | 'mood' | 'platform' | 'cinema', ref }`. `ref` es el título de la película ancla, la clave del mood o el nombre de la plataforma; `cinema` se dibuja como "En cines" y no necesita `ref`. Se muestra antes que el mood porque solo caben 2 razones.
- `flags`: `offPlatform` (no está en las plataformas del usuario, cine incluido) y `overRuntime` (dura más de `maxRuntime`).
- `platforms`: nombres de plataforma donde está; si está en cartelera, incluye `'Cine'` (sección 7).

Orden: primero las que cumplen todas las restricciones (sin `flags`), cada grupo por puntaje. Las que incumplen solo salen si no alcanzan las que sí cumplen, y siempre marcadas.

Además: los duelos (4 pares con contraste de tono, época y estilo), las sugerencias de favoritas y la búsqueda de títulos. Hoy son datos locales (`duels` y `suggestions` en `src/survey.ts`, `searchMovies`); con backend serán `/search/movie` de TMDB y listas servidas por él (de `/trending` o curadas).

## 3. Algoritmo propuesto (solo TMDB)

1. **Candidatas**, unión sin repetidas y sin las ya vistas, descartadas o elegidas:
   - `GET /3/movie/{id}/recommendations` de cada ancla (máx. 5 anclas; una ancla pesa más si es favorita). Una película recomendada desde varias anclas puntúa más (cuenta de coincidencias).
   - `GET /3/discover/movie` con los filtros de arriba más un piso de calidad (`vote_count.gte` ≈ 300 y `vote_average.gte` ≈ 6,3), 1 o 2 páginas, `sort_by=popularity.desc` o `vote_average.desc`.
   - `/similar` solo como relleno: según la comunidad usa géneros y keywords y es más ruidoso (no es una garantía oficial; validar con pruebas).
2. **Detalle** solo de las mejores ~30: `GET /3/movie/{id}?append_to_response=credits,keywords,watch/providers`. Cachear por id (≈ 24 h).
3. **Puntaje** (valores iniciales, los mismos del demo): nota/10, + 1,6 por cada género del mood (máx. 2), + afinidad con las anclas (género Jaccard × 1,5, mismo director +1,5, reparto compartido +0,5, época ±8 años +0,3; tope 4), + 0,5 por género que suma la compañía. Con keywords y reparto reales, la afinidad mejora (Jaccard de keywords).
4. **Diversidad**: evitar 5 películas del mismo director o saga (reordenar con MMR).
5. **Respuesta**: las N pedidas más unos extras, con `reasons` y `flags`, y la nota de IMDb solo de las que se devuelven (OMDb por `imdb_id`).
6. **Presupuesto**: ≈ 5 recomendaciones + 2 discover + ≤ 30 detalles ≈ 40 llamadas por encuesta, muchas menos con caché. TMDB no publica un límite fijo (hoy ≈ 40-50 req/s y puede cambiar): reintentar con espera ante `429`.
7. **Idioma y región**: `language=es-MX` o `en-US` según el idioma de la interfaz; géneros con `GET /3/genre/movie/list?language=es`; plataformas de `GET /3/watch/providers/movie?watch_region=CR` (cruzar por nombre con `platforms` en `src/data.tsx`).

## 4. TasteDive (opcional, después)

**Qué aporta**: con varios títulos que le gustan, `GET https://tastedive.com/api/similar?q=movie:Oldboy,movie:Parasite&type=movies&limit=20&k=KEY` devuelve similares que mezclan gustos de distintos géneros (`Similar.Results[].Name/Type`; `info=1` agrega teaser, Wikipedia y YouTube). Complementa a `/recommendations`, que va película por película.

**Qué no hace**: solo devuelve nombres (sin id, póster ni año) y no filtra por plataforma, duración ni año.

**Cómo usarlo**:
- Solo desde el backend (la key es secreta). Llamarlo con las anclas (`liked` + `duelPicks`) y sumar sus resultados a las candidatas.
- Convertir cada nombre a TMDB: `GET /3/search/movie?query=<nombre>`; quedarse con el que coincide exacto (sin mayúsculas) y tiene más popularidad; descartar si es ambiguo. Cachear el cruce nombre → id.
- Tratarlo como un bono en el puntaje (por su posición en la lista), nunca como filtro.
- Corte de circuito: si responde `429`, falla o tarda más de ~2 s, seguir sin él (el resultado es el de la sección 3).

**Límites y riesgos**: key gratis con 300 solicitudes por hora; API "legacy" desde que TasteDive se unió a Qloo (2019), sigue activa sin fecha pública de cierre. **Términos de uso comerciales sin verificar** (su página dio 403 al revisarla): leerlos en https://tastedive.com/read/api antes de depender de él.

**Decidir si se queda** con una prueba corta: 10 perfiles de 3 favoritas; para cada uno comparar A (solo TMDB) contra B (TMDB + TasteDive) en: porcentaje disponible en CR en las plataformas del perfil, solapamiento y relevancia puntuada a mano de 1 a 5. Se queda si B mejora la relevancia media en ≥ 0,5 y el cruce de nombres falla en menos del 5 %.

## 5. Datos, claves y atribuciones

- La key de TMDB (y la de TasteDive y OMDb) viven solo en el backend, nunca en el bundle.
- TMDB es gratis para uso no comercial con atribución (logo y aviso en Contacto, ya puestos); si MiPeli llega a generar ingresos hace falta licencia comercial.
- Las plataformas vienen de TMDB `watch/providers` y exigen atribuir a **JustWatch**; las notas de IMDb vienen de OMDb (CC BY-NC 4.0). Ambas atribuciones ya están en `src/components/Credits.tsx` y en la ficha.
- Cuando el backend guarde respuestas o perfiles, actualizar el texto de privacidad de FAQ y Contacto.

## 6. Qué reemplaza qué en el frontend

| Hoy (demo) | Con backend |
|---|---|
| `recommend()` en `src/recommend.ts` | `POST /recommend` con `Answers`; devuelve `Rec[]` |
| `searchMovies()` en `src/survey.ts` | `GET /search?q=` (TMDB `/search/movie`) |
| `duels`, `suggestions` en `src/survey.ts` | `GET /survey/duels` y `GET /survey/suggestions` |
| `catalog` en `src/data.tsx` | Se elimina; `poster()` se reemplaza por la imagen de TMDB |
| `npm run check` (`src/recommend.check.ts`) | Se convierte en pruebas del backend con los mismos casos |
| Marcas `'Cine'` en `catalog` (demo) | Sección 7: se calcula con TMDB |
| `loadRuns` y `storeRuns` en `src/history.ts` | `GET`, `POST` y `DELETE /surveys` (sección 8) |

## 7. Cine (películas en salas)

**Qué ve el usuario:** si una película está en cines, `platforms` la incluye como `'Cine'` (primero de la lista). El usuario puede marcar "En cines" junto a sus plataformas: lo que está en cartelera cuenta como suyo y sale con la razón `cinema`; si no lo marca y pidió plataformas, sale al final y marcada `offPlatform`, como cualquier título fuera de sus plataformas. La ficha dice solo "En cines": no hay enlace ni horarios.

**Cómo saberlo con TMDB** (según la documentación de `discover/movie`, `now_playing` y `release_dates`):
- **Candidatas en cartelera:** `GET /3/discover/movie?region=CR&with_release_type=2|3&release_date.gte={hoy − 45 días}&release_date.lte={hoy}` más los filtros de la encuesta (géneros, duración, nota mínima). Con `region`, `release_date.*` usa la fecha de estreno de ese país; `with_release_type` 2 es estreno limitado y 3 estreno general (1 premiere o festival, 4 digital, 5 físico, 6 TV). `GET /3/movie/now_playing?region=CR` es lo mismo con una ventana automática y sin filtros.
- **Marcar `Cine` en una película que ya es candidata** (por ejemplo, llegó por `/recommendations`): `GET /3/movie/{id}/release_dates`, buscar en `CR` una fecha de tipo 2 o 3 dentro de la ventana.
- **Estrenos exclusivos:** sin proveedor `flatrate`, `free` ni `ads` en `watch/providers` de CR y con estreno en la ventana ⇒ solo en cines. No hace falta otra marca: `platforms` queda `['Cine']`.
- **Reestrenos:** salen solo si TMDB tiene para CR una fecha de tipo 2 o 3 dentro de la ventana (por ejemplo, un reestreno de aniversario). Son datos que carga la comunidad y en países pequeños pueden faltar.

**Qué no da TMDB:** horarios, salas ni cadena (Cinépolis, Cinemark…). Si más adelante se quiere, se agrega un enlace a la cartelera de la cadena por país; sin scraping.

**Antes de depender de esto:** con la key, comparar durante dos semanas `now_playing?region=CR` contra la cartelera real de las cadenas. Si cubre menos de ~70 % de los títulos, completar con otra fuente de cartelera local o probar con una región vecina.

**Caché:** la lista de cartelera, ≤ 12 h (cambia cada semana); `release_dates` por película, 24 h. **Atribución:** las fechas de estreno son datos de TMDB (aviso ya en Contacto); JustWatch aplica solo al streaming.

## 8. Encuestas guardadas (Mi perfil)

**Hoy:** cada cuenta guarda hasta 30 encuestas en su navegador (`src/history.ts`, `localStorage['mipeli:runs:<uid>']`). Cada una es `{ id, at, titles, answers }`: `answers` son las señales de la sección 1 (menos `ownedPlatforms`, que es preferencia de hoy) más `numMovies`, y `titles` es una foto de lo recomendado. Se crea al llegar a resultados, se actualiza al afinar y, al reabrirla, se restauran las respuestas y se recalcula.

**Con backend** se reemplazan `loadRuns` y `storeRuns` por:
- `GET /surveys` (más recientes primero), `POST /surveys` (crea o actualiza por `id`) y `DELETE /surveys/{id}`.
- Autenticación con `Authorization: Bearer <user.getIdToken()>`; el backend lo verifica con Firebase Admin y usa el `uid` como dueño. Tope de 30 por usuario (se borra la más antigua).
- Guardar la foto como **ids de TMDB**, no solo las respuestas: así reabrir muestra exactamente lo que se recomendó ese día aunque cambien la cartelera, las plataformas o el algoritmo. "Ver resultados" mostraría esa foto (con los datos al día de cada id) y un botón aparte, "Repetir con estas respuestas", volvería a calcular.
- Migración opcional: al primer inicio de sesión con backend, subir las encuestas que haya en el navegador.
- Privacidad: pasan a ser datos que MiPeli guarda en un servidor ⇒ actualizar `privacyPoints` y la FAQ (hoy dicen que viven solo en el navegador) y ofrecer el borrado de cuenta y datos.
