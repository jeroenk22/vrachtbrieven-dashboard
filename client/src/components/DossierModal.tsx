// ============================================================
// src/components/DossierModal.tsx
// Modal voor het bekijken van dossierbestanden
// ============================================================

import { useEffect, useRef, useState } from 'react';
import Flag from 'react-world-flags';
import { createPortal } from 'react-dom';
import { fetchDossierFiles, getDossierFileUrl } from '../api/dossier';
import type { DossierFile } from '../api/dossier';
import { formatDateTime } from '../utils/format';
import { formatRouteName, countryIso } from '../utils/dossierMeta';

export interface TaskMeta {
  route: string | null;
  chauffeur: string | null;
  kenteken: string | null;
  afgerondTot: string | null;
  product: string | null;
  klantnaam: string | null;
  klantnummer: string | null;
  locatieNaam: string | null;
  locatiePlaats: string | null;
  locatieLand: string | null;
}

interface DossierModalProps {
  orderId: number;
  meta: TaskMeta;
  onClose: () => void;
}


function FileIcon({ ext }: { ext: string }) {
  const color =
    ext === 'pdf'                   ? 'text-red-400' :
    ext === 'xlsx' || ext === 'xls' ? 'text-green-400' :
    ext === 'docx' || ext === 'doc' ? 'text-blue-400' :
    'text-slate-400';
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      <svg viewBox="0 0 20 20" fill="currentColor" className={`w-9 h-9 ${color}`}>
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
      <span className="text-[10px] uppercase font-semibold text-slate-500">{ext}</span>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── Lightbox met zoom / sleep ──────────────────────────────
interface LightboxProps {
  images: DossierFile[];
  index: number;
  orderId: number;
  meta: TaskMeta;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const CLICK_ZOOM = 3;

function Lightbox({ images, index, orderId, meta, onClose, onPrev, onNext }: LightboxProps) {
  const file = images[index];

  const [tr, setTr] = useState({ zoom: 1, x: 0, y: 0 });
  const trRef = useRef(tr);
  trRef.current = tr;

  const [rotation, setRotation] = useState(0);

  const [copied, setCopied] = useState(false);
  const copyOrderId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(String(orderId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Drag state — alles in refs zodat window-listeners geen stale closures hebben
  const dragRef = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const didDrag = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

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

  // Window-level drag listeners — actief zodra gebruiker begint te slepen
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
        // snapshot ox/oy zijn al veilig opgeslagen in dragRef
        setTr(t => ({ ...t, x: drag.ox + dx, y: drag.oy + dy }));
      }
    };

    const onUp = (e: MouseEvent) => {
      const drag = dragRef.current;
      if (drag && !didDrag.current) {
        // Pure klik: zoom naar positie (of reset)
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

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 select-none"
      onClick={() => { if (trRef.current.zoom > 1) setTr({ zoom: 1, x: 0, y: 0 }); else onClose(); }}
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
        className={`${cursor}`}
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

      {/* Info-balk */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-6 py-4 bg-black/75 flex flex-wrap items-center gap-x-6 gap-y-1 pointer-events-none"
      >
        {meta.route && (
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide">Route</p>
            <p className="text-slate-100 text-sm font-medium">{formatRouteName(meta.route)}</p>
          </div>
        )}
        {meta.chauffeur && (
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide">Chauffeur</p>
            <p className="text-slate-100 text-sm font-medium">{meta.chauffeur}</p>
          </div>
        )}
        <div
          className="relative group/order pointer-events-auto cursor-pointer"
          onClick={copyOrderId}
        >
          <p className="text-slate-500 text-[10px] uppercase tracking-wide">Order</p>
          <p className="text-slate-100 text-sm font-medium">{orderId}</p>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-700 px-2.5 py-1 text-[11px] text-slate-200 shadow-lg transition-opacity duration-150
            pointer-events-none
            opacity-0 group-hover/order:opacity-100">
            {copied ? 'Ordernummer gekopieerd!' : 'Klik om te kopiëren'}
          </div>
        </div>
        {meta.kenteken && (
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide">Kenteken</p>
            <p className="text-slate-100 text-sm font-medium">{meta.kenteken}</p>
          </div>
        )}
        {meta.afgerondTot && (
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide">Order afgerond</p>
            <p className="text-slate-100 text-sm font-medium">{formatDateTime(meta.afgerondTot).replace(', ', ' om ')}</p>
          </div>
        )}
        {meta.product && (
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide">Product</p>
            <p className="text-slate-100 text-sm font-medium">{meta.product}</p>
          </div>
        )}
        {meta.klantnaam && (
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide">Klant</p>
            <p className="text-slate-100 text-sm font-medium">
              {meta.klantnaam}{meta.klantnummer ? <span className="text-slate-400 font-normal"> ({meta.klantnummer})</span> : null}
            </p>
          </div>
        )}
        {(meta.locatieNaam || meta.locatiePlaats) && (
          <div>
            <p className="text-slate-500 text-[10px] uppercase tracking-wide">Locatie</p>
            <p className="text-slate-100 text-sm font-medium flex items-center gap-1.5">
              {[meta.locatieNaam, meta.locatiePlaats].filter(Boolean).join(', ')}
              {countryIso(meta.locatieLand) && <Flag code={countryIso(meta.locatieLand)!} style={{ height: '14px', width: 'auto', borderRadius: '2px' }} />}
            </p>
          </div>
        )}
        <div className="ml-auto">
          <p className="text-slate-500 text-[10px] text-right">{file.filename}</p>
        </div>
      </div>
    </div>
  );
}

// ── Hoofdcomponent ─────────────────────────────────────────
export function DossierModal({ orderId, meta, onClose }: DossierModalProps) {
  const [files, setFiles] = useState<DossierFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchDossierFiles(orderId)
      .then(setFiles)
      .catch(() => setError('Fout bij ophalen bestanden'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const images = files.filter(f => f.isImage);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else onClose();
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight' && lightboxIndex < images.length - 1)
          setLightboxIndex(i => i! + 1);
        if (e.key === 'ArrowLeft' && lightboxIndex > 0)
          setLightboxIndex(i => i! - 1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, images.length, onClose]);

  return createPortal(
    <>
      {/* ── Bestandenmodal ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

        <div className="relative z-10 w-[82vw] max-w-4xl max-h-[85vh] flex flex-col bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700 flex-shrink-0">
            <div>
              <h2 className="text-slate-100 font-semibold text-sm">Dossierbestanden</h2>
              <p className="text-slate-500 text-xs mt-0.5">Order {orderId}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {loading && <p className="text-slate-400 text-sm text-center py-10">Laden...</p>}
            {error   && <p className="text-red-400 text-sm text-center py-10">{error}</p>}
            {!loading && !error && files.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-10 italic">Geen bestanden gevonden</p>
            )}
            {!loading && files.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {files.map(file => (
                  <button
                    key={file.filename}
                    onClick={() => file.isImage
                      ? setLightboxIndex(images.indexOf(file))
                      : window.open(getDossierFileUrl(orderId, file.filename), '_blank')
                    }
                    title={file.filename}
                    className="group flex flex-col items-center gap-1.5 focus:outline-none"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden border border-slate-600 bg-slate-900 group-hover:border-blue-500 transition-colors">
                      {file.isImage
                        ? <img src={getDossierFileUrl(orderId, file.filename)} alt={file.filename} className="w-full h-full object-cover" />
                        : <FileIcon ext={file.ext} />
                      }
                    </div>
                    <span className="text-[10px] text-slate-500 text-center truncate w-full px-1 group-hover:text-slate-300 transition-colors">
                      {file.filename}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          orderId={orderId}
          meta={meta}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => i! - 1)}
          onNext={() => setLightboxIndex(i => i! + 1)}
        />
      )}
    </>,
    document.body
  );
}
