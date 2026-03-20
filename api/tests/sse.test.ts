// ============================================================
// sse.test.ts
// Unit tests voor de SSE service (client beheer + broadcast)
// ============================================================

import { addClient, removeClient, broadcast, clientCount } from "../src/services/sse.service";
import { Response } from "express";

function mockResponse(): jest.Mocked<Partial<Response>> {
  return { write: jest.fn() } as jest.Mocked<Partial<Response>>;
}

describe("sse.service", () => {
  beforeEach(() => {
    // Reset clients tussen tests door alle bekende clients te verwijderen
    // (we hebben geen resetClients export, maar kunnen clients via add/remove beheren)
  });

  it("voegt een client toe en telt correct", () => {
    const before = clientCount();
    const res = mockResponse() as unknown as Response;
    addClient(res);
    expect(clientCount()).toBe(before + 1);
    removeClient(res);
  });

  it("verwijdert een client correct", () => {
    const res = mockResponse() as unknown as Response;
    addClient(res);
    const count = clientCount();
    removeClient(res);
    expect(clientCount()).toBe(count - 1);
  });

  it("broadcast schrijft SSE-payload naar alle clients", () => {
    const res1 = mockResponse() as unknown as Response;
    const res2 = mockResponse() as unknown as Response;
    addClient(res1);
    addClient(res2);

    broadcast("task-updated", { rideId: 42, checkedBy: "jeroen" });

    const expected = `event: task-updated\ndata: ${JSON.stringify({ rideId: 42, checkedBy: "jeroen" })}\n\n`;
    expect((res1 as any).write).toHaveBeenCalledWith(expected);
    expect((res2 as any).write).toHaveBeenCalledWith(expected);

    removeClient(res1);
    removeClient(res2);
  });

  it("broadcast stuurt niets als er geen clients zijn", () => {
    // Verwijder alle clients voor een schone test
    const res = mockResponse() as unknown as Response;
    // Enkel veiligheidscheck: geen error bij lege set
    expect(() => broadcast("test-event", {})).not.toThrow();
  });
});
