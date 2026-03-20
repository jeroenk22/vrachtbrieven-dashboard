// ============================================================
// src/components/RouteRow.tsx
// Eén routebalk met uitklapbare takenlijst
// ============================================================

import { useState, useEffect, memo } from 'react';
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

export const RouteRow = memo(function RouteRow({ route, day, showChecked, userName }: RouteRowProps) {
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
      rideId: route.RideId,
      routeName: route.Route,
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
          <span className="relative inline-flex items-center justify-center" title="Heeft foto's">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586A2 2 0 0113 4.586L12.414 4H7.586L7 4.586A2 2 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </span>
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
            <div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-slate-500 bg-slate-900/60">
                    <th className="px-2 py-1.5 text-left">Type</th>
                    <th className="px-2 py-1.5 text-left">Klantnr.</th>
                    <th className="px-2 py-1.5 text-left">Status</th>
                    <th className="px-2 py-1.5 text-left">Klantnaam</th>
                    <th className="px-2 py-1.5 text-left">Product</th>
                    <th className="px-2 py-1.5 text-right">Omzet</th>
                    <th className="px-2 py-1.5 text-left">Naam</th>
                    <th className="px-2 py-1.5 text-left">Adres</th>
                    <th className="px-2 py-1.5 text-left">Plaats</th>
                    <th className="px-2 py-1.5 text-left">Colli</th>
                    <th className="px-2 py-1.5 text-center">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 4V5z" clipRule="evenodd" />
                      </svg>
                    </th>
                    <th className="px-2 py-1.5 text-center">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586A2 2 0 0113 4.586L12.414 4H7.586L7 4.586A2 2 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </th>
                    <th className="px-2 py-1.5 text-left">Gepland</th>
                    <th className="px-2 py-1.5 text-left">Gewenst</th>
                    <th className="px-2 py-1.5 text-left">Gecheckt door</th>
                    <th className="px-2 py-1.5 text-left">✓</th>
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
});
