// Datos de demo: aún no hay backend, todo lo que ve el usuario sale de aquí.
import netflix from './assets/platforms/netflix.jpg';
import primeVideo from './assets/platforms/amazon prime.png';
import disney from './assets/platforms/Disney+.png';
import max from './assets/platforms/Max.jpg';
import appleTv from './assets/platforms/apple TV.jpg';
import paramount from './assets/platforms/paramount+.png';
import mubi from './assets/platforms/mubi.jpg';
import crunchyroll from './assets/platforms/crunchyroll.png';
import vix from './assets/platforms/Vix.jpg';
import claroVideo from './assets/platforms/Claro Video.png';
import pluto from './assets/platforms/Pluto tv.png';
import type { Lang } from './i18n';
import type { State } from './store';

// Forma de los datos según TMDB (movie details + credits + watch/providers). imdb: nota de IMDb sobre 10 (vía imdb_id, p. ej. OMDb).
export type Movie = {
  title: string; year: number; director: string; cast: string[]; genres: string[]; runtime: number; country: string;
  imdb: number; color: string; platforms: Platform[]; overview: Record<Lang, string>;
};

// Plataformas disponibles en Costa Rica, con su logo (src/assets/platforms) y la página de inicio a la que lleva cada botón.
// Qué película está en cuál lo dirá el backend (TMDB watch/providers, region=CR).
export type PlatformInfo = { url: string; logo: string };
export const platforms = {
  'Netflix': { url: 'https://www.netflix.com/', logo: netflix },
  'Prime Video': { url: 'https://www.primevideo.com/', logo: primeVideo },
  'Disney+': { url: 'https://www.disneyplus.com/', logo: disney },
  'HBO Max': { url: 'https://www.hbomax.com/', logo: max },
  'Apple TV': { url: 'https://tv.apple.com/', logo: appleTv },
  'Paramount+': { url: 'https://www.paramountplus.com/', logo: paramount },
  'Mubi': { url: 'https://mubi.com/', logo: mubi },
  'Crunchyroll': { url: 'https://www.crunchyroll.com/', logo: crunchyroll },
  'ViX': { url: 'https://vix.com/', logo: vix },
  'Claro video': { url: 'https://www.clarovideo.com/', logo: claroVideo },
  'Pluto TV': { url: 'https://pluto.tv/', logo: pluto },
} satisfies Record<string, PlatformInfo>;
export type Platform = keyof typeof platforms;

