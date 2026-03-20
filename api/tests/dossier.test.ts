// ============================================================
// dossier.test.ts
// Jest + Supertest tests voor de /dossier endpoints
// fs wordt gemocked zodat er geen echte bestanden gelezen worden
// ============================================================

import request from "supertest";
import { Readable } from "stream";
import { createApp } from "../src/app";

// fs MOET vóór createApp gemocked worden (hoisting)
jest.mock("fs", () => ({
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  statSync: jest.fn(),
  createReadStream: jest.fn(),
}));

import fs from "fs";

const app = createApp();

const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
const mockReaddirSync = fs.readdirSync as jest.MockedFunction<typeof fs.readdirSync>;
const mockStatSync = fs.statSync as jest.MockedFunction<typeof fs.statSync>;
const mockCreateReadStream = fs.createReadStream as jest.MockedFunction<typeof fs.createReadStream>;

// Maakt een echte Readable stream met wat testinhoud
function makeReadStream(): Readable {
  return new Readable({
    read() {
      this.push("bestandsinhoud");
      this.push(null);
    },
  });
}

// Stelt de fs-mocks in voor een bestaande map met opgegeven bestanden
function setupFolder(files: string[], allFiles = true) {
  mockExistsSync.mockReturnValue(true);
  mockReaddirSync.mockReturnValue(files as any);
  mockStatSync.mockImplementation(() => ({ isFile: () => allFiles } as any));
}

// ------------------------------------------------------------
// GET /dossier/:orderId/files
// ------------------------------------------------------------
describe("GET /dossier/:orderId/files", () => {
  beforeEach(() => jest.clearAllMocks());

  it("geeft 400 terug bij niet-numerieke orderId", async () => {
    const res = await request(app).get("/dossier/abc/files");
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("geeft 400 terug bij orderId = 0", async () => {
    const res = await request(app).get("/dossier/0/files");
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("geeft lege array terug als map niet bestaat", async () => {
    mockExistsSync.mockReturnValue(false);
    const res = await request(app).get("/dossier/1196219/files");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("geeft bestandslijst terug met correcte velden", async () => {
    setupFolder(["foto.jpg", "verslag.pdf", "sheet.xlsx"]);
    const res = await request(app).get("/dossier/1196219/files");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
  });

  it("markeert afbeeldingen correct als isImage = true", async () => {
    setupFolder(["foto.jpg", "foto.png", "foto.jpeg"]);
    const res = await request(app).get("/dossier/1196219/files");
    expect(res.body.data.every((f: any) => f.isImage)).toBe(true);
  });

  it("markeert niet-afbeeldingen als isImage = false", async () => {
    setupFolder(["verslag.pdf", "sheet.xlsx", "brief.docx"]);
    const res = await request(app).get("/dossier/1196219/files");
    expect(res.body.data.every((f: any) => !f.isImage)).toBe(true);
  });

  it("geeft de extensie terug zonder punt", async () => {
    setupFolder(["foto.jpg"]);
    const res = await request(app).get("/dossier/1196219/files");
    expect(res.body.data[0].ext).toBe("jpg");
  });

  it("filtert submappen eruit (alleen bestanden)", async () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockReturnValue(["foto.jpg", "submap"] as any);
    mockStatSync
      .mockReturnValueOnce({ isFile: () => true } as any)   // foto.jpg
      .mockReturnValueOnce({ isFile: () => false } as any);  // submap
    const res = await request(app).get("/dossier/1196219/files");
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].filename).toBe("foto.jpg");
  });

  it("geeft 500 terug bij een onverwachte leesfout", async () => {
    mockExistsSync.mockReturnValue(true);
    mockReaddirSync.mockImplementation(() => {
      throw new Error("Toegang geweigerd");
    });
    const res = await request(app).get("/dossier/1196219/files");
    expect(res.status).toBe(500);
    expect(res.body.ok).toBe(false);
  });
});

// ------------------------------------------------------------
// GET /dossier/:orderId/files/:filename
// ------------------------------------------------------------
describe("GET /dossier/:orderId/files/:filename", () => {
  beforeEach(() => jest.clearAllMocks());

  it("geeft 400 terug bij niet-numerieke orderId", async () => {
    const res = await request(app).get("/dossier/xyz/files/foto.jpg");
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("geeft 400 terug bij orderId = 0", async () => {
    const res = await request(app).get("/dossier/0/files/foto.jpg");
    expect(res.status).toBe(400);
  });

  it("geeft 404 terug als bestand niet bestaat", async () => {
    mockExistsSync.mockReturnValue(false);
    const res = await request(app).get("/dossier/1196219/files/foto.jpg");
    expect(res.status).toBe(404);
    expect(res.body.ok).toBe(false);
  });

  it("stuurt jpg terug met Content-Type image/jpeg", async () => {
    mockExistsSync.mockReturnValue(true);
    mockCreateReadStream.mockReturnValue(makeReadStream() as any);
    const res = await request(app).get("/dossier/1196219/files/foto.jpg");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("image/jpeg");
  });

  it("stuurt png terug met Content-Type image/png", async () => {
    mockExistsSync.mockReturnValue(true);
    mockCreateReadStream.mockReturnValue(makeReadStream() as any);
    const res = await request(app).get("/dossier/1196219/files/scan.png");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("image/png");
  });

  it("stuurt pdf terug met Content-Type application/pdf", async () => {
    mockExistsSync.mockReturnValue(true);
    mockCreateReadStream.mockReturnValue(makeReadStream() as any);
    const res = await request(app).get("/dossier/1196219/files/verslag.pdf");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/pdf");
  });

  it("stuurt xlsx terug met het juiste Office MIME-type", async () => {
    mockExistsSync.mockReturnValue(true);
    mockCreateReadStream.mockReturnValue(makeReadStream() as any);
    const res = await request(app).get("/dossier/1196219/files/sheet.xlsx");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("spreadsheetml");
  });

  it("gebruikt application/octet-stream voor onbekende extensie", async () => {
    mockExistsSync.mockReturnValue(true);
    mockCreateReadStream.mockReturnValue(makeReadStream() as any);
    const res = await request(app).get("/dossier/1196219/files/bestand.xyz");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/octet-stream");
  });

  it("zet Content-Disposition inline met de bestandsnaam", async () => {
    mockExistsSync.mockReturnValue(true);
    mockCreateReadStream.mockReturnValue(makeReadStream() as any);
    const res = await request(app).get("/dossier/1196219/files/foto.jpg");
    expect(res.headers["content-disposition"]).toContain("inline");
    expect(res.headers["content-disposition"]).toContain("foto.jpg");
  });

  it("voorkomt path-traversal: ../ wordt gestript door path.basename", async () => {
    // ../../wachtwoorden.txt → path.basename → wachtwoorden.txt → bestaat niet → 404
    mockExistsSync.mockReturnValue(false);
    const res = await request(app).get(
      "/dossier/1196219/files/..%2F..%2Fwachtwoorden.txt"
    );
    expect([400, 404]).toContain(res.status);
  });
});
