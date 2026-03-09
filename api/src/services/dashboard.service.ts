// ============================================================
// dashboard.service.ts
// Service-laag: alle DB calls via stored procedures
// ============================================================

import { getDbPool as getPool } from '../config/db';
import sql from 'mssql';
import {
  DashboardRoute,
  DashboardTask,
  SetTaskCheckedBody,
  MarkRouteSeenBody,
} from '../types/dashboard.types';

// ------------------------------------------------------------
// GET ROUTES (spGetDashboardRoutes)
// ------------------------------------------------------------
export async function getDashboardRoutes(
  userName: string,
  day?: string
): Promise<DashboardRoute[]> {
  const pool = await getPool();
  const request = pool.request();

  request.input('UserName', sql.NVarChar(128), userName);
  request.input('Day', sql.Date, day ?? null);

  const result = await request.execute('spGetDashboardRoutes');
  return result.recordset as DashboardRoute[];
}

// ------------------------------------------------------------
// GET TASKS (spGetDashboardTasks)
// ------------------------------------------------------------
export async function getDashboardTasks(params: {
  day?: string;
  rideId?: number;
  showChecked?: boolean;
}): Promise<DashboardTask[]> {
  const pool = await getPool();
  const request = pool.request();

  request.input('Day', sql.Date, params.day ?? null);
  request.input('ShowChecked', sql.Bit, params.showChecked ? 1 : 0);
  request.input('RideId', sql.Int, params.rideId ?? null);

  const result = await request.execute('spGetDashboardTasks');
  return result.recordset as DashboardTask[];
}

// ------------------------------------------------------------
// SET TASK CHECKED (spSetTaskChecked)
// ------------------------------------------------------------
export async function setTaskChecked(body: SetTaskCheckedBody): Promise<void> {
  const pool = await getPool();
  const request = pool.request();

  request.input('OrdSubTaskNo', sql.Int, body.ordSubTaskNo);
  request.input('Checked', sql.Bit, body.checked ? 1 : 0);
  request.input('CheckedBy', sql.NVarChar(128), body.checkedBy);
  request.input('Comment', sql.NVarChar(sql.MAX), body.comment ?? null);

  await request.execute('spSetTaskChecked');
}

// ------------------------------------------------------------
// MARK ROUTE SEEN (spMarkRouteSeen)
// ------------------------------------------------------------
export async function markRouteSeen(body: MarkRouteSeenBody): Promise<void> {
  const pool = await getPool();
  const request = pool.request();

  request.input('Day', sql.Date, body.day ?? null);
  request.input('UserName', sql.NVarChar(128), body.userName);
  request.input('RideId', sql.Int, body.rideId);
  request.input('CurrentHash', sql.Int, body.currentHash);

  await request.execute('spMarkRouteSeen');
}