export const catalog: Movie[] = [
  { title: 'Parasite', year: 2019, director: 'Bong Joon-ho', cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'], genres: ['Comedia', 'Thriller', 'Drama'], runtime: 132, country: 'KR', imdb: 8.5, color: '#3b82f6', platforms: ['Netflix', 'Prime Video'],
    overview: { es: 'La familia Kim, sin empleo y viviendo en un semisótano, se infiltra poco a poco en la vida de los adinerados Park.', en: 'The unemployed Kim family slowly worms its way into the lives of the wealthy Park household.' } },
  { title: 'Oldboy', year: 2003, director: 'Park Chan-wook', cast: ['Choi Min-sik', 'Yoo Ji-tae', 'Kang Hye-jung'], genres: ['Thriller', 'Drama', 'Misterio'], runtime: 120, country: 'KR', imdb: 8.3, color: '#8b5cf6', platforms: ['Mubi', 'Prime Video', 'Paramount+'],
    overview: { es: 'Tras quince años encerrado sin saber por qué, Oh Dae-su es liberado y tiene cinco días para encontrar a su captor.', en: 'After fifteen years imprisoned without explanation, Oh Dae-su is released and has five days to find his captor.' } },
  { title: 'Burning', year: 2018, director: 'Lee Chang-dong', cast: ['Yoo Ah-in', 'Steven Yeun', 'Jeon Jong-seo'], genres: ['Misterio', 'Drama', 'Thriller'], runtime: 148, country: 'KR', imdb: 7.5, color: '#06b6d4', platforms: ['Prime Video'],
    overview: { es: 'Un aspirante a escritor reencuentra a una vecina de la infancia, que vuelve de un viaje con un amigo rico y enigmático.', en: 'An aspiring writer reconnects with a childhood neighbor, who returns from a trip with a rich, enigmatic friend.' } },
  { title: 'Memories of Murder', year: 2003, director: 'Bong Joon-ho', cast: ['Song Kang-ho', 'Kim Sang-kyung', 'Kim Roe-ha'], genres: ['Crimen', 'Drama', 'Thriller'], runtime: 132, country: 'KR', imdb: 8.1, color: '#ec4899', platforms: ['HBO Max', 'Mubi'],
    overview: { es: 'En 1986, dos detectives rurales y uno llegado de Seúl persiguen al primer asesino en serie de Corea del Sur.', en: 'In 1986, two rural detectives and one from Seoul hunt South Korea’s first serial killer.' } },
  { title: 'Drive', year: 2011, director: 'Nicolas Winding Refn', cast: ['Ryan Gosling', 'Carey Mulligan', 'Bryan Cranston', 'Oscar Isaac'], genres: ['Drama', 'Thriller', 'Crimen'], runtime: 100, country: 'US', imdb: 7.8, color: '#f59e0b', platforms: ['Prime Video', 'Apple TV'],
    overview: { es: 'Un doble de riesgo que de noche conduce para atracadores se juega todo por proteger a su vecina.', en: 'A stunt driver who moonlights as a getaway driver risks everything to protect his neighbor.' } },
  { title: 'Whiplash', year: 2014, director: 'Damien Chazelle', cast: ['Miles Teller', 'J.K. Simmons', 'Melissa Benoist'], genres: ['Drama', 'Música'], runtime: 107, country: 'US', imdb: 8.5, color: '#10b981', platforms: ['Netflix', 'Claro video'],
    overview: { es: 'Un joven baterista de jazz cae en manos de un profesor implacable que lo empuja más allá de sus límites.', en: 'A young jazz drummer falls under a ruthless instructor who pushes him past his limits.' } },
  { title: 'Zodiac', year: 2007, director: 'David Fincher', cast: ['Jake Gyllenhaal', 'Mark Ruffalo', 'Robert Downey Jr.'], genres: ['Crimen', 'Drama', 'Misterio', 'Thriller'], runtime: 157, country: 'US', imdb: 7.7, color: '#ef4444', platforms: ['HBO Max', 'Disney+'],
    overview: { es: 'Un caricaturista se obsesiona con descubrir quién es el asesino del Zodiaco que aterrorizó San Francisco.', en: 'A cartoonist becomes obsessed with unmasking the Zodiac killer who terrorized San Francisco.' } },
  { title: 'Seven', year: 1995, director: 'David Fincher', cast: ['Brad Pitt', 'Morgan Freeman', 'Gwyneth Paltrow'], genres: ['Crimen', 'Misterio', 'Thriller'], runtime: 127, country: 'US', imdb: 8.6, color: '#6366f1', platforms: ['Netflix', 'HBO Max'],
    overview: { es: 'Dos detectives persiguen a un asesino que usa los siete pecados capitales como guion de sus crímenes.', en: 'Two detectives hunt a killer who uses the seven deadly sins as the script for his crimes.' } },
  { title: 'Prisoners', year: 2013, director: 'Denis Villeneuve', cast: ['Hugh Jackman', 'Jake Gyllenhaal', 'Viola Davis', 'Paul Dano'], genres: ['Drama', 'Thriller', 'Crimen'], runtime: 153, country: 'US', imdb: 8.1, color: '#0ea5e9', platforms: ['Paramount+', 'Prime Video'],
    overview: { es: 'Cuando su hija desaparece, un padre desesperado decide tomarse la justicia por su mano.', en: 'When his daughter goes missing, a desperate father takes matters into his own hands.' } },
  { title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai', cast: ['Tony Leung Chiu-wai', 'Maggie Cheung'], genres: ['Drama', 'Romance'], runtime: 98, country: 'HK', imdb: 8.1, color: '#e11d48', platforms: ['Mubi'],
    overview: { es: 'Hong Kong, 1962: dos vecinos descubren que sus parejas tienen un romance y forman un vínculo silencioso.', en: 'Hong Kong, 1962: two neighbors discover their spouses are having an affair and form a quiet bond.' } },
  { title: 'Heat', year: 1995, director: 'Michael Mann', cast: ['Al Pacino', 'Robert De Niro', 'Val Kilmer'], genres: ['Crimen', 'Drama', 'Acción', 'Thriller'], runtime: 170, country: 'US', imdb: 8.3, color: '#2563eb', platforms: ['Disney+'],
    overview: { es: 'Un ladrón profesional y el detective obsesionado con atraparlo se miden en Los Ángeles.', en: 'A master thief and the obsessive detective chasing him face off across Los Angeles.' } },
  { title: 'The Chaser', year: 2008, director: 'Na Hong-jin', cast: ['Kim Yoon-seok', 'Ha Jung-woo', 'Seo Young-hee'], genres: ['Thriller', 'Crimen'], runtime: 125, country: 'KR', imdb: 7.8, color: '#7c3aed', platforms: ['Pluto TV'],
    overview: { es: 'Un expolicía metido a proxeneta busca a una de sus chicas desaparecidas y se topa con un asesino.', en: 'An ex-cop turned pimp searches for one of his missing women and stumbles onto a killer.' } },
  { title: 'Nightcrawler', year: 2014, director: 'Dan Gilroy', cast: ['Jake Gyllenhaal', 'Rene Russo', 'Riz Ahmed'], genres: ['Crimen', 'Drama', 'Thriller'], runtime: 117, country: 'US', imdb: 7.8, color: '#d97706', platforms: ['Netflix'],
    overview: { es: 'Un hombre sin escrúpulos se abre paso en el periodismo nocturno de sucesos de Los Ángeles.', en: 'An unscrupulous man muscles into the world of LA’s nighttime crime journalism.' } },
  { title: 'Mother', year: 2009, director: 'Bong Joon-ho', cast: ['Kim Hye-ja', 'Won Bin', 'Jin Goo'], genres: ['Drama', 'Crimen', 'Misterio', 'Thriller'], runtime: 128, country: 'KR', imdb: 7.8, color: '#0891b2', platforms: ['Mubi'],
    overview: { es: 'Una madre busca al verdadero asesino para limpiar el nombre de su hijo, acusado de un crimen.', en: 'A mother hunts for the real killer to clear her son, who stands accused of murder.' } },
  { title: 'I Saw the Devil', year: 2010, director: 'Kim Jee-woon', cast: ['Lee Byung-hun', 'Choi Min-sik'], genres: ['Thriller', 'Terror', 'Crimen'], runtime: 144, country: 'KR', imdb: 7.8, color: '#be123c', platforms: ['ViX', 'Prime Video'],
    overview: { es: 'Un agente secreto persigue al asesino de su prometida en una espiral de venganza.', en: 'A secret agent hunts his fiancée’s killer in a spiral of revenge.' } },
  { title: 'The Grand Budapest Hotel', year: 2014, director: 'Wes Anderson', cast: ['Ralph Fiennes', 'Tony Revolori', 'Saoirse Ronan', 'Adrien Brody'], genres: ['Comedia', 'Drama'], runtime: 99, country: 'US', imdb: 8.1, color: '#db2777', platforms: ['Disney+'],
    overview: { es: 'El conserje de un célebre hotel europeo y su joven botones quedan envueltos en el robo de un cuadro.', en: 'The concierge of a famed European hotel and his young lobby boy get caught up in the theft of a painting.' } },
  { title: 'Superbad', year: 2007, director: 'Greg Mottola', cast: ['Jonah Hill', 'Michael Cera', 'Christopher Mintz-Plasse'], genres: ['Comedia'], runtime: 113, country: 'US', imdb: 7.6, color: '#f97316', platforms: ['Netflix'],
    overview: { es: 'Dos amigos inseparables intentan conseguir alcohol para una fiesta antes de separarse para la universidad.', en: 'Two inseparable friends try to score alcohol for a party before going off to college.' } },
  { title: 'Hot Fuzz', year: 2007, director: 'Edgar Wright', cast: ['Simon Pegg', 'Nick Frost', 'Martin Freeman'], genres: ['Comedia', 'Acción', 'Crimen'], runtime: 121, country: 'GB', imdb: 7.8, color: '#0284c7', platforms: ['Prime Video'],
    overview: { es: 'El mejor policía de Londres es trasladado a un pueblo idílico donde nada es lo que parece.', en: 'London’s top cop is transferred to an idyllic village where nothing is what it seems.' } },
  { title: 'The Big Lebowski', year: 1998, director: 'Joel Coen', cast: ['Jeff Bridges', 'John Goodman', 'Julianne Moore'], genres: ['Comedia', 'Crimen'], runtime: 117, country: 'US', imdb: 8.1, color: '#a16207', platforms: ['Prime Video'],
    overview: { es: 'Un vago amante de los bolos es confundido con un millonario y arrastrado a un secuestro absurdo.', en: 'A laid-back bowler is mistaken for a millionaire and dragged into an absurd kidnapping.' } },
  { title: 'Amélie', year: 2001, director: 'Jean-Pierre Jeunet', cast: ['Audrey Tautou', 'Mathieu Kassovitz', 'Rufus'], genres: ['Comedia', 'Romance'], runtime: 122, country: 'FR', imdb: 8.3, color: '#16a34a', platforms: ['Mubi', 'Prime Video'],
    overview: { es: 'Una camarera tímida de Montmartre decide cambiar en secreto la vida de quienes la rodean.', en: 'A shy Montmartre waitress secretly sets out to change the lives of those around her.' } },
  { title: 'Everything Everywhere All at Once', year: 2022, director: 'Daniel Kwan, Daniel Scheinert', cast: ['Michelle Yeoh', 'Ke Huy Quan', 'Jamie Lee Curtis', 'Stephanie Hsu'], genres: ['Acción', 'Comedia', 'Ciencia ficción'], runtime: 139, country: 'US', imdb: 7.8, color: '#9333ea', platforms: ['Prime Video', 'Mubi'],
    overview: { es: 'Una dueña de lavandería en plena auditoría descubre que puede saltar entre universos para salvarlo todo.', en: 'A laundromat owner in the middle of a tax audit discovers she can leap between universes to save everything.' } },
  { title: 'Hereditary', year: 2018, director: 'Ari Aster', cast: ['Toni Collette', 'Alex Wolff', 'Milly Shapiro', 'Gabriel Byrne'], genres: ['Terror', 'Misterio', 'Thriller'], runtime: 127, country: 'US', imdb: 7.3, color: '#b91c1c', platforms: ['HBO Max'],
    overview: { es: 'Tras la muerte de la abuela, una familia descubre secretos cada vez más aterradores sobre su linaje.', en: 'After the grandmother dies, a family uncovers increasingly terrifying secrets about their ancestry.' } },
  { title: 'Get Out', year: 2017, director: 'Jordan Peele', cast: ['Daniel Kaluuya', 'Allison Williams', 'Catherine Keener', 'Bradley Whitford'], genres: ['Terror', 'Misterio', 'Thriller'], runtime: 104, country: 'US', imdb: 7.8, color: '#65a30d', platforms: ['Netflix'],
    overview: { es: 'Un joven visita por primera vez a la familia de su novia, y tanta amabilidad empieza a inquietarlo.', en: 'A young man visits his girlfriend’s family for the first time, and all that kindness starts to unsettle him.' } },
  { title: 'The Shining', year: 1980, director: 'Stanley Kubrick', cast: ['Jack Nicholson', 'Shelley Duvall', 'Danny Lloyd'], genres: ['Terror', 'Thriller'], runtime: 146, country: 'US', imdb: 8.4, color: '#dc2626', platforms: ['HBO Max'],
    overview: { es: 'Un escritor acepta cuidar un hotel aislado durante el invierno y su mente empieza a quebrarse.', en: 'A writer takes a winter job caretaking an isolated hotel, and his mind begins to crack.' } },
  { title: 'Train to Busan', year: 2016, director: 'Yeon Sang-ho', cast: ['Gong Yoo', 'Jung Yu-mi', 'Ma Dong-seok'], genres: ['Terror', 'Acción', 'Thriller'], runtime: 118, country: 'KR', imdb: 7.6, color: '#475569', platforms: ['Netflix', 'ViX'],
    overview: { es: 'Un brote zombi estalla mientras un padre y su hija viajan en tren de Seúl a Busan.', en: 'A zombie outbreak erupts while a father and daughter ride a train from Seoul to Busan.' } },
  { title: 'The Witch', year: 2015, director: 'Robert Eggers', cast: ['Anya Taylor-Joy', 'Ralph Ineson', 'Kate Dickie'], genres: ['Terror', 'Drama', 'Misterio'], runtime: 92, country: 'US', imdb: 7.0, color: '#57534e', platforms: ['Prime Video'],
    overview: { es: 'Nueva Inglaterra, 1630: una familia puritana desterrada al borde del bosque cae presa de fuerzas oscuras.', en: 'New England, 1630: a banished Puritan family at the edge of the woods falls prey to dark forces.' } },
  { title: 'Arrival', year: 2016, director: 'Denis Villeneuve', cast: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker'], genres: ['Drama', 'Ciencia ficción', 'Misterio'], runtime: 116, country: 'US', imdb: 7.9, color: '#64748b', platforms: ['Paramount+'],
    overview: { es: 'Una lingüista es reclutada para comunicarse con las naves extraterrestres que han llegado a la Tierra.', en: 'A linguist is recruited to communicate with the alien ships that have landed on Earth.' } },
  { title: 'Blade Runner 2049', year: 2017, director: 'Denis Villeneuve', cast: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas', 'Sylvia Hoeks'], genres: ['Ciencia ficción', 'Drama'], runtime: 164, country: 'US', imdb: 8.0, color: '#ea580c', platforms: ['HBO Max', 'Prime Video'],
    overview: { es: 'Un nuevo blade runner desentierra un secreto que lo lleva a buscar a Rick Deckard, desaparecido hace treinta años.', en: 'A new blade runner unearths a secret that leads him to track down Rick Deckard, missing for thirty years.' } },
  { title: 'Interstellar', year: 2014, director: 'Christopher Nolan', cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'], genres: ['Aventura', 'Drama', 'Ciencia ficción'], runtime: 169, country: 'US', imdb: 8.7, color: '#0369a1', platforms: ['Paramount+', 'Prime Video'],
    overview: { es: 'Con la Tierra agonizando, un grupo de exploradores cruza un agujero de gusano en busca de un nuevo hogar.', en: 'With Earth dying, a team of explorers travels through a wormhole in search of a new home.' } },
  { title: 'Ex Machina', year: 2014, director: 'Alex Garland', cast: ['Domhnall Gleeson', 'Alicia Vikander', 'Oscar Isaac'], genres: ['Drama', 'Ciencia ficción', 'Thriller'], runtime: 108, country: 'GB', imdb: 7.7, color: '#94a3b8', platforms: ['Netflix'],
    overview: { es: 'Un programador es invitado a evaluar si la inteligencia artificial creada por su jefe tiene conciencia.', en: 'A programmer is invited to judge whether the AI his boss built is truly conscious.' } },
  { title: 'Inception', year: 2010, director: 'Christopher Nolan', cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'], genres: ['Acción', 'Ciencia ficción', 'Aventura'], runtime: 148, country: 'US', imdb: 8.8, color: '#1d4ed8', platforms: ['HBO Max'],
    overview: { es: 'Un ladrón que roba secretos a través de los sueños recibe el encargo inverso: implantar una idea.', en: 'A thief who steals secrets through dreams is hired for the reverse: planting an idea.' } },
  { title: 'Her', year: 2013, director: 'Spike Jonze', cast: ['Joaquin Phoenix', 'Scarlett Johansson', 'Amy Adams'], genres: ['Romance', 'Ciencia ficción', 'Drama'], runtime: 126, country: 'US', imdb: 8.0, color: '#f43f5e', platforms: ['Prime Video'],
    overview: { es: 'Un escritor solitario se enamora del sistema operativo inteligente que organiza su vida.', en: 'A lonely writer falls in love with the intelligent operating system that runs his life.' } },
  { title: 'Before Sunrise', year: 1995, director: 'Richard Linklater', cast: ['Ethan Hawke', 'Julie Delpy'], genres: ['Drama', 'Romance'], runtime: 101, country: 'US', imdb: 8.1, color: '#ca8a04', platforms: ['HBO Max'],
    overview: { es: 'Dos desconocidos se conocen en un tren y deciden pasar juntos una sola noche en Viena.', en: 'Two strangers meet on a train and decide to spend a single night together in Vienna.' } },
  { title: 'Portrait of a Lady on Fire', year: 2019, director: 'Céline Sciamma', cast: ['Noémie Merlant', 'Adèle Haenel', 'Luàna Bajrami'], genres: ['Drama', 'Romance'], runtime: 122, country: 'FR', imdb: 8.1, color: '#c2410c', platforms: ['Mubi'],
    overview: { es: 'Bretaña, siglo XVIII: una pintora debe retratar en secreto a una joven que se niega a posar.', en: 'Brittany, 18th century: a painter must secretly portray a young woman who refuses to sit for her.' } },
  { title: 'La La Land', year: 2016, director: 'Damien Chazelle', cast: ['Ryan Gosling', 'Emma Stone', 'John Legend'], genres: ['Comedia', 'Drama', 'Romance'], runtime: 128, country: 'US', imdb: 8.0, color: '#7c3aed', platforms: ['Netflix', 'Prime Video'],
    overview: { es: 'Un pianista de jazz y una aspirante a actriz se enamoran mientras persiguen sus sueños en Los Ángeles.', en: 'A jazz pianist and an aspiring actress fall in love while chasing their dreams in Los Angeles.' } },
  { title: 'Past Lives', year: 2023, director: 'Celine Song', cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'], genres: ['Drama', 'Romance'], runtime: 106, country: 'US', imdb: 7.8, color: '#0d9488', platforms: ['Paramount+'],
    overview: { es: 'Dos amigos de la infancia separados al emigrar se reencuentran en Nueva York veinte años después.', en: 'Two childhood friends separated by emigration reunite in New York twenty years later.' } },
  { title: 'Eternal Sunshine of the Spotless Mind', year: 2004, director: 'Michel Gondry', cast: ['Jim Carrey', 'Kate Winslet', 'Kirsten Dunst'], genres: ['Ciencia ficción', 'Drama', 'Romance'], runtime: 108, country: 'US', imdb: 8.3, color: '#2dd4bf', platforms: ['Prime Video'],
    overview: { es: 'Tras una ruptura, un hombre se somete a un procedimiento para borrar de su memoria a su expareja.', en: 'After a breakup, a man undergoes a procedure to erase his ex from his memory.' } },
  { title: 'Spirited Away', year: 2001, director: 'Hayao Miyazaki', cast: ['Rumi Hiiragi', 'Miyu Irino', 'Mari Natsuki'], genres: ['Animación', 'Fantasía'], runtime: 125, country: 'JP', imdb: 8.6, color: '#e11d48', platforms: ['Netflix'],
    overview: { es: 'Una niña queda atrapada en un mundo de espíritus y debe trabajar en una casa de baños para salvar a sus padres.', en: 'A girl trapped in a world of spirits must work in a bathhouse to save her parents.' } },
  { title: 'Spider-Man: Into the Spider-Verse', year: 2018, director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman', cast: ['Shameik Moore', 'Jake Johnson', 'Hailee Steinfeld'], genres: ['Animación', 'Acción', 'Ciencia ficción'], runtime: 117, country: 'US', imdb: 8.4, color: '#ef4444', platforms: ['Disney+'],
    overview: { es: 'Miles Morales se convierte en Spider-Man y se une a otros arañas de dimensiones paralelas.', en: 'Miles Morales becomes Spider-Man and teams up with spider-people from parallel dimensions.' } },
  { title: 'Your Name', year: 2016, director: 'Makoto Shinkai', cast: ['Ryunosuke Kamiki', 'Mone Kamishiraishi'], genres: ['Animación', 'Romance', 'Drama'], runtime: 106, country: 'JP', imdb: 8.4, color: '#3b82f6', platforms: ['Crunchyroll'],
    overview: { es: 'Un chico de Tokio y una chica de un pueblo de montaña empiezan a intercambiar sus cuerpos mientras duermen.', en: 'A Tokyo boy and a girl from a mountain town start swapping bodies in their sleep.' } },
  { title: 'Coco', year: 2017, director: 'Lee Unkrich', cast: ['Anthony Gonzalez', 'Gael García Bernal', 'Benjamin Bratt'], genres: ['Animación', 'Comedia', 'Familia'], runtime: 105, country: 'US', imdb: 8.4, color: '#f59e0b', platforms: ['Disney+'],
    overview: { es: 'Miguel sueña con ser músico y, en Día de Muertos, termina en la Tierra de los Muertos buscando a su tatarabuelo.', en: 'Aspiring musician Miguel ends up in the Land of the Dead on Día de Muertos, searching for his great-great-grandfather.' } },
  { title: 'Perfect Blue', year: 1997, director: 'Satoshi Kon', cast: ['Junko Iwao', 'Rica Matsumoto', 'Shinpachi Tsuji'], genres: ['Animación', 'Thriller', 'Terror'], runtime: 81, country: 'JP', imdb: 8.0, color: '#2563eb', platforms: ['Crunchyroll'],
    overview: { es: 'Una cantante pop que da el salto a actriz empieza a perder la línea entre la realidad y la paranoia.', en: 'A pop idol turned actress begins to lose the line between reality and paranoia.' } },
  { title: 'Free Solo', year: 2018, director: 'Elizabeth Chai Vasarhelyi, Jimmy Chin', cast: ['Alex Honnold', 'Tommy Caldwell'], genres: ['Documental'], runtime: 100, country: 'US', imdb: 8.1, color: '#ca8a04', platforms: ['Disney+'],
    overview: { es: 'Alex Honnold se prepara para escalar El Capitán, una pared de 900 metros, sin cuerdas ni protección.', en: 'Alex Honnold prepares to climb El Capitan, a 900-meter wall, with no ropes or protection.' } },
  { title: 'Searching for Sugar Man', year: 2012, director: 'Malik Bendjelloul', cast: ['Sixto Rodríguez'], genres: ['Documental', 'Música'], runtime: 86, country: 'SE', imdb: 8.2, color: '#d97706', platforms: ['Prime Video'],
    overview: { es: 'Dos fans sudafricanos buscan al misterioso músico estadounidense que, sin saberlo, fue leyenda en su país.', en: 'Two South African fans search for the mysterious US musician who unknowingly became a legend in their country.' } },
  { title: 'Jiro Dreams of Sushi', year: 2011, director: 'David Gelb', cast: ['Jiro Ono', 'Yoshikazu Ono'], genres: ['Documental'], runtime: 81, country: 'US', imdb: 7.8, color: '#a8a29e', platforms: ['Pluto TV'],
    overview: { es: 'A sus 85 años, Jiro Ono sigue perfeccionando el sushi en un pequeño restaurante del metro de Tokio.', en: 'At 85, Jiro Ono is still perfecting sushi in a tiny restaurant inside a Tokyo subway station.' } },
  { title: 'Won’t You Be My Neighbor?', year: 2018, director: 'Morgan Neville', cast: ['Fred Rogers', 'Joanne Rogers'], genres: ['Documental'], runtime: 94, country: 'US', imdb: 8.4, color: '#dc2626', platforms: ['HBO Max'],
    overview: { es: 'Retrato de Fred Rogers, el presentador que habló a los niños con una honestidad poco común en la televisión.', en: 'A portrait of Fred Rogers, the host who spoke to children with an honesty rare on television.' } },
  { title: 'Honeyland', year: 2019, director: 'Tamara Kotevska, Ljubomir Stefanov', cast: ['Hatidže Muratova'], genres: ['Documental'], runtime: 89, country: 'MK', imdb: 8.0, color: '#eab308', platforms: ['Mubi'],
    overview: { es: 'La última apicultora silvestre de Europa ve amenazado su delicado equilibrio con la naturaleza.', en: 'Europe’s last wild beekeeper sees her delicate balance with nature threatened.' } },
  { title: 'First Cow', year: 2019, director: 'Kelly Reichardt', cast: ['John Magaro', 'Orion Lee', 'Toby Jones'], genres: ['Drama', 'Western'], runtime: 121, country: 'US', imdb: 7.1, color: '#78716c', platforms: ['Mubi'],
    overview: { es: 'Oregón, 1820: un cocinero y un inmigrante chino montan un negocio con la leche de la única vaca de la región.', en: 'Oregon, 1820s: a cook and a Chinese immigrant start a business with milk from the region’s only cow.' } },
];

