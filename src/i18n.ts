const es = {
  tag: 'Recomendador de cine', welcomeDesc: 'Basta de scrollear 40 minutos. Respondes, nosotros elegimos la de esta noche.', google: 'Continuar con Google', guest: 'Entrar como invitado', faq: 'FAQ', sug: 'Sugerencias', langHint: 'Cambiar idioma', hi: 'Hola de nuevo,',
  typeTitle: '¿Cómo quieres hacerlo?', typeDesc: 'Elige el tipo de encuesta. Puedes repetirla las veces que quieras.', typeFull: 'Encuesta completa', typeFullD: 'Secuencia larga que clava tus gustos con certeza.', typeShort: 'Encuesta resumida', typeShortD: 'Versión corta para salir del paso rápido.', typeCustom: 'Personalizada', typeCustomD: 'Tú eliges qué responder, sin límite de tiempo.', min: 'min', youChoose: 'tú eliges',
  recTitle: '¿Qué recomendación quieres?', recDesc: 'Elige una o varias. Cada una será su propia pantalla.', recMovies: 'Películas', recMoviesD: 'duelos y favoritas', recGenres: 'Géneros', recGenresD: 'rueda de opciones', recDirector: 'Director', recDirectorD: 'rueda de opciones', recThemes: 'Themes', recThemesD: 'rueda de opciones', start: 'Empezar →',
  center: 'En el centro', moviesQ: 'De estas, ¿cuáles te laten?', moviesHint: 'el color revela lo que miras · toca para elegir', moodQ: '¿Qué se te antoja hoy?', moodHint: 'arrastra o usa scroll para pasar los géneros', moodPick: 'Toca una tarjeta para elegir — puedes escoger varios',
  loadingTitle: 'Calculando tu perfil…', wrappedTitle: 'Tu Wrapped de esta sesión', chooseForMe: 'Elegir por mí', wGenre: 'GÉNERO DOMINANTE', wRareza: 'RAREZA · CINÉFILO', wCine: 'CINE FAVORITO', wNota: 'NOTA MEDIA',
  usefulAsk: '¿Las recomendaciones te sirvieron?', useful: 'Sí, me sirvieron', notUseful: 'No mucho', sugAsk: '¿Alguna sugerencia para MiPeli?', sugPh: 'Escríbelo aquí…', send: 'Enviar', share: 'Compartir',
  homeH1: 'Elige con la mirada', homeDesc: 'Pasa el cursor por el muro: el póster que toques se enciende. ¿Aún con pereza?', startSurvey: 'Empezar encuesta', scrollFeed: 'VER EL MURO',
  faqTitle: 'Preguntas frecuentes', aboutKick: 'SOBRE EL AUTOR', authorName: 'xxx', authorBio: 'Estudiante de xxx, estudiando en xxx, con una gran pasión por las películas y el software.', close: 'Cerrar',
  rouletteKick: 'RULETA RÁPIDA', rouletteHeadline: 'Tu película para hoy', rouletteSub: 'Tienes 10 segundos para cerrar la pestaña e ir a verla.', spin: '🎲 Girar', spinning: 'Girando…',
  lengthLabel: 'Largo de la encuesta', lenShort: 'Corta', lenMed: 'Media', lenLong: 'Larga',
  duelQ: '¿Con cuál te quedas?', duelHint: 'toca tu favorita · duelo', duelVs: 'vs', numMoviesLabel: '¿Cuántas películas?', recSetTitle: 'Tus películas recomendadas', recSetHint: 'en gris; se iluminan a color donde pasas el cursor',
  listIdeasTitle: 'Ideas de listas para crear', listIdeasDesc: 'A partir de tus gustos, listas que valdría la pena crear:',
  quickRec: 'Otra recomendación (sin encuesta)', redoTitle: 'Repetir encuesta', redoSame: 'Mismas preguntas', redoDiff: 'Unas diferentes',
  surveyFull: 'ENCUESTA COMPLETA', surveyShort: 'ENCUESTA RESUMIDA', surveyCustom: 'ENCUESTA PERSONALIZADA', selected: 'seleccionadas',
  next: 'Continuar', seeResult: 'Ver resultado', back: 'Volver', continueSurvey: 'Continuar encuesta',
  loadingSub: 'cruzando 342 títulos · 12 respuestas', pickAtLeastOne: 'Elige al menos una opción',
  freshPick: 'Nueva recomendación con tus gustos guardados', thanksSug: '¡Gracias! Tu sugerencia llegó a Kevin.', linkCopied: 'Enlace copiado 🔗', shareFallback: 'Comparte: ',
};

