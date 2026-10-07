// Prueba de humo: sirve dist/ con las mismas cabeceras de vercel.json (CSP incluida) y comprueba que la app
// cargue sin violaciones de CSP ni errores: landing → login → encuesta como invitado.
// `node scripts/smoke.mjs --serve` solo deja el servidor abierto para probar a mano.
// Requiere un build previo (`npm run build`) y Chrome (en CI ya viene instalado; otro navegador: SMOKE_CHANNEL=msedge).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';

const root = resolve('dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const { headers } = JSON.parse(await readFile('vercel.json', 'utf8'));
const secure = Object.fromEntries(headers[0].headers.map(h => [h.key, h.value]));

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  const file = resolve(join(root, pathname === '/' ? 'index.html' : decodeURIComponent(pathname)));
  try {
    if (!file.startsWith(root + sep)) throw new Error('fuera de dist');
    const body = await readFile(file);
    res.writeHead(200, { ...secure, 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404, secure).end('not found');
  }
});
await new Promise(ok => server.listen(Number(process.env.SMOKE_PORT ?? 0), ok));
const base = `http://localhost:${server.address().port}/`;

if (process.argv.includes('--serve')) {
  console.log(`dist con cabeceras de vercel.json en ${base}  ·  Ctrl+C para cerrar`);
} else {
  const problems = [];
  const browser = await chromium.launch({ channel: process.env.SMOKE_CHANNEL ?? 'chrome' });
  try {
    const page = await browser.newPage();
    page.on('pageerror', e => problems.push(`pageerror: ${e.message}`));
    page.on('console', m => {
      if (m.type() === 'error' && !m.location().url.endsWith('/favicon.ico')) problems.push(`console: ${m.text()} (${m.location().url})`);
    });
    await page.goto(base);
    const cta = page.locator('.lp-cta-btn').first();
    await cta.scrollIntoViewIfNeeded();
    await cta.click();
    await page.locator('#auth-email').waitFor({ timeout: 5000 });
    await page.getByRole('button', { name: /invitado/i }).click();
    await page.locator('.mp-prow').first().waitFor({ timeout: 5000 });
    await page.getByRole('button', { name: /siguiente/i }).click();
    await page.locator('.mp-mood').first().waitFor({ timeout: 5000 });
  } catch (e) {
    problems.push(`flujo: ${e.message.split('\n')[0]}`);
  } finally {
    await browser.close();
    server.close();
  }
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log('smoke ok: landing → login → encuesta sin errores ni violaciones de CSP');
}
