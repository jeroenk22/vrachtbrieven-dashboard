// ============================================================
// src/components/Lightbox.tsx
// Foto-viewer met zoom, sleep en rotatie
// ============================================================

import { getDossierFileUrl } from '../api/dossier';
import type { DossierFile } from '../api/dossier';
import { useLightboxTransform } from '../hooks/useLightboxTransform';
import { LightboxInfoBar } from './LightboxInfoBar';
import type { TaskMeta } from './DossierModal';

interface LightboxProps {
  images: DossierFile[];
  index: number;
  orderId: number;
  meta: TaskMeta;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function Lightbox({ images, index, orderId, meta, onClose, onPrev, onNext }: LightboxProps) {
  const file = images[index];
  const { tr, trRef, rotation, setRotation, containerRef, handleMouseDown, cursor, resetZoom } = useLightboxTransform(index);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 select-none"
      onClick={() => { if (trRef.current.zoom > 1) resetZoom(); else onClose(); }}
    >
      {/* Sluitknop + draaiknoppen */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          onClick={e => { e.stopPropagation(); setRotation(r => r - 90); }}
          title="Linksom draaien"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10a9 9 0 1 0 9-9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4v6h6" />
          </svg>
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          onClick={e => { e.stopPropagation(); setRotation(r => r + 90); }}
          title="Rechtsom draaien"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10a9 9 0 1 1-9-9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 4v6h-6" />
          </svg>
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          onClick={e => { e.stopPropagation(); onClose(); }}
          title="Sluiten (Esc)"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Teller */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 text-slate-400 text-xs bg-black/50 rounded-full px-4 py-1.5 pointer-events-none">
        <span>{index + 1} / {images.length}</span>
        {tr.zoom > 1 && <span className="text-slate-500">· klik om te resetten</span>}
      </div>

      {/* Foto */}
      <div
        className={cursor}
        style={{ transform: `translate(${tr.x}px, ${tr.y}px) scale(${tr.zoom}) rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={getDossierFileUrl(orderId, file.filename)}
          alt={file.filename}
          className="max-w-[90vw] max-h-[78vh] object-contain rounded shadow-2xl pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Vorige */}
      {index > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          onClick={e => { e.stopPropagation(); onPrev(); }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* Volgende */}
      {index < images.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          onClick={e => { e.stopPropagation(); onNext(); }}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      <LightboxInfoBar orderId={orderId} meta={meta} filename={file.filename} />
    </div>
  );
}