const byTitle = (title: string) => catalog.find(m => m.title === title)!;
export const questMovies = ['Oldboy', 'Parasite', 'Drive', 'Seven', 'Zodiac', 'Heat'].map(byTitle);
export const duels: [Movie, Movie][] = [['Oldboy', 'Drive'], ['Parasite', 'Seven'], ['Whiplash', 'Burning']].map(([a, b]) => [byTitle(a), byTitle(b)]);
export const welcomePosters = ['In the Mood for Love', 'Parasite', 'Oldboy'].map(byTitle);

// Géneros de la rueda (nombres de TMDB en español)
export const genres = ['Thriller', 'Drama', 'Crimen', 'Ciencia ficción', 'Terror', 'Comedia', 'Romance', 'Animación', 'Documental'];

// Recomendador de demo: ordena el catálogo según las respuestas (género, director, ánimo y películas que te gustaron).
// ponytail: heurística local; la reemplaza el backend (TMDB discover / TasteDive).
type Answers = Pick<State, 'rec' | 'picks' | 'moodSel' | 'movieSel' | 'duelWins'>;
export function recommend(a: Answers): Movie[] {
  const liked = catalog.filter(m => a.movieSel.includes(m.title) || a.duelWins[m.title]);
  const likedGenres = new Set(liked.flatMap(m => m.genres));
  const likedDirectors = new Set(liked.map(m => m.director));
  const score = (m: Movie) => {
    let s = m.imdb / 10 + m.genres.filter(g => a.moodSel.includes(g)).length * 1.5;
    if (a.rec.genres && m.genres.includes(a.picks.genre)) s += 6;
    if (a.rec.director && m.director === a.picks.director) s += 4;
    if (a.rec.movies) {
      s += m.genres.filter(g => likedGenres.has(g)).length * 0.5;
      if (likedDirectors.has(m.director)) s += 1.5;
    }
    return s;
  };
  // Las que ya marcaste como favoritas no se recomiendan otra vez
  return catalog.filter(m => !liked.includes(m)).sort((x, y) => score(y) - score(x));
}

