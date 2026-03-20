// ============================================================
// src/routes/dossier.ts
// Bestanden ophalen uit de Mendrix dossiermap op het netwerk
// ============================================================

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const DOSSIER_BASE =
  process.env.DOSSIER_PATH ?? '\\\\192.168.4.102\\Mendrix$\\Data\\Public\\Dossiers\\Orders';

const FOLDER_DIGITS = 10;

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.tif']);

const MIME_MAP: Record<string, string> = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.bmp':  'image/bmp',
  '.webp': 'image/webp',
  '.tiff': 'image/tiff',
  '.tif':  'image/tiff',
  '.pdf':  'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.xls':  'application/vnd.ms-excel',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc':  'application/msword',
};

function toFolderName(orderId: number): string {
  return String(orderId).padStart(FOLDER_DIGITS, '0');
}

function getFolderPath(orderId: number): string {
  return path.join(DOSSIER_BASE, toFolderName(orderId));
}

// ------------------------------------------------------------
// GET /dossier/:orderId/files
// Geeft een lijst van bestanden in de dossiermap
// ------------------------------------------------------------
router.get('/:orderId/files', (req: Request, res: Response) => {
  const orderId = parseInt(req.params.orderId as string, 10);
  if (isNaN(orderId) || orderId <= 0) {
    return res.status(400).json({ ok: false, error: 'Ongeldig orderId' });
  }

  const folderPath = getFolderPath(orderId);

  if (!fs.existsSync(folderPath)) {
    return res.json({ ok: true, data: [] });
  }

  try {
    const entries = fs.readdirSync(folderPath);
    const files = entries
      .filter(f => {
        try { return fs.statSync(path.join(folderPath, f)).isFile(); } catch { return false; }
      })
      .map(filename => {
        const ext = path.extname(filename).toLowerCase();
        return { filename, ext: ext.slice(1), isImage: IMAGE_EXTS.has(ext) };
      });

    return res.json({ ok: true, data: files });
  } catch (err) {
    console.error('dossier files fout:', err);
    return res.status(500).json({ ok: false, error: 'Fout bij ophalen bestanden' });
  }
});

// ------------------------------------------------------------
// GET /dossier/:orderId/files/:filename
// Streamt één bestand uit de dossiermap
// ------------------------------------------------------------
router.get('/:orderId/files/:filename', (req: Request, res: Response) => {
  const orderId = parseInt(req.params.orderId as string, 10);
  if (isNaN(orderId) || orderId <= 0) {
    return res.status(400).json({ ok: false, error: 'Ongeldig orderId' });
  }

  // path.basename voorkomt path-traversal (strips ../ etc.)
  const filename = path.basename(req.params.filename as string);
  const folderPath = getFolderPath(orderId);
  const filePath = path.join(folderPath, filename);

  // Controleer dat het pad écht binnen de verwachte map valt
  if (!filePath.startsWith(folderPath)) {
    return res.status(400).json({ ok: false, error: 'Ongeldig pad' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ ok: false, error: 'Bestand niet gevonden' });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = MIME_MAP[ext] ?? 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => res.status(500).end());
  stream.pipe(res);
});

export default router;
