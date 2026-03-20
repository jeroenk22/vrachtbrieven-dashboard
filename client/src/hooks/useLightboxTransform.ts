// ============================================================
// src/hooks/useLightboxTransform.ts
// Zoom, drag en rotatie state voor de lightbox
// ============================================================

import { useEffect, useRef, useState } from 'react';

const CLICK_ZOOM = 3;

export function useLightboxTransform(index: number) {
  const [tr, setTr] = useState({ zoom: 1, x: 0, y: 0 });
  const trRef = useRef(tr);
  trRef.current = tr;

  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const didDrag = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset bij wisselen van foto
  useEffect(() => {
    setTr({ zoom: 1, x: 0, y: 0 });
    setRotation(0);
  }, [index]);

  // Wheel-zoom — non-passive zodat preventDefault werkt
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      const { zoom, x, y } = trRef.current;
      const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2;
      const newZoom = Math.min(10, Math.max(1, zoom * factor));
      const ratio = newZoom / zoom;
      setTr({ zoom: newZoom, x: cx - (cx - x) * ratio, y: cy - (cy - y) * ratio });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Window-level drag listeners
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.mx;
      const dy = e.clientY - drag.my;
      if (!didDrag.current && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        didDrag.current = true;
        setIsDragging(true);
      }
      if (didDrag.current && trRef.current.zoom > 1) {
        setTr(t => ({ ...t, x: drag.ox + dx, y: drag.oy + dy }));
      }
    };

    const onUp = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (drag && !didDrag.current) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const cx = e.clientX - rect.left - rect.width / 2;
          const cy = e.clientY - rect.top - rect.height / 2;
          const { zoom, x, y } = trRef.current;
          if (zoom >= CLICK_ZOOM) {
            setTr({ zoom: 1, x: 0, y: 0 });
          } else {
            const ratio = CLICK_ZOOM / zoom;
            setTr({ zoom: CLICK_ZOOM, x: cx - (cx - x) * ratio, y: cy - (cy - y) * ratio });
          }
        }
      }
      dragRef.current = null;
      didDrag.current = false;
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    didDrag.current = false;
    dragRef.current = { mx: e.clientX, my: e.clientY, ox: trRef.current.x, oy: trRef.current.y };
  };

  const cursor =
    tr.zoom >= CLICK_ZOOM ? (isDragging ? 'cursor-grabbing' : 'cursor-zoom-out') :
    tr.zoom > 1           ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') :
    'cursor-zoom-in';

  const resetZoom = () => setTr({ zoom: 1, x: 0, y: 0 });

  return { tr, trRef, rotation, setRotation, containerRef, handleMouseDown, cursor, resetZoom };
}