export const directors = ['Bong Joon-ho', 'Denis Villeneuve', 'David Fincher', 'Park Chan-wook', 'Wong Kar-wai', 'Christopher Nolan', 'Céline Sciamma', 'Kelly Reichardt'];

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  return [c, c.getContext('2d')!] as const;
};

// Arte de póster placeholder: degradado del color de la película + título tipográfico.
// ponytail: se sustituye por los pósters reales cuando haya backend (TMDB o similar).
const posterCache = new Map<string, string>();
export function poster(m: Movie): string {
  const hit = posterCache.get(m.title);
  if (hit) return hit;
  const W = 400, H = 600, pad = 30;
  const [c, ctx] = canvas(W, H);
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, m.color); bg.addColorStop(0.62, '#1a1a26'); bg.addColorStop(1, '#0f0f14');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W * 0.8, H * 0.12, 0, W * 0.8, H * 0.12, W * 0.9);
  glow.addColorStop(0, 'rgba(255,255,255,.28)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  const font = (weight: number, size: number) => `${weight} ${size}px "Geist Variable", system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,.78)';
  ctx.font = font(600, 17);
  ctx.fillText(m.director.toUpperCase(), pad, pad + 14);

  // Título: ajusta tamaño y corta en líneas para que quepa en el ancho
  const words = m.title.toUpperCase().split(' ');
  let size = 62, lines: string[] = [];
  for (; size >= 30; size -= 4) {
    ctx.font = font(760, size);
    lines = [];
    let line = '';
    for (const w of words) {
      const next = line ? `${line} ${w}` : w;
      if (ctx.measureText(next).width > W - pad * 2 && line) { lines.push(line); line = w; } else line = next;
    }
    lines.push(line);
    if (lines.length <= 3 && lines.every(l => ctx.measureText(l).width <= W - pad * 2)) break;
  }
  ctx.fillStyle = '#ffffff';
  const lh = size * 0.98, base = H - pad - 34;
  lines.forEach((l, i) => ctx.fillText(l, pad, base - (lines.length - 1 - i) * lh));
  ctx.font = font(500, 18); ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.fillText(String(m.year), pad, H - pad);

  const url = c.toDataURL('image/jpeg', 0.86);
  posterCache.set(m.title, url);
  return url;
}

