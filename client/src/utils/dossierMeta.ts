// ============================================================
// src/utils/dossierMeta.ts
// Hulpfuncties voor de dossier/fotoviewer metadata
// ============================================================

export function formatRouteName(route: string): string {
  const numMatch = route.match(/^(\d+)/);
  if (numMatch) return `Route ${parseInt(numMatch[1])}`;
  const stripped = route.replace(/\s*route\s*/i, '').trim();
  return `Route ${stripped || route}`;
}

export const COUNTRY_TO_ISO: Record<string, string> = {
  'belgie': 'BE', 'belgië': 'BE', 'belgium': 'BE',
  'nederland': 'NL', 'netherlands': 'NL',
  'duitsland': 'DE', 'germany': 'DE',
  'frankrijk': 'FR', 'france': 'FR',
  'luxemburg': 'LU', 'luxembourg': 'LU',
  'spanje': 'ES', 'spain': 'ES',
  'italie': 'IT', 'italië': 'IT', 'italy': 'IT',
  'engeland': 'GB', 'verenigd koninkrijk': 'GB', 'united kingdom': 'GB',
  'ierland': 'IE', 'ireland': 'IE',
  'denemarken': 'DK', 'denmark': 'DK',
  'zweden': 'SE', 'sweden': 'SE',
  'noorwegen': 'NO', 'norway': 'NO',
  'zwitserland': 'CH', 'switzerland': 'CH',
  'oostenrijk': 'AT', 'austria': 'AT',
  'polen': 'PL', 'poland': 'PL',
  'tsjechie': 'CZ', 'tsjechië': 'CZ', 'czech republic': 'CZ',
  'bulgarije': 'BG', 'bulgaria': 'BG',
  'verenigde staten': 'US', 'united states': 'US',
};

export function countryIso(name: string | null): string | null {
  if (!name) return null;
  return COUNTRY_TO_ISO[name.trim().toLowerCase()] ?? null;
}
