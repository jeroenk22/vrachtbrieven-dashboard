// ============================================================
// src/components/TruncatedCell.tsx
// Toont tekst afgekapt; tooltip alleen als tekst echt overloopt
// ============================================================

import { useRef, useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';

interface TruncatedCellProps {
  text: string | null | undefined;
  maxWidth: string;
  className?: string;
  tooltipText?: string;
}

export function TruncatedCell({ text, maxWidth, className, tooltipText }: TruncatedCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el) setIsTruncated(el.scrollWidth > el.offsetWidth);
  }, [text]);

  const display = text ?? '-';
  const inner = (
    <div ref={ref} className={`truncate ${maxWidth} ${className ?? ''}`}>
      {display}
    </div>
  );

  if (isTruncated) {
    return <Tooltip text={tooltipText ?? display}>{inner}</Tooltip>;
  }

  return inner;
}
