import * as fs from "node:fs";
import path from "path";
import { pool } from "../connections";

class Migration {
  static async runMigrations() {
    try {
      // Create migrations table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      const migrationsDir = path.join(__dirname, "sql");

      if (!fs.existsSync(migrationsDir)) {
        console.log("No migrations directory found, skipping migrations");
        return;
      }

      const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();

      for (const file of files) {
        // Check if migration has already been run
        const result = await pool.query(
          "SELECT id FROM migrations WHERE filename = $1",
          [file]
        );

        if (result.rows.length === 0) {
          console.log(`Running migration: ${file}`);

          const migrationSQL = fs.readFileSync(
            path.join(migrationsDir, file),
            "utf8"
          );

          // Run migration in a transaction
          const client = await pool.connect();
          try {
            await client.query("BEGIN");
            await client.query(migrationSQL);
            await client.query(
              "INSERT INTO migrations (filename) VALUES ($1)",
              [file]
            );
            await client.query("COMMIT");
            console.log(`✓ Migration ${file} completed`);
          } catch (error) {
            await client.query("ROLLBACK");
            throw error;
          } finally {
            client.release();
          }
        } else {
          console.log(`⚠ Migration ${file} already executed, skipping`);
        }
      }

      console.log("All migrations completed successfully");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  }

  static async rollback(steps = 1) {
    try {
      const result = await pool.query(
        "SELECT filename FROM migrations ORDER BY executed_at DESC LIMIT $1",
        [steps]
      );

      for (const migration of result.rows) {
        console.log(`Rolling back migration: ${migration.filename}`);
        await pool.query("DELETE FROM migrations WHERE filename = $1", [
          migration.filename,
        ]);
        console.log(`✓ Rolled back ${migration.filename}`);
      }
    } catch (error) {
      console.error("Rollback failed:", error);
      throw error;
    }
  }
}

module.exports = Migration;
