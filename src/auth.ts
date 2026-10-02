import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';

// Inicio de sesión con Google vía Firebase Authentication. No depende del backend: Firebase guarda la sesión en el navegador.
// Cuando exista el backend, el frontend le enviará user.getIdToken() y él lo verificará con Firebase Admin.
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};
// Sin .env la app funciona igual; solo el botón de Google avisa que no puede iniciar sesión
const auth = config.apiKey ? getAuth(initializeApp(config)) : null;

const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' }); // siempre muestra el selector de cuentas

export const signInWithGoogle = () => (auth ? signInWithPopup(auth, google) : Promise.reject(new Error('Firebase sin configurar: copia .env.example a .env')));
export const signOutUser = () => (auth ? signOut(auth) : Promise.resolve());
export const onUserChange = (cb: (user: User | null) => void) => (auth ? onAuthStateChanged(auth, cb) : () => {});
