import express from "express";
import cors from "cors";
import helmet from "helmet";
import dbHealthRoute from "./routes/dbHealth";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  // DB health endpoint
  app.use(dbHealthRoute);

  return app;
};
