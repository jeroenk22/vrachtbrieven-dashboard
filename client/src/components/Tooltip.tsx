// ============================================================
// src/components/Tooltip.tsx
// Gestylede tooltip via React portal — ontsnapt aan overflow-hidden
// ============================================================

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ text, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className={`inline-flex items-center ${className ?? ''}`}
      onMouseEnter={() => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          setPos({
            top: rect.top - 8,
            left: rect.left + rect.width / 2,
          });
        }
        setVisible(true);
      }}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && createPortal(
        <span
          className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full
            whitespace-nowrap rounded bg-slate-700 border border-slate-600
            px-2 py-1 text-xs text-slate-200 shadow-lg"
          style={{ top: pos.top, left: pos.left }}
        >
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
        </span>,
        document.body,
      )}
    </span>
  );
}