// Formatos que esperan los componentes de React Bits
export const chromaItem = (m: Movie) => ({ title: m.title, subtitle: `${m.year} · ${m.genres[0]}`, handle: `IMDb ${m.imdb}`, image: poster(m), borderColor: m.color, gradient: '#1f1f2e' });
export const driftItem = (m: Movie) => ({ title: m.title, year: m.year, rating: String(m.imdb), subtitle: `${m.year} · IMDb ${m.imdb}`, image: poster(m) });

function stripes(w: number, h: number, stops: [number, string][], line: string, lineWidth: number, step: number) {
  const [c, ctx] = canvas(w, h);
  const g = ctx.createLinearGradient(0, 0, w, h);
  stops.forEach(([at, color]) => g.addColorStop(at, color));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = line; ctx.lineWidth = lineWidth;
  for (let k = -h; k < w; k += step) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + h, h); ctx.stroke(); }
  return c.toDataURL('image/png');
}

const moodColors = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981'];
export const moodGallery = ['Thriller', 'Comedia', 'Terror', 'Drama', 'Ciencia ficción', 'Romance', 'Animación']
  .map((text, i) => ({ text, image: stripes(600, 450, [[0, moodColors[i]], [1, '#0f0f14']], 'rgba(255,255,255,.08)', 14, 42) }));

