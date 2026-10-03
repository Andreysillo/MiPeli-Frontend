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
      text: 'Se borran tus respuestas hasta ahora y empiezas de nuevo desde la primera pregunta.', ok: 'Empezar de nuevo', cancel: 'Cancelar',
    },
  },

  landing: {
    kicker: 'Recomendador de películas', intro: 'Respondes unas preguntas y te decimos qué ver esta noche, y dónde verlo.',
    headline: ['Tu película', 'de esta noche', 'en dos minutos'], scroll: 'Desliza',
    statement: 'Cuarenta minutos eligiendo qué ver. Cero minutos viéndolo. MiPeli te hace unas preguntas rápidas y te dice qué ver esta noche, y dónde verlo.',
    howLabel: 'Cómo funciona',
    steps: [
      { title: 'Responde', text: 'Unas preguntas rápidas: tu ánimo, duelos entre pósters y tus favoritas. Sin listas infinitas.' },
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

  stepNames: { mood: 'Ánimo', context: 'Contexto', duel: 'Duelos', favorites: 'Favoritas', platforms: 'Plataformas' },
  stepOf: (i: number, n: number) => `Paso ${i} de ${n}`,
  moodQ: '¿Qué se te antoja esta noche?', moodHint: (max: number) => `Elige hasta ${max}.`,
  moodNames: {
    laugh: { name: 'Reír', hint: 'Algo ligero que me saque una sonrisa.' },
    tension: { name: 'Tensión', hint: 'Que no pueda ni parpadear.' },
    feel: { name: 'Emocionarme', hint: 'Historias que se sienten.' },
    mind: { name: 'Volar la cabeza', hint: 'Ciencia ficción, giros y preguntas grandes.' },
    epic: { name: 'Aventura', hint: 'Acción, mundos nuevos, algo épico.' },
    scare: { name: 'Un buen susto', hint: 'Luces apagadas y volumen alto.' },
    cozy: { name: 'Acurrucarme', hint: 'Cálida, familiar y sin estrés.' },
    real: { name: 'Algo real', hint: 'Documentales y vidas de verdad.' },
  },
  contextQ: 'Cuéntanos de tu noche', contextHint: 'Todo es opcional: nos ayuda a afinar.',
  timeLabel: '¿Cuánto tiempo tienes?', timeOption: (min: number | null) => (min ? `Hasta ${min} min` : 'Sin límite'),
  companyLabel: '¿Con quién la ves?', companyNames: { solo: 'Para mí', couple: 'En pareja', friends: 'Con amigos', family: 'En familia' },
  avoidLabel: '¿Algo que prefieras evitar?',
  duelQ: '¿Con cuál te quedas?', duelHint: 'Toca tu favorita.', duelOf: (i: number, n: number) => `Duelo ${i} de ${n}`, duelVs: 'vs', duelSkip: 'No conozco ninguna',
  favoritesQ: '¿Cuáles son tus favoritas?', favoritesHint: (max: number) => `Agrega hasta ${max}. Si no se te ocurre ninguna, sáltalo.`,
  searchLabel: 'Busca una película', searchPh: 'Escribe un título…', noMatch: 'No encontramos ese título en el catálogo.', orTap: 'O toca una de estas',
  picked: (n: number) => (n === 1 ? '1 elegida' : `${n} elegidas`), remove: 'Quitar',
  platformsQ: '¿Dónde ves películas?', platformsHint: 'Solo te mostraremos lo que puedas ver. Se guardan para la próxima vez.',
  numMoviesLabel: '¿Cuántas películas quieres ver?', myPlatforms: 'Tus plataformas',
  next: 'Siguiente', skip: 'Omitir', seeResult: 'Ver mis resultados', back: 'Atrás',

  loadingTitle: 'Calculando tu perfil…', loadingDone: (n: number) => (n === 1 ? 'Listo, encontramos tu película' : `Listo, encontramos ${n} películas`), loadingSteps: ['Analizando tus respuestas', 'Buscando películas parecidas', 'Comprobando dónde verlas'],

  tonightKick: 'Tu película para esta noche', yourMovies: (n: number) => `Tus ${n} películas para esta noche`,
  because: (list: string, liked?: string) => {
    const extra = liked ? ` y lo que elegiste, como ${liked}` : '';
    return `Según tu ánimo (${list})${extra}.`;
  },
  reasons: {
    director: (ref: string) => `Del mismo director que ${ref}`,
    liked: (ref: string) => `Parecida a ${ref}`,
    mood: (name: string) => `Va con tu ánimo: ${name.toLowerCase()}`,
    platform: (p: string) => `Está en ${p}`,
  },
  flags: { offPlatform: 'Fuera de tus plataformas', overRuntime: 'Dura más de lo que pediste' },
  refineSeen: 'Ya la vi', refineNo: 'No me interesa', refineMore: 'Más como esta',
  refinedSeen: 'Listo, la cambiamos por otra.', refinedNo: 'Anotado, no te la volveremos a mostrar.', refinedMore: 'Anotado: buscaremos más así.',
  noResultsTitle: 'Con esos filtros no encontramos nada', noResultsText: 'Prueba quitando alguna restricción: plataformas, duración o géneros a evitar.', relax: 'Relajar filtros',
  galleryHint: (n: number): string => (n === 1 ? 'Toca el póster para ver su ficha.' : 'Desliza, arrastra o usa las flechas. Toca un póster para ver su ficha.'),
  seeDetails: 'Ver ficha', posterOf: (title: string) => `Ver ficha de ${title}`, prev: 'Anterior', close: 'Cerrar',
  directedBy: 'Dirigida por', starring: 'Reparto', yearL: 'Año', genresL: 'Géneros', runtimeL: 'Duración', countryL: 'País', watchNow: 'Ver ahora en',
  whereToWatch: 'Puedes verla en:', openIn: (p: string) => `Ver en ${p} (abre en otra pestaña)`, imdbOf: (n: number) => `Calificación en IMDb: ${n} de 10`, share: 'Compartir',
  moreForYou: 'Más para ti', moreHint: 'Extras que también encajan con tus respuestas.',
  wrappedTitle: 'Tu Wrapped de esta sesión', wGenre: 'Género dominante', wRareza: 'Fuera de Hollywood', wCine: 'Cine favorito', wNota: 'Nota media en IMDb',
  usefulAsk: '¿Te sirvieron las recomendaciones?', useful: 'Sí, me sirvieron', notUseful: 'No mucho', thanksFeedback: 'Gracias, lo tendremos en cuenta.',
  redoTitle: '¿Otra ronda?', redoSame: 'Repetir la encuesta', redoFresh: 'Empezar de cero', quickRec: 'Recomendación sin encuesta',

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
      text: 'Your answers so far are cleared and you start over from the first question.', ok: 'Start over', cancel: 'Cancel',
    },
  },

  landing: {
    kicker: 'Movie recommender', intro: 'Answer a few questions and we tell you what to watch tonight, and where to stream it.',
    headline: ['Your movie', 'for tonight', 'in two minutes'], scroll: 'Scroll',
    statement: 'Forty minutes choosing what to watch. Zero minutes watching it. MiPeli asks a few quick questions and tells you what to watch tonight, and where to stream it.',
    howLabel: 'How it works',
    steps: [
      { title: 'Answer', text: 'A few quick questions: your mood, poster duels and your favorites. No endless lists.' },
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

  stepNames: { mood: 'Mood', context: 'Context', duel: 'Duels', favorites: 'Favorites', platforms: 'Platforms' },
  stepOf: (i: number, n: number) => `Step ${i} of ${n}`,
  moodQ: 'What are you in the mood for tonight?', moodHint: (max: number) => `Pick up to ${max}.`,
  moodNames: {
    laugh: { name: 'Laugh', hint: 'Something light that makes me smile.' },
    tension: { name: 'Tension', hint: 'Can’t even blink.' },
    feel: { name: 'Feel something', hint: 'Stories that hit.' },
    mind: { name: 'Blow my mind', hint: 'Sci-fi, twists and big questions.' },
    epic: { name: 'Adventure', hint: 'Action, new worlds, something epic.' },
    scare: { name: 'A good scare', hint: 'Lights off, volume up.' },
    cozy: { name: 'Cozy up', hint: 'Warm, family-friendly, no stress.' },
    real: { name: 'Something real', hint: 'Documentaries and real lives.' },
  },
  contextQ: 'Tell us about your night', contextHint: 'Everything is optional: it helps us fine-tune.',
  timeLabel: 'How much time do you have?', timeOption: (min: number | null) => (min ? `Up to ${min} min` : 'No limit'),
  companyLabel: 'Who are you watching with?', companyNames: { solo: 'Just me', couple: 'As a couple', friends: 'With friends', family: 'With family' },
  avoidLabel: 'Anything you’d rather avoid?',
  duelQ: 'Which one do you pick?', duelHint: 'Tap your favorite.', duelOf: (i: number, n: number) => `Duel ${i} of ${n}`, duelVs: 'vs', duelSkip: 'I don’t know either',
  favoritesQ: 'What are your favorites?', favoritesHint: (max: number) => `Add up to ${max}. If none comes to mind, skip it.`,
  searchLabel: 'Search for a movie', searchPh: 'Type a title…', noMatch: 'We couldn’t find that title in the catalog.', orTap: 'Or tap one of these',
  picked: (n: number) => `${n} picked`, remove: 'Remove',
  platformsQ: 'Where do you watch movies?', platformsHint: 'We’ll only show what you can watch. They’re saved for next time.',
  numMoviesLabel: 'How many movies do you want to see?', myPlatforms: 'Your platforms',
  next: 'Next', skip: 'Skip', seeResult: 'See my results', back: 'Back',

  loadingTitle: 'Computing your profile…', loadingDone: (n: number) => (n === 1 ? 'Done, we found your movie' : `Done, we found ${n} movies`), loadingSteps: ['Analyzing your answers', 'Finding similar movies', 'Checking where to watch'],

  tonightKick: 'Your movie for tonight', yourMovies: (n: number) => `Your ${n} movies for tonight`,
  because: (list: string, liked?: string) => {
    const extra = liked ? ` and what you picked, like ${liked}` : '';
    return `Based on your mood (${list})${extra}.`;
  },
  reasons: {
    director: (ref: string) => `From the director of ${ref}`,
    liked: (ref: string) => `Similar to ${ref}`,
    mood: (name: string) => `Fits your mood: ${name.toLowerCase()}`,
    platform: (p: string) => `On ${p}`,
  },
  flags: { offPlatform: 'Outside your platforms', overRuntime: 'Longer than you asked' },
  refineSeen: 'Already seen it', refineNo: 'Not interested', refineMore: 'More like this',
  refinedSeen: 'Done, we swapped it for another one.', refinedNo: 'Noted, we won’t show it again.', refinedMore: 'Noted: we’ll look for more like it.',
  noResultsTitle: 'We found nothing with those filters', noResultsText: 'Try removing a restriction: platforms, runtime or genres to avoid.', relax: 'Relax filters',
  galleryHint: (n: number) => (n === 1 ? 'Tap the poster to see its details.' : 'Swipe, drag or use the arrows. Tap a poster to see its details.'),
  seeDetails: 'View details', posterOf: (title: string) => `View details for ${title}`, prev: 'Previous', close: 'Close',
  directedBy: 'Directed by', starring: 'Starring', yearL: 'Year', genresL: 'Genres', runtimeL: 'Runtime', countryL: 'Country', watchNow: 'Watch now on',
  whereToWatch: 'You can watch it on:', openIn: (p: string) => `Watch on ${p} (opens in a new tab)`, imdbOf: (n: number) => `IMDb rating: ${n} out of 10`, share: 'Share',
  moreForYou: 'More for you', moreHint: 'Extras that also fit your answers.',
  wrappedTitle: 'Your Wrapped for this session', wGenre: 'Top genre', wRareza: 'Outside Hollywood', wCine: 'Favorite cinema', wNota: 'Average IMDb rating',
  usefulAsk: 'Were the recommendations useful?', useful: 'Yes, they helped', notUseful: 'Not really', thanksFeedback: 'Thanks, we’ll keep it in mind.',
  redoTitle: 'Another round?', redoSame: 'Redo the survey', redoFresh: 'Start from scratch', quickRec: 'Pick without survey',

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
