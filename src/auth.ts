import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail,
  signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, type User,
} from 'firebase/auth';

// Inicio de sesión con Google y con correo y contraseña vía Firebase Authentication. No depende del backend: Firebase guarda la sesión en el navegador.
// Cuando exista el backend, el frontend le enviará user.getIdToken() y él lo verificará con Firebase Admin.
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  appId: process.env.FIREBASE_APP_ID,
};
// Sin .env la app funciona igual; solo el inicio de sesión avisa que no puede
const auth = config.apiKey ? getAuth(initializeApp(config)) : null;
export const authEnabled = !!auth;
const unconfigured = () => Promise.reject(new Error('Firebase sin configurar: copia .env.example a .env'));

const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' }); // siempre muestra el selector de cuentas

export const signInWithGoogle = () => (auth ? signInWithPopup(auth, google) : unconfigured());
export const signInWithEmail = (email: string, password: string) => (auth ? signInWithEmailAndPassword(auth, email, password) : unconfigured());
export const resetPassword = (email: string) => (auth ? sendPasswordResetEmail(auth, email) : unconfigured());
export const signOutUser = () => (auth ? signOut(auth) : Promise.resolve());
export const onUserChange = (cb: (user: User | null) => void) => (auth ? onAuthStateChanged(auth, cb) : () => {});

// Crea la cuenta y le pone nombre (Firebase no lo pide al registrar). Devuelve el usuario ya con su nombre.
export async function registerWithEmail(name: string, email: string, password: string) {
  if (!auth) return unconfigured();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  return user;
}

// Nombre corto para saludar: el primer nombre, o la parte del correo antes de la @
export const firstName = (u: User) => u.displayName?.split(' ')[0] || u.email?.split('@')[0] || '';
