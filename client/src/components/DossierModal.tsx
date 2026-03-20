// ============================================================
// src/components/DossierModal.tsx
// Modal voor het bekijken van dossierbestanden
// ============================================================

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { fetchDossierFiles, getDossierFileUrl } from '../api/dossier';
import type { DossierFile } from '../api/dossier';
import { Lightbox } from './Lightbox';

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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
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
