// ============================================================
// src/App.tsx
// Hoofdlayout: datumpicker, gebruikersnaam, toggle, routelijst
// ============================================================

import { useState, useEffect } from 'react';
import { useRoutes } from './hooks/useDashboard';
import { RouteRow } from './components/RouteRow';
import { toDateInputValue, formatLastUpdated, capitalizeFirst } from './utils/format';
import { fetchWhoAmI } from './api/dashboard';

export default function App() {
  const [day, setDay] = useState<string>(toDateInputValue(new Date()));
  const [userName, setUserName] = useState<string>('');
  const [userNameError, setUserNameError] = useState<boolean>(false);
  const [showChecked, setShowChecked] = useState<boolean>(false);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchWhoAmI()
      .then((name) => setUserName(capitalizeFirst(name)))
      .catch(() => setUserNameError(true));
  }, []);
  const { data: routes, isLoading, isError, refetch, dataUpdatedAt } = useRoutes(userName, day);

  useEffect(() => {
    if (dataUpdatedAt) setLastUpdated(new Date(dataUpdatedAt));
  }, [dataUpdatedAt]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800/80 border-b border-slate-700 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">

          {/* Titel */}
          <h1 className="text-base font-bold tracking-tight text-white mr-2">
            🚛 Vrachtbrieven Dashboard
          </h1>

          {/* Datumpicker */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wide">Datum</label>
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200
                         focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Gebruikersnaam */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 uppercase tracking-wide">Gebruiker</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => { setUserName(e.target.value); setUserNameError(false); }}
              placeholder="gebruikersnaam"
              className={`bg-slate-700 border rounded px-2 py-1 text-sm text-slate-200 w-32
                         focus:outline-none focus:ring-1
                         ${userNameError
                           ? 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500'
                           : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'}`}
            />
            {userNameError && (
              <span className="text-xs text-yellow-500" title="Kon gebruikersnaam niet automatisch ophalen">
                Vul handmatig in
              </span>
            )}
          </div>

          {/* Toon gecheckte taken toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none ml-auto">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Toon gecheckte taken</span>
            <div
              onClick={() => setShowChecked((v) => !v)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer
                ${showChecked ? 'bg-blue-600' : 'bg-slate-600'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                ${showChecked ? 'translate-x-4' : 'translate-x-0.5'}`}
              />
            </div>
          </label>

          {/* Laatst bijgewerkt */}
          {lastUpdated && (
            <span className="text-xs text-slate-500 italic">
              Bijgewerkt: {formatLastUpdated(lastUpdated)}
            </span>
          )}

          {/* Ververs knop */}
          <button
            onClick={() => refetch()}
            title="Ververs routes"
            className="ml-2 p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 py-4">
        {isLoading && (
          <div className="text-slate-400 text-sm py-8 text-center animate-pulse">Routes laden...</div>
        )}

        {isError && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-3 text-red-400 text-sm">
            Fout bij ophalen van routes. Controleer of de API bereikbaar is.
          </div>
        )}

        {routes && routes.length === 0 && (
          <div className="text-slate-500 text-sm py-8 text-center italic">
            Geen routes gevonden voor {day}.
          </div>
        )}

        {routes && routes.map((route) => (
          <RouteRow
            key={route.RideId}
            route={route}
            day={day}
            showChecked={showChecked}
            userName={userName}
          />
        ))}
      </main>
    </div>
  );
}
