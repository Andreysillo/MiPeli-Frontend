import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, EnvelopeSimple, Eye, EyeSlash, UserCircle, WarningCircle } from '@phosphor-icons/react';
import Button from '../components/Button';
import GoogleG from '../components/GoogleG';
import PosterWall from '../components/PosterWall';
import { firstName, registerWithEmail, resetPassword, signInWithEmail } from '../auth';
import { useGoogleSignIn } from '../useGoogleSignIn';
import { useApp } from '../store';
import type { Strings } from '../i18n';

type Mode = 'login' | 'register' | 'reset';

// Los códigos de error de Firebase se traducen a un texto que dice qué hacer; los desconocidos caen en el mensaje genérico
const errorText = (t: Strings, e: { code?: string }) => t.authErrors[e.code as keyof Strings['authErrors']] ?? t.loginError;

// Inicio de sesión y registro con correo y contraseña (Firebase Authentication)
export default function Login() {
  const { st, set, enterSurvey, t } = useApp();
  const { busy: googleBusy, google } = useGoogleSignIn();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  const [sent, setSent] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const register = mode === 'register';
  const reset = mode === 'reset';

  const switchMode = (next: Mode) => { setMode(next); setError(''); setSent(false); };

  // Al abrir "¿Olvidaste tu contraseña?" el foco va directo al correo
  useEffect(() => { if (reset) emailRef.current?.focus(); }, [reset]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setWorking(true);
    const done = register
      ? registerWithEmail(name.trim(), email.trim(), password).then(firstName)
      : signInWithEmail(email.trim(), password).then(cred => firstName(cred.user));
    done
      .then(user => { set({ loggedIn: true, user }); enterSurvey(); })
      .catch((err: { code?: string }) => { setError(errorText(t, err)); if (!err.code) console.error(err); })
      .finally(() => setWorking(false));
  };

  // Firebase no revela si el correo existe: el aviso es el mismo en ambos casos
  const sendReset = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setWorking(true);
    resetPassword(email.trim(), st.lang)
      .then(() => setSent(true))
      .catch((err: { code?: string }) => setError(errorText(t, err)))
      .finally(() => setWorking(false));
  };

  const errorBox = error && <p role="alert" className="mp-error"><WarningCircle size={18} weight="fill" aria-hidden />{error}</p>;
  const backBtn = (onClick: () => void) => (
    <div data-reveal><Button variant="ghost" size="sm" icon={<ArrowLeft size={18} aria-hidden />} onClick={onClick} style={{ marginLeft: -14 }}>{t.back}</Button></div>
  );

  // Mini sección para restablecer la contraseña: solo el correo y, al enviarlo, el aviso de revisar el spam
  if (reset) {
    return (
      <section className="mp-screen">
        <PosterWall scrim="radial-gradient(60% 80% at 50% 52%,rgba(15,15,20,.94),rgba(15,15,20,.45) 68%,transparent)" />
        <div className="mp-content mp-container mp-page" style={{ pointerEvents: 'none' }}>
          <div className="mp-auth">
            {backBtn(() => switchMode('login'))}
            <h1 className="mp-title">{sent ? t.resetSentTitle : t.resetTitle}</h1>
            {sent ? (
              <div className="mp-card mp-auth-form">
                <p className="mp-lead"><EnvelopeSimple size={22} aria-hidden style={{ verticalAlign: '-4px', marginRight: 8 }} />{t.resetSent}</p>
                <p className="mp-label">{t.resetSpam}</p>
                <Button block onClick={() => switchMode('login')}>{t.backToLogin}<ArrowRight size={18} weight="bold" aria-hidden /></Button>
              </div>
            ) : (
              <>
                <p className="mp-lead">{t.resetLead}</p>
                <form className="mp-card mp-auth-form" onSubmit={sendReset}>
                  <div className="mp-fieldcol">
                    <label htmlFor="auth-email" className="mp-label">{t.emailLabel}</label>
                    <input id="auth-email" ref={emailRef} name="email" type="email" className="mp-input" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" spellCheck={false} required />
                  </div>
                  {errorBox}
                  <Button type="submit" block disabled={working} aria-busy={working}>{t.resetSubmit}<ArrowRight size={18} weight="bold" aria-hidden /></Button>
                  <p className="mp-label">{t.resetSpam}</p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mp-screen">
      <PosterWall scrim="radial-gradient(60% 80% at 50% 52%,rgba(15,15,20,.94),rgba(15,15,20,.45) 68%,transparent)" />
      {/* El contenedor deja pasar el cursor para que el mural reaccione; solo el formulario lo recibe */}
      <div className="mp-content mp-container mp-page" style={{ pointerEvents: 'none' }}>
        <div className="mp-auth">
          {/* Atrás vuelve adonde estaba (p. ej. los resultados de un invitado que quería guardarlos) o a la landing */}
          {backBtn(() => set({ screen: st.returnTo ?? 'welcome', returnTo: null }))}
          <h1 data-reveal className="mp-title">{register ? t.registerTitle : t.loginTitle}</h1>
          <p data-reveal className="mp-lead">{t.loginBenefit}</p>

          <div data-reveal className="mp-seg" role="group" aria-label={t.loginTitle}>
            <button type="button" aria-pressed={!register} onClick={() => switchMode('login')}>{t.tabLogin}</button>
            <button type="button" aria-pressed={register} onClick={() => switchMode('register')}>{t.tabRegister}</button>
          </div>

          <form data-reveal className="mp-card mp-auth-form" onSubmit={submit}>
            {register && (
              <div className="mp-fieldcol">
                <label htmlFor="auth-name" className="mp-label">{t.nameLabel}</label>
                <input id="auth-name" name="name" className="mp-input" value={name} onChange={e => setName(e.target.value)} autoComplete="name" required />
              </div>
            )}
            <div className="mp-fieldcol">
              <label htmlFor="auth-email" className="mp-label">{t.emailLabel}</label>
              <input id="auth-email" ref={emailRef} name="email" type="email" className="mp-input" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" spellCheck={false} required />
            </div>
            <div className="mp-fieldcol">
              <label htmlFor="auth-password" className="mp-label">{t.passwordLabel}</label>
              <div className="mp-pass">
                <input id="auth-password" name="password" type={show ? 'text' : 'password'} className="mp-input" value={password} onChange={e => setPassword(e.target.value)}
                  autoComplete={register ? 'new-password' : 'current-password'} minLength={register ? 6 : undefined} aria-describedby={register ? 'auth-hint' : undefined} required />
                <button type="button" className="mp-eye" onClick={() => setShow(!show)} aria-pressed={show} aria-label={show ? t.hidePassword : t.showPassword}>
                  {show ? <EyeSlash size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
                </button>
              </div>
              {register && <span id="auth-hint" className="mp-label">{t.passwordHint}</span>}
            </div>

            {errorBox}

            <Button type="submit" block disabled={working} aria-busy={working}>{register ? t.submitRegister : t.submitLogin}<ArrowRight size={18} weight="bold" aria-hidden /></Button>
            {!register && <button type="button" className="mp-linkbtn" onClick={() => switchMode('reset')}>{t.forgot}</button>}
          </form>

          <p data-reveal className="mp-or" aria-hidden>{t.or}</p>
          <div data-reveal className="mp-stack" style={{ gap: 8 }}>
            <Button variant="google" block icon={<GoogleG />} onClick={google} disabled={googleBusy} aria-busy={googleBusy}>{t.google}</Button>
            <Button variant="ghost" block icon={<UserCircle size={20} aria-hidden />} onClick={enterSurvey}>{t.guest}</Button>
            <p className="mp-label" style={{ textAlign: 'center' }}>{t.guestNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
