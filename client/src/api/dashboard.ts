// ============================================================
// src/api/dashboard.ts
// Axios API calls naar de backend
// ============================================================

import axios from 'axios';
import type { ApiResponse, DashboardRoute, DashboardTask } from '../types/dashboard';

const api = axios.create({ baseURL: '/api' });

export const fetchRoutes = async (
  userName: string,
  day?: string
): Promise<DashboardRoute[]> => {
  const params: Record<string, string> = { userName };
  if (day) params.day = day;
  const { data } = await api.get<ApiResponse<DashboardRoute[]>>('/dashboard/routes', { params });
  return data.data;
};

export const fetchTasks = async (params: {
  day?: string;
  rideId?: number;
  showChecked?: boolean;
}): Promise<DashboardTask[]> => {
  const { data } = await api.get<ApiResponse<DashboardTask[]>>('/dashboard/tasks', { params });
  return data.data;
};

export const setTaskChecked = async (body: {
  ordSubTaskNo: number;
  checked: boolean;
  checkedBy: string;
  comment?: string | null;
}): Promise<void> => {
  await api.post('/dashboard/tasks/check', body);
};

export const fetchWhoAmI = async (): Promise<string> => {
  const { data } = await api.get<{ ok: boolean; username: string }>('/whoami');
  return data.username;
};

export const markRouteSeen = async (body: {
  userName: string;
  rideId: number;
  currentHash: number;
  day?: string;
}): Promise<void> => {
  await api.post('/dashboard/routes/seen', body);
};