export type Strings = typeof es;
export type Lang = 'es' | 'en';

const en: Strings = {
  tag: 'Movie recommender', welcomeDesc: 'Stop scrolling for 40 minutes. You answer, we pick tonight’s film.', google: 'Continue with Google', guest: 'Continue as guest', faq: 'FAQ', sug: 'Suggestions', langHint: 'Switch language', hi: 'Welcome back,',
  typeTitle: 'How do you want to do it?', typeDesc: 'Pick a survey type. Repeat it as many times as you like.', typeFull: 'Full survey', typeFullD: 'A long sequence that nails your taste for sure.', typeShort: 'Quick survey', typeShortD: 'Short version to decide fast.', typeCustom: 'Custom', typeCustomD: 'You choose what to answer, no time limit.', min: 'min', youChoose: 'you choose',
  recTitle: 'What kind of recommendation?', recDesc: 'Pick one or several. Each becomes its own screen.', recMovies: 'Movies', recMoviesD: 'duels & favorites', recGenres: 'Genres', recGenresD: 'option wheel', recDirector: 'Director', recDirectorD: 'option wheel', recThemes: 'Themes', recThemesD: 'option wheel', start: 'Start →',
  center: 'Centered', moviesQ: 'Which of these speak to you?', moviesHint: 'color reveals what you look at · tap to pick', moodQ: 'What are you in the mood for?', moodHint: 'drag or scroll to browse genres', moodPick: 'Tap a card to choose — you can pick several',
  loadingTitle: 'Computing your profile…', wrappedTitle: 'Your Wrapped for this session', chooseForMe: 'Choose for me', wGenre: 'TOP GENRE', wRareza: 'RARITY · CINEPHILE', wCine: 'FAVORITE CINEMA', wNota: 'AVG RATING',
  usefulAsk: 'Were the recommendations useful?', useful: 'Yes, they helped', notUseful: 'Not really', sugAsk: 'Any suggestion for MiPeli?', sugPh: 'Type it here…', send: 'Send', share: 'Share',
  homeH1: 'Choose with your eyes', homeDesc: 'Hover the wall: the poster you touch lights up. Still too lazy?', startSurvey: 'Start survey', scrollFeed: 'SEE THE WALL',
  faqTitle: 'Frequently asked', aboutKick: 'ABOUT THE AUTHOR', authorName: 'xxx', authorBio: 'A xxx student, studying at xxx, with a deep passion for film and software.', close: 'Close',
  rouletteKick: 'QUICK ROULETTE', rouletteHeadline: 'Your movie for today', rouletteSub: 'You have 10 seconds to close the tab and go watch it.', spin: '🎲 Spin', spinning: 'Spinning…',
  lengthLabel: 'Survey length', lenShort: 'Short', lenMed: 'Medium', lenLong: 'Long',
  duelQ: 'Which one do you pick?', duelHint: 'tap your favorite · duel', duelVs: 'vs', numMoviesLabel: 'How many movies?', recSetTitle: 'Your recommended movies', recSetHint: 'grayscale; they light up in color where you hover',
  listIdeasTitle: 'List ideas to create', listIdeasDesc: 'From your taste, lists worth creating:',
  quickRec: 'Another recommendation (no survey)', redoTitle: 'Redo survey', redoSame: 'Same questions', redoDiff: 'Different ones',
  surveyFull: 'FULL SURVEY', surveyShort: 'QUICK SURVEY', surveyCustom: 'CUSTOM SURVEY', selected: 'selected',
  next: 'Continue', seeResult: 'See result', back: 'Back', continueSurvey: 'Continue survey',
  loadingSub: 'crossing 342 titles · 12 answers', pickAtLeastOne: 'Pick at least one option',
  freshPick: 'Fresh pick from your saved taste', thanksSug: 'Thanks! Your suggestion reached Kevin.', linkCopied: 'Link copied 🔗', shareFallback: 'Share: ',
};

export const L: Record<Lang, Strings> = { es, en };
