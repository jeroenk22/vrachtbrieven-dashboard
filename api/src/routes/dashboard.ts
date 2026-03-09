// ============================================================
// dashboard.ts  (routes)
// Express route-handlers voor het dashboard
// ============================================================

import { Router, Request, Response } from 'express';
import {
  getDashboardRoutes,
  getDashboardTasks,
  setTaskChecked,
  markRouteSeen,
} from '../services/dashboard.service';
import { SetTaskCheckedBody, MarkRouteSeenBody } from '../types/dashboard.types';

const router = Router();

// ------------------------------------------------------------
// GET /dashboard/routes
// Query params:
//   userName  (required)
//   day       (optional, ISO date string, default = vandaag)
// ------------------------------------------------------------
router.get('/routes', async (req: Request, res: Response) => {
  const { userName, day } = req.query as { userName?: string; day?: string };

  if (!userName) {
    return res.status(400).json({ ok: false, error: 'userName is verplicht' });
  }

  try {
    const routes = await getDashboardRoutes(userName, day);
    return res.json({ ok: true, data: routes });
  } catch (err) {
    console.error('getDashboardRoutes fout:', err);
    return res.status(500).json({ ok: false, error: 'Interne serverfout' });
  }
});

// ------------------------------------------------------------
// GET /dashboard/tasks
// Query params:
//   day         (optional, ISO date string, default = vandaag)
//   rideId      (optional, number)
//   showChecked (optional, '1' | 'true', default = false)
// ------------------------------------------------------------
router.get('/tasks', async (req: Request, res: Response) => {
  const { day, rideId, showChecked } = req.query as {
    day?: string;
    rideId?: string;
    showChecked?: string;
  };

  try {
    const tasks = await getDashboardTasks({
      day,
      rideId: rideId !== undefined ? parseInt(rideId, 10) : undefined,
      showChecked: showChecked === '1' || showChecked === 'true',
    });
    return res.json({ ok: true, data: tasks });
  } catch (err) {
    console.error('getDashboardTasks fout:', err);
    return res.status(500).json({ ok: false, error: 'Interne serverfout' });
  }
});

// ------------------------------------------------------------
// POST /dashboard/tasks/check
// Body: SetTaskCheckedBody
// ------------------------------------------------------------
router.post('/tasks/check', async (req: Request, res: Response) => {
  const body = req.body as Partial<SetTaskCheckedBody>;

  if (body.ordSubTaskNo === undefined || body.checked === undefined || !body.checkedBy) {
    return res.status(400).json({
      ok: false,
      error: 'ordSubTaskNo, checked en checkedBy zijn verplicht',
    });
  }

  try {
    await setTaskChecked({
      ordSubTaskNo: body.ordSubTaskNo,
      checked: body.checked,
      checkedBy: body.checkedBy,
      comment: body.comment ?? null,
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('setTaskChecked fout:', err);
    return res.status(500).json({ ok: false, error: 'Interne serverfout' });
  }
});

// ------------------------------------------------------------
// POST /dashboard/routes/seen
// Body: MarkRouteSeenBody
// ------------------------------------------------------------
router.post('/routes/seen', async (req: Request, res: Response) => {
  const body = req.body as Partial<MarkRouteSeenBody>;

  if (!body.userName || body.rideId === undefined || body.currentHash === undefined) {
    return res.status(400).json({
      ok: false,
      error: 'userName, rideId en currentHash zijn verplicht',
    });
  }

  try {
    await markRouteSeen({
      day: body.day,
      userName: body.userName,
      rideId: body.rideId,
      currentHash: body.currentHash,
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error('markRouteSeen fout:', err);
    return res.status(500).json({ ok: false, error: 'Interne serverfout' });
  }
});

export default router;
