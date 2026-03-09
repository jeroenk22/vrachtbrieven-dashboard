// ============================================================
// dashboard.test.ts
// Jest + Supertest tests voor de dashboard endpoints
// ============================================================

import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

// Mock de volledige service-laag zodat tests zonder DB draaien
jest.mock("../src/services/dashboard.service", () => ({
  getDashboardRoutes: jest.fn(),
  getDashboardTasks: jest.fn(),
  setTaskChecked: jest.fn(),
  markRouteSeen: jest.fn(),
}));

import {
  getDashboardRoutes,
  getDashboardTasks,
  setTaskChecked,
  markRouteSeen,
} from "../src/services/dashboard.service";

const mockGetDashboardRoutes = getDashboardRoutes as jest.MockedFunction<
  typeof getDashboardRoutes
>;
const mockGetDashboardTasks = getDashboardTasks as jest.MockedFunction<
  typeof getDashboardTasks
>;
const mockSetTaskChecked = setTaskChecked as jest.MockedFunction<
  typeof setTaskChecked
>;
const mockMarkRouteSeen = markRouteSeen as jest.MockedFunction<
  typeof markRouteSeen
>;

// ------------------------------------------------------------
// Fixture data
// ------------------------------------------------------------
const mockRoute = {
  RideId: 1,
  Route: "101 Amsterdam",
  RouteSortKey: "00101|101 Amsterdam",
  RideStartDatum: "2026-03-04T06:00:00.000Z",
  NaamChauffeur: "Jan Jansen",
  Kenteken: "AB-123-C",
  NaamAuto: "Scania R450",
  TaakAantal: 5,
  OpenTaken: 3,
  HeeftFotos: 1,
  CurrentHash: 987654321,
  LastSeenAt: null,
  LastSeenHash: null,
  HasUpdates: 1,
};

const mockTask = {
  Ritnummer: 1,
  Route: "101 Amsterdam",
  RouteSortNumber: 101,
  RouteSortKey: "00101|101 Amsterdam",
  RideStartDatum: "2026-03-04T06:00:00.000Z",
  NaamChauffeur: "Jan Jansen",
  Kenteken: "AB-123-C",
  NaamAuto: "Scania R450",
  Taaknummer: 42,
  Type: "L",
  Status: "Planned",
  ProbleemStatusId: null,
  ProbleemStatusNaam: null,
  Klantnummer: "K001",
  Klantnaam: "Klant BV",
  EmailAdresKlant: "klant@example.com",
  TaakEmailAdres: null,
  Product: "PROD01",
  ProductOmschrijving: "Productomschrijving",
  OrderId: 1001,
  ClientNo: "K001",
  Omzet: 250.0,
  AantalFotos: 2,
  AfgerondVan: null,
  AfgerondTot: null,
  GeplandVan: "2026-03-04T08:00:00.000Z",
  GeplandTot: "2026-03-04T09:00:00.000Z",
  GewenstVan: null,
  GewenstTot: null,
  OpenFrom: null,
  OpenTo: null,
  Naam: "Magazijn A",
  Adres: "Havenstraat 1",
  Plaats: "Amsterdam",
  Commentaar: null,
  Instructies: null,
  Wachttijd: null,
  Colliomschrijving: null,
  HeeftFotos: 1,
  LastEmailSentAt: null,
  LastEmailSentBy: null,
  LastEmailType: null,
  LastEmailTo: null,
  IsChecked: 0,
  CheckedBy: null,
  CheckedAt: null,
  CheckedComment: null,
};

