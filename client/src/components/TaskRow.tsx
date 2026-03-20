// ============================================================
// src/components/TaskRow.tsx
// Eén taakregel in de uitgeklapte routeweergave
// ============================================================

import type { DashboardTask } from '../types/dashboard';
import { formatTime, formatDateTime, formatEuro } from '../utils/format';
import { getStatusLabel } from '../config/statusCodes';
import { TaskTypeIcon } from './TaskTypeIcon';

interface TaskRowProps {
  task: DashboardTask;
  showChecked: boolean;
  checkedBy: string;
  onCheck: (task: DashboardTask, checked: boolean) => void;
}

export function TaskRow({ task, showChecked, onCheck }: TaskRowProps) {
  const isChecked = task.IsChecked === 1;
  const isHidden = isChecked && !showChecked;

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
        <div className="font-medium truncate max-w-[160px]">{task.Klantnaam ?? '-'}</div>
      </td>

      {/* Product */}
      <td className={tdMuted}>{task.Product ?? '-'}</td>

      {/* Omzet */}
      <td className={`${tdMuted} text-right tabular-nums whitespace-nowrap`}>
        {formatEuro(task.Omzet)}
      </td>

      {/* Naam */}
      <td className={tdMuted}>
        <div className="truncate max-w-[140px]">{task.Naam ?? '-'}</div>
      </td>

      {/* Adres */}
      <td className={tdMuted}>
        <div className="truncate max-w-[160px]">{task.Adres ?? '-'}</div>
      </td>

      {/* Plaats */}
      <td className={tdMuted}>
        <div className="truncate max-w-[120px]">{task.Plaats ?? '-'}</div>
      </td>

      {/* Colliomschrijving */}
      <td className={tdMuted}>
        <div className="truncate max-w-[120px]">{task.Colliomschrijving ?? '-'}</div>
      </td>

      {/* Commentaar */}
      <td className={`${tdBase} text-center`}>
        {task.Commentaar && (
          <span title={task.Commentaar} className="cursor-default text-slate-400 hover:text-slate-200 transition-colors">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 4V5z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </td>

      {/* Foto's */}
      <td className={`${tdBase} text-center`}>
        <div className="flex items-center justify-center gap-1.5">
          {task.AantalFotos > 0 && (
            <span title={`${task.AantalFotos} foto('s)`} className="text-sm">📷</span>
          )}
          {task.LastEmailSentAt && (
            <span title={`Email verstuurd: ${formatDateTime(task.LastEmailSentAt)}`} className="text-sm">✉️</span>
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
        <button
          onClick={() => onCheck(task, !isChecked)}
          title={isChecked ? 'Klik om te unchecken' : 'Klik om te checken'}
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
      </td>
    </tr>
  );
}
