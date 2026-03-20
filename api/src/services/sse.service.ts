// ============================================================
// sse.service.ts
// Server-Sent Events: bijhouden van verbonden clients + broadcast
// ============================================================

import { Response } from 'express';

const clients = new Set<Response>();

export function addClient(res: Response): void {
  clients.add(res);
}

export function removeClient(res: Response): void {
  clients.delete(res);
}

export function broadcast(event: string, data: unknown): void {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((res) => res.write(payload));
}

export function clientCount(): number {
  return clients.size;
}
