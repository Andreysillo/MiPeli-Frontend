// Comprobación rápida del recomendador de demo: `npm run check`. Falla con un error si alguna regla deja de cumplirse.
import { catalog } from './data';
import { recommend, type Answers } from './recommend';

const base: Answers = { moods: ['tension'], maxRuntime: null, company: 'solo', avoid: [], duelPicks: [], liked: [], boosted: [], disliked: [], seen: [], ownedPlatforms: [] };
const ok = (cond: boolean, msg: string) => { if (!cond) throw new Error(`recommend: ${msg}`); };
const titles = (a: Partial<Answers>) => recommend({ ...base, ...a }).map(m => m.title);

ok(titles({}).length === catalog.length, 'sin filtros salen todas');
ok(titles({ avoid: ['Terror'] }).every(t => !catalog.find(m => m.title === t)!.genres.includes('Terror')), 'evitar un género lo excluye');
ok(!titles({ liked: ['Oldboy'] }).includes('Oldboy') && !titles({ duelPicks: ['Seven'] }).includes('Seven'), 'las elegidas no se repiten');
ok(!titles({ seen: ['Parasite'], disliked: ['Drive'] }).some(t => t === 'Parasite' || t === 'Drive'), 'vistas y descartadas no salen');
ok(titles({ boosted: ['Oldboy'] }).includes('Oldboy'), '"más como esta" no la saca de la lista');
ok(titles({ company: 'family' }).every(t => !catalog.find(m => m.title === t)!.genres.some(g => ['Terror', 'Thriller', 'Crimen'].includes(g))), 'en familia no sale terror, thriller ni crimen');

const mubi = recommend({ ...base, ownedPlatforms: ['Mubi'] });
const firstOff = mubi.findIndex(m => m.flags.includes('offPlatform'));
ok(mubi[0].platforms.includes('Mubi') && mubi.slice(0, firstOff).every(m => m.platforms.includes('Mubi')), 'las de tus plataformas van primero');
ok(mubi.find(m => m.title === 'Past Lives')!.flags.includes('offPlatform'), 'lo que solo está en cines sale marcado si no eliges Cine');

const cine = recommend({ ...base, ownedPlatforms: ['Cine'] });
const firstOffCine = cine.findIndex(m => m.flags.includes('offPlatform'));
ok(cine.slice(0, firstOffCine).every(m => m.platforms.includes('Cine')) && cine[0].reasons.some(r => r.kind === 'cinema'), 'las que están en cines van primero y lo dicen');
ok(recommend({ ...base, maxRuntime: 100 }).filter(m => m.flags.includes('overRuntime')).every(m => m.runtime > 100), 'la marca de duración solo va en las que se pasan');
ok(recommend({ ...base, liked: ['Parasite'] }).find(m => m.title === 'Mother')!.reasons[0]?.kind === 'director', 'mismo director explica la recomendación');

console.log('recommend: ok');
