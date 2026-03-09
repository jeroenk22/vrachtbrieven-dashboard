// ============================================================
// src/types/dashboard.ts
// Client-side types — gespiegeld aan de API DTO's
// ============================================================

export interface DashboardRoute {
  RideId: number;
  Route: string;
  RouteSortKey: string;
  RideStartDatum: string;
  NaamChauffeur: string | null;
  Kenteken: string | null;
  NaamAuto: string | null;
  TaakAantal: number;
  OpenTaken: number;
  HeeftFotos: number;
  CurrentHash: number;
  LastSeenAt: string | null;
  LastSeenHash: number | null;
  HasUpdates: number;
}

export interface DashboardTask {
  Ritnummer: number;
  Route: string;
  RouteSortNumber: number | null;
  RouteSortKey: string;
  RideStartDatum: string;
  NaamChauffeur: string | null;
  Kenteken: string | null;
  NaamAuto: string | null;
  Taaknummer: number;
  Type: string | null;
  Status: string | null;
  ProbleemStatusId: number | null;
  ProbleemStatusNaam: string | null;
  Klantnummer: string | null;
  Klantnaam: string | null;
  EmailAdresKlant: string | null;
  TaakEmailAdres: string | null;
  Product: string | null;
  ProductOmschrijving: string | null;
  OrderId: number;
  ClientNo: string | null;
  Omzet: number | null;
  AantalFotos: number;
  AfgerondVan: string | null;
  AfgerondTot: string | null;
  GeplandVan: string | null;
  GeplandTot: string | null;
  GewenstVan: string | null;
  GewenstTot: string | null;
  OpenFrom: string | null;
  OpenTo: string | null;
  Naam: string | null;
  Adres: string | null;
  Plaats: string | null;
  Commentaar: string | null;
  Instructies: string | null;
  Wachttijd: number | null;
  Colliomschrijving: string | null;
  HeeftFotos: number;
  LastEmailSentAt: string | null;
  LastEmailSentBy: string | null;
  LastEmailType: string | null;
  LastEmailTo: string | null;
  IsChecked: number;
  CheckedBy: string | null;
  CheckedAt: string | null;
  CheckedComment: string | null;
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  error?: string;
}
