// ============================================================
// src/components/LicensePlate.tsx
// Toont een kenteken als Nederlands kentekenplaatje.
// Zet STYLED=false om terug te gaan naar de eenvoudige weergave.
// ============================================================

const STYLED = true;

interface LicensePlateProps {
  kenteken: string;
}

export function LicensePlate({ kenteken }: LicensePlateProps) {
  if (!STYLED) {
    return (
      <span className="text-xs font-mono bg-slate-900 border border-slate-600 text-slate-300 px-2 py-0.5 rounded">
        {kenteken}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-stretch rounded-sm overflow-hidden border border-yellow-600/50 flex-shrink-0"
      style={{ height: '22px' }}
    >
      {/* EU strip */}
      <span
        className="flex flex-col items-center justify-center bg-blue-700 px-1"
        style={{ width: '18px' }}
      >
        <svg viewBox="0 0 10 10" width="10" height="10">
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = 5 + 3.8 * Math.cos(angle);
            const y = 5 + 3.8 * Math.sin(angle);
            return (
              <polygon
                key={i}
                points="0,-0.9 0.21,-0.29 0.85,-0.29 0.35,0.11 0.53,0.72 0,0.35 -0.53,0.72 -0.35,0.11 -0.85,-0.29 -0.21,-0.29"
                fill="#FFD700"
                transform={`translate(${x},${y}) scale(0.9)`}
              />
            );
          })}
        </svg>
        <span
          className="text-white leading-none"
          style={{ fontSize: '5.5px', fontFamily: 'Arial, sans-serif', fontWeight: 700 }}
        >
          NL
        </span>
      </span>

      {/* Kentekenplaat */}
      <span
        className="flex items-center bg-yellow-400 text-black px-1.5 tracking-wider uppercase"
        style={{ fontSize: '11px', fontFamily: '"Arial Black", "Arial Bold", Arial, sans-serif', fontWeight: 900 }}
      >
        {kenteken}
      </span>
    </span>
  );
}
