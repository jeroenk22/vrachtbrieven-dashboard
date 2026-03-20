// ============================================================
// src/config/statusCodes.ts
// Mapping van numerieke statuscodes naar leesbare tekst
// ============================================================

export const STATUS_LABELS: Record<string, string> = {
  '1100': 'Nog niet geaccepteerd (WL)',
  '1200': 'Ongepland (K)',
  '1300': 'Voorgepland (V)',
  '1400': 'Gepland (P)',
  '1500': 'Bezig (B)',
  '1600': 'Gestart (G)',
  '1800': 'Afgerond (#)',
  '1900': 'Geannuleerd (X)',
};

export function getStatusLabel(status: string | null | undefined): string {
  if (!status) return '-';
  return STATUS_LABELS[status] ?? status;
}

// ============================================================
// Taaktypes: 0 = Wissel, 1 = Laden, 2 = Lossen
// ============================================================

export const TASK_TYPE_CONFIG: Record<string, { label: string; color: 'blue' | 'orange' | 'green' }> = {
  '0': { label: 'Wissel', color: 'blue' },
  '1': { label: 'Laden', color: 'orange' },
  '2': { label: 'Lossen', color: 'green' },
};

export function getTaskTypeConfig(type: string | number | null | undefined) {
  if (type === null || type === undefined || type === '') return null;
  return TASK_TYPE_CONFIG[String(type)] ?? null;
}
