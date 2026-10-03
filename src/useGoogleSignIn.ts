import { useState } from 'react';
import { signInWithGoogle } from './auth';
import { useApp } from './store';

// Cerrar el popup o abrir otro encima no es un error: no se avisa
const CANCELLED = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

// Abre el popup de Google (selector de cuentas). Con la sesión ya abierta, solo continúa.
export function useGoogleSignIn() {
  const { st, go, flash, t } = useApp();
  const [busy, setBusy] = useState(false);
  const google = () => {
    if (st.loggedIn) { go('type'); return; }
    setBusy(true);
    signInWithGoogle()
      .then(() => go('type'))
      .catch((e: { code?: string }) => {
        if (e.code === 'auth/popup-blocked') flash(t.popupBlocked);
        else if (!CANCELLED.has(e.code ?? '')) { console.error(e); flash(t.loginError); }
      })
      .finally(() => setBusy(false));
  };
  return { busy, google };
}
