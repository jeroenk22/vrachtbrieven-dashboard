// ============================================================
// src/components/LightboxInfoBar.tsx
// Metadata-balk onderaan de lightbox
// ============================================================

import { useState } from 'react';
import Flag from 'react-world-flags';
import { formatDateTime } from '../utils/format';
import { formatRouteName, countryIso } from '../utils/dossierMeta';
import type { TaskMeta } from './DossierModal';

interface LightboxInfoBarProps {
  orderId: number;
  meta: TaskMeta;
  filename: string;
}

export function LightboxInfoBar({ orderId, meta, filename }: LightboxInfoBarProps) {
  const [copied, setCopied] = useState(false);

  const copyOrderId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(String(orderId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 px-6 py-4 bg-black/75 flex flex-wrap items-center gap-x-6 gap-y-1 pointer-events-none">
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
      <div className="relative group/order pointer-events-auto cursor-pointer" onClick={copyOrderId}>
        <p className="text-slate-500 text-[10px] uppercase tracking-wide">Order</p>
        <p className="text-slate-100 text-sm font-medium">{orderId}</p>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-700 px-2.5 py-1 text-[11px] text-slate-200 shadow-lg transition-opacity duration-150 pointer-events-none opacity-0 group-hover/order:opacity-100">
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
        <p className="text-slate-500 text-[10px] text-right">{filename}</p>
      </div>
    </div>
  );
}
