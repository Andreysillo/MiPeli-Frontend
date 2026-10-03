import { useState } from 'react';
import { Check, X } from '@phosphor-icons/react';
import { byTitle, poster, type Movie } from '../data';
import { MAX_FAVORITES, searchMovies, suggestions } from '../survey';
import { useApp } from '../store';
import StepHeader from './StepHeader';

// Paso 4: hasta tres películas que ama (las que pesan más en el resultado). Buscador sobre el catálogo de demo y sugerencias para tocar.
// ponytail: con backend, el buscador usa TMDB /search/movie y las sugerencias salen de /trending o una lista curada.
export default function FavoritesStep() {
  const { st, set, t } = useApp();
  const [query, setQuery] = useState('');
  const full = st.liked.length >= MAX_FAVORITES;
  const matches = searchMovies(query).filter(m => !st.liked.includes(m.title));
  const searching = query.trim().length >= 2;

  const toggle = (m: Movie) => {
    if (st.liked.includes(m.title)) set({ liked: st.liked.filter(x => x !== m.title) });
    else if (!full) set({ liked: [...st.liked, m.title] });
  };
  const add = (m: Movie) => { toggle(m); setQuery(''); };

  return (
    <>
      <StepHeader title={t.favoritesQ} hint={t.favoritesHint(MAX_FAVORITES)} />
      <div className="mp-stack" style={{ gap: 28, marginTop: 32 }}>
        <div data-reveal className="mp-stack" style={{ gap: 12 }}>
          <label htmlFor="fav-search" className="mp-kicker">{t.searchLabel}</label>
          <input id="fav-search" type="search" className="mp-input mp-search" value={query} onChange={e => setQuery(e.target.value)}
            placeholder={t.searchPh} autoComplete="off" spellCheck={false} disabled={full} />
          {searching && matches.length === 0 && <p className="mp-label" role="status">{t.noMatch}</p>}
          {matches.length > 0 && (
            <ul className="mp-search-list">
              {matches.map(m => (
                <li key={m.title}>
                  <button onClick={() => add(m)}>
                    <img src={poster(m)} alt="" width={40} height={60} />
                    <span className="mp-search-title">{m.title}</span>
                    <span className="mp-label tnum">{m.year} · {m.director}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div data-reveal className="mp-stack" style={{ gap: 10 }} aria-live="polite">
          <span className="mp-kicker tnum">{t.picked(st.liked.length)}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 40 }}>
            {st.liked.map(title => (
              <button key={title} className="mp-chip" onClick={() => toggle(byTitle(title))} aria-label={`${t.remove} ${title}`}>
                {title}<X size={14} weight="bold" aria-hidden />
              </button>
            ))}
          </div>
        </div>

        <div data-reveal className="mp-stack" style={{ gap: 12 }}>
          <span className="mp-kicker">{t.orTap}</span>
          <div className="mp-sugs">
            {suggestions.map(m => (
              <button key={m.title} className="mp-poster-btn mp-sug" aria-pressed={st.liked.includes(m.title)} aria-label={m.title}
                disabled={full && !st.liked.includes(m.title)} onClick={() => toggle(m)}>
                <img src={poster(m)} alt="" />
                <span className="mp-check"><Check size={14} weight="bold" aria-hidden /></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
