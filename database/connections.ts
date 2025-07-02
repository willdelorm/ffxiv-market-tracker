import { Pool, QueryResult } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

// Create connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const query = (text: string, params?: any[]): Promise<QueryResult> =>
  pool.query(text, params);
