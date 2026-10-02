const es = {
  langHint: 'Cambiar idioma', navHome: 'Inicio', navContact: 'Contacto',
  heroTitle: 'Tu película de esta noche, en dos minutos.',
  heroDesc: 'Responde unas preguntas rápidas y te recomendamos qué ver. Sin scrollear 40 minutos.',
  google: 'Continuar con Google', guest: 'Entrar como invitado', guestName: 'invitado', faq: 'Preguntas frecuentes', sug: 'Sugerencias',
  hi: (user: string) => `Hola, ${user}`,

  typeTitle: '¿Cómo quieres hacerlo?', typeDesc: 'Elige un tipo de encuesta. Puedes repetirla cuando quieras.',
  typeFull: 'Encuesta completa', typeFullD: 'Secuencia larga que clava tus gustos con certeza.',
  typeShort: 'Encuesta resumida', typeShortD: 'Versión corta para decidir rápido.',
  typeCustom: 'Personalizada', typeCustomD: 'Tú eliges qué responder, sin límite de tiempo.',
  recommendedTag: 'Recomendada', youChoose: 'Tú decides', min: 'min',

  recTitle: '¿Qué quieres que te recomendemos?', recDesc: 'Elige una o varias. Cada una será su propia pantalla.',
  recMovies: 'Películas', recMoviesD: 'Duelos entre películas y tus favoritas. La forma más precisa de acertar.', bestTag: 'La más precisa', recGenres: 'Géneros', recGenresD: 'Rueda de opciones',
  recDirector: 'Director', recDirectorD: 'Rueda de opciones',
  numMoviesLabel: '¿Cuántas películas quieres al final?', lengthLabel: 'Largo de la encuesta', lenShort: 'Corta', lenMed: 'Media', lenLong: 'Larga',
  changeType: 'Cambiar tipo', start: 'Empezar', pickAtLeastOne: 'Elige al menos una opción para empezar.',
  summary: (steps: number, mins: number) => `${steps} pasos, unos ${mins} min`,

  stepNames: { genres: 'Género', director: 'Director', duel: 'Duelos', movies: 'Películas', personal: 'Ánimo' },
  stepOf: (i: number, n: number) => `Paso ${i} de ${n}`,
  qGenres: '¿Qué género te apetece hoy?', qDirector: '¿Qué director te gusta más?',
  wheelHint: 'Desliza la rueda o toca una opción. En teclado, usa las flechas.', yourPick: 'Tu elección',
  duelQ: '¿Con cuál te quedas?', duelHint: 'Toca tu favorita.', duelOf: (i: number, n: number) => `Duelo ${i} de ${n}`, duelVs: 'vs',
  moviesQ: 'De estas, ¿cuáles te laten?', moviesHint: 'Toca para marcar. Puedes elegir varias.', picked: (n: number) => (n === 1 ? '1 elegida' : `${n} elegidas`),
  moodQ: '¿Qué se te antoja hoy?', moodHint: 'Arrastra la galería y toca los géneros que quieras.', moodEmpty: 'Aún no elegiste ninguno.', remove: 'Quitar',
  next: 'Siguiente', seeResult: 'Ver mis resultados', back: 'Atrás',

  loadingTitle: 'Calculando tu perfil…', loadingDone: (n: number) => (n === 1 ? 'Listo, encontramos tu película' : `Listo, encontramos ${n} películas`), loadingSteps: ['Analizando tus respuestas', 'Cruzando géneros y directores', 'Eligiendo tu película'],

  tonightKick: 'Tu película para esta noche', yourMovies: (n: number) => `Tus ${n} películas para esta noche`,
  because: (genre: string, director?: string) => {
    const article = /^(Comedia|Ciencia ficción|Animación)$/.test(genre) ? 'la' : 'el';
    const by = director ? ` y el cine de ${director}` : '';
    return `Porque te va ${article} ${genre.toLowerCase()}${by}.`;
  },
  galleryHint: (n: number): string => (n === 1 ? 'Toca el póster para ver su ficha.' : 'Desliza, arrastra o usa las flechas. Toca un póster para ver su ficha.'),
  seeDetails: 'Ver ficha', posterOf: (title: string) => `Ver ficha de ${title}`, prev: 'Anterior', close: 'Cerrar',
  directedBy: 'Dirigida por', starring: 'Reparto', yearL: 'Año', genresL: 'Géneros', runtimeL: 'Duración', countryL: 'País', watchNow: 'Ver ahora en',
  whereToWatch: 'Puedes verla en:', openIn: (p: string) => `Ver en ${p} (abre en otra pestaña)`, imdbOf: (n: number) => `Calificación en IMDb: ${n} de 10`, share: 'Compartir',
  moreForYou: 'Más para ti', moreHint: 'Extras que también encajan con tus respuestas.',
  wrappedTitle: 'Tu Wrapped de esta sesión', wGenre: 'Género dominante', wRareza: 'Fuera de Hollywood', wCine: 'Cine favorito', wNota: 'Nota media en IMDb',
  usefulAsk: '¿Te sirvieron las recomendaciones?', useful: 'Sí, me sirvieron', notUseful: 'No mucho', thanksFeedback: 'Gracias, lo tendremos en cuenta.',
  redoTitle: '¿Otra ronda?', redoSame: 'Mismas preguntas', redoDiff: 'Otro tipo de encuesta', quickRec: 'Recomendación sin encuesta',

  homeH1: 'Elige con la mirada', homeDesc: 'Pasa el cursor por el muro: el póster que toques se enciende. ¿Prefieres que elijamos nosotros?',
  startSurvey: 'Empezar encuesta', continueSurvey: 'Continuar encuesta',

  faqTitle: 'Preguntas frecuentes', faqMore: '¿Te quedó otra duda?', faqWrite: 'Escríbenos',

  aboutKick: 'Sobre el autor', authorName: 'xxx', authorBio: 'Estudiante de xxx, estudiando en xxx, con una gran pasión por las películas y el software.',
  sugLabel: '¿Alguna sugerencia para MiPeli?', sugPh: 'Escríbela aquí', send: 'Enviar',

  freshPick: 'Nueva recomendación con tus gustos guardados', thanksSug: '¡Gracias! Tu sugerencia llegó a Kevin.', linkCopied: 'Enlace copiado', shareFallback: 'Comparte: ',
};

