// ============================================================
// src/components/RouteRow.tsx
// Eén routebalk met uitklapbare takenlijst
// ============================================================

import { useState, useEffect } from 'react';
import type { DashboardRoute } from '../types/dashboard';
import { useTasks, useSetTaskChecked, useMarkRouteSeen } from '../hooks/useDashboard';
import { TaskRow } from './TaskRow';
import { LicensePlate } from './LicensePlate';
import { formatTime, formatEuro } from '../utils/format';

interface RouteRowProps {
  route: DashboardRoute;
  day?: string;
  showChecked: boolean;
  userName: string;
}

export function RouteRow({ route, day, showChecked, userName }: RouteRowProps) {
  const [expanded, setExpanded] = useState(false);

  const { data: tasks, isLoading } = useTasks(
    expanded ? route.RideId : null,
    day,
    showChecked
  );

  const { mutate: checkTask } = useSetTaskChecked();
  const { mutate: markSeen } = useMarkRouteSeen();

  // Markeer als gezien wanneer uitgeklapt
  useEffect(() => {
    if (expanded && route.HasUpdates === 1) {
      markSeen({
        userName,
        rideId: route.RideId,
        currentHash: route.CurrentHash,
        day,
      });
    }
  }, [expanded]);

  const handleCheck = (task: { Taaknummer: number; IsChecked: number }, checked: boolean) => {
    checkTask({
      ordSubTaskNo: task.Taaknummer,
      checked,
      checkedBy: userName,
    });
  };

  const startTijd = formatTime(route.RideStartDatum);
  const hasUpdates = route.HasUpdates === 1;

  // Bereken omzet uit taken (wanneer geladen)
  const totaalOmzet = tasks?.reduce((sum, t) => sum + (t.Omzet ?? 0), 0);

  return (
    <div className="mb-1.5">
      {/* Route balk */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className={`
          w-full text-left px-4 py-2.5 rounded-lg border transition-all duration-150
          flex items-center gap-3 group
          ${expanded
            ? 'bg-slate-700/80 border-slate-500 rounded-b-none'
            : 'bg-slate-800/70 border-slate-700 hover:bg-slate-700/60 hover:border-slate-500'}
        `}
      >
        {/* Bolletje */}
        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full transition-all"
          style={{ backgroundColor: hasUpdates ? '#f97316' : '#334155' }}
          title={hasUpdates ? 'Wijzigingen sinds laatste bekijken' : 'Geen wijzigingen'}
        />

        {/* Route naam */}
        <span className="font-bold text-slate-100 text-sm min-w-[180px] truncate">
          {route.Route}
        </span>

        {/* Chauffeur */}
        <span className="text-slate-400 text-sm truncate flex-1">
          {route.NaamChauffeur ?? '-'}
        </span>

        {/* Kenteken */}
        {route.Kenteken && <LicensePlate kenteken={route.Kenteken} />}

        {/* Starttijd */}
        <span className="text-slate-400 text-xs tabular-nums whitespace-nowrap">
          {startTijd}
        </span>

        {/* Taken teller */}
        <span className="text-xs text-slate-400 whitespace-nowrap">
          <span className="font-semibold text-slate-200">{route.OpenTaken}</span>
          <span className="text-slate-600">/{route.TaakAantal}</span>
          <span className="ml-1">taken</span>
        </span>

        {/* Omzet */}
        {totaalOmzet !== undefined && (
          <span className="text-xs text-slate-400 whitespace-nowrap tabular-nums">
            {formatEuro(totaalOmzet)}
          </span>
        )}

        {/* Foto indicator */}
        {route.HeeftFotos === 1 && (
          <span className="text-sm" title="Heeft foto's">📷</span>
        )}

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Taken tabel */}
      {expanded && (
        <div className="border border-slate-700 border-t-0 rounded-b-lg overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-3 text-slate-500 text-sm">Laden...</div>
          ) : !tasks || tasks.length === 0 ? (
            <div className="px-4 py-3 text-slate-500 text-sm italic">Geen taken gevonden</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-slate-500 bg-slate-900/60">
                    <th className="px-3 py-2 text-left">Taak / Type</th>
                    <th className="px-3 py-2 text-left">Klant</th>
                    <th className="px-3 py-2 text-left">Locatie</th>
                    <th className="px-3 py-2 text-left">Tijd</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Info</th>
                    <th className="px-3 py-2 text-left">Gecheckt door</th>
                    <th className="px-3 py-2 text-left">✓</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <TaskRow
                      key={task.Taaknummer}
                      task={task}
                      showChecked={showChecked}
                      checkedBy={userName}
                      onCheck={handleCheck}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
