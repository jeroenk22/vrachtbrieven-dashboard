import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

app.listen(port, () => {
  // Bewust simpel houden; logging later uitbreiden
  console.log(`API listening on http://localhost:${port}`);
});