export type Strings = typeof es;
export type Lang = 'es' | 'en';

const en: Strings = {
  langHint: 'Switch language', navHome: 'Home', navContact: 'Contact',
  heroTitle: 'Tonight’s movie, in two minutes.',
  heroDesc: 'Answer a few quick questions and we tell you what to watch. No more 40 minutes of scrolling.',
  google: 'Continue with Google', guest: 'Continue as guest', guestName: 'guest', faq: 'FAQ', sug: 'Suggestions',
  hi: (user: string) => `Hi, ${user}`,

  typeTitle: 'How do you want to do it?', typeDesc: 'Pick a survey type. Repeat it whenever you like.',
  typeFull: 'Full survey', typeFullD: 'A long sequence that nails your taste for sure.',
  typeShort: 'Quick survey', typeShortD: 'Short version to decide fast.',
  typeCustom: 'Custom', typeCustomD: 'You choose what to answer, no time limit.',
  recommendedTag: 'Recommended', youChoose: 'You decide', min: 'min',

  recTitle: 'What should we recommend?', recDesc: 'Pick one or several. Each becomes its own screen.',
  recMovies: 'Movies', recMoviesD: 'Movie duels and your favorites. The most accurate way to get it right.', bestTag: 'Most accurate', recGenres: 'Genres', recGenresD: 'Option wheel',
  recDirector: 'Director', recDirectorD: 'Option wheel',
  numMoviesLabel: 'How many movies do you want at the end?', lengthLabel: 'Survey length', lenShort: 'Short', lenMed: 'Medium', lenLong: 'Long',
  changeType: 'Change type', start: 'Start', pickAtLeastOne: 'Pick at least one option to start.',
  summary: (steps: number, mins: number) => `${steps} steps, about ${mins} min`,

  stepNames: { genres: 'Genre', director: 'Director', duel: 'Duels', movies: 'Movies', personal: 'Mood' },
  stepOf: (i: number, n: number) => `Step ${i} of ${n}`,
  qGenres: 'What genre are you in the mood for?', qDirector: 'Which director do you like most?',
  wheelHint: 'Swipe the wheel or tap an option. On a keyboard, use the arrows.', yourPick: 'Your pick',
  duelQ: 'Which one do you pick?', duelHint: 'Tap your favorite.', duelOf: (i: number, n: number) => `Duel ${i} of ${n}`, duelVs: 'vs',
  moviesQ: 'Which of these speak to you?', moviesHint: 'Tap to mark. You can pick several.', picked: (n: number) => `${n} picked`,
  moodQ: 'What are you in the mood for?', moodHint: 'Drag the gallery and tap the genres you want.', moodEmpty: 'Nothing picked yet.', remove: 'Remove',
  next: 'Next', seeResult: 'See my results', back: 'Back',

  loadingTitle: 'Computing your profile…', loadingDone: (n: number) => (n === 1 ? 'Done, we found your movie' : `Done, we found ${n} movies`), loadingSteps: ['Analyzing your answers', 'Matching genres and directors', 'Picking your movie'],

  tonightKick: 'Your movie for tonight', yourMovies: (n: number) => `Your ${n} movies for tonight`,
  because: (genre: string, director?: string) => {
    const by = director ? ` and ${director}’s films` : '';
    return `Because you like ${genre.toLowerCase()}${by}.`;
  },
  galleryHint: (n: number) => (n === 1 ? 'Tap the poster to see its details.' : 'Swipe, drag or use the arrows. Tap a poster to see its details.'),
  seeDetails: 'View details', posterOf: (title: string) => `View details for ${title}`, prev: 'Previous', close: 'Close',
  directedBy: 'Directed by', starring: 'Starring', yearL: 'Year', genresL: 'Genres', runtimeL: 'Runtime', countryL: 'Country', watchNow: 'Watch now on',
  whereToWatch: 'You can watch it on:', openIn: (p: string) => `Watch on ${p} (opens in a new tab)`, imdbOf: (n: number) => `IMDb rating: ${n} out of 10`, share: 'Share',
  moreForYou: 'More for you', moreHint: 'Extras that also fit your answers.',
  wrappedTitle: 'Your Wrapped for this session', wGenre: 'Top genre', wRareza: 'Outside Hollywood', wCine: 'Favorite cinema', wNota: 'Average IMDb rating',
  usefulAsk: 'Were the recommendations useful?', useful: 'Yes, they helped', notUseful: 'Not really', thanksFeedback: 'Thanks, we’ll keep it in mind.',
  redoTitle: 'Another round?', redoSame: 'Same questions', redoDiff: 'Another survey type', quickRec: 'Pick without survey',

  homeH1: 'Choose with your eyes', homeDesc: 'Hover the wall: the poster you touch lights up. Rather have us pick?',
  startSurvey: 'Start survey', continueSurvey: 'Continue survey',

  faqTitle: 'Frequently asked questions', faqMore: 'Still have a question?', faqWrite: 'Write to us',

  aboutKick: 'About the author', authorName: 'xxx', authorBio: 'A xxx student, studying at xxx, with a deep passion for film and software.',
  sugLabel: 'Any suggestion for MiPeli?', sugPh: 'Write it here', send: 'Send',

  freshPick: 'Fresh pick from your saved taste', thanksSug: 'Thanks! Your suggestion reached Kevin.', linkCopied: 'Link copied', shareFallback: 'Share: ',
};

export const L: Record<Lang, Strings> = { es, en };
