// ============================================================
// src/components/TaskRow.tsx
// Eén taakregel in de uitgeklapte routeweergave
// ============================================================

import type { DashboardTask } from '../types/dashboard';
import { formatTime, formatDateTime } from '../utils/format';

interface TaskRowProps {
  task: DashboardTask;
  showChecked: boolean;
  checkedBy: string;
  onCheck: (task: DashboardTask, checked: boolean) => void;
}

export function TaskRow({ task, showChecked, checkedBy, onCheck }: TaskRowProps) {
  const isChecked = task.IsChecked === 1;
  const isHidden = isChecked && !showChecked;

  if (isHidden) return null;

  const tijdVan = formatTime(task.GeplandVan ?? task.GewenstVan);
  const tijdTot = formatTime(task.GeplandTot ?? task.GewenstTot);

  return (
    <tr
      className={`
        border-b border-slate-700 text-sm transition-colors
        ${isChecked
          ? 'bg-slate-800/40 text-slate-500'
          : 'bg-slate-800/80 hover:bg-slate-700/60 text-slate-200'}
      `}
    >
      {/* Taaknummer + type */}
      <td className="px-3 py-2 font-mono text-xs text-slate-400 whitespace-nowrap">
        <span className="font-semibold text-slate-300">{task.Taaknummer}</span>
        {task.Type && (
          <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
            ${task.Type === 'L' ? 'bg-blue-900/60 text-blue-300' : 'bg-amber-900/60 text-amber-300'}`}>
            {task.Type}
          </span>
        )}
      </td>

      {/* Klant */}
      <td className="px-3 py-2">
        <div className="font-medium truncate max-w-[180px]">{task.Klantnaam ?? '-'}</div>
        {task.ProbleemStatusNaam && (
          <div className="text-xs text-red-400 mt-0.5">{task.ProbleemStatusNaam}</div>
        )}
      </td>

      {/* Locatie */}
      <td className="px-3 py-2 text-slate-400 text-xs">
        <div className="truncate max-w-[200px]">{task.Naam ?? '-'}</div>
        <div className="truncate max-w-[200px]">{task.Adres} {task.Plaats}</div>
      </td>

      {/* Tijden */}
      <td className="px-3 py-2 whitespace-nowrap text-xs tabular-nums">
        <span className="text-slate-300">{tijdVan}</span>
        <span className="text-slate-500 mx-1">–</span>
        <span className="text-slate-300">{tijdTot}</span>
      </td>

      {/* Status */}
      <td className="px-3 py-2 text-xs text-slate-400">
        {task.Status ?? '-'}
      </td>

      {/* Indicatoren */}
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          {task.AantalFotos > 0 && (
            <span title={`${task.AantalFotos} foto('s)`} className="text-base">📷</span>
          )}
          {task.LastEmailSentAt && (
            <span title={`Email verstuurd: ${formatDateTime(task.LastEmailSentAt)}`} className="text-base">✉️</span>
          )}
        </div>
      </td>

      {/* Check info (alleen zichtbaar als gecheckt + showChecked) */}
      {isChecked && showChecked && (
        <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">
          <div>{task.CheckedBy}</div>
          <div>{formatDateTime(task.CheckedAt)}</div>
          {task.CheckedComment && (
            <div className="italic text-slate-600 truncate max-w-[120px]">{task.CheckedComment}</div>
          )}
        </td>
      )}
      {!(isChecked && showChecked) && <td />}

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
