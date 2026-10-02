import * as esbuild from 'esbuild';

// Build de producción (`npm run build`) y servidor de desarrollo con recarga automática (`npm run dev`).
// La config web de Firebase sale de .env (ver .env.example) y se inyecta en el bundle con `define`.
try { process.loadEnvFile(); } catch { /* sin .env: el inicio de sesión con Google queda desactivado */ }

const dev = process.argv.includes('--dev');
const firebaseKeys = ['FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID', 'FIREBASE_APP_ID'];

const options = {
  entryPoints: ['src/main.tsx', 'index.html'],
  bundle: true,
  loader: { '.html': 'copy', '.woff2': 'file' },
  entryNames: '[name]',
  outdir: 'dist',
  sourcemap: dev,
  minify: !dev,
  logLevel: dev ? 'warning' : 'info',
  define: Object.fromEntries([
    ...firebaseKeys.map(k => [`process.env.${k}`, JSON.stringify(process.env[k] ?? '')]),
    ['process.env.DEV', JSON.stringify(dev ? '1' : '')],
  ]),
};

if (dev) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: 'dist' });
  // localhost (no 127.0.0.1): es el dominio que Firebase autoriza por defecto para el popup de Google
  console.log(`MiPeli en http://localhost:${port}/  ·  se recarga al guardar  ·  Ctrl+C para cerrar`);
} else {
  await esbuild.build(options);
}
