import express from "express";
import cors from "cors";
import helmet from "helmet";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  // Simpele healthcheck (handig voor tests & monitoring)
  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  return app;
};
