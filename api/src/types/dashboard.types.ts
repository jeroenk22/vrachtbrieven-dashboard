// ============================================================
// dashboard.types.ts
// Gegenereerd op basis van SQL views + stored procedures
// ============================================================

// ------------------------------------------------------------
// Route (spGetDashboardRoutes → RouteAgg + RouteSeenState)
// ------------------------------------------------------------
export interface DashboardRoute {
  RideId: number;
  Route: string;
  RouteSortKey: string;
  RideStartDatum: string;         // ISO datetime string
  NaamChauffeur: string | null;
  Kenteken: string | null;
  NaamAuto: string | null;
  TaakAantal: number;
  OpenTaken: number;
  HeeftFotos: number;             // 0 | 1
  CurrentHash: number;
  LastSeenAt: string | null;      // ISO datetime string
  LastSeenHash: number | null;
  HasUpdates: number;             // 0 | 1 — bolletje indicator
}

// ------------------------------------------------------------
// Task (vw_Dashboard_Tasks_Checked → spGetDashboardTasks)
// ------------------------------------------------------------
export interface DashboardTask {
  // Rit / route
  Ritnummer: number;
  Route: string;
  RouteSortNumber: number | null;
  RouteSortKey: string;
  RideStartDatum: string;

  // Chauffeur / voertuig
  NaamChauffeur: string | null;
  Kenteken: string | null;
  NaamAuto: string | null;

  // Taak kern
  Taaknummer: number;
  Type: string | null;
  Status: string | null;
  ProbleemStatusId: number | null;
  ProbleemStatusNaam: string | null;

  // Klant / order
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

  // Tijden
  AfgerondVan: string | null;
  AfgerondTot: string | null;
  GeplandVan: string | null;
  GeplandTot: string | null;
  GewenstVan: string | null;
  GewenstTot: string | null;
  OpenFrom: string | null;
  OpenTo: string | null;

  // Locatie / details
  Naam: string | null;
  Adres: string | null;
  Plaats: string | null;
  Commentaar: string | null;
  Instructies: string | null;
  Wachttijd: number | null;
  Colliomschrijving: string | null;

  // Dossier indicatoren (vw_Dashboard_Tasks_Checked)
  HeeftFotos: number;             // 0 | 1
  LastEmailSentAt: string | null;
  LastEmailSentBy: string | null;
  LastEmailType: string | null;
  LastEmailTo: string | null;

  // Check-status
  IsChecked: number;              // 0 | 1
  CheckedBy: string | null;
  CheckedAt: string | null;
  CheckedComment: string | null;
}

// ------------------------------------------------------------
// Request bodies
// ------------------------------------------------------------
export interface SetTaskCheckedBody {
  ordSubTaskNo: number;
  checked: boolean;
  checkedBy: string;
  comment?: string | null;
}

export interface MarkRouteSeenBody {
  day?: string;                   // ISO date string, optioneel (default = vandaag)
  userName: string;
  rideId: number;
  currentHash: number;
}
