// ============================================================
// src/api/dossier.ts
// API calls voor dossierbestanden (Mendrix netwerk)
// ============================================================

import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export interface DossierFile {
  filename: string;
  ext: string;
  isImage: boolean;
}

export const fetchDossierFiles = async (orderId: number): Promise<DossierFile[]> => {
  const { data } = await api.get<{ ok: boolean; data: DossierFile[] }>(`/dossier/${orderId}/files`);
  return data.data;
};

export const getDossierFileUrl = (orderId: number, filename: string): string =>
  `/api/dossier/${orderId}/files/${encodeURIComponent(filename)}`;
