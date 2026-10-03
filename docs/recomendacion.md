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
| `ownedPlatforms[]` | Plataformas del usuario (se guardan) | Paso 5 / resultados | `watch_region=CR`, `with_watch_providers` (ids separados por `\|`) y `with_watch_monetization_types=flatrate` |

En el frontend las películas se identifican por título (demo). El backend usará ids de TMDB y el frontend los enviará tal cual (`liked`, `duelPicks`… pasan a ser listas de ids).

## 2. Qué debe devolver

Una lista ordenada de `Rec` = `Movie` (ver `src/data.tsx`) más:

- `reasons`: hasta 2 de `{ kind: 'director' | 'liked' | 'mood' | 'platform', ref }`. `ref` es el título de la película ancla, la clave del mood o el nombre de la plataforma.
- `flags`: `offPlatform` (no está en las plataformas del usuario) y `overRuntime` (dura más de `maxRuntime`).

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