export const maskedHeadingSrc = stripes(1600, 440, [[0, '#a3a3b8'], [0.5, '#f4f4f4'], [1, '#c9c9d6']], 'rgba(15,15,20,.1)', 26, 70);

// ponytail: datos de contacto de ejemplo; reemplazar por los reales del autor
export const contactInfo = { email: 'jimenezzzandrey@gmail.com', github: 'https://github.com/', linkedin: 'https://www.linkedin.com/' };

export const faqData: Record<Lang, { q: string; a: string }[]> = {
  es: [{ q: '¿De dónde salen las recomendaciones?', a: 'De tus respuestas, cruzadas con nuestra base de títulos.' }, { q: '¿Necesito cuenta?', a: 'No para probar. Con una cuenta (Google o correo) guardas tu progreso y repites encuestas sin límite.' }, { q: '¿De dónde sale la calificación?', a: 'Es la nota de IMDb, sobre 10.' }, { q: '¿Dónde veo la peli?', a: 'Cada recomendación muestra en qué plataformas está, con un botón que te lleva directo a cada una.' }, { q: '¿Qué datos guardan de mí?', a: 'Si entras con Google o con correo, Firebase guarda tu nombre y correo para mantener tu sesión, y MiPeli solo usa tu nombre para saludarte. Tus respuestas viven solo en tu navegador. No vendemos tus datos. Hay más detalle en Contacto.' }],
  en: [{ q: 'Where do recommendations come from?', a: 'Your answers, matched against our title base.' }, { q: 'Do I need an account?', a: 'Not to try. With an account (Google or email) you save progress and repeat surveys with no limit.' }, { q: 'Where does the rating come from?', a: 'It is the IMDb score, out of 10.' }, { q: 'Where can I watch it?', a: 'Every recommendation shows which platforms have it, with a button that takes you straight to each one.' }, { q: 'What data do you keep about me?', a: 'If you sign in with Google or email, Firebase keeps your name and email to maintain your session, and MiPeli only uses your name to greet you. Your answers live only in your browser. We don’t sell your data. See Contact for details.' }],
};
