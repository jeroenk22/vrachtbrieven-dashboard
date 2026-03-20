// ============================================================
// src/components/TaskRow.tsx
// Eén taakregel in de uitgeklapte routeweergave
// ============================================================

import { useState } from 'react';
import type { DashboardTask } from '../types/dashboard';
import { formatTime, formatDateTime, formatEuro } from '../utils/format';
import { getStatusLabel } from '../config/statusCodes';
import { TaskTypeIcon } from './TaskTypeIcon';
import { Tooltip } from './Tooltip';
import { TruncatedCell } from './TruncatedCell';
import { DossierModal } from './DossierModal';

interface TaskRowProps {
  task: DashboardTask;
  showChecked: boolean;
  checkedBy: string;
  onCheck: (task: DashboardTask, checked: boolean) => void;
}

export function TaskRow({ task, showChecked, onCheck }: TaskRowProps) {
  const isChecked = task.IsChecked === 1;
  const isHidden = isChecked && !showChecked;
  const [dossierOpen, setDossierOpen] = useState(false);

  if (isHidden) return null;

  const tdBase = 'px-2 py-1 text-xs';
  const tdMuted = `${tdBase} text-slate-400`;

  return (
    <tr
      className={`
        border-b border-slate-700 text-xs transition-colors
        ${isChecked
          ? 'bg-slate-800/40 text-slate-500'
          : 'bg-slate-800/80 hover:bg-slate-700/60 text-slate-200'}
      `}
    >
      {/* Type + taaknummer */}
      <td className="px-2 py-1 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <TaskTypeIcon type={task.Type} />
          <span className="font-mono font-semibold text-slate-300 text-xs">{task.Taaknummer}</span>
        </div>
      </td>

      {/* Klantnummer */}
      <td className={tdMuted}>{task.Klantnummer ?? '-'}</td>

      {/* Taakstatus + probleemstatus */}
      <td className={tdMuted}>
        <div>{getStatusLabel(task.Status)}</div>
        {task.ProbleemStatusNaam && (
          <div className="text-red-400 mt-0.5">{task.ProbleemStatusNaam}</div>
        )}
      </td>

      {/* Klantnaam */}
      <td className={tdBase}>
        <TruncatedCell text={task.Klantnaam} maxWidth="max-w-[160px]" className="font-medium" />
      </td>

      {/* Product */}
      <td className={tdMuted}>
        {task.ProductOmschrijving
          ? <Tooltip text={task.ProductOmschrijving}><span>{task.Product ?? '-'}</span></Tooltip>
          : (task.Product ?? '-')
        }
      </td>

      {/* Omzet */}
      <td className={`${tdMuted} text-right tabular-nums whitespace-nowrap`}>
        {formatEuro(task.Omzet)}
      </td>

      {/* Naam */}
      <td className={tdMuted}><TruncatedCell text={task.Naam} maxWidth="max-w-[140px]" /></td>

      {/* Adres */}
      <td className={tdMuted}><TruncatedCell text={task.Adres} maxWidth="max-w-[160px]" /></td>

      {/* Plaats */}
      <td className={tdMuted}><TruncatedCell text={task.Plaats} maxWidth="max-w-[120px]" /></td>

      {/* Colliomschrijving */}
      <td className={tdMuted}><TruncatedCell text={task.Colliomschrijving} maxWidth="max-w-[120px]" /></td>

      {/* Commentaar */}
      <td className={`${tdBase} text-center`}>
        {task.Commentaar && (
          <Tooltip text={task.Commentaar}>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 hover:text-slate-200 transition-colors cursor-default">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 4V5z" clipRule="evenodd" />
            </svg>
          </Tooltip>
        )}
      </td>

      {/* Foto's / dossier */}
      <td className={`${tdBase} text-center`}>
        <div className="flex items-center justify-center gap-1.5">
          {task.AantalFotos > 0 && (
            <>
              <Tooltip text={`${task.AantalFotos} foto('s) — klik om te bekijken`}>
                <button
                  onClick={() => setDossierOpen(true)}
                  className="relative inline-flex items-center justify-center group/cam cursor-pointer"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400 group-hover/cam:text-blue-400 transition-colors">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586A2 2 0 0113 4.586L12.414 4H7.586L7 4.586A2 2 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-0.5 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                    {task.AantalFotos}
                  </span>
                </button>
              </Tooltip>
              {dossierOpen && (
                <DossierModal
                  orderId={task.OrderId}
                  meta={{
                    route: task.Route,
                    chauffeur: task.NaamChauffeur,
                    kenteken: task.Kenteken,
                    afgerondTot: task.AfgerondTot,
                    product: task.ProductOmschrijving ?? task.Product,
                    klantnaam: task.Klantnaam,
                    klantnummer: task.Klantnummer,
                    locatieNaam: task.Naam,
                    locatiePlaats: task.Plaats,
                    locatieLand: task.Land,
                  }}
                  onClose={() => setDossierOpen(false)}
                />
              )}
            </>
          )}
          {task.LastEmailSentAt && (
            <Tooltip text={`Email verstuurd: ${formatDateTime(task.LastEmailSentAt)}`}>
              <span className="text-sm">✉️</span>
            </Tooltip>
          )}
        </div>
      </td>

      {/* Gepland (MomentPTA) */}
      <td className={`${tdMuted} tabular-nums whitespace-nowrap`}>
        {formatTime(task.GeplandVan) ?? '-'}
      </td>

      {/* Gewenst (MomentETA – MomentETD) */}
      <td className={`${tdMuted} tabular-nums whitespace-nowrap`}>
        <span>{formatTime(task.GewenstVan)}</span>
        <span className="mx-1 text-slate-600">–</span>
        <span>{formatTime(task.GewenstTot)}</span>
      </td>

      {/* Check info (alleen zichtbaar als gecheckt + showChecked) */}
      {isChecked && showChecked ? (
        <td className={`${tdMuted} whitespace-nowrap`}>
          <div>{task.CheckedBy}</div>
          <div>{formatDateTime(task.CheckedAt)}</div>
          {task.CheckedComment && (
            <div className="italic text-slate-600 truncate max-w-[120px]">{task.CheckedComment}</div>
          )}
        </td>
      ) : (
        <td />
      )}

      {/* Check knop */}
      <td className="px-3 py-2">
        <Tooltip text={isChecked ? 'Klik om te unchecken' : 'Klik om te checken'}>
        <button
          onClick={() => onCheck(task, !isChecked)}
          className={`
            w-6 h-6 rounded border-2 flex items-center justify-center transition-all
            ${isChecked
              ? 'bg-green-700/50 border-green-600 text-green-400 hover:bg-red-900/40 hover:border-red-600'
              : 'bg-transparent border-slate-600 hover:border-green-500 hover:bg-green-900/30'}
          `}
        >
          {isChecked && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        </Tooltip>
      </td>
    </tr>
  );
}
