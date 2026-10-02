import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

// npm run dev: recarga la página cuando esbuild termina de recompilar (en producción esta línea se elimina)
if (process.env.DEV) new EventSource('/esbuild').addEventListener('change', () => location.reload());

// Los pósters se dibujan en canvas con Geist: hay que tener la fuente antes del primer render
const font = Promise.all(['600 16px "Geist Variable"', '760 16px "Geist Variable"'].map(f => document.fonts.load(f)));
font.catch(() => {}).finally(() => createRoot(document.getElementById('root')!).render(<App />));
