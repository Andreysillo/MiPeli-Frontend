import { useEffect, useRef, type ReactNode } from 'react';
import Button from './Button';

type Props = Readonly<{
  icon: ReactNode; title: string; text: string; confirmLabel: string; cancelLabel: string;
  onConfirm: () => void; onCancel: () => void;
}>;

// Aviso propio en lugar del confirm() del navegador. Se monta solo mientras está abierto y usa <dialog> nativo:
// Esc lo cierra, el foco queda atrapado y arranca en "cancelar" (la opción segura). Un clic fuera también cancela.
export default function ConfirmDialog({ icon, title, text, confirmLabel, cancelLabel, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const cancel = useRef(onCancel);
  cancel.current = onCancel;

  useEffect(() => {
    const dialog = ref.current!;
    const close = () => cancel.current();
    const outside = (e: MouseEvent) => { if (e.target === dialog) close(); };
    dialog.showModal();
    dialog.addEventListener('close', close);
    dialog.addEventListener('click', outside);
    return () => { dialog.removeEventListener('close', close); dialog.removeEventListener('click', outside); dialog.close(); };
  }, []);

  return (
    <dialog ref={ref} className="mp-confirm" aria-labelledby="confirm-title" aria-describedby="confirm-text">
      <span className="mp-icon-tile">{icon}</span>
      <h2 id="confirm-title" className="mp-confirm-title">{title}</h2>
      <p id="confirm-text" className="mp-confirm-text">{text}</p>
      <div className="mp-confirm-actions">
        <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </dialog>
  );
}
