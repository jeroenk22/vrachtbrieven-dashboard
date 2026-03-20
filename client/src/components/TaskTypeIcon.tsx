// ============================================================
// src/components/TaskTypeIcon.tsx
// Gekleurd icoontje voor taaktype (0=Wissel, 1=Laden, 2=Lossen)
// ============================================================

import { getTaskTypeConfig } from '../config/statusCodes';

const COLORS = {
  green:  { bg: 'bg-green-600',  hover: 'bg-green-500',  border: 'border-green-500'  },
  orange: { bg: 'bg-orange-500', hover: 'bg-orange-400', border: 'border-orange-400' },
  blue:   { bg: 'bg-blue-600',   hover: 'bg-blue-500',   border: 'border-blue-500'   },
};

// Vrachtwagen rijdend naar rechts (bovenaanzicht/zijaanzicht)
function TruckIcon() {
  return (
    <svg viewBox="0 0 20 14" fill="currentColor" className="w-3 h-2.5">
      {/* Cabine */}
      <rect x="12" y="1" width="7" height="8" rx="1" />
      {/* Laadruimte */}
      <rect x="1" y="3" width="11" height="6" rx="0.5" />
      {/* Wielen */}
      <circle cx="4"  cy="11.5" r="2" />
      <circle cx="14" cy="11.5" r="2" />
    </svg>
  );
}

// Pijl omhoog (laden)
function ArrowUp() {
  return (
    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2">
      <path d="M5 8.5V1.5M2 4.5l3-3 3 3" />
    </svg>
  );
}

// Pijl omlaag (lossen)
function ArrowDown() {
  return (
    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2 h-2">
      <path d="M5 1.5V8.5M2 5.5l3 3 3-3" />
    </svg>
  );
}

// Dubbele pijl (wissel)
function ArrowSwap() {
  return (
    <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2">
      <path d="M1 3l3-2.5L7 3" />
      <path d="M4 0.5V9" />
      <path d="M11 7l-3 2.5L5 7" />
      <path d="M8 9.5V1" />
    </svg>
  );
}

interface TaskTypeIconProps {
  type: string | number | null | undefined;
}

export function TaskTypeIcon({ type }: TaskTypeIconProps) {
  const config = getTaskTypeConfig(type);
  if (!config) return null;

  const c = COLORS[config.color];

  return (
    <span
      title={config.label}
      className={`inline-flex items-center justify-center w-6 h-6 rounded ${c.bg} text-white shadow-sm select-none`}
    >
      <span className="flex flex-col items-center gap-0.5">
        <TruckIcon />
        {config.color === 'green'  && <ArrowDown />}
        {config.color === 'orange' && <ArrowUp />}
        {config.color === 'blue'   && <ArrowSwap />}
      </span>
    </span>
  );
}
