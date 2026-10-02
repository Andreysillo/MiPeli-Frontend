type Props = { label: string; onClick?: () => void; bg?: string; color?: string; height?: number };

export default function GlowButton({ label, onClick, bg = '#ffffff', color = '#2a0d6b', height = 54 }: Props) {
  return (
    <div className="gb-wrap">
      <span className="gb-glow" />
      <button className="gb-btn" style={{ height, background: bg, color }} onClick={onClick}>{label}</button>
    </div>
  );
}
