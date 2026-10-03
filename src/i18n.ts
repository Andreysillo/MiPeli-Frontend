const es = {
  langHint: 'Cambiar idioma', navHome: 'Inicio', navContact: 'Contacto',
  google: 'Continuar con Google', guest: 'Entrar como invitado', guestName: 'invitado', faq: 'Preguntas frecuentes',
  continueAs: (user: string) => `Continuar como ${user}`, signOut: 'Cerrar sesión',
  loginTitle: 'Inicia sesión', registerTitle: 'Crea tu cuenta', tabLogin: 'Iniciar sesión', tabRegister: 'Crear cuenta', submitLogin: 'Entrar', submitRegister: 'Crear cuenta',
  nameLabel: 'Nombre', emailLabel: 'Correo electrónico', passwordLabel: 'Contraseña', passwordHint: 'Mínimo 6 caracteres.', showPassword: 'Mostrar contraseña', hidePassword: 'Ocultar contraseña',
  forgot: '¿Olvidaste tu contraseña?', needEmail: 'Escribe tu correo arriba y vuelve a pulsar “¿Olvidaste tu contraseña?”.', resetSent: 'Si ese correo tiene una cuenta, te enviamos un enlace para cambiar la contraseña.', or: 'o',
  authErrors: {
    'auth/invalid-credential': 'Correo o contraseña incorrectos.', 'auth/invalid-email': 'Ese correo no es válido.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Prueba a iniciar sesión.', 'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.', 'auth/network-request-failed': 'No hay conexión. Revisa tu internet e inténtalo de nuevo.',
    'auth/operation-not-allowed': 'El acceso con correo no está habilitado en Firebase.', 'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  },
  loginError: 'No pudimos iniciar sesión con Google. Inténtalo de nuevo.', popupBlocked: 'Tu navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
  hi: (user: string) => `Hola, ${user}`,
  restart: 'Reiniciar', startNew: 'Empezar una nueva',
  // Avisos antes de acciones que no se deshacen; `user` es el nombre de quien tiene sesión (null para invitados)
  confirm: {
    signout: {
      title: (user: string | null) => user ? `${user}, ¿seguro que quieres cerrar sesión?` : '¿Seguro que quieres cerrar sesión?',
      text: 'Puedes volver en cualquier momento si así lo deseas.', ok: 'Cerrar sesión', cancel: 'Quedarme',
    },
    restart: {
      title: (user: string | null) => user ? `${user}, ¿seguro que quieres empezar de nuevo?` : '¿Seguro que quieres empezar de nuevo?',
      text: 'Se borran tus respuestas hasta ahora y vuelves a elegir cómo hacer la encuesta.', ok: 'Empezar de nuevo', cancel: 'Cancelar',
    },
  },

  landing: {
    kicker: 'Recomendador de películas', intro: 'Respondes unas preguntas y te decimos qué ver esta noche, y dónde verlo.',
    headline: ['Tu película', 'de esta noche', 'en dos minutos'], scroll: 'Desliza',
    statement: 'Cuarenta minutos eligiendo qué ver. Cero minutos viéndolo. MiPeli te hace unas preguntas rápidas y te dice qué ver esta noche, y dónde verlo.',
    howLabel: 'Cómo funciona',
    steps: [
      { title: 'Responde', text: 'Unas preguntas rápidas: géneros, directores y duelos entre pósters. Sin listas infinitas.' },
      { title: 'Recibe', text: 'De 1 a 10 películas pensadas para tu noche, cada una con su ficha completa.' },
      { title: 'Mira', text: 'Cada recomendación te lleva directo a la plataforma donde puedes verla.' },
    ],
    showTitle: ['Pósters, fichas', 'y dónde verlas'],
    statsLabel: 'En números',
    stats: [{ value: 2, label: 'minutos de encuesta' }, { value: 10, label: 'películas como máximo por ronda' }, { value: 11, label: 'plataformas de streaming' }],
    platformsLabel: 'Dónde verlas',
    ctaTitle: ['¿Listo para', 'elegir?'], ctaText: 'Entra con Google, con tu correo o como invitado.', cta: 'Iniciar sesión',
    navLabel: 'Secciones', navStart: '¿Le entras a la recomendación?', navResume: '¡Continúa tu encuesta!', menu: 'Menú', menuClose: 'Cerrar',
  },

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

  continueSurvey: 'Continuar encuesta',

  faqTitle: 'Preguntas frecuentes', faqMore: '¿Te quedó otra duda?', faqMoreD: 'Escríbenos y te respondemos lo antes posible.', faqWrite: 'Escríbenos', faqKick: 'Ayuda',
  aboutBrand: 'Sobre MiPeli', studioStatement: 'MiPeli es un recomendador de películas. Respondes unas preguntas y te decimos qué ver esta noche, y dónde verlo.',
  contactLabel: 'Escríbenos', creditsLabel: 'Créditos',
  privacyLabel: 'Privacidad y datos',
  privacyPoints: [
    'Si entras con Google, Firebase (de Google) recibe tu nombre, correo y foto de perfil para mantener tu sesión. Si creas una cuenta con correo, guarda tu correo, tu nombre y una versión cifrada de tu contraseña, que MiPeli nunca ve. MiPeli solo usa tu nombre, para saludarte.',
    'Tus respuestas, el idioma y tu valoración se guardan solo en tu navegador. No se envían a ningún servidor, y al borrar los datos del sitio desaparecen.',
    'Lo que escribes en el formulario de sugerencias todavía no se envía ni se guarda en ningún lado.',
    'No vendemos ni compartimos tus datos, y no los usamos para publicidad.',
  ],
  privacyDelete: 'Para pedir que se borren tu cuenta o tus datos, escríbenos a', privacyNote: 'Esta es la versión de la aplicación sin servidor propio. Se actualizará cuando se conecte uno.',
  colMovies: 'Datos de películas', colProviders: 'Dónde ver', colRatings: 'Calificaciones',
  creditProviders: 'Datos de disponibilidad en plataformas de', creditRatings: 'Notas de IMDb obtenidas con', creditLicense: ', licencia CC BY-NC 4.0.',
  tmdbNotice: 'This product uses the TMDB API but is not endorsed or certified by TMDB.', availability: 'Disponibilidad:',

  aboutKick: 'Sobre el autor', authorName: 'xxx', authorBio: 'Estudiante de xxx, estudiando en xxx, con una gran pasión por las películas y el software.',
  sugLabel: '¿Alguna sugerencia para MiPeli?', sugPh: 'Escríbela aquí…', send: 'Enviar',

  freshPick: 'Nueva recomendación con tus gustos guardados', thanksSug: '¡Gracias! Tu sugerencia llegó a Andrey.', linkCopied: 'Enlace copiado', shareFallback: 'Comparte: ',
};

export type Strings = typeof es;
export type Lang = 'es' | 'en';

const en: Strings = {
  langHint: 'Switch language', navHome: 'Home', navContact: 'Contact',
  google: 'Continue with Google', guest: 'Continue as guest', guestName: 'guest', faq: 'FAQ',
  continueAs: (user: string) => `Continue as ${user}`, signOut: 'Sign out',
  loginTitle: 'Sign in', registerTitle: 'Create your account', tabLogin: 'Sign in', tabRegister: 'Create account', submitLogin: 'Sign in', submitRegister: 'Create account',
  nameLabel: 'Name', emailLabel: 'Email', passwordLabel: 'Password', passwordHint: 'At least 6 characters.', showPassword: 'Show password', hidePassword: 'Hide password',
  forgot: 'Forgot your password?', needEmail: 'Type your email above and press “Forgot your password?” again.', resetSent: 'If that email has an account, we sent you a link to reset the password.', or: 'or',
  authErrors: {
    'auth/invalid-credential': 'Wrong email or password.', 'auth/invalid-email': 'That email isn’t valid.',
    'auth/email-already-in-use': 'An account with that email already exists. Try signing in.', 'auth/weak-password': 'The password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.', 'auth/network-request-failed': 'No connection. Check your internet and try again.',
    'auth/operation-not-allowed': 'Email sign-in isn’t enabled in Firebase.', 'auth/user-disabled': 'This account is disabled.',
  },
  loginError: 'We couldn’t sign you in with Google. Please try again.', popupBlocked: 'Your browser blocked the Google window. Allow pop-ups and try again.',
  hi: (user: string) => `Hi, ${user}`,
  restart: 'Restart', startNew: 'Start a new one',
  confirm: {
    signout: {
      title: (user: string | null) => user ? `${user}, are you sure you want to sign out?` : 'Are you sure you want to sign out?',
      text: 'You can come back any time you like.', ok: 'Sign out', cancel: 'Stay signed in',
    },
    restart: {
      title: (user: string | null) => user ? `${user}, are you sure you want to start over?` : 'Are you sure you want to start over?',
      text: 'Your answers so far are cleared and you pick how to take the survey again.', ok: 'Start over', cancel: 'Cancel',
    },
  },

  landing: {
    kicker: 'Movie recommender', intro: 'Answer a few questions and we tell you what to watch tonight, and where to stream it.',
    headline: ['Your movie', 'for tonight', 'in two minutes'], scroll: 'Scroll',
    statement: 'Forty minutes choosing what to watch. Zero minutes watching it. MiPeli asks a few quick questions and tells you what to watch tonight, and where to stream it.',
    howLabel: 'How it works',
    steps: [
      { title: 'Answer', text: 'A few quick questions: genres, directors and poster duels. No endless lists.' },
      { title: 'Get', text: 'From 1 to 10 movies picked for your night, each with its full details.' },
      { title: 'Watch', text: 'Every recommendation takes you straight to the platform where you can watch it.' },
    ],
    showTitle: ['Posters, details', 'and where to watch'],
    statsLabel: 'In numbers',
    stats: [{ value: 2, label: 'minutes of survey' }, { value: 10, label: 'movies at most per round' }, { value: 11, label: 'streaming platforms' }],
    platformsLabel: 'Where to watch',
    ctaTitle: ['Ready to', 'choose?'], ctaText: 'Sign in with Google, with your email or as a guest.', cta: 'Sign in',
    navLabel: 'Sections', navStart: 'Up for a recommendation?', navResume: 'Continue your survey!', menu: 'Menu', menuClose: 'Close',
  },

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

  continueSurvey: 'Continue survey',

  faqTitle: 'Frequently asked questions', faqMore: 'Still have a question?', faqMoreD: 'Write to us and we’ll get back to you soon.', faqWrite: 'Write to us', faqKick: 'Help',
  aboutBrand: 'About MiPeli', studioStatement: 'MiPeli is a movie recommender. Answer a few questions and we tell you what to watch tonight, and where to stream it.',
  contactLabel: 'Get in touch', creditsLabel: 'Credits',
  privacyLabel: 'Privacy and data',
  privacyPoints: [
    'If you sign in with Google, Firebase (by Google) receives your name, email and profile photo to keep you signed in. If you create an account with email, it stores your email, your name and an encrypted version of your password, which MiPeli never sees. MiPeli only uses your name, to greet you.',
    'Your answers, language and feedback are stored only in your browser. They are not sent to any server, and clearing the site’s data removes them.',
    'What you type in the suggestions form is not sent or stored anywhere yet.',
    'We don’t sell or share your data, and we don’t use it for advertising.',
  ],
  privacyDelete: 'To ask for your account or data to be deleted, write to us at', privacyNote: 'This describes the app as it is without its own server. It will be updated when one is connected.',
  colMovies: 'Movie data', colProviders: 'Where to watch', colRatings: 'Ratings',
  creditProviders: 'Streaming availability data from', creditRatings: 'IMDb scores fetched with', creditLicense: ', CC BY-NC 4.0 license.',
  tmdbNotice: 'This product uses the TMDB API but is not endorsed or certified by TMDB.', availability: 'Availability:',

  aboutKick: 'About the author', authorName: 'xxx', authorBio: 'A xxx student, studying at xxx, with a deep passion for film and software.',
  sugLabel: 'Any suggestion for MiPeli?', sugPh: 'Write it here…', send: 'Send',

  freshPick: 'Fresh pick from your saved taste', thanksSug: 'Thanks! Your suggestion reached Andrey.', linkCopied: 'Link copied', shareFallback: 'Share: ',
};

export const L: Record<Lang, Strings> = { es, en };
