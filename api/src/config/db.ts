import sql from "mssql";

let pool: sql.ConnectionPool | null = null;

export const getDbPool = async (): Promise<sql.ConnectionPool> => {
  if (pool) return pool;

  const password = process.env.DB_PASSWORD;

  if (!password) {
    throw new Error("DB_PASSWORD must be set in .env for NTLM authentication");
  }

  pool = await new sql.ConnectionPool({
    server: "192.168.4.102",
    database: "TASK_DASHBOARD",
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
    authentication: {
      type: "ntlm",
      options: {
        domain: "TRANSPORT",
        userName: "jeroen",
        password: password,
      },
    },
  }).connect();

  return pool;
};

export const closeDbPool = async () => {
  if (pool) {
    await pool.close();
    pool = null;
  }
};
