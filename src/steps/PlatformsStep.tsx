import { useApp } from '../store';
import PlatformPicker from './PlatformPicker';
import StepHeader from './StepHeader';

// Paso 5 (solo la primera vez): dónde ve películas. Con esto los resultados salen de lo que puede ver hoy; se guarda en el navegador.
export default function PlatformsStep() {
  const { t } = useApp();
  return (
    <>
      <StepHeader title={t.platformsQ} hint={t.platformsHint} />
      <div data-reveal style={{ marginTop: 32 }}>
        <PlatformPicker label={t.platformsQ} />
      </div>
    </>
  );
}
