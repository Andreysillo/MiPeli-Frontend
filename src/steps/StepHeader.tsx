import Rise from '../components/Rise';

// Cabecera común de cada paso: etiqueta pequeña, titular que sube desde su máscara y una pista
export default function StepHeader({ kicker, title, hint }: Readonly<{ kicker?: string; title: string; hint?: string }>) {
  return (
    <div className="mp-stack" style={{ gap: 10 }}>
      {kicker && <p data-reveal className="mp-kicker">{kicker}</p>}
      <Rise text={title} className="mp-title" />
      {hint && <p data-reveal className="mp-lead" style={{ margin: 0 }}>{hint}</p>}
    </div>
  );
}