// ------------------------------------------------------------
// GET /dashboard/routes
// ------------------------------------------------------------
describe("GET /dashboard/routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("geeft 400 terug als userName ontbreekt", async () => {
    const res = await request(app).get("/dashboard/routes");
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("geeft routes terug als userName aanwezig is", async () => {
    mockGetDashboardRoutes.mockResolvedValueOnce([mockRoute] as any);
    const res = await request(app).get("/dashboard/routes?userName=jeroen");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].RideId).toBe(1);
    expect(mockGetDashboardRoutes).toHaveBeenCalledWith("jeroen", undefined);
  });

  it("stuurt day door naar service als opgegeven", async () => {
    mockGetDashboardRoutes.mockResolvedValueOnce([mockRoute] as any);
    await request(app).get("/dashboard/routes?userName=jeroen&day=2026-03-04");
    expect(mockGetDashboardRoutes).toHaveBeenCalledWith("jeroen", "2026-03-04");
  });

  it("geeft 500 terug bij service error", async () => {
    mockGetDashboardRoutes.mockRejectedValueOnce(new Error("DB fout"));
    const res = await request(app).get("/dashboard/routes?userName=jeroen");
    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});

// ------------------------------------------------------------
// GET /dashboard/tasks
// ------------------------------------------------------------
describe("GET /dashboard/tasks", () => {
  beforeEach(() => jest.clearAllMocks());

  it("geeft taken terug zonder filters", async () => {
    mockGetDashboardTasks.mockResolvedValueOnce([mockTask] as any);
    const res = await request(app).get("/dashboard/tasks");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data[0].Taaknummer).toBe(42);
  });

  it("stuurt rideId en showChecked door naar service", async () => {
    mockGetDashboardTasks.mockResolvedValueOnce([]);
    await request(app).get("/dashboard/tasks?rideId=1&showChecked=true");
    expect(mockGetDashboardTasks).toHaveBeenCalledWith(
      expect.objectContaining({ rideId: 1, showChecked: true }),
    );
  });

  it("geeft 500 terug bij service error", async () => {
    mockGetDashboardTasks.mockRejectedValueOnce(new Error("DB fout"));
    const res = await request(app).get("/dashboard/tasks");
    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});

// ------------------------------------------------------------
// POST /dashboard/tasks/check
// ------------------------------------------------------------
describe("POST /dashboard/tasks/check", () => {
  beforeEach(() => jest.clearAllMocks());

  it("geeft 400 als verplichte velden ontbreken", async () => {
    const res = await request(app).post("/dashboard/tasks/check").send({});
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("roept setTaskChecked aan met correcte data", async () => {
    mockSetTaskChecked.mockResolvedValueOnce();
    const res = await request(app).post("/dashboard/tasks/check").send({
      ordSubTaskNo: 42,
      checked: true,
      checkedBy: "jeroen",
      comment: "OK",
    });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(mockSetTaskChecked).toHaveBeenCalledWith({
      ordSubTaskNo: 42,
      checked: true,
      checkedBy: "jeroen",
      comment: "OK",
    });
  });

  it("geeft 500 terug bij service error", async () => {
    mockSetTaskChecked.mockRejectedValueOnce(new Error("DB fout"));
    const res = await request(app)
      .post("/dashboard/tasks/check")
      .send({ ordSubTaskNo: 42, checked: true, checkedBy: "jeroen" });
    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});

// ------------------------------------------------------------
// POST /dashboard/routes/seen
// ------------------------------------------------------------
describe("POST /dashboard/routes/seen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("geeft 400 als verplichte velden ontbreken", async () => {
    const res = await request(app)
      .post("/dashboard/routes/seen")
      .send({ userName: "jeroen" });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("roept markRouteSeen aan met correcte data", async () => {
    mockMarkRouteSeen.mockResolvedValueOnce();
    const res = await request(app)
      .post("/dashboard/routes/seen")
      .send({ userName: "jeroen", rideId: 1, currentHash: 987654321 });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(mockMarkRouteSeen).toHaveBeenCalledWith({
      day: undefined,
      userName: "jeroen",
      rideId: 1,
      currentHash: 987654321,
    });
  });

  it("geeft 500 terug bij service error", async () => {
    mockMarkRouteSeen.mockRejectedValueOnce(new Error("DB fout"));
    const res = await request(app)
      .post("/dashboard/routes/seen")
      .send({ userName: "jeroen", rideId: 1, currentHash: 123 });
    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});
