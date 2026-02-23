import sql from "mssql";

let pool: sql.ConnectionPool | null = null;

export const getDbPool = async (): Promise<sql.ConnectionPool> => {
  if (pool) return pool;

  const server = process.env.DB_SERVER;
  const database = process.env.DB_DATABASE;

  if (!server || !database) {
    throw new Error("DB_SERVER and DB_DATABASE must be set");
  }

  pool = await new sql.ConnectionPool({
    server,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database,
    options: {
      encrypt: process.env.DB_ENCRYPT === "true",
      trustServerCertificate: true,
    },
  }).connect();

  return pool;
};

// Handig voor tests / shutdown
export const closeDbPool = async () => {
  if (pool) {
    await pool.close();
    pool = null;
  }
};
