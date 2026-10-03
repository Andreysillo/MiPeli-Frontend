import { useMemo } from 'react';
import DriftWall from './DriftWall';
import { catalog, driftItem } from '../data';

// Mural de pósters que flota de fondo (Home y Login). `scrim` oscurece la zona donde va el texto.
export default function PosterWall({ scrim }: Readonly<{ scrim: string }>) {
  // 24 bastan para llenar el muro; generar el arte de todo el catálogo trabaría la entrada
  const wall = useMemo(() => catalog.slice(0, 24).map(driftItem), []);
  return (
    <>
      <div className="mp-bg">
        <DriftWall items={wall} columns={6} tileWidth={150} tileHeight={225} gap={18} tilt={16} turn={-14} perspective={1200} depth={120} speed={42} direction="up"
          variance={0.45} parallax={0.6} lift={70} fade={0.62} dim={0.5} overlayColor="#0f0f14" />
      </div>
      <div className="mp-scrim" style={{ background: scrim }} />
    </>
  );
}
