// ============================================================
// dossier.test.ts
// Vitest tests voor de dossier API-functies
// ============================================================

import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted zorgt dat mockGet beschikbaar is in de mock-factory (die gehoist wordt)
const mockGet = vi.hoisted(() => vi.fn());
vi.mock("axios", () => ({
  default: {
    create: () => ({ get: mockGet }),
  },
}));

import { fetchDossierFiles, getDossierFileUrl } from "../api/dossier";

// ------------------------------------------------------------
// getDossierFileUrl — pure functie, geen mock nodig
// ------------------------------------------------------------
describe("getDossierFileUrl", () => {
  it("geeft het juiste API-pad terug", () => {
    expect(getDossierFileUrl(1196219, "foto.jpg")).toBe(
      "/api/dossier/1196219/files/foto.jpg"
    );
  });

  it("verwerkt een groot orderId correct", () => {
    expect(getDossierFileUrl(9999999, "scan.png")).toBe(
      "/api/dossier/9999999/files/scan.png"
    );
  });

  it("encodeert spaties in bestandsnamen", () => {
    const url = getDossierFileUrl(1196219, "mijn foto.jpg");
    expect(url).toContain("mijn%20foto.jpg");
    expect(url).not.toContain(" ");
  });

  it("encodeert de spatie in een bestandsnaam met haakjes correct", () => {
    // encodeURIComponent encodeert spaties maar laat haakjes ongemoeid (geldige URI-tekens)
    const url = getDossierFileUrl(1196219, "foto (1).jpg");
    expect(url).toContain("%20");
    expect(url).not.toContain(" ");
  });

  it("encodeert ampersands in bestandsnamen", () => {
    const url = getDossierFileUrl(1196219, "bon & factuur.pdf");
    expect(url).toContain("%26");
  });
});

// ------------------------------------------------------------
// fetchDossierFiles — gebruikt axios mock
// ------------------------------------------------------------
describe("fetchDossierFiles", () => {
  beforeEach(() => vi.clearAllMocks());

  it("geeft de bestandenlijst terug bij een succesvolle response", async () => {
    const mockData = [
      { filename: "foto.jpg", ext: "jpg", isImage: true },
      { filename: "verslag.pdf", ext: "pdf", isImage: false },
    ];
    mockGet.mockResolvedValueOnce({ data: { ok: true, data: mockData } });

    const result = await fetchDossierFiles(1196219);

    expect(result).toHaveLength(2);
    expect(result[0].filename).toBe("foto.jpg");
    expect(result[0].isImage).toBe(true);
    expect(result[1].filename).toBe("verslag.pdf");
    expect(result[1].isImage).toBe(false);
  });

  it("roept het juiste endpoint aan", async () => {
    mockGet.mockResolvedValueOnce({ data: { ok: true, data: [] } });
    await fetchDossierFiles(1196219);
    expect(mockGet).toHaveBeenCalledWith("/dossier/1196219/files");
  });

  it("geeft een lege array terug als de map leeg is", async () => {
    mockGet.mockResolvedValueOnce({ data: { ok: true, data: [] } });
    const result = await fetchDossierFiles(9999999);
    expect(result).toEqual([]);
  });

  it("gooit een fout bij een mislukte request", async () => {
    mockGet.mockRejectedValueOnce(new Error("Netwerkfout"));
    await expect(fetchDossierFiles(1196219)).rejects.toThrow("Netwerkfout");
  });

  it("geeft isImage-vlag correct terug voor afbeeldingen", async () => {
    const mockData = [
      { filename: "a.jpg", ext: "jpg", isImage: true },
      { filename: "b.pdf", ext: "pdf", isImage: false },
    ];
    mockGet.mockResolvedValueOnce({ data: { ok: true, data: mockData } });
    const result = await fetchDossierFiles(1196219);
    expect(result.find((f) => f.filename === "a.jpg")?.isImage).toBe(true);
    expect(result.find((f) => f.filename === "b.pdf")?.isImage).toBe(false);
  });
});
