// ============================================================
// src/components/Tooltip.tsx
// Gestylede tooltip wrapper
// ============================================================

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export function Tooltip({ text, children }: TooltipProps) {
  return (
    <span className="relative group inline-flex items-center">
      {children}
      <span className="
        pointer-events-none absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
        whitespace-nowrap rounded bg-slate-700 border border-slate-600
        px-2 py-1 text-xs text-slate-200 shadow-lg
        opacity-0 group-hover:opacity-100 transition-opacity duration-150
      ">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
      </span>
    </span>
  );
}
