import { Router } from "express";
import { getDbPool } from "../config/db";

const router = Router();

router.get("/db-health", async (_req, res) => {
  try {
    const pool = await getDbPool();
    await pool.request().query("SELECT 1 AS ok");
    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

export default router;
