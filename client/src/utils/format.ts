// ============================================================
// src/utils/format.ts
// Herbruikbare formatteerfuncties
// ============================================================

/**
 * Formatteert een ISO datetime string naar HH:MM
 * Geeft '-' terug als de waarde null/undefined is
 */
export function formatTime(value: string | null | undefined): string {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formatteert een ISO datetime string naar DD-MM-YYYY HH:MM
 */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatteert een bedrag als euro
 */
export function formatEuro(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value);
}

/**
 * Formatteert een ISO date string naar YYYY-MM-DD (voor input[type=date])
 */
export function toDateInputValue(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Formatteert een Date naar "Dinsdag 9 maart om 21:45u"
 */
export function formatLastUpdated(date: Date): string {
  const dag = date.toLocaleDateString('nl-NL', { weekday: 'long' });
  const dagNum = date.getDate();
  const maand = date.toLocaleDateString('nl-NL', { month: 'long' });
  const tijd = date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  const dagCapitaal = dag.charAt(0).toUpperCase() + dag.slice(1);
  return `${dagCapitaal} ${dagNum} ${maand} om ${tijd}u`;
}
